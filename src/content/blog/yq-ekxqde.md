---
title: 'React HOC中的危险写法'
description: '最近参与一个开发基础组件库的项目，开发过程平平淡淡。昨天在视觉走查时，设计小哥提了一个bug： 可选择表格：在第二页选中某一条数据，页码会自动跳回第一页。排查了一个多小时，发现每次props变了的时候，这个组件会重新执行constructo'
pubDate: 2019-04-22
updatedDate: 2019-04-22
tags: ['yuque', 'jose-wg1zg7']
source: 'https://www.yuque.com/jose/wg1zg7/ekxqde'
---

最近参与一个开发基础组件库的项目，开发过程平平淡淡。

昨天在视觉走查时，设计小哥提了一个bug：_ __可选择表格：在第二页选中某一条数据，页码会自动跳回第一页。_

排查了一个多小时，发现每次props变了的时候，这个组件会重新执行constructor，然后因为构造函数里有默认初始化逻辑，所以pagination每次会被初始化。。。

问题是找到了，可是为什么会这样呢？

先看下table的代码，最重要的一行：export default withDnd(Table);

问题就出现在这个withDnd函数上，下面我们来看一下这个函数：

```typescript
import React from 'react';
import { DragDropContext, DragDropContextConsumer, ContextComponent } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

let defaultDragDropContext: >(
  DecoratedComponent: TargetClass
) => TargetClass & ContextComponent;

function getDefaultDragDropContext() {
  if (!defaultDragDropContext) {
    defaultDragDropContext = DragDropContext(HTML5Backend);
  }
  return defaultDragDropContext;
}

const withDnd = (WrappedComponent: any) => {
  return (props: any) => {
    return (
      
        {value => {
          if (value && value.dragDropManager != null) {
            return ;
          }
          const Comp = getDefaultDragDropContext()(WrappedComponent);
          return ;
        }}
      
    );
  };
};

export default withDnd;

```

这是一个装饰器函数，对传入的组件进行了dndContext包裹的处理，问题就出现在第24行，因为这样写，每次都会重新生成一个组件实例。。。

简单修改后：

```typescript
import React from 'react';
import { DragDropContext, DragDropContextConsumer, ContextComponent } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

let defaultDragDropContext: >(
  DecoratedComponent: TargetClass
) => TargetClass & ContextComponent;

function getDefaultDragDropContext() {
  if (!defaultDragDropContext) {
    defaultDragDropContext = DragDropContext(HTML5Backend);
  }
  return defaultDragDropContext;
}

const withDnd = (WrappedComponent: any) => {
  // here
  const DefaultComp = getDefaultDragDropContext()(WrappedComponent);
  return (props: any) => {
    return (
      
        {value => {
          if (value && value.dragDropManager != null) {
            return ;
          }
          // const Comp = getDefaultDragDropContext()(WrappedComponent);
          return ;
        }}
      
    );
  };
};

export default withDnd;

```
