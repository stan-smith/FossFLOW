import React from 'react';
import { UiStateStore } from '../types';
interface ProviderProps {
    children: React.ReactNode;
}
export declare const UiStateProvider: ({ children }: ProviderProps) => import("react/jsx-runtime").JSX.Element;
export declare function useUiStateStore<T>(selector: (state: UiStateStore) => T): T;
export {};
