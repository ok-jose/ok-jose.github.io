---
title: '为啥没调用俺的方法之ES6 Class详解'
description: '刚哥，为啥我自定义容器里这个方法没有调用有天（友天）有个小伙伴问我，他写的这个lookUpSourceChange为什么没有调用左边的是原始代码，然后告诉我说之前是好用的，现在突然就不行了，被我喷了一顿，我一看 告诉他改成了右边的这种写法，'
pubDate: 2021-08-06
updatedDate: 2021-08-17
tags: ['yuque', 'jose-wg1zg7']
source: 'https://www.yuque.com/jose/wg1zg7/eqqm1r'
---

## 刚哥，为啥我自定义容器里这个方法没有调用

有天有个小伙伴问我，他写的这个lookUpSourceChange为什么没有调用

![](/uploads/yuque/eqqm1r/1628415869432-ccede220-14ec-4f.png)

这段代码的意思时继承一个ItemContainer的基类，然后想要复写lookUpSourceChange方法。

左边的是原始代码，然后告诉我说之前是好用的，现在突然就不行了，我说不可能....告诉他改成了右边的这种写法，就work了。

![](/uploads/yuque/eqqm1r/1628414858634-13dcaa44-03dc-4a.png)

然后我继续追问，发了一个[解释的链接](https://github.com/Microsoft/TypeScript/issues/9722)给小伙子，让他给我描述下啥问题，不过得到的回答并不理想。

## why？different？
```javascript
class Person {
  constructor(name) {
    this.name = name;
  }
  age(num) {
    console.log(`${this.name} is ${num} years old !!`);
  }
  sex = (gender) => {
    console.log(`${this.name} is super ${gender} !!`);
  };
}
const p = new Person('jose')
```

大家觉得上面age、sex这两种写法有什么区别？下面会输出什么？

```javascript
class Person {
  constructor(name) {
    this.name = name;
  }
  age(num) {
    console.log(`${this.name} is ${num} years old !!`);
  }
  sex = (gender) => {
    console.log(`${this.name} is super ${gender} !!`);
  };
}

class People extends Person {
  constructor(name) {
    super();
    this.name = name;
  }
  age(year) {
    console.log(`${this.name} is only ${year} years old !!`);
  }
  sex(male) {
    console.log(`${this.name} is ${male} !!`);
  }
}
const p = new People('Jose');
p.sex('boy'); // ??
p.age(18); // ??
```

> Person的实例
>

![](/uploads/yuque/eqqm1r/1628424318082-207527ce-cfde-43.png)

> People(extends Person)的实例
>

![](/uploads/yuque/eqqm1r/1628424622819-a095c3ec-2f00-41.png)

上面输出的正确答案是:

```javascript
p.sex("boy"); // Jose is super boy
p.age(18); // Jose is Only 18 years old !!
```

```javascript
class Person {
  constructor(name) {
    this.name = name;
  }
  // 静态属性和方法：不能在类的实例上调用静态方法，而应该通过类本身调用
  static nature = 'good'
  // 原型属性和方法：所有人共同使用一个
  age(num) {
    console.log(`${this.name} is ${num} years old !!`);
  }
  // 实例属性和方法：每个人都有一份
  sex = (gender) => {
    console.log(`${this.name} is super ${gender} !!`);
  };
}
```

可以看下[tc39对class的定义](https://tc39.es/ecma262/#sec-class-definitions)

Person类上的age是原型属性，**sex是实例属性**，当People类继承Person时，得到与父类（Person）同样的实例属性和方法，然后再对其进行加工，加上子类自己的实例属性和方法，但是People定义的sex是原型方法，所以在调用People实例的sex方法时，先去找实例上的属性，找不到才去原型链上找，这时父类的sex方法就屏蔽了子类上的sex方法。

![](/uploads/yuque/eqqm1r/1628425073816-9fd0bbe5-3cca-46.png)

> The fundamental restriction here is that prop() { } declares a prototype member, whereas prop: Functype declares an instance member. It's not possible for a prototype member to 'hide' an instance member, so any implementation declared this way would never be called.
>
> It sounds like you might want to make A abstract based on your setup.
>

PS：ES6定义一个原型属性还是挺麻烦的

![](/uploads/yuque/eqqm1r/1628674851038-e4919da7-c99d-44.png)

## 反转~迟来的道歉~哈哈
回应下上面小伙伴发出的疑问：为啥之前是好的

我翻了下代码，赫然发现这个本来是原型属性的lookUpSourceChange，在三周前被改成了实例属性，然后自定义容器在使用lookUpSourceChange时又声明成了原型属性，就导致了属性屏蔽。

![](/uploads/yuque/eqqm1r/1628425254118-552bdb2b-a2db-48.png)

其实vscode在文件的大纲里也用图标给我区分了实例属性和原型属性，

然后我下意识的翻了下自己之前写的代码，也是一通乱写，好像写成实例属性只是为了bind this??

![](/uploads/yuque/eqqm1r/1628426149918-da9de4c4-0bb6-47.png)

## 大家都是什么时候接触class的用法
其实ES6刚提出class的概念时，我只是了解了下，真正用是从React [classComponent](https://github.com/facebook/react/blob/64931821a9df262f2b6475404d025bcff97c3e0a/packages/react/src/ReactBaseClasses.js)开始

思考：

1. class组件里什么场景使用原型属性什么时候使用实例属性？
2. ES6的Class本质和React中需要使用bind(this)的原因？

ES6 Class代码

```javascript
class Person {
    constructor(name) {
        this.name = name;
    }
  
    sayHello() {
        return 'hello, I am ' + this.name;
    }
  
    sayage = (age)=>{
            return `hello, I am ' + ${this.name} , ${age} years old`;
     }
}

```

ES5代码

```javascript
function Person(name) {
    this.name = name;
  	this.sayAge = (age)=>{
			return `hello, I am ' + ${this.name} , ${age} years old`;
	}
}

Person.prototype.sayHello = function () {
    return 'hello, I am ' + this.name;
};
```

babel编译后

```javascript
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

var Person = /*#__PURE__*/ (function () {
  "use strict";

  function Person(name) {
    var _this = this;

    _classCallCheck(this, Person);

    _defineProperty(this, "sayAge", function (age) {
      return "hello, I am ' + "
        .concat(_this.name, " , ")
        .concat(age, " years old");
    });

    this.name = name;
  }

  _createClass(Person, [
    {
      key: "sayHello",
      value: function sayHello() {
        return "hello, I am " + this.name;
      }
    }
  ]);

  return Person;
})();

```

可以看到 Babel 生成了一个 _createClass 辅助函数，该函数传入三个参数，第一个是构造函数，在这个例子中也就是 Person，第二个是要添加到原型上的函数数组，第三个是要添加到构造函数本身的函数数组，也就是所有添加 static 关键字的函数。该函数的作用就是将函数数组中的方法添加到构造函数或者构造函数的原型中，最后返回这个构造函数。

在其中，又生成了一个 defineProperties 辅助函数，使用 Object.defineProperty 方法添加属性。

## 复习下继承（凑时长）
1. 原型链继承

```javascript
function Parent() {
  this.name = "parent";
  this.interest = ["eat"];
}

function Child() {
  this.type = "child";
}

Child.prototype = new Parent();
let child = new Child();
console.log(child.name, child.type);
// 缺点：
// 1. 多个实例公共一个原型对象，它们的内存空间是共享的。当一个发生变化时，另一个也随之变化
// 2.在创建 Child 的实例时，不能向Parent传参
```

2. 构造函数继承

```javascript
function Parent(name) {
  this.name = name;
  this.interest = ["eat"];
}

Parent.prototype.getName = function () {
  return this.name;
};

function Child(name) {
  Parent.call(this, name);
  this.type = "child";
}
// 缺点：只能继承父类的实例属性和方法，不能继承原型属性或方法
```

3. 组合继承（原型链+构造函数）

```javascript
function Parent() {
  this.name = "parent";
  this.interest = ["eat"];
}

Parent.prototype.getName = function () {
  return this.name;
};

function Child() {
  Parent.call(this);
  this.type = "child type";
}

Child.prototype = new Parent();
Child.prototype.constructor = Child;
// 缺点：会调用两次超类型的构造函数，即Parent执行了两次，第一次是改变 Child的prototype的时候，第二次是通过call方法调用Parent的时候。
```

4. 原型式继承

```javascript
let parent = {
  name: "parent",
  interest: ["eat"],
  getName: function () {
    return this.name;
  },
};

let parent1 = Object.create(parent);
let parent2 = Object.create(parent, {name: {value: 'jose'});
// es5 Bar.prototype = Object.create(Foo.prototype, properties)
// es5 Object.setPrototypeOf(Bar.prototype, Foo.prototype)

```

5. 寄生式继承

```javascript
let parent = {
  name: "parent",
  interest: ["eat", "run"],
  getName: function () {
    return this.name;
  },
};

function clone(original) {
  let clone = Object.create(original);
  clone.getInterest = function () {
    return this.interest;
  };
  return clone;
}
```

6. 寄生式组合继承

```javascript

function Parent() {
  this.name = "parent";
  this.interest = ["eat", "run"];
}

Parent.prototype.getName = function () {
  return this.name;
};

function Child() {
  Parent.call(this);
  this.type = "child type";
}

function clone(parent, child) {
  // 改用Object.create可以减少组合继承中多进行一次构造函数
  child.prototype = Object.create(parent.prototype);
  child.prototype.constructor = child;
}

clone(Parent, Child);

Child.prototype.getInterest = function () {
  return this.interest;
};

let child1 = new Child();
let child2 = new Child();
```

## ES6的Class继承
ES5 的继承，实质是先创造子类的实例对象this，然后再将父类的方法添加到this上面（Parent.apply(this)）。

ES6 Class 通过 extends 关键字实现继承，这比 ES5 的通过修改原型链实现继承，要清晰和方便很多。

ES6 Class 代码

```javascript
class Parent {
    constructor(name) {
        this.name = name;
    }
}

class Child extends Parent {
    constructor(name, age) {
      	// 调用父类的 constructor(name)
        super(name); // Parent.prototype.constructor.call(this)
        this.age = age;
    }
}

var child1 = new Child('Jose', '18');

console.log(child1);
```

ES6 的继承机制完全不同，实质是先将父类实例对象的属性和方法，加到this上面（所以必须先调用super方法），然后再用子类的构造函数修改this。在子类的构造函数中，只有调用 super 之后，才可以使用this关键字，否则会报错。这是因为子类实例的构建，基于父类实例，只有super方法才能调用父类实例。super作为函数调用时，代表父类的构造函数。ES6 要求，子类的构造函数必须执行一次super函数。

![](/uploads/yuque/eqqm1r/1628490690460-b5be8eb5-faf4-49.png)

```javascript
Child.__proto__ === Parent
Child.prototype.__proto__ === Parent.prototype
child.__proto__ === Child.prototype
```

Babel编译后

```javascript
function _typeof(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === "function" &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? "symbol"
        : typeof obj;
    };
  }
  return _typeof(obj);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, writable: true, configurable: true }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf =
    Object.setPrototypeOf ||
    function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
  return _setPrototypeOf(o, p);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
      result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  };
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }
  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return self;
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;
  try {
    Boolean.prototype.valueOf.call(
      Reflect.construct(Boolean, [], function () {})
    );
    return true;
  } catch (e) {
    return false;
  }
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
  return _getPrototypeOf(o);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Parent = function Parent(name) {
  "use strict";

  _classCallCheck(this, Parent);

  this.name = name;
};

