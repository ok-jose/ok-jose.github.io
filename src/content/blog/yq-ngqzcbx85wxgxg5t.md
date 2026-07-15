---
title: '如何更可靠地从模型中获取结构化数据'
description: '什么是TypeChat？TypeChat is a library that makes it easy to build natural language interfaces using types.TypeChat 简化了使用 Typ'
pubDate: 2023-10-29
updatedDate: 2023-11-01
tags: ['yuque', 'jose-wg1zg7']
source: 'https://www.yuque.com/jose/wg1zg7/ngqzcbx85wxgxg5t'
---

## 什么是TypeChat？
> TypeChat is a library that makes it easy to build natural language interfaces using types.
>
> TypeChat 简化了使用 TypeScript 构建自然语言模型界面的过程。
>

### TypeChat replaces prompt engineering with schema engineering.
TypeChat 通过用 schema 工程取代 prompt 工程来应对这些挑战。它允许开发者定义代表其自然语言模型应用程序支持的意图的类型

### After defining your types, TypeChat takes care of the rest by:
1. Constructing a prompt to the LLM using types.
2. Validating the LLM response conforms to the schema. If the validation fails, repair the non-conforming output through further language model interaction.
3. Summarizing succinctly (without use of a LLM) the instance and confirm that it aligns with user intent.

## TypeChat核心架构
> 核心就是对话、校验、修复型对话，得到想要的结构
>

