declare module 'heic-convert' {
	interface ConversionOptions {
		/**
		 * the HEIC file buffer
		 */
		// eslint-disable-next-line node/prefer-global/buffer
		buffer: ArrayBufferLike | Buffer | Uint8Array;
		/**
		 * output format
		 */
		format: 'JPEG' | 'PNG';
		/**
		 * the JPEG compression quality, between 0 and 1
		 * @default 0.92
		 */
		quality?: number;
	}

	interface Convertible {
		// eslint-disable-next-line ts/method-signature-style
		convert(): Promise<ArrayBuffer>;
	}

	/** @async */
	declare function convert(image: ConversionOptions): Promise<ArrayBuffer>;
	declare namespace convert {
		/** @async */
		function all(image: ConversionOptions): Promise<Convertible[]>;
	}

	export = convert;
}
