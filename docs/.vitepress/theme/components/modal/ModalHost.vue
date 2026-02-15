<script setup lang="ts">
const modal = useModals();
const { close } = modal;
const { visible, component, props } = storeToRefs(modal);
</script>

<template>
	<MaskBox :visible @close="close">
		<component :is="component" v-bind="props" @close="close" />
	</MaskBox>
</template>
