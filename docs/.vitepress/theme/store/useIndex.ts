export const useIndex = defineStore('useIndex', () => {
	const fillPaths = ['index.md'];
	const labelName = ref<string>('');
	const showLabel = ref<boolean>(false);

	const setLabelName = (data: string) => {
		labelName.value = data;
	};

	const getLabelName = () => {
		return labelName.value;
	};

	const setShowLabel = (data: string) => {
		showLabel.value = fillPaths.includes(data);
	};

	const getShowLabel = () => {
		return showLabel.value;
	};

	return {
		labelName,
		showLabel,
		getLabelName,
		setLabelName,
		setShowLabel,
		getShowLabel,
	};
});
