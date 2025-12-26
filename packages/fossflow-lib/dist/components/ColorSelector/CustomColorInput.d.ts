interface EyeDropper {
    open: (options?: {
        signal?: AbortSignal;
    }) => Promise<{
        sRGBHex: string;
    }>;
}
declare global {
    interface Window {
        EyeDropper?: {
            new (): EyeDropper;
        };
    }
}
interface Props {
    value: string;
    onChange: (color: string) => void;
}
export declare const CustomColorInput: ({ value, onChange }: Props) => import("react/jsx-runtime").JSX.Element;
export {};
