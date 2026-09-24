import type { Buffer } from 'node:buffer';
import fs from 'node:fs/promises';
import sharp from 'sharp';

/** 压缩时允许的最长边像素 */
const maxSize = 1440;

type CompressResult = {
    /** 处理后的 Sharp 实例 */
    image: sharp.Sharp;
    /** 压缩后的图片缓冲区 */
    outBuffer: Buffer;
    /** 原始文件大小（字节） */
    size: number;
    /** 压缩后文件大小（字节） */
    outSize: number;
    /** 相对原始大小的变化比例，负值表示变小 */
    percent: number;
    /** 输入文件路径 */
    inFile: string;
    /** 输出文件路径 */
    outFile: string;
};

/**
 * 使用 Sharp 压缩单张图片，必要时按最长边缩放
 * @param image - Sharp 实例
 * @param inBuffer - 原始图片缓冲区
 * @param inFile - 输入文件路径
 * @param outFile - 输出文件路径
 * @returns 压缩结果，包含输出缓冲区与体积变化比例
 */
export async function compressSharp(
    image: sharp.Sharp,
    inBuffer: Buffer,
    inFile: string,
    outFile: string,
): Promise<CompressResult> {
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

/**
 * 批量压缩图片，体积减少超过 10% 时写回原文件
 * @param files - 待压缩的图片路径列表
 */
export async function compressImages(files: string[]): Promise<void> {
    await Promise.all(
        files.map(async (file) => {
            const buffer = await fs.readFile(file);
            const image = sharp(buffer);
            const { percent, outFile, outBuffer } = await compressSharp(
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
