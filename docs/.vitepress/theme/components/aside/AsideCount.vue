<script lang="ts" setup>
import { stats } from '@/theme/utils';
import { data as posts } from '../../content/blog.data';

const useindex = useIndex();
const { labelName } = storeToRefs(useindex);

const gather = computed(() => stats(posts, labelName.value));
</script>

<template>
	<div class="flex w-full justify-around text-[0.9rem]">
		<div class="text-center">
			<div class="text-blog-tertiary font-semibold">
				{{ gather.totalPosts }}
			</div>
			文章
		</div>
		<div class="text-center">
			<div class="text-blog-tertiary font-semibold">
				{{ gather.totalTags }}
			</div>
			标签
		</div>
		<div class="text-center">
			<div class="text-blog-tertiary font-semibold">
				{{ gather.category }}
			</div>
			分类
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
