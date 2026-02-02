export const useJojoHeader = defineStore('jojoHeader', () => {
	const isScroll = ref<boolean>(false);
	const headerHeight = ref<number>(0);

	const getScroll = () => {
		return isScroll.value;
	};

	const setScroll = (value: boolean) => {
		isScroll.value = value;
	};

	const getHeaderHeight = () => {
		return headerHeight.value;
	};

	const setHeaderHeight = (value: number) => {
		headerHeight.value = value;
	};

	return {
		isScroll,
		headerHeight,
		getScroll,
		setScroll,
		getHeaderHeight,
		setHeaderHeight,
	};
});
