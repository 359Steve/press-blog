export const useModals = defineStore('useModals', () => {
    type ModalName = keyof typeof currentComponent;
    type ModalProps<K extends ModalName> = PropsOf<(typeof currentComponent)[K]>;
    type AllModalProps = {
        [K in ModalName]: ModalProps<K>;
    }[ModalName];

    /** 弹层是否可见 */
    const visible = ref<boolean>(false);
    /** 当前渲染的弹层组件 */
    const component = shallowRef<Component | null>(null);
    /** 当前弹层组件接收的 props */
    const props = ref<AllModalProps>();

    /** 可打开的弹层组件映射 */
    const currentComponent = {
        ImageMask: defineAsyncComponent(() => import('@/theme/components/modal/ImageMask.vue')),
        SearchMask: defineAsyncComponent(() => import('@/theme/components/modal/SearchMask.vue')),
    };

    /**
     * 打开指定弹层
     * @param comp - 弹层组件名
     * @param p - 传给弹层组件的 props
     */
    function open<K extends ModalName>(comp: K, p?: ModalProps<K>): void {
        component.value = currentComponent[comp];
        props.value = p;
        visible.value = true;
    }

    /**
     * 关闭当前弹层
     */
    function close(): void {
        visible.value = false;
    }

    return {
        visible,
        component,
        props,
        open,
        close,
    };
});
