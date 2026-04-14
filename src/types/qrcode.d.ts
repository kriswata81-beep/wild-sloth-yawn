declare module "qrcode" {
  interface QRData {
    modules: {
      size: number;
      data: Uint8Array;
    };
  }
  interface QROptions {
    errorCorrectionLevel?: "L" | "M" | "Q" | "H";
  }
  function create(text: string, options?: QROptions): Promise<QRData>;
  export { create };
}
