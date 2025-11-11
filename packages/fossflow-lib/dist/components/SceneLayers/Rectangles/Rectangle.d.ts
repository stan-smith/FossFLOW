import React from 'react';
import { useScene } from '../../../hooks/useScene';
type Props = ReturnType<typeof useScene>['rectangles'][0];
export declare const Rectangle: React.MemoExoticComponent<({ from, to, color: colorId, customColor }: Props) => import("react/jsx-runtime").JSX.Element | null>;
export {};
