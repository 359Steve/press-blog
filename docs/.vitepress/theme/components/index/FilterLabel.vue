<script lang="ts" setup>
const { labelName } = defineProps<{
	labelName: string;
}>();
const useindex = useIndex();
const { setLabelName } = useindex;
</script>

<template>
	<div v-if="labelName" class="text-blog-secondary mb-4 flex items-center gap-2 text-sm">
		<span>当前筛选：</span>
		<span class="font-medium">#{{ labelName }}</span>
		<a class="text-blog-accent! ml-1 cursor-pointer hover:underline!" @click="setLabelName('')">清除</a>
	</div>
</template>

<style lang="scss" scoped></style>
