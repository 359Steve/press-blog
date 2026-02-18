<script lang="ts" setup>
import VPLocalSearchBox from 'vitepress/dist/client/theme-default/components/VPLocalSearchBox.vue';

const emit = defineEmits<{
	(e: 'close'): void;
}>();

function handleClose() {
	emit('close');

	nextTick(() => {
		const hash = window.location.hash;
		if (hash) {
			setTimeout(() => {
				const targetId = hash.slice(1);
				const targetElement = document.getElementById(targetId);
				if (targetElement) {
					targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
				}
			}, 300);
		}
	});
}
</script>

<template>
	<VPLocalSearchBox @close="handleClose" />
</template>

<style lang="scss" scoped></style>
