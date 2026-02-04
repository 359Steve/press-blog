<script lang="ts" setup>
import { ref } from 'vue';

const search = ref<string>('');
const debouncedSearch = useDebounce(search, 300);
</script>

<template>
	<div class="mt-6 w-full sm:mt-10">
		<BlogSearch v-model:search="search" />
		<BlogList :search="debouncedSearch" />
	</div>
</template>

<style lang="scss" scoped></style>
