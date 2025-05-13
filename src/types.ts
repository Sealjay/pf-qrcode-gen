// QR Code related types

// Interface for QR code configuration
export interface QRCodeConfig {
    content: string;
    size: number;
    backgroundColor: string;
    foregroundColor: string;
    includeMargin: boolean;
    errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
}

// Default QR code configuration
export const DEFAULT_QR_CONFIG: QRCodeConfig = {
    content: '',
    size: 256,
    backgroundColor: '#FFFFFF',
    foregroundColor: '#000000',
    includeMargin: true,
    errorCorrectionLevel: 'M'
};