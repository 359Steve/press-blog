import type { Directive } from 'vue';

export const preview: Directive<HTMLElement, ImageType> = {
	mounted(el: HTMLElement, binding) {
		const handler = () => {
			const { setPreviewSrc, setAlt, setPreviewVisible } = usePreviewImg();
			if (binding.value) {
				const data = binding.value;

				setPreviewSrc(data.src);
				setAlt(data.alt);
				setPreviewVisible(true);
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
