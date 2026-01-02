import React from 'react';
export type Props = {
    hex: string;
    isActive?: boolean;
    onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
};
export declare const ColorSwatch: ({ hex, onClick, isActive }: Props) => import("react/jsx-runtime").JSX.Element;
