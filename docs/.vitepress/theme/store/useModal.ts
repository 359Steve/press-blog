export const useModals = defineStore('useModals', () => {
	type ModalName = keyof typeof currentComponent;
	type ModalProps<K extends ModalName> = PropsOf<(typeof currentComponent)[K]>;
	type AllModalProps = {
		[K in ModalName]: ModalProps<K>;
	}[ModalName];

	const visible = ref<boolean>(false);
	const component = shallowRef<Component | null>(null);
	const props = ref<AllModalProps>();

	const currentComponent = {
		ImageMask: defineAsyncComponent(() => import('@/theme/components/modal/ImageMask.vue')),
		SearchMask: defineAsyncComponent(() => import('@/theme/components/modal/SearchMask.vue')),
	};

	function open<K extends ModalName>(comp: K, p?: ModalProps<K>) {
		component.value = currentComponent[comp];
		props.value = p;
		visible.value = true;
	}

	function close() {
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
