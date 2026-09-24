/**
 * @description 相册图片类型
 */
interface ImageType {
    /** 图片地址 */
    src: string;
    /** 图片描述 */
    alt: string;
    /** 对应的实况视频信息 */
    live?: Photo['live'];
    [key: string]: any;
}

/**
 * @description 提取组件 props
 */
type PropsOf<T> = T extends new () => { $props: infer P } ? P : never;

/**
 * @description 图片元数据信息类型
 */
interface PhotoMate {
    /** 图片说明文字 */
    text?: string;
    /** 说明文字语言 */
    lang?: string;
    /** 图片模糊占位哈希 */
    blurhash?: string;
}

/**
 * @description 图片类型
 */
interface Photo extends PhotoMate {
    /** 图片文件名（不含扩展名） */
    name: string;
    /** 图片访问地址 */
    url: string;
    /** 同名实况视频信息 */
    live?: Pick<Photo, 'url' | 'name'>;
}
