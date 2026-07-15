---
title: 'MCP next'
description: 'What is mcp ？关键词关键词价值场景应用MCP标准化LLM与数据源的整合，减少定制整合需求需要访问外部数据的AI应用，如聊天机器人AI助手、聊天机器人、AI驱动的IDELLM提供自然语言处理能力，生成和理解文本文本补全、问答、内容'
pubDate: 2025-06-03
updatedDate: 2025-06-04
tags: ['yuque', 'jose-wg1zg7']
source: 'https://www.yuque.com/jose/wg1zg7/xmu9et4altfazbo9'
---

## What is mcp ？
![](/uploads/yuque/xmu9et4altfazbo9/1748957182054-ebe0c1a8-c16f-43.gif)

## 关键词
| 关键词 | 价值 | 场景 | 应用 |
| :--- | :--- | :--- | :--- |
| MCP | 标准化LLM与数据源的整合，减少定制整合需求 | 需要访问外部数据的AI应用，如聊天机器人 | AI助手、聊天机器人、AI驱动的IDE |
| LLM | 提供自然语言处理能力，生成和理解文本 | 文本补全、问答、内容生成场景 | 文本补全工具、客户服务聊天机器人 |
| 主机（Host） | 管理多个客户端实例，协调客户端与服务器交互 | AI应用的集中管理，如桌面应用 | Claude Desktop等AI桌面应用的协调中心 |
| 客户端（Client） | 与服务器1:1连接，处理协议协商和消息路由 | 主机与特定服务器的通信桥梁 | MCP架构中的通信组件，如Claude客户端 |
| 服务器（Server） | 暴露资源、工具、提示等特定能力 | 为LLM提供数据或功能，如文件访问 | Filesystem Server、GitHub Server等 |
| 资源（Resources） | 可供LLM访问的只读数据，如文件、文档 | 访问本地文件、数据库或云存储内容 | LLM查询文档、检索数据库信息 |
| 工具（Tools） | LLM可调用的动作或函数，如运行SQL查询 | 需要执行特定任务，如API调用、数据处理 | 自动化任务，如财务数据分析、网页抓取 |
| 提示（Prompts） | 指导LLM行为或提供上下文的预定义文本 | 定制LLM响应或提供特定指令 | 针对不同用例调整AI输出，如客户支持提示 |
| 采样（Sampling） | 主机协调LLM与多个服务器的交互，聚合上下文 | 为复杂查询从多源数据收集信息 | 综合多源数据为LLM提供全面上下文 |
| JSON-RPC | 用于客户端与服务器消息交换的通信协议 | 分布式系统中的标准化消息传递 | MCP中的消息交互，如请求和响应 |
| 能力（Capabilities） | 客户端和服务器支持的声明功能，用于功能协商 | 确保会话中双方支持特定功能 | MCP会话中的功能协商，如工具支持 |
| 会话（Sessions） | 保持状态的客户端与服务器连接，允许持续交互 | 需要记忆先前交互的长期任务 | 对话式AI、连续多步骤任务 |
| 通知（Notifications） | 用于事件或更新的单向消息，如资源变化 | 保持客户端了解服务器端实时更新 | AI应用中的实时状态更新，如文件修改 |
| 安全（Security） | 确保数据访问和操作的控制与安全机制 | 保护敏感数据，防止未经授权访问 | MCP实现中的访问控制、数据加密 |
| 授权（Authorization） | 验证并授予资源或操作的访问权限 | 确保只有授权用户或进程可执行操作 | MCP服务器中的用户认证、角色访问控制 |
| 上下文（Context） | 提供给LLM以告知其响应的数据 | LLM需要额外信息以提供准确输出的交互 | 个性化响应、领域特定知识应用 |
| 有状态（Stateful） | 在会话中保持状态以保留上下文 | 需要记住先前交换或数据的交互 | 对话式AI、多步骤过程，如任务跟踪 |
| 协议协商（Protocol Negotiation） | 客户端和服务器初始商定功能和能力 | 建立具有已知能力的会话 | 确保交互开始时的兼容性和功能 |
| 消息类型（Message Types） | 协议中的请求、响应、通知三种消息类型 | 区分协议中不同种类的通信 | MCP实现中的消息管理和路由 |
| 设计原则（Design Principles） | 指导MCP设计的原则，如易建服务器、高组合性 | 理解MCP架构和功能的理由 | 开发者和架构师设计或扩展MCP系统时使用 |

