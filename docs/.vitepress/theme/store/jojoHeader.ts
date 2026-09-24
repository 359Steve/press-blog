export const useJojoHeader = defineStore('jojoHeader', () => {
    /** 移动端侧边栏是否展开 */
    const showSidebar = ref<boolean>(false);

    /**
     * 设置侧边栏展开状态
     * @param data - 是否展开侧边栏
     */
    const setShowSidebar = (data: boolean): void => {
        showSidebar.value = data;
    };

    /**
     * 获取当前侧边栏展开状态
     * @returns 侧边栏是否展开
     */
    const getShowSidebar = (): boolean => {
        return showSidebar.value;
    };

    return {
        showSidebar,
        setShowSidebar,
        getShowSidebar,
    };
});
