---
title: '浏览器取消请求的问题排查（canceled）'
description: '项目组的小伙伴问到：部署了新环境，但是部分请求被cancel，然后页面一直reload。描述问题的The DOM element that caused the request to be made got deleted (i.e. an'
pubDate: 2021-03-31
updatedDate: 2021-04-03
tags: ['yuque', 'jose-wg1zg7']
source: 'https://www.yuque.com/jose/wg1zg7/ib5gil'
---

![](/uploads/yuque/ib5gil/1617156773558-c375e80a-7162-4d.png)

项目组的小伙伴问到：部署了新环境，但是部分请求被cancel，然后页面一直reload。

描述问题的

+ The DOM element that caused the request to be made got deleted (i.e. an IMG is being loaded, but before the load happened, you deleted the IMG node)
+ You did something that made loading the data unnecessary. (i.e. you started loading a iframe, then changed the src or overwrite the contents)
+ There are lots of requests going to the same server, and a network problem on earlier requests showed that subsequent requests weren't going to work (DNS lookup error, earlier (same) request resulted e.g. HTTP 400 error code, etc)
