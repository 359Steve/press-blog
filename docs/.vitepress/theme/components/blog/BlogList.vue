<script lang="ts" setup>
import { data as posts } from '../../content/blog.data';

const { search } = defineProps<{
	search: string;
}>();
const router = useRouter();
const filtered = computed(() => {
	if (!search) {
		return posts;
	}

	return posts.filter((p) => {
		return p.title.toLowerCase().includes(search.toLowerCase());
	});
});
</script>

<template>
	<div v-if="filtered && filtered.length > 0" class="grid grid-cols-1 gap-6">
		<div
			v-for="item in filtered"
			:key="item.url"
			class="group glass flex cursor-pointer flex-col space-y-4 rounded-xl border border-black/5 bg-white/30 p-3 shadow-md transition-all sm:flex-row sm:space-y-0 sm:space-x-4 dark:border-white/8 dark:bg-white/8 dark:shadow-none dark:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.06)]"
			@click="router.go(item.url)"
		>
			<img
				:src="item.cover"
				alt="博客封面"
				loading="lazy"
				decoding="async"
				class="rounded-base aspect-video max-h-40 w-full shrink-0 object-cover sm:h-50 sm:max-h-none sm:w-50"
			/>
			<div class="flex min-h-0 flex-1 flex-col justify-between overflow-hidden">
				<div class="min-h-0 flex-1">
					<h4
						class="from-primary to-secondary mb-2 line-clamp-2 bg-linear-to-r bg-clip-text text-lg font-black md:text-lg lg:text-lg"
					>
						{{ item.title }}
					</h4>
					<p class="text-secondary line-clamp-3 max-w-xl text-sm font-normal md:text-sm lg:text-sm">
						{{ item.description }}
					</p>
				</div>
				<div class="mt-2 flex flex-wrap gap-2 md:mb-1">
					<span
						v-for="tag in item.tags"
						:key="tag.name"
						:style="{
							color: tag.color,
						}"
						class="text-secondary rounded-base flex items-center justify-between gap-1 bg-gray-100 px-2 py-1 text-xs shadow-sm md:text-xs lg:text-xs dark:bg-gray-100/10"
						@click.stop=""
					>
						<a :href="tag.url" target="_blank" rel="noopener noreferrer" class="flex items-center gap-1">
							<Icon :icon="tag.icon" width="24" />
							{{ tag.name }}
						</a>
					</span>
				</div>
			</div>
		</div>
	</div>
	<ClientOnly v-else>
		<TRexRunner />
	</ClientOnly>
</template>

<style lang="scss" scoped></style>
