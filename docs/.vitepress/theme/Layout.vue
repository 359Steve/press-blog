<script lang="ts" setup>
import type { Component } from 'vue';

const { page, isDark, frontmatter } = useData();

const layouts: Record<string, Component> = {
	index: defineAsyncComponent(() => import('@/theme/components/layouts/IndexLayout.vue')),
	about: defineAsyncComponent(() => import('@/theme/components/layouts/AboutLayout.vue')),
};

function enableTransitions() {
	return 'startViewTransition' in document && window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
}

provide('toggle-appearance', async ({ clientX: x, clientY: y }: MouseEvent) => {
	if (!enableTransitions()) {
		isDark.value = !isDark.value;
		return;
	}

	const clipPath = [
		`circle(0px at ${x}px ${y}px)`,
		`circle(${Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))}px at ${x}px ${y}px)`,
	];

	await document.startViewTransition(async () => {
		isDark.value = !isDark.value;
		await nextTick();
	}).ready;

	document.documentElement.animate(
		{ clipPath: isDark.value ? clipPath.reverse() : clipPath },
		{
			duration: 500,
			easing: 'ease-in',
			fill: 'forwards',
			pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(root)`,
		},
	);
});
</script>

<template>
	<ModalHost />

	<MainLayout>
		<component :is="layouts[frontmatter.layout] || 'Content'" />
	</MainLayout>
</template>

<style lang="scss" scoped></style>
