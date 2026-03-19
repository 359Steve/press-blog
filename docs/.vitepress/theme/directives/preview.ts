import type { Directive } from 'vue';

export const preview: Directive<HTMLElement, ImageType> = {
	mounted(el: HTMLElement, binding) {
		const handler = () => {
			const { open } = useModals();
			if (binding.value) {
				open('ImageMask', binding.value);
			}
		};

		el.__previewHandler__ = handler;
		el.addEventListener('click', handler);
	},
	unmounted(el: HTMLElement) {
		if (el.__previewHandler__) {
			el.removeEventListener('click', el.__previewHandler__);
			delete el.__previewHandler__;
		}
	},
};
