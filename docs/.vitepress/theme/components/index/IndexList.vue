<script lang="ts" setup>
import { data as posts } from '../../content/blog.data';

const router = useRouter();
</script>

<template>
	<div v-if="posts && posts.length > 0" class="index-list grid w-full grid-cols-1 gap-5 sm:gap-6">
		<article
			v-for="item in posts"
			:key="item.url"
			class="index-list__card group focus-within:ring-blog-accent cursor-pointer overflow-hidden rounded-xl transition-all duration-200 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-(--color-bg-blog-primary) hover:shadow-md"
			@click="router.go(item.url)"
		>
			<div
				class="glass flex flex-col overflow-hidden rounded-xl border border-black/6 bg-white/40 p-0 transition-shadow duration-200 dark:border-white/10 dark:bg-white/6"
			>
				<div class="bg-blog-primary relative aspect-video w-full shrink-0 overflow-hidden">
					<img
						:src="item.cover"
						alt="博客封面"
						loading="lazy"
						decoding="async"
						class="absolute inset-0 block h-full min-h-full w-full min-w-full object-cover object-center"
					/>
				</div>
				<div class="flex min-h-0 flex-1 flex-col gap-3 p-4">
					<div class="flex flex-wrap gap-1.5">
						<a
							v-for="tag in item.tags"
							:key="tag.name"
							:href="tag.url"
							target="_blank"
							rel="noopener noreferrer"
							class="index-list__tag inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors hover:opacity-80"
							:style="{ color: tag.color, backgroundColor: `${tag.color}18` }"
							@click.stop
						>
							<Icon :icon="tag.icon" width="14" height="14" />
							{{ tag.name }}
						</a>
					</div>
					<h2
						class="index-list__title text-blog-primary group-hover:text-blog-accent line-clamp-2 text-lg leading-snug font-semibold transition-colors"
					>
						{{ item.title }}
					</h2>
					<p class="index-list__desc text-blog-secondary line-clamp-3 text-sm leading-relaxed">
						{{ item.description }}
					</p>
				</div>
			</div>
		</article>
	</div>
	<ClientOnly v-else>
		<TRexRunner />
	</ClientOnly>
</template>

<style lang="scss" scoped></style>
