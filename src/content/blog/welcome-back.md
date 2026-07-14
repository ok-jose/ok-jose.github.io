---
title: 'Hello Again —— 博客重建记'
description: '9 年后，用 Astro 重建这个博客。'
pubDate: 2026-07-14
tags: ['meta', 'astro']
---

这是一篇重启博客的宣言。

## 为什么重启

上次更新是 2017 年 6 月 26 日。9 年过去，Hexo 还在，
Next 主题却早已不再维护，部署流程也早已忘记。

## 为什么选 Astro

- **内容优先**：默认零 JS，文章页就是纯 HTML。
- **现代 DX**：TypeScript、Content Collections、Vite 一切都是现成的。
- **部署简单**：`astro build` 完事，丢给 GitHub Actions 自动发布。

## 接下来

- 把 2017 年的旧文迁移过来
- 重新写点东西
- 找个干净的主题配色

> Done is better than perfect.

```ts
// 顺便贴个 Astro 5 渲染文章的小细节
import { render } from 'astro:content';
const { Content } = await render(entry);
```

欢迎订阅 [RSS](/rss.xml) 或在 [关于页](/about) 找到更多联系方式。
