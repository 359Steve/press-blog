export const useIndex = defineStore('useIndex', () => {
	const labelName = ref<string>('');
	const sectionScrollTop = ref<number>(0);

	const setLabelName = (data: string) => {
		labelName.value = data;
	};

	const getLabelName = () => {
		return labelName.value;
	};

	return {
		labelName,
		sectionScrollTop,
		getLabelName,
		setLabelName,
	};
});
