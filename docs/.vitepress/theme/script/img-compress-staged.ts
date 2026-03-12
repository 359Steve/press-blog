import process from 'node:process';
import prompts from 'prompts';
import Git from 'simple-git';
import { compressImages } from './img-compress';

const git = Git();
const file = await git.diff(['--cached', '--name-only']);
const stagedFiles = file
	.split('\n')
	.map((i) => i.trim())
	.filter(Boolean);

const images = stagedFiles.filter((i) => i.match(/\.(png|jpe?g|webp)$/i));
if (images.length > 0) {
	const { confirm } = await prompts({
		type: 'confirm',
		name: 'confirm',
		message: `Compress ${images.length} images?`,
	});

	if (!confirm) process.exit(0);

	compressImages(images);
} else {
	process.exit(0);
}