[AI Agent爆火后，MCP协议为什么如此重要！ - 程序员海军 - 博客园](https://www.cnblogs.com/HaiJun-Aion/p/18785156)

[GitHub - liaokongVFX/MCP-Chinese-Getting-Started-Guide: Model Context Protocol(MCP) 编程极速入门](https://github.com/liaokongVFX/MCP-Chinese-Getting-Started-Guide?tab=readme-ov-file)

## Tool
> MCP Tools 就是一套预置在 MCP 体系中的实用工具集，它们能帮助 AI 更高效、更精准地完成特定任务
>

## 模型如何智能选择工具？
### 模型如何智能选择工具？
先理解第一步**模型如何确定该使用哪些工具？**这里以 MCP 官方提供的 [choose tool](https://github.com/modelcontextprotocol/python-sdk/blob/main/examples/clients/simple-chatbot/mcp_simple_chatbot/main.py#L337) 为讲解示例，并简化了对应的代码（删除了一些不影响阅读逻辑的异常控制代码）。通过阅读代码，可以发现模型是通过 prompt 来确定当前有哪些工具。我们通过**将工具的具体使用描述以文本的形式传递给模型**，供模型了解有哪些工具以及结合实时情况进行选择。参考代码中的注释：

```python
async def start(self):
     # 初始化所有的 mcp server
     for server in self.servers:
         await server.initialize()
 ​
     # 获取所有的 tools 命名为 all_tools
     all_tools = []
     for server in self.servers:
         tools = await server.list_tools()
         all_tools.extend(tools)
 ​
     # 将所有的 tools 的功能描述格式化成字符串供 LLM 使用
     # tool.format_for_llm() 我放到了这段代码最后，方便阅读。
     tools_description = "\n".join(
         [tool.format_for_llm() for tool in all_tools]
     )
 ​
     # 这里就不简化了，以供参考，实际上就是基于 prompt 和当前所有工具的信息
     # 询问 LLM（Claude） 应该使用哪些工具。
     system_message = (
         "You are a helpful assistant with access to these tools:\n\n"
         f"{tools_description}\n"
         "Choose the appropriate tool based on the user's question. "
         "If no tool is needed, reply directly.\n\n"
         "IMPORTANT: When you need to use a tool, you must ONLY respond with "
         "the exact JSON object format below, nothing else:\n"
         "{\n"
         '    "tool": "tool-name",\n'
         '    "arguments": {\n'
         '        "argument-name": "value"\n'
         "    }\n"
         "}\n\n"
         "After receiving a tool's response:\n"
         "1. Transform the raw data into a natural, conversational response\n"
         "2. Keep responses concise but informative\n"
         "3. Focus on the most relevant information\n"
         "4. Use appropriate context from the user's question\n"
         "5. Avoid simply repeating the raw data\n\n"
         "Please use only the tools that are explicitly defined above."
     )
     messages = [{"role": "system", "content": system_message}]
```

### 工具执行与结果反馈机制
其实工具的执行就比较简单和直接了。承接上一步，我们把 system prompt（指令与工具调用描述）和用户消息一起发送给模型，然后接收模型的回复。当模型分析用户请求后，它会决定是否需要调用工具：[process_llm_response](https://github.com/modelcontextprotocol/python-sdk/blob/main/examples/clients/simple-chatbot/mcp_simple_chatbot/main.py#L295-L338)

● 无需工具时：模型直接生成自然语言回复。

● 需要工具时：模型输出结构化 JSON 格式的工具调用请求。

### tooo much tools more than 40
![](/uploads/yuque/xmu9et4altfazbo9/1749034466945-186745f2-90fa-42.png)

## Resource
> 概念 Resources 顾名思义，是提供一种资源，比如文本文件、代码、图片或者一个网页内容等等。
>
> Resources 允许  Server 向 Client 公开一些数据内容，并由 Client 提供给 LLM，进行参考和处理。
>

就像我们使用 DeepSeek 时，可以通过附件功能上传一些文件或者资料：

![](/uploads/yuque/xmu9et4altfazbo9/1749023896593-785aa48f-4476-4a.png)

在 MCP 中，将这个功能内化成了协议中的一种约定，以便可以打造出更便捷和智能的软件或者工具。

并且，Resources 是通过应用控制的理念设计的，就是说只有获得了用户的授权，Client 才能将某个资源交给 LLM 去处理。

### 资源类型
可以通过 Resources 提供哪些资源类型呢？

其实可以提供任何类型的文件，只要 LLM 可以理解，比如常见的：

+ 文件内容
+ 数据库记录
+ API 的响应内容
+ 实时系统数据
+ 截图或者图片
+ 日志文件

等等

只要有 [URI](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier) ，并且可以提供文本或者二进制内容，都可以做为资源。

当一个资源由 Server 提供给(通过 Client) LLM 时，内容必须是以下两种形式之一：

文本数据：通过 utf-8 编码的文本内容，如代码文件等

二进制数据：通过 base-64 编码的文件内容，如图片、PDF等

### 定义资源
资源通过 URI 格式来定义：

> **INFO**: [protocol]://[host]/[path]

例如：

file:///home/user/documents/report.pdf

postgres://database/customers/schema

screen://localhost/display1

MCP 协议只通过定义和方案，具体的资源协议（file, screen等）以及资源路径，需要 Server 来实现，也就是说 Server 可以在 MCP 协议的框架下，创建自己特有的协议和资源路径形式。

这就和 API 的定义一样，是通过参数还是路径来区分具体的接口，由服务提供者说了算。

```python
@app.resource("config://app")
def get_config() -> str:
    """Static configuration data"""
    file_path = "/Users/jose/Downloads/local-mcp-resource.txt"
    with open(file_path, "r") as file:
        return file.read()
```

```python
@app.resource("users://{user_id}/profile")
def get_file(user_id: str) -> str:
    """Get a file"""
    file_path = f'/Users/{user_id}/Downloads/local-mcp-resource.txt'
    with open(file_path, "r") as file:
        return file.read()
```

## Prompt
> prompt 就是给 AI 提供的提示词，而且 AI 答复的质量很大程度上依赖于提示词的质量，给出好的提示词，能让 AI 发挥巨大的能力。
>

一般情况下，我们可以将有用的提示词保存起来，在特定的场景中，或者解决特定的问题时，提供给 AI，比如北大 DeepSeek 的教程中，提供的提示词公式：

> **INFO**: 我要（做）**，要给 ** 用，希望达到 ** 效果，但担 ** 问题

有了 MCP 协议，提示词可以被封装在 MCP Server 中，必要的时候，由 AI 自行选择使用，这极大的简化了提示词的管理和使用，也让处理过程更加丝滑和确定。

那么如何让 MCP Server 提供提示词呢？和常规的提示词库又有什么区别呢？下面一起来了解一下。

```python
# Define explain-code prompt  
@app.prompt()
def explain_code(code: str, language: str = "Unknown") -> str:
    """Explain how code works
    
    Args:
        code: Code to explain (required)
        language: Programming language (optional)
    """
    return f"Explain how this {language} code works:\n\n{code}"
```

![](/uploads/yuque/xmu9et4altfazbo9/1749025013953-6ba8f4fa-5adf-4b.png)

## 最后
MCP 真正的价值在于提供了一个将能力组合起来的方案，在方案中提供了多种能力使用范式，而将具体实现交给了应用提供者，以及真正实现者。

所以 MCP 没有什么神秘的，也不是什么创世之作，但是，MCP 协议如果能覆盖绝大多数应用场景，使得能力体、智能体、应用体在网络中，轻松地组合与连接，那它一定是伟大的。

我们在研究探索 MCP 的时候，不必为它的神秘和新颖迷惑，也不要为它的简单和“空洞”而轻视，应该从它的字里行间，去品味它的格局和伟大之处，进而让自己的能力体、用户、产品更有效地进入智能网络，融入智能时代。

## 引用
[MCP 微信公众号](https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzI4MzMyNjQwMw==&action=getalbum&album_id=3924087713674100737&subscene=159&subscene=189&scenenote=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzI4MzMyNjQwMw%3D%3D%26mid%3D2247494847%26idx%3D1%26sn%3Dee865766de9a23836ec297f23a281024%26chksm%3Deb8ece13dcf947050998d4f7dd6309881a0c9125df7eb057a8ead49ab40dd2de64b2dd5e9d59%26cur_album_id%3D3924087713674100737%26scene%3D189%23wechat_redirect&nolastread=1#wechat_redirect)
