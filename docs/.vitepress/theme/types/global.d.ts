declare global {
	interface HTMLElement {
		__previewHandler__?: () => void;
	}
}

export {};
