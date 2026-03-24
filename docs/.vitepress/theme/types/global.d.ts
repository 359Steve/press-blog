declare global {
	interface HTMLElement {
		__previewHandler__?: () => void;
	}

	interface Window {
		_AMapSecurityConfig?: {
			securityJsCode: string;
		};
	}
}

export {};
