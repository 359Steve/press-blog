declare global {
    interface HTMLElement {
        /** v-preview 绑定的点击处理器 */
        __previewHandler__?: () => void;
    }

    interface Window {
        /** 高德地图安全密钥配置 */
        _AMapSecurityConfig?: {
            /** 高德地图安全密钥 */
            securityJsCode: string;
        };
    }
}

export {};
