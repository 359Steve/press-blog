import type { DefaultTheme } from 'vitepress/theme';

/**
 * @description 扩展导航栏菜单类型
 */
export type NavItemWithIcon = DefaultTheme.NavItemWithLink & {
    /** Iconify 图标名称 */
    icon?: string;
};

/**
 * @description 扩展导航栏社交账户类型，icon 固定为 Iconify 字符串
 */
export type SocialWithColor = Omit<DefaultTheme.SocialLink, 'icon'> & {
    /** Iconify 图标名称 */
    icon: string;
    /** 图标颜色 */
    color?: string;
    /** 图标背景色 */
    bgcolor?: string;
};

/**
 * @description 扩展 footer 类型
 */
export type PressFooter = DefaultTheme.Footer & {
    /** 版权信息 */
    copyright: string;
    /** 页脚补充信息 */
    message: string;
};

/**
 * @description 扩展 notfound 配置
 */
export type PressNotFound = DefaultTheme.NotFoundOptions & {
    /** 404 页展示的图标或动图地址 */
    icon: string;
};
