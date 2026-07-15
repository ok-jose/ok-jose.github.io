---
title: 'Sass的color函数'
description: 'fade-infade-outmix'
pubDate: 2019-09-02
updatedDate: 2019-09-02
tags: ['yuque', 'jose-wg1zg7']
source: 'https://www.yuque.com/jose/wg1zg7/igcp8b'
---

## mix
```css
mix($color1, $color2, $weight: 50%) //=> color
```

> 官方定义
>

Returns a number that’s a mixture of `$color1` and `$color2`.

Both the `$weight` and the relative opacity of each color determines how much of each color is in the result. The `$weight`must be a number between `0%` and `100%` (inclusive). A larger weight indicates that more of `$color1` should be used, and a smaller weight indicates that more of `$color2` should be used.

> 简单来讲
>

返回两个颜色的叠加色，第三个weight参数默认是50%（各取一半），取值范围是0%-100%

如果超过50%，则第一个颜色color1混入较多，小于50%，第二个颜色color2混入较多。

`$weight` 只能取 `0%-100%之间` 的数值。

> 举个例子
>

```css
mix(#036, #d2e1dd); // #698aa2 等价于mix(#036, #d2e1dd, 50%)
mix(#036, #d2e1dd, 75%); // #355f84
mix(#036, #d2e1dd, 25%); // #9eb6bf
mix(rgba(242, 236, 228, 0.5), #6b717f); // rgba(141, 144, 152, 0.75)
```

## fade-in与fade-out

```css
fade-in($color, $amount) //=> color 
fade-out($color, $amount) //=> color
```

> 官方定义
>

Make `$color`  more `opaque` or `opacity` .

The `$amount`  must be a number between 0 and 1 (inclusive). ` Increases or Reduces `  the alpha channel of `$color`  by that amount.

> 简单来讲
>

就是让改变第一个参数$color的透明度，fade-in让color变得 `更不透明` ，fade-out让color变得 `更透明` ， `$amount` 只能取 `0-1之间` 的数值。 

> 举个例子
>

```css
fade-in(rgba(255, 215, 210, 0.5), 0.4) // rgba(225, 215, 210, 0.9)
fade-out(rgba(255, 215, 210, 0.5), 0.4) // rgba(255, 215, 210, 0.1)
// 其实就是透明度的加减运算
```

附上 [sass-playground](https://www.sassmeister.com/) 链接，可以自己演示着玩玩
