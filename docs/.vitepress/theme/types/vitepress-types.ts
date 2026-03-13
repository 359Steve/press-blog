import type { DefaultTheme } from 'vitepress/theme';

/**
 * @description 扩展导航栏菜单类型
 */
export type NavItemWithIcon = DefaultTheme.NavItemWithLink & {
	icon?: string;
};

/**
 * @description 扩展导航栏社交账户类型
 */
export type SocialWithColor = DefaultTheme.SocialLink & {
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
