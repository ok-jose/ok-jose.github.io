---
title: '一个简单的文本换行需求'
description: '对传进来一个tips文本支持换行方案1： Jose''}} /&gt;使用React的dangerouslySetInnerHTML，不过这样存在安全隐患（XSS攻击）dangerouslySetI...'
pubDate: 2020-02-28
updatedDate: 2020-02-28
tags: ['yuque', 'jose-wg1zg7']
source: 'https://www.yuque.com/jose/wg1zg7/vc9qxx'
---

> 对传进来一个tips文本支持换行
>

![](/uploads/yuque/vc9qxx/1582896362871-d8993671-a772-4b.png)

#### 方案1：

```html
 Jose'}} />
```

使用React的dangerouslySetInnerHTML，不过这样存在安全隐患（XSS攻击）

> dangerouslySetInnerHTML is React’s replacement for using innerHTML in the browser DOM. In general, setting HTML from code is risky because it’s easy to inadvertently expose your users to a cross-site scripting (XSS) attack. So, you can set HTML directly from React, but you have to type out dangerouslySetInnerHTML and pass an object with a __html key, to remind yourself that it’s dangerous.
>

#### 方案2：
根据特殊字符使用js来处理：

```javascript
const tips = "jose \n woffee \n nina"
const tipsArr = tips.split('\n')
....
```

#### 方案3:
最简单 使用css `white-space` 属性：

```html
jose \n woffee \n nina
```

```css

.tips-with-n {
	white-space: 'pre-wrap'; // pre-line pre 也能满足此处的需求
}
```

> white-space 属性取值
>

| normal | 默认。空白会被浏览器忽略。 |
| :--- | :--- |
| pre | 空白会被浏览器保留。其行为方式类似 HTML 中的  标签。 |
| nowrap | 文本不会换行，文本会在在同一行上继续，直到遇到 
 标签为止。 |
| pre-wrap | 保留空白符序列，但是正常地进行换行。 |
| pre-line | 合并空白符序列，但是保留换行符。 |
| inherit | 规定应该从父元素继承 white-space 属性的值。 |
