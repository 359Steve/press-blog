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

const FOLDER = fileURLToPath(new URL('../photos/album', import.meta.url));
const ONE_HOUR_MS = 60 * 60 * 1000;
const IMAGE_EXTS = ['jpg', 'jpeg', 'png'] as const;
const fgOpt = { caseSensitiveMatch: false, absolute: true, cwd: FOLDER };

async function getImageFiles(): Promise<string[]> {
	return (await fg('**/*.{jpg,png,jpeg,heic}', fgOpt)).sort((a, b) => a.localeCompare(b));
}

function toJsonPath(imagePath: string) {
	return imagePath.replace(/\.\w+$/, '.json');
}

// 获取扩展名
function normExt(filepath: string) {
	const ext = parse(filepath.toLowerCase()).ext;
	return ext === '.jpeg' ? '.jpg' : ext;
}

// 获取拍摄时间
async function parsePhotoDate(exif: ExifReader.Tags, filepath: string): Promise<Date | null> {
	let dateRaw = exif.DateTimeOriginal?.value ?? exif.DateTime?.value ?? exif.DateCreated?.value;
	dateRaw ??= new Date((await fs.stat(filepath)).birthtime || (await fs.stat(filepath)).mtime).toISOString();

	const raw = Array.isArray(dateRaw) ? dateRaw[0] : dateRaw;
	const normalized = raw.toString().replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3');
	const date = new Date(normalized);

	return Date.now() - +date < ONE_HOUR_MS ? null : date;
}

// 循环查找是否有同名文件
function getNextAvailableName(base: string, ext: string): string {
	let index = 1;
	let name = `${base}${index}${ext}`;
	while (existsSync(join(FOLDER, name.toLowerCase()))) {
		index++;
		name = `${base}${index}${ext}`;
	}
	return join(FOLDER, name.toLowerCase());
}

// 生成对应的Blurhash
async function generateBlurhash(buffer: Buffer): Promise<string> {
	const { data, info } = await sharp(buffer)
		.raw()
		.ensureAlpha()
		.resize(32, 32, { fit: 'cover' })
		.toBuffer({ resolveWithObject: true });
	return blurhashEncode(new Uint8ClampedArray(data), info.width, info.height, 4, 4);
}

async function processPhoto(filepath: string) {
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

// 清除多余的json文件
async function cleanOrphanJson() {
	const jsonFiles = await fg('**/*.json', fgOpt);
	for (const json of jsonFiles) {
		const base = json.replace(/\.json$/i, '');
		const exists = IMAGE_EXTS.some((ext) => existsSync(`${base}.${ext}`));
		if (!exists) await fs.unlink(json);
	}
}

async function main() {
	const files = await getImageFiles();
	for (const file of files) await processPhoto(file);
	await cleanOrphanJson();
}

void main();
