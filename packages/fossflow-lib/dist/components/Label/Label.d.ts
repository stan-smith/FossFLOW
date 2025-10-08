import React from 'react';
import { SxProps } from '@mui/material';
export interface Props {
    labelHeight?: number;
    maxWidth: number;
    maxHeight?: number;
    expandDirection?: 'CENTER' | 'BOTTOM';
    children: React.ReactNode;
    sx?: SxProps;
    showLine?: boolean;
}
export declare const Label: ({ children, maxWidth, maxHeight, expandDirection, labelHeight, sx, showLine }: Props) => import("react/jsx-runtime").JSX.Element;
