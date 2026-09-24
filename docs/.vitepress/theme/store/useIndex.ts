export const useIndex = defineStore('useIndex', () => {
    /** 当前选中的标签名称，空字符串表示不过滤 */
    const labelName = ref<string>('');
    /** 各页面滚动位置缓存，key 为路径，value 为滚动距离 */
    const scrollMap = shallowReactive<Map<string, number>>(new Map());

    /**
     * 设置当前筛选标签
     * @param data - 标签名称
     */
    const setLabelName = (data: string): void => {
        labelName.value = data;
    };

    /**
     * 获取当前筛选标签
     * @returns 当前标签名称
     */
    const getLabelName = (): string => {
        return labelName.value;
    };

    return {
        labelName,
        scrollMap,
        getLabelName,
        setLabelName,
    };
});
