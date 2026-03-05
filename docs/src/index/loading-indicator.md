---
layout: index
index: true
title: 'VP Loading Indicator 基于 Vue 3，适配 VitePress'
cover: '/images/posts/loading-indicator/1.png'
description: '基于 Vue 3 的 VitePress 顶部加载进度条组件，适用于文档站或 Vue 应用中的页面加载指示'
category: bar
tags:
    - name: VitePress
      icon: vscode-icons:folder-type-vitepress-opened
      color: #000000
      url: https://vitepress.dev/zh/
    - name: Vite
      icon: devicon:vitejs
      color: #000000
      url: https://v3.vitejs.dev/guide/
    - name: MarkDown
      icon: vscode-icons:file-type-markdown
      color: #000000
      url: https://www.markdownguide.org/
date: 2026-03-04
---

> VitePress 切换路由时缺少明显的页面反馈，用户会产生“点击了没反应”的错觉。

---

## 特性

- 基于 Vue 3 Composition API
- 自动监听 VitePress 路由
- 支持自定义进度计算函数
- 支持渐变色 / 错误态颜色
- 内置节流、防闪烁控制
- 单例模式，多个组件共享实例
- 使用 requestAnimationFrame 驱动动画

---

## 为什么不直接用 NProgress？

确实可以。但我想实现：

- 更平滑的缓动曲线
- 更可控的节流与隐藏策略
- Vue 3 响应式驱动
- 更优雅的 VitePress 集成方式

于是我自己封装了一个。

---

## 核心设计思路

### 进度计算策略（缓动算法）

默认进度算法：

```ts
const defaultEstimatedProgress = (duration: number, elapsed: number): number => {
	const completionPercentage = (elapsed / duration) * 100;
	return (2 / Math.PI) * 100 * Math.atan(completionPercentage / 50);
};
```

用 `elapsed / duration` 得到线性完成度，再通过 `atan` 映射成「前快后慢」的曲线，避免进度条一开始就冲得很猛、后面却几乎不动，观感更自然。

---

### 时序控制（throttle / hideDelay / resetDelay）

- **throttle**：点击链接后，先等这么长时间再显示进度条，避免极短请求造成「闪一下就没」。
- **hideDelay**：进度到 100% 后，延迟这么久再隐藏条，避免瞬间消失。
- **resetDelay**：隐藏之后再过这么久把 `progress` 置回 0，下次路由切换时从 0 重新开始。

三者配合，既减少闪烁，又让开始和结束都有过渡。

---

### 单例与作用域销毁

全局只维护一个 `LoadingIndicator` 实例，多个地方调用 `useLoadingIndicator()` 拿到的是同一个实例。用 `indicatorUseCount` 记录当前有多少组件在用；当这些组件都卸载（`onScopeDispose`）且计数归零时，才把单例置空，避免在 SPA 里重复注册路由钩子、产生多个进度条逻辑。

---

## 组件 API（Props）

:::doctable

| 属性                | 类型                            | 默认值         | 说明                                |
| ------------------- | ------------------------------- | -------------- | ----------------------------------- |
| `throttle`          | `number`                        | `200`          | 显示进度条前等待时间（ms）          |
| `duration`          | `number`                        | `2000`         | 进度条动画总时长（ms）              |
| `hideDelay`         | `number`                        | `500`          | 到 100% 后延迟隐藏（ms）            |
| `resetDelay`        | `number`                        | `400`          | 隐藏后延迟重置进度（ms）            |
| `height`            | `number`                        | `3`            | 进度条高度（px）                    |
| `color`             | `string \| boolean`             | 见下           | 进度条颜色/渐变，`false` 用默认渐变 |
| `errorColor`        | `string`                        | 红色渐变       | 错误态时的颜色/渐变                 |
| `estimatedProgress` | `(duration, elapsed) => number` | 内置 atan 曲线 | 自定义进度计算函数                  |

:::

默认 `color` 为 Nuxt 风格渐变：`repeating-linear-gradient(to right,#00dc82 0%,#34cdfe 50%,#0047e1 100%)`。

---

## useLoadingIndicator 返回值

在非 SSR 环境下，`createLoadingIndicator` 内部会挂到 VitePress 的 `router.onBeforeRouteChange` / `router.onAfterRouteChange`，所以**只挂一个进度条组件**就会在路由切换时自动跑。

若需要手动控制（例如在非 VitePress 的 Vue 应用里），可以使用返回的方法：

| 属性/方法          | 类型                   | 说明                              |
| ------------------ | ---------------------- | --------------------------------- |
| `progress`         | `ShallowRef<number>`   | 当前进度 0–100                    |
| `isLoading`        | `ShallowRef<boolean>`  | 是否显示进度条                    |
| `error`            | `ShallowRef<boolean>`  | 是否错误态（可配合 `errorColor`） |
| `start()`          | `() => void`           | 从 0 开始进度条                   |
| `end()`            | `() => void`           | 直接到 100% 并进入隐藏流程        |
| `setIndicator(at)` | `(at: number) => void` | 设置初始进度再启动                |
| `clearStart()`     | `() => void`           | 取消尚未开始的 throttle/RAF       |

---

## 在 VitePress 中集成

在主题的根布局里挂一个组件即可，建议包在 `ClientOnly` 里，避免 SSR 报错：

```vue
<template>
	<ClientOnly>
		<VPLoadingIndicator color="var(--color-blog-accent)" />
	</ClientOnly>
	<!-- 其余 layout -->
</template>

<script setup>
import VPLoadingIndicator from 'vp-loading-indicator';
</script>
```

按需传入 `height`、`color`、`errorColor` 等即可与站点风格统一。

---

## 组件与工具代码结构

**进度条组件**：根据 `useLoadingIndicator` 的 `progress`、`isLoading`、`error` 渲染一根固定在顶部的条，用 `transform: scaleX(progress%)` 做宽度动画，用 `backgroundSize` 配合渐变实现「条纹向右推进」的效果。

**工具层**：`createLoadingIndicator(opts)` 里用 `requestAnimationFrame` 循环调用 `getProgress(duration, elapsed)` 更新 `progress`；`start` 时先 throttle 再开 RAF，`end` 时设 100%、清定时器、走 hide → reset 的延迟链。非 SSR 时把 `start` / `end` 挂到 `router.onBeforeRouteChange` / `router.onAfterRouteChange`，即可与 VitePress 路由联动。

---

## 小结

VP Loading Indicator 用 Vue 3 响应式 + 单例 composable + VitePress 路由钩子，实现了一个可配置、可扩展的顶部加载条：默认 atan 缓动、可自定义进度函数，throttle/hideDelay/resetDelay 控制时序，单例在组件全部卸载后自动清理。如果你也在用 VitePress 或 Vue 3 文档站，不妨按需接入或在此基础上改一版自己的进度条。

> 项目地址：[VPLoadingIndicator](https://github.com/359Steve/bjbn-map.git)
