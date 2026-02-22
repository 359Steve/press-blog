<script lang="ts" setup>
import { data as posts } from '../../content/blog.data';
import { getMonthName, groupedPosts, stats } from '../../utils';

const router = useRouter();
const useindex = useIndex();
const { setLabelName } = useindex;
const { labelName } = storeToRefs(useindex);

const classify = computed(() => groupedPosts(posts, labelName.value));
const gather = computed(() => stats(posts, labelName.value));
const gatherList = computed(() => {
	return [
		{
			name: '总文章数',
			count: gather.value.totalPosts,
		},
		{
			name: '总标签数',
			count: gather.value.totalTags,
		},
		{
			name: '年份数',
			count: gather.value.totalYears,
		},
		{
			name: '当前筛选',
			count: gather.value.filteredPosts,
		},
	];
});
</script>

<template>
	<div class="w-full">
		<div class="mb-8">
			<h1 class="text-blog-primary mb-2 text-3xl font-bold">文章归档</h1>
			<p class="text-blog-secondary text-sm">记录每一篇文字，见证每一次成长</p>
		</div>

		<!-- 统计信息  -->
		<div
			class="glass mb-8 grid grid-cols-2 gap-4 rounded-xl border border-black/6 bg-white/40 p-4 sm:grid-cols-4 dark:border-white/10 dark:bg-white/6"
		>
			<div v-for="(item, index) in gatherList" :key="index" class="flex flex-col">
				<span class="text-blog-secondary text-center text-xs">{{ item.name }}</span>
				<span class="text-blog-primary mt-1 text-center text-2xl font-bold">{{ item.count }}</span>
			</div>
		</div>

		<!-- 标签筛选提示 -->
		<div v-if="labelName" class="text-blog-secondary mb-4 flex items-center gap-2 text-sm">
			<span>当前筛选：</span>
			<span class="font-medium">#{{ labelName }}</span>
			<a class="text-blog-accent! ml-1 hover:underline!" @click="setLabelName('')">清除</a>
		</div>

		<div v-if="classify.length > 0" class="relative">
			<div
				class="from-blog-accent/45 via-blog-accent/20 to-blog-secondary/15 dark:to-blog-secondary/25 absolute top-0 bottom-0 left-2 w-0.5 -translate-x-1/2 rounded-full bg-linear-to-b md:left-3"
				aria-hidden="true"
			/>

			<!-- 文章分组 -->
			<div
				v-for="group in classify"
				:key="`${group.year}-${group.month}`"
				class="relative mb-10 pl-6 last:mb-0 md:pl-8"
			>
				<div
					class="absolute top-4.5 left-2 flex h-5 w-5 -translate-x-1/2 items-center justify-center md:left-3"
				>
					<span
						class="border-blog-accent bg-blog-accent ring-blog-accent/15 h-2.5 w-2.5 shrink-0 rounded-full border-2 shadow-[0_0_0_0_3px_var(--color-bg-blog-primary)] ring-4 dark:shadow-[0_0_0_0_3px_var(--color-bg-blog-primary)]"
					/>
				</div>

				<div
					class="border-blog-accent/50 bg-blog-primary/4 dark:bg-blog-primary/10 mb-4 rounded-r-lg border-l-2 py-2 pt-2.5 pl-4"
				>
					<h2 class="text-blog-primary text-lg font-semibold tracking-tight">
						{{ group.year }} 年 {{ getMonthName(group.month) }}
					</h2>
					<p class="text-blog-secondary mt-0.5 text-xs">{{ group.posts.length }} 篇文章</p>
				</div>

				<!-- 文章列表 -->
				<div class="space-y-3">
					<article
						v-for="post in group.posts"
						:key="post.url"
						class="glass group cursor-pointer overflow-hidden rounded-lg border border-black/6 bg-white/40 p-4 transition-all duration-200 hover:shadow-md dark:border-white/10 dark:bg-white/6"
						@click="router.go(post.url)"
					>
						<div class="flex flex-col gap-2">
							<!-- 标题和日期 -->
							<div class="flex items-start justify-between gap-4">
								<h3
									class="text-blog-primary group-hover:text-blog-accent line-clamp-2 flex-1 text-base font-medium transition-colors"
								>
									{{ post.title }}
								</h3>
								<time
									class="text-blog-tertiary shrink-0 text-xs whitespace-nowrap"
									:datetime="new Date(post.date.time).toISOString()"
								>
									{{ post.date.string }}
								</time>
							</div>

							<!-- 描述 -->
							<p v-if="post.description" class="text-blog-secondary line-clamp-2 text-sm leading-relaxed">
								{{ post.description }}
							</p>

							<!-- 标签 -->
							<div v-if="post.tags && post.tags.length > 0" class="flex flex-wrap gap-1.5">
								<a
									v-for="tag in post.tags"
									:key="tag.name"
									:href="tag.url"
									target="_blank"
									rel="noopener noreferrer"
									class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition-colors hover:opacity-80"
									:style="{ color: tag.color, backgroundColor: `${tag.color}18` }"
									@click.stop
								>
									<Icon :icon="tag.icon" width="12" height="12" />
									{{ tag.name }}
								</a>
							</div>
						</div>
					</article>
				</div>
			</div>
		</div>

		<!-- 空状态 -->
		<ClientOnly v-else>
			<TRexRunner />
		</ClientOnly>
	</div>
</template>
