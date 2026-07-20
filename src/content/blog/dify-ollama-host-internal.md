---
title: 'Dify 接入本地 Ollama：host.docker.internal 为什么解析不到'
description: 'curl 能通、Dify 校验却一直报 NameResolutionError。根因不在 DNS，而在 Dify 把模型供应商跑成了一个独立的 plugin 容器。'
pubDate: 2026-07-20
tags: ['dify', 'ollama', 'docker', 'ai', 'debug']
---

## 起因

想把 Dify 跑起来接入本地的 Ollama，省点 token 钱。流程看上去很简单：

1. `cd docker && docker compose up -d`
2. 后台「设置 → 模型供应商」加 Ollama
3. Base URL 填 `http://host.docker.internal:11434`

第三步报错了：

```
An error occurred during credentials validation:
HTTPConnectionPool(host='host.docker.internal', port=11434):
  Max retries exceeded with url: /api/embed
  (Caused by NameResolutionError("Failed to resolve 'host.docker.internal'
  ([Errno -2] Name or service not known)"))
```

`host.docker.internal` —— Docker Desktop 给容器访问宿主机用的「魔法域名」，按理说应该可以直接用，怎么就解析不到了？

## 第一个直觉：加 extra_hosts

在 macOS Docker Desktop 上，`host.docker.internal` 通常默认会被自动加进容器的 `/etc/hosts`。但某些配置下不会自动加。

最常见的修法是在 `docker-compose.yaml` 里给相关服务加 `extra_hosts`：

```yaml
services:
  api:
    image: langgenius/dify-api:1.16.0
    extra_hosts:
      - "host.docker.internal:host-gateway"
    ...
```

`host-gateway` 是 Docker 的内置占位符，启动时会自动展开成宿主网关 IP。改完 `docker compose up -d --force-recreate api worker worker_beat`，重启容器。

进 api 容器验证一下：

```bash
$ docker compose exec api cat /etc/hosts
127.0.0.1       localhost
...
192.168.65.254  host.docker.internal   # ← 加上了

$ docker compose exec api curl -s -m 3 http://host.docker.internal:11434/api/tags
{"models":[{"name":"qwen2.5:3b",...},{"name":"bge-m3:latest",...}]}
```

通了 ✅

回到 Dify 后台再点保存，**还是报同样的错**。😤

## 第二个直觉：可能还有别的容器需要加

既然 api 容器里 curl 通了、Dify 后端校验却失败，那请求大概率不是从 api 容器发出来的。Dify 是个组件挺多的应用，模型供应商这块说不定跑在别的地方。

去仓库里翻一下，模型供应商相关的代码不在 `api/core/` 里：

```bash
$ find . -name "*ollama*" -type f
./docker/volumes/plugin_daemon/plugin_packages/langgenius/ollama:0.1.5@.../provider/ollama.py
./docker/volumes/plugin_daemon/plugin_packages/langgenius/ollama:0.1.5@.../provider/ollama.yaml
```

`plugin_daemon`。再去看 `docker-compose.yaml`：

```bash
$ grep -nE "^  [a-z_]+:" docker-compose.yaml | head -10
  api:          # 加了 extra_hosts ✅
  worker:       # 加了 extra_hosts ✅
  worker_beat:  # 加了 extra_hosts ✅
  plugin_daemon:  # ← 没加 ❌
```

破案了。

## 根因：Dify 的 plugin_daemon 架构

从某个版本开始，Dify 把所有模型供应商（OpenAI、Anthropic、Ollama、各种私有化模型…）都拆成了 **plugin**，跑在独立的 `plugin_daemon` 容器里。

架构大致是这样的：

```
┌──────────┐      ┌──────────────────┐      ┌─────────────────┐
│  Web     │ ───▶ │  api (Flask)     │ ───▶ │  plugin_daemon  │ ───▶ Ollama
└──────────┘      └──────────────────┘      └─────────────────┘
   浏览器           业务逻辑                   模型供应商在这里跑
```

所以「凭证校验」这条请求的真正链路是：

1. 浏览器点保存
2. web → api（HTTP）
3. api → plugin_daemon（HTTP，调用插件）
4. **plugin_daemon → Ollama**（HTTP，凭证校验）

**第 4 步的「发请求」容器是 plugin_daemon，不是 api**。我只给 api/worker/worker_beat 加了 extra_hosts，自然校验就过不了。

修复就一行：给 `plugin_daemon` 也加上：

```yaml
  plugin_daemon:
    image: langgenius/dify-plugin-daemon:0.6.3-local
    extra_hosts:
      - "host.docker.internal:host-gateway"
    ...
```

`docker compose up -d --force-recreate plugin_daemon`，回后台再点保存，**过了 ✅**。

## 复盘

这个坑的隐蔽性在于：**手动 curl 验证通过 ≠ Dify 应用能通**。两个常见的误判场景：

| 验证方式 | 实际能证明什么 | 不能证明什么 |
|---------|---------------|-------------|
| `docker compose exec api curl ...` | api 容器到目标通 | 其他容器到目标通不通 |
| 浏览器访问 Dify 前端 | web 容器到 nginx 通 | 后端链路通不通 |

**调试容器间网络问题，永远要搞清楚请求到底从哪个容器发出来。** Dify 的 plugin_daemon 是个典型例子，其他多容器应用（GitLab Runner、Airflow、Superset）也都有类似的「副容器」结构。

最后给一个「Dify 本地起不来的踩坑速查表」，这次完整踩了一遍：

| 症状 | 真因 |
|------|------|
| `localhost` 完全无响应 | macOS Apache 占着 80 端口；改 `EXPOSE_NGINX_PORT=8080` |
| 容器都是 Up 但 curl `localhost:8080` 拒接 | `.env` 改了端口但 `docker compose up -d` 没 recreate，要加 `--force-recreate` |
| Ollama 校验失败 `host.docker.internal` | `plugin_daemon` 容器没加 `extra_hosts` |
| Ollama 校验失败但本机 `localhost:11434` 通 | Ollama 默认监听 127.0.0.1，需要 `OLLAMA_HOST=0.0.0.0` |

配完后，Dify + 本地 Ollama 跑起来确实香——评论分类、知识库 RAG、Agent 工具调用，token 成本直接归零。
