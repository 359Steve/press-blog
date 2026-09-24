import { Buffer } from 'node:buffer';
import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { encode as blurhashEncode } from 'blurhash';
import ExifReader from 'exifreader';
import fg from 'fast-glob';
import convert from 'heic-convert';
import { basename, extname, join, parse } from 'pathe';
import sharp from 'sharp';
import { compressSharp } from './img-compress';

/** 相册根目录 */
const FOLDER = fileURLToPath(new URL('../photos/album', import.meta.url));
/** 拍摄时间距当前不足一小时则视为无效 */
const ONE_HOUR_MS = 60 * 60 * 1000;
/** 相册支持的图片扩展名 */
const IMAGE_EXTS = ['jpg', 'jpeg', 'png'] as const;
/** fast-glob 扫描相册文件的配置 */
const fgOpt = { caseSensitiveMatch: false, absolute: true, cwd: FOLDER };

/**
 * 获取相册目录下待处理的图片路径
 * @returns 按路径排序的图片绝对路径列表
 */
async function getImageFiles(): Promise<string[]> {
    return (await fg('**/*.{jpg,png,jpeg,heic}', fgOpt)).sort((a, b) => a.localeCompare(b));
}

/**
 * 将图片路径转换为同名 JSON 元数据路径
 * @param imagePath - 图片文件路径
 * @returns 对应的 JSON 文件路径
 */
function toJsonPath(imagePath: string): string {
    return imagePath.replace(/\.\w+$/, '.json');
}

/**
 * 规范化图片扩展名，将 jpeg 统一为 jpg
 * @param filepath - 文件路径
 * @returns 规范化后的扩展名，包含前导点
 */
function normExt(filepath: string): string {
    const ext = parse(filepath.toLowerCase()).ext;
    return ext === '.jpeg' ? '.jpg' : ext;
}

/**
 * 从 EXIF 或文件时间解析拍摄日期
 * @param exif - 图片 EXIF 信息
 * @param filepath - 图片文件路径
 * @returns 有效拍摄日期；距当前不足一小时时返回 null
 */
async function parsePhotoDate(exif: ExifReader.Tags, filepath: string): Promise<Date | null> {
    let dateRaw = exif.DateTimeOriginal?.value ?? exif.DateTime?.value ?? exif.DateCreated?.value;
    dateRaw ??= new Date((await fs.stat(filepath)).birthtime || (await fs.stat(filepath)).mtime).toISOString();

    const raw = Array.isArray(dateRaw) ? dateRaw[0] : dateRaw;
    const normalized = raw.toString().replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3');
    const date = new Date(normalized);

    return Date.now() - +date < ONE_HOUR_MS ? null : date;
}

/**
 * 按序号查找尚未占用的目标文件名
 * @param base - 文件名前缀
 * @param ext - 文件扩展名
 * @returns 可用的目标文件绝对路径
 */
function getNextAvailableName(base: string, ext: string): string {
    let index = 1;
    let name = `${base}${index}${ext}`;
    while (existsSync(join(FOLDER, name.toLowerCase()))) {
        index++;
        name = `${base}${index}${ext}`;
    }
    return join(FOLDER, name.toLowerCase());
}

/**
 * 根据图片缓冲区生成 Blurhash
 * @param buffer - 图片缓冲区
 * @returns Blurhash 字符串
 */
async function generateBlurhash(buffer: Buffer): Promise<string> {
    const { data, info } = await sharp(buffer)
        .raw()
        .ensureAlpha()
        .resize(32, 32, { fit: 'cover' })
        .toBuffer({ resolveWithObject: true });
    return blurhashEncode(new Uint8ClampedArray(data), info.width, info.height, 4, 4);
}

/**
 * 转换、压缩并重命名单张照片，同时同步 MOV 与 JSON
 * @param filepath - 原始图片路径
 */
async function processPhoto(filepath: string): Promise<void> {
    let ext = normExt(filepath);
    if (ext !== '.heic' && basename(filepath).startsWith('p-')) return;

    let buffer = await fs.readFile(filepath);

    // HEIC 转 JPG
    if (ext === '.heic') {
        buffer = Buffer.from(await convert({ buffer: new Uint8Array(buffer), format: 'JPEG', quality: 0.9 }));
        ext = '.jpg';
    }

    const img = sharp(buffer);
    const exif = ExifReader.load(buffer);
    const date = await parsePhotoDate(exif, filepath);
    if (!date) return;

    const base = `p-${date.toISOString().replace(/[:.a-z]+/gi, '-')}`;
    const writepath = getNextAvailableName(base, ext);

    const { outBuffer, percent, outFile } = await compressSharp(img, buffer, filepath, writepath);
    if (outFile !== filepath || percent > -0.1) await fs.writeFile(outFile, outBuffer);
    if (outFile !== filepath) await fs.unlink(filepath);

    // 重命名对应 MOV
    const oldMovPath = filepath.replace(extname(filepath), '.mov');
    if (existsSync(oldMovPath)) await fs.rename(oldMovPath, writepath.replace(extname(writepath), '.mov'));

    // 生成或更新 JSON
    const jsonPath = toJsonPath(outFile);
    const jsonConfig: PhotoMate = existsSync(jsonPath) ? JSON.parse(await fs.readFile(jsonPath, 'utf-8')) : {};
    if (!jsonConfig.blurhash) jsonConfig.blurhash = await generateBlurhash(buffer);
    await fs.writeFile(jsonPath, JSON.stringify(jsonConfig, null, 2));
}

/**
 * 删除没有对应图片的孤立 JSON 与 MOV 文件
 */
async function cleanOrphanFile(): Promise<void> {
    const orphanFiles = await fg('**/*.{json,mov}', fgOpt);
    for (const file of orphanFiles) {
        const base = file.replace(/\.\w+$/, '');
        const exists = IMAGE_EXTS.some((ext) => existsSync(`${base}.${ext}`));
        if (!exists) await fs.unlink(file);
    }
}

/**
 * 处理相册中的全部图片并清理孤立文件
 */
async function main(): Promise<void> {
    const files = await getImageFiles();
    for (const file of files) await processPhoto(file);
    await cleanOrphanFile();
}

void main();
