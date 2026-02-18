<script lang="ts" setup>
import VPLocalSearchBox from 'vitepress/dist/client/theme-default/components/VPLocalSearchBox.vue';

defineEmits<{
	(e: 'close'): void;
}>();
</script>

<template>
	<VPLocalSearchBox @close="$emit('close')" />
</template>

<style lang="scss" scoped></style>
