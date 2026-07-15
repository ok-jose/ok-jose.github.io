---
title: 'JavaScript的数组'
description: 'JavaScript的 Array 对象是用于构造数组的全局对象，数组是类似于列表的高阶对象。数组是一种类列表对象，它的原型中提供了遍历和修改元素的相关操作。（Array.prototype.reduce()）JavaScript 数组的长'
pubDate: 2020-06-26
updatedDate: 2020-06-26
tags: ['yuque', 'jose-wg1zg7']
source: 'https://www.yuque.com/jose/wg1zg7/dd2fnu'
---

> JavaScript的 `**Array**` 对象是用于构造数组的全局对象，数组是类似于列表的高阶对象。
>

1. 数组是一种类列表对象，它的原型中提供了遍历和修改元素的相关操作。（Array.prototype.reduce()）
2. JavaScript 数组的长度和元素类型都是非固定的。因为数组的长度可随时改变，并且其数据在内存中也可以不连续，所以 JavaScript 数组不一定是密集型的，这取决于它的使用方式。

常规的操作就不在赘述了，只记录下自己不了解的

#### 正则匹配结果所返回的数组
使用正则表达式匹配字符串可以得到一个数组。这个数组中包含本次匹配的相关信息和匹配结果。`[RegExp.exec](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec)`、`[String.match](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/match)`、`[String.replace](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replace)` 都会返回这样的数组。看下面的例子和例子下面的表格：

```javascript
// 匹配1个 d 后面紧跟着至少1个 b，再后面又跟着1个 d 的子串，
// 并且需要记住子串中匹配到的 b 和最后的 d （通过正则表达式中的分组），
// 同时在匹配时忽略大小写
myRe = /d(b+)(d)/i;
myArray = myRe.exec("cdbBdbsbz");
// ['dbBd', 'bB', 'd', index: 1, input: "cdbBdbsbz", groups: undefined]
myArray.length //3
myArray.input // "cdbBdbsbz"
```

该正则匹配返回的数组包含以下属性和元素：

| 属性/元素 | 说明 | 示例 |
| :--- | :--- | :--- |
| `input` | 只读属性，原始字符串 | cdbBdbsbz |
| `index` | 只读属性，匹配到的子串在原始字符串中的索引 | 1 |
| `[0]` | 只读元素，本次匹配到的子串 | dbBd |
| `[1], ...[n]` | 只读元素，正则表达式中所指定的分组所匹配到的子串，其数量由正则中的分组数量决定，无最大上限 | [1]: bB   [2]: d |

#### 构建[1,2,3...100]这样的数组
```javascript
// fill
const arr = new Array(100).fill(0).map((_,index)=>index)

// Array.from
const arr = Array.from(Array(100), (v, k) => k + 1)

// Array.keys
const arr = [...new Array(100).keys()]

```

`new Array(100)` 会生成一个有100空位的数组，这个数组是不能被`map()，forEach(), filter(), reduce(), every() ，some()`遍历的，因为空位会被跳过（`for of`不会跳过空位，可以遍历）。 `[...new Array(4)]` 可以给空位设置默认值`undefined`，从而使数组可以被以上方法遍历。

#### 原型上的方法汇总
##### 修改器方法
下面的这些方法会改变调用它们的对象自身的值：

+ `[Array.prototype.copyWithin()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin)` 在数组内部，将一段元素序列拷贝到另一段元素序列上，覆盖原有的值。
+ `[Array.prototype.fill()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/fill)` 将数组中指定区间的所有元素的值，都替换成某个固定的值。
+ `[Array.prototype.pop()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/pop)`删除数组的最后一个元素，并返回这个元素。
+ `[Array.prototype.push()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/push)`在数组的末尾增加一个或多个元素，并返回数组的新长度。
+ `[Array.prototype.reverse()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse)`颠倒数组中元素的排列顺序，即原先的第一个变为最后一个，原先的最后一个变为第一个。
+ `[Array.prototype.shift()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/shift)`删除数组的第一个元素，并返回这个元素。
+ `[Array.prototype.sort()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)`对数组元素进行排序，并返回当前数组。
+ `[Array.prototype.splice()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)`在任意的位置给数组添加或删除任意个元素。
+ `[Array.prototype.unshift()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift)`在数组的开头增加一个或多个元素，并返回数组的新长度。

