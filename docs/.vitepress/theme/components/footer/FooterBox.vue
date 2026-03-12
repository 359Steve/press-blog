<script lang="ts" setup>
import type { PressFooter } from '@/theme/types/vitepress-types';

const { theme } = useData<{
	footer: PressFooter;
}>();
const { copyright, message } = theme.value.footer;
</script>

<template>
	<div v-if="copyright || message" class="mt-4 w-full truncate py-2 pl-2">
		<span class="text-blog-tertiary text-base">
			{{ copyright }}
			<a
				href="http://beian.miit.gov.cn/"
				target="_blank"
				rel="noopener noreferrer"
				class="text-blog-tertiary! text-base font-normal!"
			>
				{{ message }}
			</a>
		</span>
	</div>
</template>

<style lang="scss" scoped></style>
