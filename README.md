# VitePress Custom Theme Template

一个基于 **VitePress** 的现代化文档模板，默认启用 **自定义主题**，并集成常用的前端工程化工具，适合用于：

- 技术文档
- 博客 / 笔记站点
- 组件说明站
- 长期维护的知识库

该模板以 **可维护性、可扩展性** 为核心设计目标。

---

## ✨ 特性一览

- ⚡️ 基于 **VitePress**
- 🎨 **完全自定义主题**（不依赖 DefaultTheme 布局）
- 🌬 **Tailwind CSS v4**（Vite 插件模式）
- 🧹 **ESLint**（代码规范）
- ✨ **Prettier**（统一格式化）
- 🧩 支持在 **Markdown / Theme / Vue 组件** 中无感使用
- 📦 适合二次开发与长期演进

---

## 📦 技术栈

:::doctable

| 技术            | 说明         |
| --------------- | ------------ |
| VitePress       | 文档生成框架 |
| Vue 3           | 组件系统     |
| Tailwind CSS v4 | 原子化 CSS   |
| ESLint          | 代码规范     |
| Prettier        | 格式化工具   |

:::

---

## 📂 项目结构

```txt
docs/
├─ .vitepress/
│  ├─ config.ts              # VitePress 配置
│  └─ theme/
│     ├─ index.ts            # 自定义主题入口
│     ├─ Layout.vue          # 全局布局
│     ├─ tailwind.css        # Tailwind CSS v4 入口
│     └─ components/         # 主题级组件
│
├─ index.md                  # 首页
└─ README.md
```

## 🚀 使用方式

```txt
npx create-pressplus
```
