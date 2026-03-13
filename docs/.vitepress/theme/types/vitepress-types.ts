import type { DefaultTheme } from 'vitepress/theme';

/**
 * @description 扩展导航栏菜单类型
 */
export type NavItemWithIcon = DefaultTheme.NavItemWithLink & {
	icon?: string;
};

/**
 * @description 扩展导航栏社交账户类型，icon 固定为 Iconify 字符串
 */
export type SocialWithColor = Omit<DefaultTheme.SocialLink, 'icon'> & {
	icon: string;
	color?: string;
	bgcolor?: string;
};

/**
 * @description 扩展footer类型
 */
export type PressFooter = DefaultTheme.Footer & {
	copyright: string;
	message: string;
};

/**
 * @description 扩展notfound配置
 */
export type PressNotFound = DefaultTheme.NotFoundOptions & {
	icon: string;
};
