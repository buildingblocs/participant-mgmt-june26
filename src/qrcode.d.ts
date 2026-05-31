declare module "qrcode" {
  interface QRCodeToBufferOptions {
    scale?: number;
  }

  const QRCode: {
    toBuffer(data: string, options?: QRCodeToBufferOptions): Promise<Buffer>;
  };

  export default QRCode;
}
