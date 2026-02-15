<script lang="ts" setup>
import { transformDate } from '@/theme/utils';

const { frontmatter } = useData();
const router = useRouter();

const getDate = computed(() => {
	return transformDate(new Date(frontmatter.value.date));
});
</script>

<template>
	<div class="vp-doc mt-6 w-full pt-10 sm:mt-10">
		<h1 class="text-3xl font-semibold">
			{{ frontmatter.title }}
		</h1>
		<p class="text-blog-tertiary my-2">发布于 {{ getDate.string }}</p>
		<br />
		<Content />
		<div class="text-blog-tertiary mt-10 flex w-fit items-center gap-1 text-lg" @click="router.go('/index')">
			<Icon icon="mdi:chevron-right" width="24" />
			<span class="cursor-pointer border-b border-gray-400">cd . .</span>
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
