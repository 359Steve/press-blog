<script lang="ts" setup>
import type { SocialWithColor } from '@/theme/types/vitepress-types';

const { socialLinks } = defineProps<{
	socialLinks: SocialWithColor[];
}>();
</script>

<template>
	<div
		class="glass w-full rounded-lg border border-black/5 bg-white/30 p-3 shadow-md dark:border-white/8 dark:bg-white/8 dark:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.06)]"
	>
		<div class="grid w-full grid-cols-4 gap-4">
			<span v-for="item in socialLinks" :key="item.link">
				<a
					:href="item.link"
					target="_blank"
					:style="{ backgroundColor: item.bgcolor }"
					class="flex h-fit w-fit items-center justify-center rounded-[50%] p-1.5"
				>
					<Icon :icon="item.icon as string" :color="item.color" width="20" />
				</a>
			</span>
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
