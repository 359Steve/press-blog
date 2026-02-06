<script lang="ts" setup>
const activeId = ref<string>('');
const observer = ref<IntersectionObserver | null>(null);
const links = ref<HTMLAnchorElement[]>([]);

function updateActiveByHash() {
	const hash = decodeURIComponent(window.location.hash.replace(/^#/, ''));
	if (!hash) {
		return;
	}
	activeId.value = hash;
}

watch(
	activeId,
	(id) => {
		links.value.forEach((link) => {
			const linkId = decodeURIComponent(link.hash.slice(1));
			const isActive = linkId === id;
			link.classList.toggle('is-active', isActive);
		});
	},
	{ immediate: true },
);

onMounted(() => {
	links.value = Array.from(document.querySelectorAll<HTMLAnchorElement>('.toc a[href^="#"]'));

	const headings = links.value
		.map((link) => {
			const id = decodeURIComponent(link.hash.slice(1));
			const el = document.getElementById(id);
			return el ? { id, el } : null;
		})
		.filter(Boolean) as { id: string; el: HTMLElement }[];

	// 监听滚动获取活动标题的id
	if (headings.length) {
		observer.value = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						activeId.value = (entry.target as HTMLElement).id;
					}
				}
			},
			{
				rootMargin: '0px 0px -70% 0px',
				threshold: 0.1,
			},
		);

		headings.forEach(({ el }) => observer.value!.observe(el));
	}

	// 初始化时添加活动样式
	updateActiveByHash();

	// 地址栏改变时添加活动样式
	window.addEventListener('hashchange', updateActiveByHash);
});

onBeforeUnmount(() => {
	window.removeEventListener('hashchange', updateActiveByHash);
	if (observer.value) {
		observer.value!.disconnect();
	}
});
</script>

<template>
	<div class="toc fixed top-31 left-6 z-10 hidden sm:top-35 lg:block">
		<slot />
	</div>
</template>

<style lang="postcss" scoped>
.toc :deep(a.is-active) {
	color: var(--vp-c-brand-1);
	font-weight: 600;
}
</style>