##### 访问方法
下面的这些方法绝对不会改变调用它们的对象的值，只会返回一个新的数组或者返回一个其它的期望值。

+ `[Array.prototype.concat()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)`返回一个由当前数组和其它若干个数组或者若干个非数组值组合而成的新数组。
+ `[Array.prototype.includes()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/includes)` 判断当前数组是否包含某指定的值，如果是返回 `true`，否则返回 `false`。
+ `[Array.prototype.join()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/join)`连接所有数组元素组成一个字符串。
+ `[Array.prototype.slice()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)`抽取当前数组中的一段元素组合成一个新数组（可以用于复制一个数组）。
+ `[Array.prototype.toString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/toString)`返回一个由所有数组元素组合而成的字符串。遮蔽了原型链上的 `[Object.prototype.toString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString)` 方法。
+ `[Array.prototype.indexOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf)`返回数组中第一个与指定值相等的元素的索引，如果找不到这样的元素，则返回 -1。
+ `[Array.prototype.lastIndexOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf)`返回数组中最后一个（从右边数第一个）与指定值相等的元素的索引，如果找不到这样的元素，则返回 -1。

##### 迭代方法
在下面的众多遍历方法中，有很多方法都需要指定一个回调函数作为参数。在每一个数组元素都分别执行完回调函数之前，数组的length属性会被缓存在某个地方，所以，如果你在回调函数中为当前数组添加了新的元素，那么那些新添加的元素是不会被遍历到的。此外，如果在回调函数中对当前数组进行了其它修改，比如改变某个元素的值或者删掉某个元素，那么随后的遍历操作可能会受到未预期的影响。总之，不要尝试在遍历过程中对原数组进行任何修改，虽然规范对这样的操作进行了详细的定义，但为了可读性和可维护性，请不要这样做。

+ `[Array.prototype.forEach()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)`为数组中的每个元素执行一次回调函数。
+ `[Array.prototype.entries()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/entries)` 返回一个数组迭代器对象，该迭代器会包含所有数组元素的键值对。
+ `[Array.prototype.every()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/every)`如果数组中的每个元素都满足测试函数，则返回 `true`，否则返回 `false。`
+ `[Array.prototype.some()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/some)`如果数组中至少有一个元素满足测试函数，则返回 `true` ，否则返回 `false` 。
+ `[Array.prototype.filter()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)`将所有在过滤函数中返回 `true` 的数组元素放进一个新数组中并返回。
+ `[Array.prototype.find()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/find)` 找到第一个满足测试函数的元素并返回那个元素的值，如果找不到，则返回 `undefined`。
+ `[Array.prototype.findIndex()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex)` 找到第一个满足测试函数的元素并返回那个元素的索引，如果找不到，则返回 `-1`。
+ `[Array.prototype.map()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map)`返回一个由回调函数的返回值组成的新数组。
+ `[Array.prototype.reduce()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)`从左到右为每个数组元素执行一次回调函数，并把上次回调函数的返回值放在一个暂存器中传给下次回调函数，并返回最后一次回调函数的返回值。
+ `[Array.prototype.reduceRight()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight)`从右到左为每个数组元素执行一次回调函数，并把上次回调函数的返回值放在一个暂存器中传给下次回调函数，并返回最后一次回调函数的返回值。
+ `[Array.prototype.keys()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/keys)` 返回一个数组迭代器对象，该迭代器会包含所有数组元素的键。
+ `[Array.prototype.values()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/values)` 返回一个数组迭代器对象，该迭代器会包含所有数组元素的值。
