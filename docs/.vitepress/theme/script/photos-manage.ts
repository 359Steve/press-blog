/**
 * 相册管理脚本：对 theme/photos/album 下的图片进行压缩、按日期重命名、生成 blurhash、清理孤立 json。
 * 使用方式：npm run photos
 */

import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { encode as blurhashEncode } from 'blurhash';
import ExifReader from 'exifreader';
import fg from 'fast-glob';
import { basename, join, parse } from 'pathe';
import sharp from 'sharp';
import { compressSharp } from './img-compress';

const FOLDER = fileURLToPath(new URL('../photos/album', import.meta.url));
const ONE_HOUR_MS = 60 * 60 * 1000;
const IMAGE_EXTS = ['jpg', 'jpeg', 'png'] as const;

const fgOpt = { caseSensitiveMatch: false, absolute: true, cwd: FOLDER };

/**
 * 获取相册内所有图片路径
 */
async function getImageFiles(): Promise<string[]> {
	const list = await fg('**/*.{jpg,png,jpeg}', fgOpt);
	return list.sort((a, b) => a.localeCompare(b));
}

/**
 * 根据图片路径生成同名的json路径
 * @param imagePath 图片原始路径
 */
function toJsonPath(imagePath: string): string {
	return imagePath.replace(/\.\w+$/, '.json');
}

/**
 * 是否存在以 base 为前缀的任意图片
 * @param base 文件名不包含后缀
 */
function hasImage(base: string): boolean {
	return IMAGE_EXTS.some((ext) => existsSync(`${base}.${ext}`));
}

/**
 * 从 EXIF 或文件时间解析拍摄日期；若在 1 小时内则返回 null
 * @param exif 图片元信息
 * @param filepath 图片路径
 */
async function parsePhotoDate(
	exif: Awaited<ReturnType<typeof ExifReader.load>>,
	filepath: string,
): Promise<Date | null> {
	// 从 EXIF 里找时间
	let dateRaw = exif.DateTimeOriginal?.value ?? exif.DateTime?.value ?? exif.DateCreated?.value;

	// 如果 EXIF 没有时间
	dateRaw ??= new Date(await fs.stat(filepath).then((s) => s.birthtime || s.mtime)).toISOString();

	// 2025:02:02 10:07:10 - 2025-02-02 10:07:10
	const raw = String(Array.isArray(dateRaw) ? dateRaw[0] : dateRaw);
	const normalized = raw.replace(/:/g, (ch, i) => (i < 10 ? '-' : ch));

	// 转成 Date
	const date = new Date(normalized);
	const d = Number.isNaN(+date) ? new Date() : date;

	// 一小时内的照片直接丢弃
	if (Date.now() - +d < ONE_HOUR_MS) return null;
	return d;
}

/**
 * 统一扩展名
 * @param filepath 图片原始路径
 */
function normExt(filepath: string): string {
	const ext = parse(filepath.toLowerCase()).ext;
	return ext === '.jpeg' ? '.jpg' : ext;
}

async function main() {
	// 第一步：压缩并按日期重命名新图
	for (const filepath of await getImageFiles()) {
		if (basename(filepath).startsWith('p-')) continue;

		// 统一扩展名
		const ext = normExt(filepath);
		// 获取图片的 buffer
		const buffer = await fs.readFile(filepath);
		// 用 sharp 解析图片
		const img = await sharp(buffer);
		// 读取 EXIF 信息
		const exif = await ExifReader.load(buffer);

		const date = await parsePhotoDate(exif, filepath);
		if (date === null) continue;

		// 循环生成对应新图片名称
		const base = `p-${date.toISOString().replace(/[:.a-z]+/gi, '-')}`;
		let index = 1;
		while (existsSync(join(FOLDER, `${base}${index}${ext}`.toLowerCase()))) index++;
		const writepath = join(FOLDER, `${base}${index}${ext}`.toLowerCase());

		// 压缩图片
		const { outBuffer, percent, outFile } = await compressSharp(img, buffer, filepath, writepath);

		// 写入新图片
		if (outFile !== filepath || percent > -0.1) await fs.writeFile(outFile, outBuffer);

		// 删除旧图片
		if (outFile !== filepath) await fs.unlink(filepath);

		// 生成对应名称的空json对象
		await fs.writeFile(toJsonPath(outFile), JSON.stringify({}, null, 2));
	}

	// 第二步：为已命名图片生成 blurhash
	for (const filepath of await getImageFiles()) {
		if (!basename(filepath).startsWith('p-')) continue;

		// 获取对应json文件名
		const configPath = toJsonPath(filepath);

		// 读取json
		const config: Record<string, any> = existsSync(configPath)
			? JSON.parse(await fs.readFile(configPath, 'utf-8'))
			: {};
		if (config.blurhash) continue;

		// 获取图片二进制buffer数据
		const buffer = await fs.readFile(filepath);

		// 处理图片
		const { data, info } = await sharp(buffer)
			.raw()
			.ensureAlpha()
			.resize(32, 32, { fit: 'cover' })
			.toBuffer({ resolveWithObject: true });

		// 生成 blurhash
		config.blurhash = blurhashEncode(new Uint8ClampedArray(data), info?.width ?? 0, info?.height ?? 0, 4, 4);

		// 写入对应json文件
		await fs.writeFile(configPath, JSON.stringify(config, null, 2));
	}

	// 第三步：删除没有对应图片的 json
	for (const json of await fg('**/*.json', fgOpt)) {
		if (!hasImage(json.replace(/\.json$/i, ''))) await fs.unlink(json);
	}
}

void main();
