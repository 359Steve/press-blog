<script lang="ts" setup>
defineEmits<{
	(e: 'close'): void;
}>();

const search = ref<string>('');
const debouncedSearch = useDebounce(search, 300);

function clearSearch() {
	search.value = '';
}
</script>

<template>
	<div
		class="bg-bg-blog-primary h-fit max-h-screen w-full rounded-sm md:m-[60px_auto_auto] md:max-h-[calc(100%-120px)] md:max-w-200"
		@click.stop
	>
		<form class="flex w-full items-center justify-between gap-3 p-4">
			<label>
				<Icon icon="ri:search-ai-line" width="24" />
			</label>
			<input v-model="search" type="text" placeholder="搜索文档" class="flex-1" />
			<div class="flex items-center gap-2">
				<button v-if="debouncedSearch" type="button" class="text-blog-accent! text-sm!" @click="clearSearch">
					<span>清除</span>
				</button>
				<button type="button" @click="$emit('close')">
					<Icon icon="ri:close-fill" width="24" />
				</button>
			</div>
		</form>
	</div>
</template>

<style lang="scss" scoped></style>
