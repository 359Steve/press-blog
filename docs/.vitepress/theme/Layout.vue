<script lang="ts" setup>
const { page, isDark, frontmatter } = useData();
const { setScroll, getHeaderHeight } = useJojoHeader();

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

onMounted(() => {
	const { y } = useWindowScroll();

	watch(
		y,
		(newY, oldY) => {
			setScroll(newY > (oldY ?? 0) && newY > getHeaderHeight());
		},
		{ immediate: true },
	);
});
</script>

<template>
	<RecordBackground />
	<ImageMask />
	<MainLayout>
		<template #header>
			<HeaderBox />
		</template>
		<NotFound v-if="page.isNotFound" />
		<template v-else>
			<BlogIndexLayout v-if="frontmatter.layout === 'blog'" />
			<BlogListLayout v-else-if="frontmatter.blog" />
			<Content v-else />
		</template>
		<template #footer>
			<FooterBox />
		</template>
	</MainLayout>
</template>

<style lang="scss" scoped></style>
