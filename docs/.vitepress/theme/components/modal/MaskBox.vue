<script lang="ts" setup>
defineProps<{ visible: boolean }>();
defineEmits<{ (e: 'close'): void }>();
</script>

<template>
	<Transition name="fade">
		<div v-if="visible" class="glass fixed inset-0 z-99 flex" @click="$emit('close')">
			<div class="absolute inset-0 z-[-1] bg-black/50" />
			<slot />
		</div>
	</Transition>
</template>

<style lang="postcss" scoped>
.fade-enter-active,
.fade-leave-active {
	transition:
		opacity 0.3s ease,
		transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
	transform: scale(0.999);
}

.fade-enter-to,
.fade-leave-from {
	opacity: 1;
	transform: scale(1);
}
</style>
