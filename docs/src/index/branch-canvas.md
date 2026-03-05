---
layout: index
index: true
title: 'Branch Canvas 基于 Vue 3 + Canvas 实现'
cover: '/images/posts/branch-canvas/1.png'
description: '一个基于 Vue 3 的轻量级柳枝背景插件，可以轻松在网页或组件中生成飘动的柳枝背景效果，适合用于网站、博客、活动页面等场景，增加自然灵动的视觉感'
category: bar
tags:
    - name: Vue
      icon: vscode-icons:file-type-vue
      color: #000000
      url: https://cn.vuejs.org/
    - name: Canvas
      icon: devicon:canva
      color: #000000
      url: https://canvas.apps.chrome/
    - name: Vite
      icon: devicon:vitejs
      color: #000000
      url: https://v3.vitejs.dev/guide/
date: 2026-03-02
---

> 感谢作者 [antfu](https://github.com/antfu/){.text-blog-primary} 原文链接：[梅开二度](https://www.bilibili.com/video/BV1wY411n7er/?spm_id_from=333.1387.homepage.video_card.click&vd_source=ecef86ade37287f107edb6964d526922){.text-blog-primary}

---

## 我把一个直播里的小 Demo，做成了一个开源组件

有时候，一个很有意思的开源项目，并不是从一个宏大的计划开始的。可能只是某次直播、某段代码、或者一个看起来很随意的小实验。这个组件 `Branch Canvas` 的灵感，就来自于一次 **[@antfu](https://github.com/antfu)** 的直播。当时他在直播里写了一个用 **Canvas 生成树枝生长动画** 的小 Demo。代码不复杂，但效果非常有意思：线条会从屏幕边缘慢慢生长出来，像树枝一样不断分叉，最后形成一种自然的背景纹理。那一刻我就在想：

> 这个效果如果做成一个组件，用在博客背景里应该会很有意思。

于是我在原始思路的基础上，做了一些修改、优化和封装，最终整理成了一个可以直接使用的 Vue 组件，并开源了出来。

---

## 最终效果

组件会在页面背景生成一种“树枝生长”的动态效果：

- 从屏幕四周随机位置开始生长
- 每条线都会随机分叉
- 最终形成类似分形结构的自然纹理

整个过程是渐进式的，看起来像是背景在慢慢长出来。

并且这个动画是 **实时 `Canvas` 绘制** 的，而不是视频或者 GIF，因此体积非常小。

---

## 为什么会想做这个组件

很多网站都会使用背景动画，比如：

- 粒子背景
- 星空背景
- 波浪背景

但这些背景通常都比较“显眼”。

我更喜欢一种 **存在感不强，但又不完全静态的背景**。

这种树枝生长的效果正好符合这个特点：

- 不会抢内容的注意力
- 但页面又不会显得太单调
- 动画是慢慢出现的，很自然

于是就决定把它封装成一个组件。

---

## 技术实现思路

这个组件的核心其实非常简单：**不断生成新的线段，并随机产生分叉。** 整体流程大概是这样的：生成起点 > 绘制一段线条 > 计算终点 > 随机决定是否分叉 > 把新分支加入下一帧任务。随着帧数增加，树枝会逐渐长满整个屏幕。

---

## Canvas 初始化

为了保证在高 DPI 屏幕上显示清晰，需要根据 `devicePixelRatio` 调整画布分辨率。

```ts
function initCanvas(canvas: HTMLCanvasElement, width = 400, height = 400) {
	const ctx = canvas.getContext('2d')!;

	const dpr = window.devicePixelRatio || 1;

	canvas.width = width * dpr;
	canvas.height = height * dpr;

	canvas.style.width = `${width}px`;
	canvas.style.height = `${height}px`;

	ctx.scale(dpr, dpr);

	return ctx;
}
```

---

## 极坐标计算

树枝生长其实就是：从某个点，沿某个角度延伸一段距离。所以使用极坐标来计算新的坐标。

```ts
function polar2cart(x = 0, y = 0, r = 0, theta = 0) {
	const dx = r * Math.cos(theta);
	const dy = r * Math.sin(theta);

	return [x + dx, y + dy];
}
```

---

## 树枝分叉算法

每画一条线，就会随机生成两个新的方向。

```ts
const rad1 = rad + random() * r15;
const rad2 = rad - random() * r15;

if (random() < rate) {
	steps.value.push(() => step(ctx, nx, ny, rad1, counter));
}
```

随着深度增加，分叉概率会降低，这样可以避免树枝无限生长。

---

## 从四个方向开始生长

初始化时会在屏幕四周生成种子。

```ts
steps.value = [
	() => step(ctx, randomMiddle * width, 0, r90),
	() => step(ctx, randomMiddle * width, height, -r90),
	() => step(ctx, 0, randomMiddle * height, 0),
	() => step(ctx, width, randomMiddle * height, Math.PI),
];
```

---

## 边缘渐隐效果

如果线条直接到达边缘，会显得有些生硬。所以我给组件加了一个 **径向渐变遮罩**。

```ts
const mask = 'radial-gradient(circle, transparent, black)';
```

这样，中心区域完全可见越靠近边缘越淡，视觉上会更柔和一些。

---

虽然只是一个很小的组件，但整个过程其实挺有意思的。如果你也在做自己的博客或者个人网站，也许可以试试在背景里放一点这样的动态细节。它不会抢走内容的注意力，但会让页面多一点点生命力。

> 项目地址：[BranchCanvs](https://github.com/359Steve/bjbn-map.git)
