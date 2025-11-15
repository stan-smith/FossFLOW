import { Model, Size } from '../types';
export declare const generateGenericFilename: (extension: string) => string;
export declare const base64ToBlob: (base64: string, contentType: string, sliceSize?: number) => Blob;
export declare const downloadFile: (data: Blob, filename: string) => void;
export declare const transformToCompactFormat: (model: Model) => {
    t: string;
    i: string[][];
    v: number[][][][];
    _: {
        f: string;
        v: string;
    };
};
export declare const transformFromCompactFormat: (compactModel: any) => Model;
export declare const exportAsJSON: (model: Model) => void;
export declare const exportAsCompactJSON: (model: Model) => void;
export declare const exportAsImage: (el: HTMLDivElement, size?: Size, scale?: number) => Promise<string>;