### 连接模型
[/src/model.ts?#L41-L55](https://github.com/microsoft/TypeChat/blob/main/src/model.ts#L41-L55)

目前官网里面就支持了两种，微软自己的Azure的和 OpenAI 的ChatGpt

```typescript
export function createLanguageModel(env: Record): TypeChatLanguageModel {
    if (env.OPENAI_API_KEY) {
        const apiKey = env.OPENAI_API_KEY ?? missingEnvironmentVariable("OPENAI_API_KEY");
        const model = env.OPENAI_MODEL ?? missingEnvironmentVariable("OPENAI_MODEL");
        const endPoint = env.OPENAI_ENDPOINT ?? "https://api.openai.com/v1/chat/completions";
        const org = env.OPENAI_ORGANIZATION ?? "";
        return createOpenAILanguageModel(apiKey, model, endPoint, org);
    }
    if (env.AZURE_OPENAI_API_KEY) {
        const apiKey = env.AZURE_OPENAI_API_KEY ?? missingEnvironmentVariable("AZURE_OPENAI_API_KEY");
        const endPoint = env.AZURE_OPENAI_ENDPOINT ?? missingEnvironmentVariable("AZURE_OPENAI_ENDPOINT");
        return createAzureOpenAILanguageModel(apiKey, endPoint);
    }
    missingEnvironmentVariable("OPENAI_API_KEY or AZURE_OPENAI_API_KEY");
}
```

### createJsonTranslator 函数是核心部分
[/src/typechat.ts?#L65-L76](https://github.com/microsoft/TypeChat/blob/e300dccd2fbf846518dba7fe94a36a30168885ec//src/typechat.ts?#L65-L76)

```typescript
export function createJsonTranslator(model: TypeChatLanguageModel, schema: string, typeName: string): TypeChatJsonTranslator {
    const validator = createJsonValidator(schema, typeName);
    const typeChat: TypeChatJsonTranslator = {
        model,
        validator,
        attemptRepair: true,
        stripNulls: false,
        createRequestPrompt,
        createRepairPrompt,
        validateInstance: success,
        translate
    };
    return typeChat;
  ...
}
```

**createJsonTranslator** 函数是核心部分，它接受三个参数 model、schema 和 typeName，并返回一个包含几个方法和属性的对象 typeChat， 该对象用于将自然语言请求转换为指定类型的 JSON 对象。

+ model：是用于将自然语言请求翻译为 JSON 的大语言模型，目前是支持微软自己的Azure 和 Openai的，就是通过`createLanguageModel`函数创建的
+ schema：是一个包含 JSON schema 的 TypeScript 源代码的字符串。
+ typeName：是在 schema 中指定的目标 JSON 类型的名称。

返回的 typeChat 对象包含以下几个属性和方法：

+ model：保存传入的语言模型。
+ validator：通过调用 createJsonValidator 函数，使用传入的 schema 和 typeName 创建一个 JSON 校验器，并将其保存在 validator 属性中。
+ attemptRepair：一个布尔值，表示在校验失败时是否尝试修复 JSON 对象。
+ stripNulls：一个布尔值，表示是否从最终的 JSON 对象中剥离空值（null）属性。
+ createRequestPrompt(request)：一个函数，用于创建用户请求的 Prompt ，包含 JSON schema 和用户请求的内容。
+ createRepairPrompt(validationError)：一个函数，检验格式不对的话，修复性的 Prompt ，再次请求。
+ translate(request)：一个异步函数，用于将用户请求翻译为 JSON 对象。 它使用语言模型 model 来翻译用户请求，并调用 JSON 校验器进行验证。如果验证成功，返回验证结果，否则根据 attemptRepair 的值决定是否尝试修复错误，最终返回修复后的 JSON 对象。

### 核心Prompt
[/src/typechat.ts?#L78-L84](https://github.com/microsoft/TypeChat/blob/e300dccd2fbf846518dba7fe94a36a30168885ec//src/typechat.ts?#L78-L84)

```typescript
function createRequestPrompt(request: string) {
        return `You are a service that translates user requests into JSON objects of type "${validator.typeName}" according to the following TypeScript definitions:\n` +
            `\`\`\`\n${validator.schema}\`\`\`\n` +
            `The following is a user request:\n` +
            `"""\n${request}\n"""\n` +
            `The following is the user request translated into a JSON object with 2 spaces of indentation and no properties with the value undefined:\n`;
    }
```

这里面的核心就是对 ChatGpt 做一个角色的定义， 定义 ChatGpt 作为一个处理JSON对象的服务，在一个就是 typescript 对对象类型的定义描述给 chatGpt 识别。

当 ChatGpt 回复之后，通过 validation 校验的类型错误，在给 chatGpt 说你的类型不对，具体错误是什么， 你需要在输出修改后的JSON对象：

[/src/typechat.ts?#L85-L90](https://github.com/microsoft/TypeChat/blob/e300dccd2fbf846518dba7fe94a36a30168885ec//src/typechat.ts?#L85-L90)

```typescript
function createRepairPrompt(validationError: string) {
        return `The JSON object is invalid for the following reason:\n` +
            `"""\n${validationError}\n"""\n` +
            `The following is a revised JSON object:\n`;
    }
```

通过这样的一次反馈得到最后需要的格式.

## Function calling
> Developers can now describe functions to gpt-4-0613 and gpt-3.5-turbo-0613, and have the model intelligently choose to output a JSON object containing arguments to call those functions. This is a new way to more reliably connect GPT's capabilities with external tools and APIs.
>
> These models have been fine-tuned to both detect when a function needs to be called (depending on the user’s input) and to respond with JSON that adheres to the function signature. Function calling allows developers to more reliably get structured data back from the model. 
>

开发人员现在可以向gpt-4-0613和gpt-3.5-turbo-0613描述函数，并让模型智能选择输出包含调用这些函数的参数的JSON对象。这是将GPT的功能与外部工具和API更可靠地连接起来的新方法。

这些模型已经过微调，以检测何时需要调用函数（取决于用户的输入），并使用函数签名的JSON进行响应。Function calling允许开发人员更可靠地从模型中获取结构化数据。

### 做了什么
一户话就是：gpt 只是帮你找到要调用的函数名，以及从自然语言中提取出调用这个函数需要的参数返回给你。真正调用函数还是要靠开发者自己的代码来调用

[Function calling and other API updates](https://openai.com/blog/function-calling-and-other-api-updates)

### 具体例子
> 使用function calling 实现TypeChat功能，同样使用star例子
>

第一次

```json
{
    "model": "gpt-3.5-turbo-0613",
    "messages": [
        {
            "role": "user",
            "content": "小明夸小红帽，在他吃不起饭的时候，主动帮助他：请他吃饭、给他创业基金，最终小明逆袭成为霸道总裁"
        }
    ],
    "functions": [
        {
            "name": "get_who_to_star",
            "description": "Get whether it conforms to the STAR law from the given who, to and star to praise others.",
            "parameters": {
                "type": "object",
                "properties": {
                    "who": {
                        "type": "string",
                        "description": "speaker"
                    },
                    "to": {
                        "type": "string",
                        "description": "People who are praised"
                    },
                    "content": {
                        "type": "object",
                        "description": "star content",
                        "properties": {
                            "S": {
                                "type": "string",
                                "description": "situation"
                            },
                            "T": {
                                "type": "string",
                                "description": "task"
                            },
                            "A": {
                                "type": "string",
                                "description": "action"
                            },
                            "R": {
                                "type": "string",
                                "description": "result"
                            }
                        }
                    }
                },
               "required": [
                    "who",
                    "to",
                    "content"
                ]
            }
        }
    ]
}
```

```json
{
    "who": "小明",
    "to": "小红帽",
    "content": {
        "S": "主动帮助",
        "T": "吃饭、给他创业基金",
        "A": "在他吃不起饭的时候",
        "R": "最终小明逆袭成为霸道总裁"
    }
}
```

第二次

```json
{
    "model": "gpt-3.5-turbo-0613",
    "messages": [
        {
            "role": "user",
            "content": "小明夸小红帽，在他吃不起饭的时候，主动帮助他：请他吃饭、给他创业基金，最终小明逆袭成为霸道总裁"
        }
    ],
    "functions": [
        {
            "name": "get_who_to_star",
            "description": "Get whether it conforms to the STAR law from the given who, to and star to praise others.",
            "parameters": {
                "type": "object",
                "properties": {
                    "who": {
                        "type": "string",
                        "description": "speaker"
                    },
                    "to": {
                        "type": "string",
                        "description": "People who are praised"
                    },
                    "content": {
                        "type": "object",
                        // 注意这里
                        "description": "Contains a paragraph about using STAR's law to praise people",
                        "properties": {
                            "S": {
                                "type": "string",
                                "description": "situation"
                            },
                            "T": {
                                "type": "string",
                                "description": "task"
                            },
                            "A": {
                                "type": "string",
                                "description": "action"
                            },
                            "R": {
                                "type": "string",
                                "description": "result"
                            }
                        }
                    }
                },
                "required": [
                    "location"
                ]
            }
        }
    ]
}
```

```json
{
    "model": "gpt-3.5-turbo-0613",
    "messages": [
        {
            "role": "user",
            "content": "小明夸小红帽，在他吃不起饭的时候，主动帮助他：请他吃饭、给他创业基金，最终小明逆袭成为霸道总裁"
        }
    ],
    "functions": [
        {
            "name": "get_who_to_star",
            "description": "Get whether it conforms to the STAR law from the given who, to and star to praise others.",
            "parameters": {
                "type": "object",
                "properties": {
                    "who": {
                        "type": "string",
                        "description": "speaker"
                    },
                    "to": {
                        "type": "string",
                        "description": "People who are praised"
                    },
                    "content": {
                        "type": "object",
                      	// 注意这里
                        "description": "Contains a paragraph about using STAR's law to praise people, includes situation,task,action,result ",
                        "properties": {
                            "S": {
                                "type": "string",
                                "description": "situation"
                            },
                            "T": {
                                "type": "string",
                                "description": "task"
                            },
                            "A": {
                                "type": "string",
                                "description": "action"
                            },
                            "R": {
                                "type": "string",
                                "description": "result"
                            }
                        }
                    }
                },
                "required": [
                    "who",
                    "to",
                    "content"
                ]
            }
        }
    ]
}

```

第三次

```json
{
    "model": "gpt-3.5-turbo-0613",
    "messages": [
        {
            "role": "user",
            "content": "小明夸小红帽，在他吃不起饭的时候，主动帮助他：请他吃饭、给他创业基金，最终小明逆袭成为霸道总裁"
        }
    ],
    "functions": [
        {
            "name": "get_who_to_star",
            "description": "Get whether it conforms to the STAR law from the given who, to and star to praise others.",
            "parameters": {
                "type": "object",
                "properties": {
                    "who": {
                        "type": "string",
                        "description": "speaker"
                    },
                    "to": {
                        "type": "string",
                        "description": "People who are praised"
                    },
                    "content": {
                        "type": "object",
                        "description": "Contains a paragraph about using STAR's law to praise people, includes situation,task,action,result ",
                        "properties": {
                            "S": {
                                "type": "string",
                                "description": "situation"
                            },
                            "T": {
                                "type": "string",
                                "description": "task"
                            },
                            "A": {
                                "type": "string",
                                "description": "action"
                            },
                            "R": {
                                "type": "string",
                                "description": "result"
                            }
                        }
                    }
                },
                "required": [
                    "who",
                    "to",
                    "content"
                ]
            }
        }
    ]
}

```

```json
{
    "who": "小明",
    "to": "小红帽",
    "content": {
        "S": "在他吃不起饭的时候",
        "T": "主动帮助他",
        "A": "请他吃饭、给他创业基金",
        "R": "最终小明逆袭成为霸道总裁"
    }
}
```
