export const useJojoHeader = defineStore('jojoHeader', () => {
    /** 移动端侧边栏是否展开 */
    const showSidebar = ref<boolean>(false);

    return {
        showSidebar,
    };
});
