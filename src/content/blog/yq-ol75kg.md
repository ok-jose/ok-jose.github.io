---
title: 'Git的一些操作'
description: '// git checkout -b 本地分支名 origin/远程分支名 git checkout -b jose_dev origin/release/010  ============================= Switche'
pubDate: 2020-10-30
updatedDate: 2020-11-02
tags: ['yuque', 'jose-wg1zg7']
source: 'https://www.yuque.com/jose/wg1zg7/ol75kg'
---

## Git切换到指定远程分支
```git
// git checkout -b 本地分支名 origin/远程分支名
git checkout -b jose_dev origin/release/010

=============================
Switched to a new branch 'jose_dev'
Branch 'jose_dev' set up to track remote branch 'release/010' from 'origin'.
```

该命令可以将远程git仓库里的指定分支拉取到本地，这样就在本地新建了一个jose_dev分支，并和指定的远程分支release/release/010关联了起来。

### 查看本地分支及本地分支追踪的远程分支 git branch -vv
![](/uploads/yuque/ol75kg/1604023821931-f2dbe489-909c-4d.png)

### 推送本地分支到远程
```git
git push   :
git push origin release/10.30:release/10.30
```

## git恢复某个文件到上一个提交版本
1.首先查看一下该文件的commit记录：git log 文文件

```git
git log src/index.java
```

2.找到需要提交到上一个版本的commit号，然后checkout该文件的上一版本，输入下面的指令：

```git
git checkout [commit id] 文件
// 例如 git checkout a57fb4b474888f0db4cba18de2180496 src/index.java
```

3.然后将checkout的版本提交到本地

```git
git commit -m "回退到上一版本"
```

4.最后将改变提交到分支远程：

```git
git push origin 分支名
```
