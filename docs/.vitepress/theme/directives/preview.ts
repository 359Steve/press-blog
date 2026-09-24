import type { Directive } from 'vue';

export const preview: Directive<HTMLElement, ImageType> = {
    /**
     * 绑定点击事件，打开图片预览弹层
     * @param el - 绑定指令的元素
     * @param binding - 指令绑定值，包含预览图片信息
     */
    mounted(el: HTMLElement, binding): void {
        const handler = () => {
            const { open } = useModals();
            if (binding.value) {
                open('ImageMask', binding.value);
            }
        };

        el.__previewHandler__ = handler;
        el.addEventListener('click', handler);
    },
    /**
     * 移除点击事件并清理元素上的处理器引用
     * @param el - 解绑指令的元素
     */
    unmounted(el: HTMLElement): void {
        if (el.__previewHandler__) {
            el.removeEventListener('click', el.__previewHandler__);
            delete el.__previewHandler__;
        }
    },
};
