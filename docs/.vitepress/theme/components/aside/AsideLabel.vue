<script lang="ts" setup>
import { data as posts } from '../../content/blog.data';

const router = useRouter();
const { setLabelName } = useIndex();

const tagList = computed(() => {
	const map = new Map<string, Post['tags'][number]>();
	for (const post of posts) {
		for (const tag of post.tags || []) {
			if (tag?.name && !map.has(tag.name)) {
				map.set(tag.name, {
					name: tag.name,
					icon: tag.icon ?? 'mdi:tag',
					color: tag.color ?? '#64748b',
					url: tag.url ?? '#',
				});
			}
		}
	}
	return Array.from(map.values());
});

function goToTag(tagName: string) {
	setLabelName(tagName);
}
</script>

<template>
	<div
		v-if="tagList.length > 0"
		class="glass w-full rounded-lg border border-black/5 bg-white/30 p-3 transition-all duration-200 hover:shadow-md dark:border-white/8 dark:bg-white/8"
	>
		<div class="flex flex-wrap gap-4">
			<div
				v-for="tag in tagList"
				:key="tag.name"
				type="button"
				class="inline-flex cursor-pointer items-center gap-1 rounded-full px-2 py-1 text-xs font-medium transition-opacity hover:opacity-80"
				:style="{ color: tag.color, backgroundColor: `${tag.color}18` }"
				@click="goToTag(tag.name)"
			>
				<Icon :icon="tag.icon" width="12" height="12" />
				#{{ tag.name }}
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
