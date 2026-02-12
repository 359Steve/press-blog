export const useJojoHeader = defineStore('jojoHeader', () => {
	const showSidebar = ref<boolean>(false);

	const setShowSidebar = (data: boolean) => {
		showSidebar.value = data;
	};

	const getShowSidebar = () => {
		return showSidebar.value;
	};

	return {
		showSidebar,
		setShowSidebar,
		getShowSidebar,
	};
});
