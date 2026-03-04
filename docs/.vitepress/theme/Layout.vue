<script lang="ts" setup>
import type { Component } from 'vue';
import BranchCanvas from 'branch-canvas';
import VPLoadingIndicator from 'vp-loading-indicator';
import AboutLayout from './components/layouts/AboutLayout.vue';
import BlogLayout from './components/layouts/BlogLayout.vue';
import IndexLayout from './components/layouts/IndexLayout.vue';
import PhotosLayout from './components/layouts/PhotosLayout.vue';
import RecordLayout from './components/layouts/RecordLayout.vue';

const { isDark, frontmatter } = useData();

const layouts: Record<string, Component> = {
	index: IndexLayout,
	blog: BlogLayout,
	record: RecordLayout,
	about: AboutLayout,
	photos: PhotosLayout,
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

	<ClientOnly>
		<BranchCanvas />
	</ClientOnly>

	<VPLoadingIndicator color="var(--color-blog-accent)" />

	<MainLayout>
		<component :is="layouts[frontmatter.layout] || 'Content'" />
	</MainLayout>
</template>

<style lang="scss" scoped></style>
