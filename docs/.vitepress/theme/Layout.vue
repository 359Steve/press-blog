<script lang="ts" setup>
import { useWindowScroll } from '@vueuse/core';
import { Content, useData } from 'vitepress';
import { onMounted, watch } from 'vue';
import HeaderBox from './components/HeaderBox.vue';
import { useJojoHeader } from './store/jojoHeader';

const { page } = useData();
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
