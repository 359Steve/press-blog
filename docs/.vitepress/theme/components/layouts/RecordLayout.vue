<script lang="ts" setup>
import { transformDate } from '@/theme/utils';

const { frontmatter } = useData();
const router = useRouter();

const getDate = computed(() => (frontmatter.value.date ? transformDate(new Date(frontmatter.value.date)) : null));
</script>

<template>
	<div class="vp-doc record mt-6 w-full">
		<h1 class="text-3xl font-semibold">
			{{ frontmatter.title }}
		</h1>
		<p v-if="getDate" class="text-blog-tertiary my-2">发布于 {{ getDate.string }}</p>
		<Content />
		<template v-if="!frontmatter.record">
			<div class="text-blog-tertiary mt-10 flex w-fit items-center gap-1 text-lg" @click="router.go('/record')">
				<Icon icon="mdi:chevron-right" width="24" />
				<span class="cursor-pointer border-b border-gray-400">cd . .</span>
			</div>
			<FooterBox />
		</template>
	</div>
</template>

<style lang="postcss" scoped></style>
