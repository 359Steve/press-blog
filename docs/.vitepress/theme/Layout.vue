<script lang="ts" setup>
const { page, isDark } = useData();
const { setScroll, getHeaderHeight } = useJojoHeader();

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

	<MainPress>
		<template #header>
			<HeaderBox />
		</template>
		<NotFound v-if="page.isNotFound" />
		<Content v-else />
	</MainPress>
</template>

<style lang="scss" scoped></style>
