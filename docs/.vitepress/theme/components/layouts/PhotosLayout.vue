<script lang="ts" setup>
import { blurhashToGradientCssObject } from '@unpic/placeholder';
import photos from '@/theme/photos/data';

const translate = ref<boolean>(true);
</script>

<template>
	<div class="w-full">
		<div class="fixed top-16 flex items-center justify-center py-2 lg:top-6">
			<Icon
				:icon="translate ? 'ri-grid-line' : 'ri-layout-masonry-line'"
				width="26"
				class="text-blog-tertiary cursor-pointer"
				@click="translate = !translate"
			/>
		</div>
		<div class="grid grid-cols-1 gap-4 pt-8 md:grid-cols-2 lg:grid-cols-3 lg:pt-10 xl:grid-cols-4">
			<div v-for="(photo, idx) in photos" :key="idx" class="cursor-pointer">
				<img
					v-preview="{
						src: photo.url,
						alt: '照片墙',
						live: photo.live,
					}"
					class="w-full"
					:src="photo.url"
					:alt="photo.text"
					:data-photo-index="idx"
					:style="photo.blurhash && translate ? (blurhashToGradientCssObject(photo.blurhash) as any) : ''"
					loading="lazy"
					:class="!translate ? 'object-contain sm:aspect-square' : 'aspect-square object-cover'"
				/>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
