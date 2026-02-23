import type { Buffer } from 'node:buffer';
import fs from 'node:fs/promises';
import c from 'ansis';
import sharp from 'sharp';

const maxSize = 1440;

export async function compressSharp(image: sharp.Sharp, inBuffer: Buffer, inFile: string, outFile: string) {
	const { format, width, height } = await image.metadata();
	if (!format) {
		throw new Error(`Could not determine format of ${inFile}`);
	}
	if (!width || !height) {
		throw new Error(`Could not determine size of ${inFile}`);
	}
	if (format !== 'jpeg' && format !== 'png' && format !== 'webp')
		throw new Error(`Unsupported format ${format} of ${inFile}`);

	if (width > maxSize || height > maxSize) {
		image = image.resize(maxSize);
	}

	image = image[format]({
		quality: format === 'png' ? 100 : 80,
		compressionLevel: 9,
	});

	const outBuffer = await image.withMetadata().toBuffer();
	const size = inBuffer.byteLength;
	const outSize = outBuffer.byteLength;

	const percent = (outSize - size) / size;
	return {
		image,
		outBuffer,
		size,
		outSize,
		percent,
		inFile,
		outFile,
	};
}

export async function compressImages(files: string[]) {
	await Promise.all(
		files.map(async (file) => {
			const buffer = await fs.readFile(file);
			const image = sharp(buffer);
			const { percent, size, outSize, inFile, outFile, outBuffer } = await compressSharp(
				image,
				buffer,
				file,
				file,
			);
			if (percent <= -0.1) {
				await fs.writeFile(outFile, outBuffer);
			}
		}),
	);
}
