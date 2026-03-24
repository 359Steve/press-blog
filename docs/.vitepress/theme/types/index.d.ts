/**
 * @description 相册图片类型
 */
interface ImageType {
	src: string;
	alt: string;
	live?: Photo['live'];
	[key: string]: any;
}

/**
 * @description 提取组件props
 */
type PropsOf<T> = T extends new () => { $props: infer P } ? P : never;

/**
 * @description 图片数据信息类型
 */
interface PhotoMate {
	text?: string;
	lang?: string;
	blurhash?: string;
}

/**
 * @description 图片类型
 */
interface Photo extends PhotoMate {
	name: string;
	url: string;
	live?: Pick<Photo, 'url' | 'name'>;
}
