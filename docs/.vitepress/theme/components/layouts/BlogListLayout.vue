<script lang="ts" setup>
import { transformDate } from '@/theme/utils';

const { frontmatter } = useData();

const getDate = computed(() => {
	return transformDate(new Date(frontmatter.value.date));
});
</script>

<template>
	<div class="mt-6 w-full pt-10 sm:mt-10">
		<h1 class="text-3xl font-bold">
			{{ frontmatter.title }}
		</h1>
		<p class="text-blog-tertiary my-2">发布于 {{ getDate.string }}</p>
		<br />
		<Content />
	</div>
</template>

<style lang="scss" scoped></style>
