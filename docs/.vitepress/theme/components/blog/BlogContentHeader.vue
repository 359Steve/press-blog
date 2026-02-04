<script lang="ts" setup>
import { transformDate } from '@/theme/utils';

const { title, date } = defineProps<{
	title: string;
	date: string;
}>();

const getDate = computed(() => {
	return transformDate(new Date(date));
});
</script>

<template>
	<h1 class="text-3xl font-bold">
		{{ title }}
	</h1>
	<p class="text-blog-tertiary my-2">发布于 {{ getDate.string }}</p>
	<br />
</template>

<style lang="scss" scoped></style>
