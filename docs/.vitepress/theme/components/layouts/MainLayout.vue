<script lang="ts" setup>
const route = useRoute();
const { page } = useData();
const { scrollMap } = useIndex();
const sectionEl = useTemplateRef<HTMLElement>('sectionEl');

const notMd = computed(() => page.value?.isNotFound);

watch(
    () => route.path,
    (newPath) => {
        const top = scrollMap.get(newPath) || 0;
        if (newPath && sectionEl) {
            sectionEl.value?.scrollTo(0, top);
        }
    },
);

function setScroll(e: Event) {
    const target = e.target as HTMLElement;

    scrollMap.set(route.path, target.scrollTop);
}
</script>

<template>
    <main class="relative h-screen">
        <HeaderBox />

        <div class="mx-auto flex h-[calc(100%-48px)] max-w-6xl gap-2 px-4 py-6 lg:h-full">
            <AsideBox />
            <!-- 主内容 -->
            <section ref="sectionEl" class="scroll-y-hidden w-full flex-1 pb-3" @scroll="setScroll">
                <NotFound v-if="notMd" />
                <slot v-else />
            </section>
        </div>
    </main>
</template>

<style scoped lang="scss"></style>
