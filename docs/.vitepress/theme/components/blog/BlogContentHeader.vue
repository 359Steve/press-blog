<script lang="ts" setup>
const { title, date } = defineProps<{
	title: string;
	date: string;
}>();

const transformDate = computed(() => {
	const newDate = new Date(date);
	newDate.setUTCHours(12);
	return newDate.toLocaleDateString('zh-CN', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
});
</script>

<template>
	<h1 class="text-3xl font-bold">
		{{ title }}
	</h1>
	<p class="text-blog-tertiary my-2">发布于 {{ transformDate }}</p>
	<br />
</template>

<style lang="scss" scoped></style>
