/**
 * @description 菜单项类型
 */
interface ThemeVavbarItem {
	text: string;
	link: string;
	activeMatch?: string;
	[key: string]: any;
}

/**
 * @description 顶部导航菜单列表类型
 */
interface ThemeNavbarConfig extends ThemeVavbarItem {
	icon: string;
}