var Child = /*#__PURE__*/ (function (_Parent) {
  "use strict";

  _inherits(Child, _Parent);

  var _super = _createSuper(Child);

  function Child(name, age) {
    var _this;

    _classCallCheck(this, Child);

    _this = _super.call(this, name); // 调用父类的 constructor(name)

    _this.age = age;
    return _this;
  }

  return Child;
})(Parent);

var child1 = new Child("jose", "18");
console.log(child1);

```

可以看到 Babel 创建了 _inherits 函数帮助实现继承，又创建了 _createSuper 函数帮助确定调用父类构造函数的返回值，我们来细致的看一看代码。

```javascript
function _inherits(subClass, superClass) {
  // type检查，extends的的目标必须是function 或者 null
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  // 类似于 ES5 的寄生组合式继承，使用 Object.create，设置子类 prototype属性指向父类的 prototype 属性,
  // 并把构造函数这项子类
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, writable: true, configurable: true }
  });
  // 设置子类的 __proto__ 属性指向父类
  if (superClass) _setPrototypeOf(subClass, superClass);
}

// 创造super， 调用父类构造函数 创造this
function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
      result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  };
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }
  return _assertThisInitialized(self);
}
```

最后我们总体看下如何实现继承：

首先执行 _inherits(Child, Parent)，建立 Child 和 Parent 的原型链关系，即 Object.setPrototypeOf(Child.prototype, Parent.prototype) 和 Object.setPrototypeOf(Child, Parent)。

然后调用 Parent.call(this, name)，根据 Parent 构造函数的返回值类型确定子类构造函数 this 的初始值 _this。

最终，根据子类构造函数，修改 _this 的值，然后返回该值。

## 相关文档
### 参考
1. [阮一峰 Class继承](https://es6.ruanyifeng.com/#docs/class-extends)
2. [知乎 一文吃透JavaScript继承](https://zhuanlan.zhihu.com/p/353724120)
3. [ES6 系列之 Babel 是如何编译 Class 的](https://github.com/mqyqingfeng/Blog/issues/105)
