import React from 'react';
import { Coords } from '../../types';
interface Props {
    tile: Coords;
    radius?: number;
}
export declare const Circle: ({ tile, radius, ...rest }: Props & React.SVGProps<SVGCircleElement>) => import("react/jsx-runtime").JSX.Element;
export {};
