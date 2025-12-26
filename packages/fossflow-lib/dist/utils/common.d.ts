import { Icon, EditorModeEnum, Mode } from '../types';
export declare const generateId: () => string;
export declare const clamp: (num: number, min: number, max: number) => number;
export declare const getRandom: (min: number, max: number) => number;
export declare const roundToOneDecimalPlace: (num: number) => number;
export declare const roundToTwoDecimalPlaces: (num: number) => number;
interface GetColorVariantOpts {
    alpha?: number;
    grade?: number;
}
export declare const getColorVariant: (color: string, variant: "light" | "dark", { alpha, grade }: GetColorVariantOpts) => string;
export declare const setWindowCursor: (cursor: string) => void;
export declare const toPx: (value: number | string) => string;
export declare const categoriseIcons: (icons: Icon[]) => {
    name?: string;
    icons: Icon[];
}[];
export declare const getStartingMode: (editorMode: keyof typeof EditorModeEnum) => Mode;
export declare function getItemByIdOrThrow<T extends {
    id: string;
}>(values: T[], id: string): {
    value: T;
    index: number;
};
export declare function getItemById<T extends {
    id: string;
}>(values: T[], id: string): {
    value: T;
    index: number;
} | null;
export declare function getItemByIndexOrThrow<T>(items: T[], index: number): T;
export {};
