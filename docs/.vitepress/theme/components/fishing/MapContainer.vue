<script lang="ts" setup>
import AMapLoader from '@amap/amap-jsapi-loader';

const {
	lng = 116.397428,
	lat = 39.90923,
	title = '背景',
	cover = '',
} = defineProps<{
	title: string;
	lng: number;
	lat: number;
	cover: string;
}>();
const map = ref<any>(null);
const isInfoOpen = ref(true);

onMounted(() => {
	nextTick(async () => {
		window._AMapSecurityConfig = {
			securityJsCode: '717239097f7a3d9de73e5f5df0a72196',
		};
		try {
			const AMap = await AMapLoader.load({
				key: '67a8f4bdf5091b96b8d842d74668fb5d',
				version: '2.0',
				plugins: [
					'AMap.Marker', // 标记点
				],
			});

			map.value = new AMap.Map('container', {
				viewMode: '2D',
				zoom: 16,
				center: [lng, lat],
			});

			const marker = new AMap.Marker({
				position: new AMap.LngLat(lng, lat),
				title,
			});

			const infoWindow = new AMap.InfoWindow({
				anchor: 'bottom-center',
				content: `
					<div class="fishing-info-window">
						<img class="fishing-cover" src="${cover}" alt="${title}" />
						<div class="fishing-title">${title}</div>
					</div>
				`,
				offset: [0, -35],
			});

			marker.on('click', () => {
				if (isInfoOpen.value) {
					infoWindow.close();
					isInfoOpen.value = false;
					return;
				}
				infoWindow.open(map.value, [lng, lat]);
				isInfoOpen.value = true;
			});

			infoWindow.open(map.value, [lng, lat]);
			map.value.add(marker);
		} catch (e) {
			console.warn(e);
		}
	});
});

onUnmounted(() => {
	map.value && map.value.destroy();
});
</script>

<template>
	<div id="container" class="h-full w-full" />
</template>

<style lang="scss" scoped>
:deep(.amap-info-close) {
	display: none;
}

:deep(.amap-info-content) {
	padding: 12px;
}

:deep(.fishing-info-window) {
	width: 220px;
	background: #fff;
	border-radius: 12px;
}

:deep(.fishing-cover) {
	width: 100%;
	height: 120px;
	object-fit: cover;
}

:deep(.fishing-title) {
	margin-top: 8px;
	font-size: 13px;
	font-weight: 600;
	color: #1f2937;
	line-height: 1.4;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
