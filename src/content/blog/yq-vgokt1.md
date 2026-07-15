---
title: 'JS new的模拟实现'
description: 'function myFullName(firstName, lastName) {     this.firstName = firstName;   this.lastName = lastName; }  var myName = n'
pubDate: 2020-09-06
updatedDate: 2020-09-06
tags: ['yuque', 'jose-wg1zg7']
source: 'https://www.yuque.com/jose/wg1zg7/vgokt1'
---

```javascript
function myFullName(firstName, lastName) {
	this.firstName = firstName;
  this.lastName = lastName;
}

var myName = new myFullName("Lee","Jose");
myName.firstName // "Lee"
```

这里就简单的来看一下 new 的过程吧：

伪代码表示：

```javascript
var myName = new myFullName("Lee","Jose");
new myFullName {
  // 1.创建一个空对象
	var obj = {} 
  // 2.将新创建的空对象的隐式原型指向其构造函数的显式原型
  obj.__proto__ = myFullName.prototype 
  // 3.使用call改变this指向
  var result = myFullName.call(obj,"Lee","Jose");
  // 4.如果无返回值或者返回一个非对象值，则将 obj 返回作为新对象；如果返回值是一个新对象的话那么直接直接返回该对象
  return typeof result === 'object'? result : obj;
}
```
