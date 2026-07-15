---
title: 'ES6中class的get和set'
description: '与ES5一样，在class内部可以使用get和set关键字，对某个属性设置存值函数(setter)和取值函数(getter)，拦截改属性的存取行为。'
pubDate: 2019-05-27
updatedDate: 2019-05-27
tags: ['yuque', 'jose-wg1zg7']
source: 'https://www.yuque.com/jose/wg1zg7/gugdel'
---

> 与ES5一样，在class内部可以使用get和set关键字，对某个属性设置存值函数(setter)和取值函数(getter)，拦截改属性的存取行为。
>

```javascript
class MyClass {
  constructor() {
    // ...
  }
  get prop() {
    return this_.prop;
  }
  set prop(value) {
    this._prop = value;
  }
}

let inst = new MyClass();

inst.prop = 123;
// setter: 123

inst.prop
// 123
```

上面代码中，`prop`属性有对应的存值函数和取值函数，因此赋值和读取行为都被自定义了。

（可以单独的使用get，或者get、set同时使用）

存值函数和取值函数是设置在属性的 [Descriptor](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor) 对象上的。

```javascript
class CustomHTMLElement {
  constructor(element) {
    this.element = element;
  }

  get html() {
    return this.element.innerHTML;
  }

  set html(value) {
    this.element.innerHTML = value;
  }
}

var descriptor = Object.getOwnPropertyDescriptor(
  CustomHTMLElement.prototype, "html"
);

"get" in descriptor  // true
"set" in descriptor  // true
```
