---
title: 博客
---

<script lang="ts" setup>
import { ref } from 'vue'
import { useDebounce } from '@vueuse/core'

const search = ref<string>('');
const debouncedSearch = useDebounce(search, 300);
</script>

<div class="mt-6 w-full sm:mt-10">
	<BlogSearch v-model:search="search" />
	<BlogList :search="debouncedSearch" />
</div>
