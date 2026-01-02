import React from 'react';
import { Size } from '../../types';
type Props = React.SVGProps<SVGSVGElement> & {
    children: React.ReactNode;
    style?: React.CSSProperties;
    viewboxSize?: Size;
};
export declare const Svg: ({ children, style, viewboxSize, ...rest }: Props) => import("react/jsx-runtime").JSX.Element;
export {};
