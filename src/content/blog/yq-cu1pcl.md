---
title: 'History路由和Hash路由的区别'
description: 'hash路由在地址栏URL上有#，而history路由没有会好看一点...hash路由支持低版本的浏览器，而history路由是HTML5新增的APIhash的特点在于它虽然出现在了URL中，但是不包括在http请求中，所以对于后端是没有一'
pubDate: 2020-10-25
updatedDate: 2020-10-25
tags: ['yuque', 'jose-wg1zg7']
source: 'https://www.yuque.com/jose/wg1zg7/cu1pcl'
---

1. hash路由在地址栏URL上有#，而history路由没有会好看一点...
2. hash路由支持低版本的浏览器，而history路由是HTML5新增的API
3. hash的特点在于它虽然出现在了URL中，但是不包括在http请求中，所以对于后端是没有一点影响的，所以改变hash不会重新加载页面，所以这也是单页面应用的必备
4. history运用了浏览器的历史记录栈，之前有back,forward,go方法，之后在HTML5中新增了pushState（）和replaceState（）方法（需要特定浏览器的支持）

## Hash模式
hash的原理是监听 `onhashchange事件` ,可以在window对象上监听这个事件:

```javascript
window.onhashchange=()=>{
		console.log(event.oldURL, event.newURL);
    let hash = location.hash.slice(1); 
    document.body.style.color = hash;
}
```

上面的代码，通过hash的变化可以改变页面字体颜色，虽然没什么用，但是说明了原理，因为hash变化url都会被浏览器记录下来，从而浏览器的前进后退都可用了。hash变化，并不会去请求服务端，但是页面状态和url的变化却因为hash联系在一起了，后来人们给它起了一个霸气的名字叫 `前端路由` ，成为了单页应用标配。

## History路由
> 随着history api的到来，前端路由开始进化了,前面的hashchange，你只能改变#后面的url片段，而history api则给了前端完全的自由。
>

history api可以分为两大部分，切换和修改，参考MDN，

1. 切换历史状态包括 `back` 、 `forward` 、 `go`  三个方法，对应浏览器的前进，后退，跳转操作

```javascript
history.go(-2);//后退两次
history.go(2);//前进两次
history.back(); //后退
hsitory.forward(); //前进
```

2. 修改历史状态包括了 `pushState` 、 `replaceState` 

HTML5新接口，可以改变网址(存在跨域限制)而不刷新页面，这个强大的特性后来用到了单页面应用如：vue-router，react-router-dom中。

两个方法,这两个方法接收三个参数:`stateObj`,`title`,`url`

```javascript
history.pushState({color:'red'}, 'red', 'red')
history.back();
setTimeout(function(){
     history.forward();
 },0)
window.onpopstate = function(event){
     console.log(event.state)
     if(event.state && event.state.color === 'red'){
           document.body.style.color = 'red';
      }
}
```

用 `history.pushState()` 或者 `history.replaceState()` 不会触发 `onpopstate` 事件。

（最近用`onpopstate` 解决了一个通过点击浏览器back按钮，页面弹窗不消失的bug）

### history模式的问题
通过history api，我们丢掉了丑陋的#，但是它也有个问题：不怕前进，不怕后退，就怕**刷新**，**f5**，（如果后端没有准备的话）,因为刷新是实实在在地去请求服务器的,不玩虚的。 在hash模式下，前端路由修改的是#中的信息，而浏览器请求时是不带它玩的，所以没有问题。但是在history下，你可以自由的修改path，当刷新时，如果服务器中没有相应的响应或者资源，会分分钟刷出一个404来。
