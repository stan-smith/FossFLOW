declare module 'dom-to-image-more' {
  export interface Options {
    filter?: (node: Node) => boolean;
    bgcolor?: string;
    width?: number;
    height?: number;
    style?: any;
    quality?: number;
    cacheBust?: boolean;
    copyDefaultStyles?: boolean;
    preferredFontFormat?: string;
    fontEmbedCSS?: string | null;
    skipAutoScale?: boolean;
  }

  export function toPng(node: Node, options?: Options): Promise<string>;
  export function toJpeg(node: Node, options?: Options): Promise<string>;
  export function toSvg(node: Node, options?: Options): Promise<string>;
  export function toBlob(node: Node, options?: Options): Promise<Blob>;
  export function toPixelData(node: Node, options?: Options): Promise<Uint8ClampedArray>;

  const domtoimage: {
    toPng: typeof toPng;
    toJpeg: typeof toJpeg;
    toSvg: typeof toSvg;
    toBlob: typeof toBlob;
    toPixelData: typeof toPixelData;
  };

  export default domtoimage;
}