export const useIndex = defineStore('useIndex', () => {
	const labelName = ref<string>('');

	const setLabelName = (data: string) => {
		labelName.value = data;
	};

	const getLabelName = () => {
		return labelName.value;
	};

	return {
		labelName,
		getLabelName,
		setLabelName,
	};
});
