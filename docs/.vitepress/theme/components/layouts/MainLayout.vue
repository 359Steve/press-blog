<script lang="ts" setup>
import type { WatchHandle } from 'vue';

const { page } = useData();
const { sectionScrollTop } = storeToRefs(useIndex());
const sectionEl = useTemplateRef<HTMLElement>('sectionEl');
let watcher: WatchHandle | null = null;
let scroll: ReturnType<typeof useScroll> | null = null;

const notMd = computed(() => page.value?.isNotFound);

watch(
	() => page.value.filePath,
	() => {
		watcher?.();
		watcher = null;
		scroll = null;
		nextTick(() => {
			const scroll = useScroll(sectionEl);
			const { y } = scroll;

			watcher = watch(
				y,
				(newValue) => {
					sectionScrollTop.value = newValue;
				},
				{
					immediate: true,
				},
			);
		});
	},
	{
		immediate: true,
	},
);
</script>

<template>
	<main class="relative h-screen">
		<HeaderBox />

		<div class="mx-auto flex h-[calc(100%-48px)] max-w-6xl gap-2 px-4 py-6 lg:h-full">
			<AsideBox />
			<!-- 主内容 -->
			<section ref="sectionEl" class="scroll-y-hidden w-full flex-1 pb-3">
				<NotFound v-if="notMd" />
				<slot v-else />
			</section>
		</div>
	</main>
</template>

<style scoped lang="scss"></style>
