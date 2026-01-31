import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

export const useJojoHeader = defineStore('jojoHeader', () => {
	const isScroll = ref<boolean>(false); // 是否滚动
	const headerHeight = ref<number>(0); // 导航栏高度

	const drawer = ref<boolean>(false); // 是否打开侧边菜单弹窗

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
		drawer,
		getScroll,
		setScroll,
		getHeaderHeight,
		setHeaderHeight,
	};
});
