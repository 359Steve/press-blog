---
title: 主页
---

# 标题一 {#title1}

## 标题2

[title1](./#title1)

[百度](https://www.baidu.com)

[[toc]]

::: danger STOP
危险区域，请勿继续
:::

::: details

```js
console.log('Hello, VitePress!');
```

:::

::: raw
Wraps in a `<div class="vp-raw">`
:::

> [!NOTE]
> 强调用户在快速浏览文档时也不应忽略的重要信息。

> [!TIP]
> 有助于用户更顺利达成目标的建议性信息。

> [!IMPORTANT]
> 对用户达成目标至关重要的信息。

> [!WARNING]
> 因为可能存在风险，所以需要用户立即关注的关键内容。

> [!CAUTION]
> 行为可能带来的负面影响。

```js
export default {
	name: 'MyComponent',
	// ...
};
```

```html
<ul>
	<li v-for="todo in todos" :key="todo.id">{{ todo.text }}</li>
</ul>
```

```js{1,4,6-8}
export default { // Highlighted
  data () {
    return {
      msg: `Highlighted!
      This line isn't highlighted,
      but this and the next 2 are.`,
      motd: 'VitePress is awesome',
      lorem: 'ipsum'
    }
  }
}
```

<script setup>
import { useData } from 'vitepress'

const { page } = useData()
</script>

<pre>{{ page }}</pre>

This <span v-pre>{{ will be displayed as-is }}</span>
