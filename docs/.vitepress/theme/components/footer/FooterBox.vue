<script lang="ts" setup>
const nowYear = computed(() => new Date().getFullYear());
</script>

<template>
	<div class="mt-4 w-full truncate py-2 pl-2">
		<span class="text-blog-tertiary text-base">
			Copyright © {{ nowYear }} Joseph Joestar
			<a
				href="http://beian.miit.gov.cn/"
				target="_blank"
				rel="noopener noreferrer"
				class="text-blog-tertiary! text-base font-normal!"
			>
				蜀ICP备2025171383号
			</a>
		</span>
	</div>
</template>

<style lang="scss" scoped></style>
