<script lang="ts" setup>
const route = useRoute();

const notMd = computed(() => route.data.title === '404');
</script>

<template>
	<main class="relative h-screen">
		<HeaderBox />

		<div class="mx-auto flex h-[calc(100%-48px)] max-w-6xl gap-6 px-4 py-6 lg:h-full">
			<AsideBox />
			<!-- 主内容 -->
			<section class="scroll-y-hidden w-full flex-1" :class="notMd && 'flex items-center justify-center'">
				<NotFound v-if="notMd" />
				<slot v-else />
			</section>
		</div>
	</main>
</template>

<style scoped lang="scss"></style>
