import React from 'react';
interface Props {
    value?: string;
    onChange?: (value: string) => void;
    readOnly?: boolean;
    height?: number;
    styles?: React.CSSProperties;
}
export declare const RichTextEditor: ({ value, onChange, readOnly, height, styles }: Props) => import("react/jsx-runtime").JSX.Element;
export {};
