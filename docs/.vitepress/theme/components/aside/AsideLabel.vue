<script lang="ts" setup>
import { data as posts } from '../../content/blog.data';

const { showCount = false, showShadow = true } = defineProps<{
	showCount?: boolean;
	showShadow?: boolean;
}>();

const route = useRoute();
const router = useRouter();
const { setLabelName } = useIndex();

const tagList = computed(() => {
	const map = new Map<string, Post['tags'][number] & { count: number }>();
	for (const post of posts) {
		for (const tag of post.tags ?? []) {
			if (!tag?.name) continue;

			const existing = map.get(tag.name);

			if (existing) {
				existing.count += 1;
				continue;
			}

			map.set(tag.name, {
				name: tag.name,
				icon: tag.icon ?? 'mdi:tag',
				color: tag.color ?? '#64748b',
				url: tag.url ?? '#',
				count: 1,
			});
		}
	}
	return Array.from(map.values());
});

function goToTag(tagName: string) {
	setLabelName(tagName);
	if (route.path !== '/' && route.path !== '/blog') {
		router.go('/');
	}
}
</script>

<template>
	<div
		v-if="tagList.length > 0"
		:class="[showShadow && 'shadow-md']"
		class="glass w-full rounded-lg border border-black/5 p-3 transition-all duration-200 dark:border-white/8"
	>
		<div class="flex flex-wrap gap-2">
			<div
				v-for="tag in tagList"
				:key="tag.name"
				type="button"
				class="text-blog-accent! inline-flex cursor-pointer items-center gap-1 rounded-full px-2 py-1 text-xs font-medium transition-opacity hover:opacity-80"
				:style="{ color: tag.color, backgroundColor: `${tag.color}18` }"
				@click="goToTag(tag.name)"
			>
				<span>#{{ tag.name }}</span>
				<span v-if="showCount">({{ tag.count }})</span>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
