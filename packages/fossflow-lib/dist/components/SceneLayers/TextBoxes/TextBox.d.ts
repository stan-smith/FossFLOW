import React from 'react';
import { useScene } from '../../../hooks/useScene';
interface Props {
    textBox: ReturnType<typeof useScene>['textBoxes'][0];
}
export declare const TextBox: React.MemoExoticComponent<({ textBox }: Props) => import("react/jsx-runtime").JSX.Element>;
export {};
