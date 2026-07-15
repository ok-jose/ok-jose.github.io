---
title: 'ES6 的类'
description: '类的数据类型就是函数，类本身就指向构造函数class Ponit {     constructor() {     // ...   }    toString() {     // ...   }    toValue() {     '
pubDate: 2020-08-02
updatedDate: 2020-08-02
tags: ['yuque', 'jose-wg1zg7']
source: 'https://www.yuque.com/jose/wg1zg7/zwrgfg'
---

> 类的数据类型就是函数，类本身就指向构造函数
>

```javascript
class Ponit {
	constructor() {
    // ...
  }

  toString() {
    // ...
  }

  toValue() {
    // ...
  }
}
typeof Point // function
Point === Ponit.protoType.constructor // true
// 等同于
Point.prototype = {
  constructor() {},
  toString() {},
  toValue() {},
};

```
