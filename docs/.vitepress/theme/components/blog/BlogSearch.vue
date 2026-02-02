<script lang="ts" setup>
const search = ref<string>('');
</script>

<template>
	<div
		class="glass relative mb-4 flex h-full w-full flex-col items-center justify-start overflow-hidden rounded-[30px] border border-gray-200 bg-white/40 shadow-md transition-all sm:mb-8 dark:border-white/10 dark:bg-white/5 dark:shadow-[0_0_10px_rgba(255,255,255,0.08)] dark:shadow-gray-600"
	>
		<div class="flex h-10 w-full items-center justify-start gap-2 px-2 sm:h-12 md:h-14 md:px-6">
			<div class="opacity-100">
				<Icon icon="ri:search-line" class="text-[24px] md:text-[32px]" />
			</div>

			<div class="relative flex-1 text-[16px] md:text-base">
				<input
					v-model="search"
					placeholder="输入搜索内容"
					class="w-full bg-transparent ring-0 outline-none"
					type="text"
				/>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
