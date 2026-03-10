<script lang="ts" setup>
import type { WatchHandle } from 'vue';

const useHeader = useJojoHeader();
const { page } = useData();
const { setShowSidebar } = useHeader;
const { sectionScrollTop } = storeToRefs(useIndex());

const headers = computed(() => page.value?.headers.filter((i) => i.level === 2));
const activeHeaderText = ref<string>('');
const activeHeader = useDebounce(activeHeaderText, 80);
const debounceScroll = useDebounce(sectionScrollTop, 80);

let h2Elements: NodeListOf<Element>;
let watcher: WatchHandle | null = null;

function getNearestHeader(els: NodeListOf<Element>) {
	if (!els.length) return '';

	const offset = 140;
	let active = '';

	for (const el of els) {
		if (el.getBoundingClientRect().top <= offset) {
			active = el.textContent || '';
		} else {
			break;
		}
	}

	return active;
}

watch(
	headers,
	(newValue) => {
		watcher?.();
		watcher = null;

		if (Array.isArray(newValue) && newValue.length) {
			nextTick(() => {
				h2Elements = document.querySelectorAll('.vp-doc h2');

				watcher = watch(
					debounceScroll,
					() => {
						activeHeaderText.value = getNearestHeader(h2Elements);
					},
					{
						immediate: debounceScroll.value >= 140,
					},
				);
			});
		} else {
			activeHeaderText.value = '';
		}
	},
	{ immediate: true },
);
</script>

<template>
	<header
		class="bg-bg-blog-primary sticky top-0 z-40 flex items-center justify-between gap-4 px-4 py-3 shadow-[0_2px_5px_var(--color-blog-shadow)] lg:hidden"
	>
		<button class="px-3 py-2" @click="setShowSidebar(true)">
			<Icon icon="ri:menu-2-fill" width="24" />
		</button>
		<Transition name="marquee" mode="out-in">
			<div :key="activeHeader" class="flex-1">
				<span class="truncate text-base">{{ activeHeader }}</span>
			</div>
		</Transition>
		<div class="box-border h-6 w-12">
			<LogoBasicLogo />
		</div>
	</header>
</template>

<style lang="postcss" scoped>
.marquee-enter-active,
.marquee-leave-active {
	transition: all 0.35s ease;
}

.marquee-enter-from {
	transform: translateY(100%);
	opacity: 0;
}

.marquee-leave-to {
	transform: translateY(-100%);
	opacity: 0;
}
</style>
