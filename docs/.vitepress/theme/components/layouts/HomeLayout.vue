<script lang="ts" setup>
const router = useRouter();
const { frontmatter } = useData();
</script>

<template>
	<div class="grid w-full grid-cols-1 items-center gap-8 pt-8 md:grid-cols-2 md:pt-0">
		<div>
			<div class="text-blog-accent backdrop-blur-0 mb-4 block text-xs font-medium opacity-100 md:text-sm">
				{{ frontmatter.name }}
			</div>
			<div class="backdrop-blur-0 text-4xl font-semibold tracking-tight opacity-100 md:text-[2.4rem]">
				{{ frontmatter.sign }}
			</div>
			<div
				class="text-blog-body backdrop-blur-0 my-4 line-clamp-5 indent-8 text-base opacity-100 md:my-6 md:text-lg"
			>
				{{ frontmatter.description }}
			</div>
			<div class="backdrop-blur-0 opacity-100">
				<button
					class="ring-offset-background focus-visible:ring-ring text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center rounded-md bg-rose-500 px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
					@click="router.go('/record')"
				>
					欢迎浏览
				</button>
			</div>
		</div>

		<div class="relative">
			<div class="grid grid-cols-2 grid-rows-[50px_150px_50px_150px_50px] gap-4">
				<!-- <div v-for="(pos, index) in gridPositions" :key="index"
					class="glass relative cursor-pointer overflow-hidden rounded-xl shadow-xl" :style="{
						gridColumnStart: pos.colStart,
						gridColumnEnd: pos.colEnd,
						gridRowStart: pos.rowStart,
						gridRowEnd: pos.rowEnd,
						opacity: 1,
					}" @click="toRecordDetail(pictureList[index])">
					<img :src="pictureList[index]?.url || defaultImages[index]"
						class="size-full object-cover object-center" width="100%" height="100%"
						:alt="pictureList[index]?.url || '首页默认'">
				</div> -->
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
