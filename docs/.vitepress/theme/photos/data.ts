type PhotoAsset = Pick<Photo, 'name' | 'url'>;

type PhotoMetaEntry = {
    name: string;
    data: PhotoMate;
};

/** 相册中的实况视频资源列表 */
const movModules = Object.entries(
    import.meta.glob<string>('./album/**/*.mov', {
        eager: true,
        query: '?url',
        import: 'default',
    }),
).map(([name, url]): PhotoAsset => {
    name = name.replace(/\.\w+$/, '').replace(/^\.\//, '');
    return {
        name,
        url,
    };
});

/**
 * 根据图片名称查找对应的实况视频
 * @param name - 图片文件名（不含扩展名）
 * @returns 同名实况视频资源，未找到时返回 undefined
 */
function metaMov(name: string): PhotoAsset | undefined {
    return movModules.find((item) => item.name.endsWith(name));
}

/** 相册图片对应的 JSON 元数据列表 */
const metaInfo = Object.entries(
    import.meta.glob<PhotoMate>('./album/**/*.json', {
        eager: true,
        import: 'default',
    }),
).map(([name, data]): PhotoMetaEntry => {
    name = name.replace(/\.\w+$/, '').replace(/^\.\//, '');
    return {
        name,
        data,
    };
});

/** 相册照片数据，按文件名倒序排列 */
const photos = Object.entries(
    import.meta.glob<string>('./album/**/*.{jpg,png,JPG,PNG}', {
        eager: true,
        query: '?url',
        import: 'default',
    }),
)
    .map(([name, url]): Photo => {
        name = name.replace(/\.\w+$/, '').replace(/^\.\//, '');
        return {
            ...metaInfo.find((info) => info.name === name)?.data,
            live: metaMov(name),
            name,
            url,
        };
    })
    .sort((a, b) => b.name.localeCompare(a.name));

export default photos;
