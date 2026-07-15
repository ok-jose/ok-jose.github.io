---
title: 'Typescript的稍微高阶用法'
description: '预定义的条件类型（Predefined conditional types）TypeScript 2.8在lib.d.ts里增加了一些预定义的有条件类型：Exclude&lt;T, U&gt; – Exclude from T those '
pubDate: 2019-08-20
updatedDate: 2019-08-21
tags: ['yuque', 'jose-wg1zg7']
source: 'https://www.yuque.com/jose/wg1zg7/sfrgsa'
---

## 预定义的条件类型（Predefined conditional types）
TypeScript 2.8在`lib.d.ts`里增加了一些预定义的有条件类型：

+ `Exclude` – Exclude from `T` those types that are assignable to `U`.
+ `Extract` – Extract from `T` those types that are assignable to `U`.
+ `NonNullable` – Exclude `null` and `undefined` from `T`.
+ `ReturnType` – Obtain the return type of a function type.
+ `InstanceType` – Obtain the instance type of a constructor function type.

其实在几天前，我根本不知道这些东西，接手同事的工作，发现他用了`Exclude`

但是效果却并非是他想象中的。

> 下面是同事的用法:
>

```typescript
export interface InputNumberProps {
  prefixCls?: string;
  min?: number;
  max?: number;
  value?: number;
  onChange?: (value: number | string | undefined) => void;
 	// ...
}

export type RangeNumberProps = {
  value: number[];
  onChange: (value: number[] | undefined[]) => void;
  leftProps: InputNumberProps;
  rightProps: InputNumberProps;
} & Exclude;
```

他犯了一个“顾名思义”的错误，他的用意是想要把InputNumberProps剔除 'value'和'onChange'后的定义和RangeNumberProps合并，但是Exclude的用法根本不是这样，如果这里想要实现这个效果，可以这样写：

```typescript
...
  & Omit
```

好吧，在查询Exclude的用法时，就顺带了解了“预定义的条件类型”（其实我不明白为什么叫这个名字，费解）

### Exclude
![](/uploads/yuque/sfrgsa/1566310645011-5ecd7fc6-f6e6-48.png)

```typescript
type T00 = Exclude;  // "b" | "d"
type T01 = Exclude // never
```
