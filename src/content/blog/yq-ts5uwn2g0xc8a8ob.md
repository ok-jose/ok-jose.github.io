---
title: '编排服务分享'
description: '编排服务DSLhttps://aliyuque.antfin.com/trantor/eewi6i/vlednodbg2ram50h1. 编排服务概述1.1.  定位让研发人员在线定义服务（最开始还包含了产品）1.2. 服务对象专业开发者1'
pubDate: 2024-06-17
updatedDate: 2024-06-18
tags: ['yuque', 'jose-wg1zg7']
source: 'https://www.yuque.com/jose/wg1zg7/ts5uwn2g0xc8a8ob'
---

编排服务DSL

[https://aliyuque.antfin.com/trantor/eewi6i/vlednodbg2ram50h](https://aliyuque.antfin.com/trantor/eewi6i/vlednodbg2ram50h)

# 编排服务概述
##  定位
让研发人员在线定义服务（最开始还包含了产品）

## 服务对象
专业开发者

## 信息结构
![画板](/uploads/yuque/ts5uwn2g0xc8a8ob/1718629863447-d6724f3f-7b32-4e.jpg)

![](/uploads/yuque/ts5uwn2g0xc8a8ob/1718624905769-06ea65f4-7242-44.png)

# 创建一个编排服务
## step by step
![](/uploads/yuque/ts5uwn2g0xc8a8ob/1718628148894-2560cb4e-b116-40.png)

## 使用服务模板
![](/uploads/yuque/ts5uwn2g0xc8a8ob/1718628183978-1e377507-deba-44.png)

## 使用AI
![](/uploads/yuque/ts5uwn2g0xc8a8ob/1718628245335-4ca654ed-368c-4d.png)

# 编排服务与AI 的探索
1. 最初 生成字段名，文本翻译
2. 根据 dsl 推出下个候选节点
3. 推断要赋值的参数
4. 根据服务描述生成完整的 dsl
5. 服务中 AI 节点：增加调用 AI 的能力

# 编排服务的赏析&调试
[Trantor-Console](https://emp-console-dev.app.terminus.io/team/1/branch/1/app/15349/serviceflow/crm$delete_visit_task)删除拜访任务

[Trantor-Console](https://emp-console-dev.app.terminus.io/team/1/branch/1/app/2/scene/HR$hr_entrance_list)HR 名下员工异常考勤

[Trantor-Console](https://emp-console-dev.app.terminus.io/team/1/branch/1/app/2/serviceflow/HR$query_dept_attendance_exceptions_copy) 查询部门考勤异常数据_

```plain
{
  "teamId": "1",
  "params": {
    "request": {
      "pageable": {
        "pageNo": 1,
        "pageSize": 20
      }
    }
  },
  "portalKey": "EMP_MANAGER_PORTAL"
}
// staff_ID: 44
```

# 关于难用
1. 交互难用
2. 节点配置不易理解
3. editor 能力不够强大，sql、js 节点
