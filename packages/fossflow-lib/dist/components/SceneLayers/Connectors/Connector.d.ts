import React from 'react';
import { useScene } from '../../../hooks/useScene';
interface Props {
    connector: ReturnType<typeof useScene>['connectors'][0];
    isSelected?: boolean;
}
export declare const Connector: React.MemoExoticComponent<({ connector: _connector, isSelected }: Props) => import("react/jsx-runtime").JSX.Element | null>;
export {};
