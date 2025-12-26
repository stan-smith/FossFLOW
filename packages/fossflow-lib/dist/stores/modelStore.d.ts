import React from 'react';
import { ModelStore, Model } from '../types';
export interface HistoryState {
    past: Model[];
    present: Model;
    future: Model[];
    maxHistorySize: number;
}
export interface ModelStoreWithHistory extends Omit<ModelStore, 'actions'> {
    history: HistoryState;
    actions: {
        get: () => ModelStoreWithHistory;
        set: (model: Partial<Model>, skipHistory?: boolean) => void;
        undo: () => boolean;
        redo: () => boolean;
        canUndo: () => boolean;
        canRedo: () => boolean;
        saveToHistory: () => void;
        clearHistory: () => void;
    };
}
interface ProviderProps {
    children: React.ReactNode;
}
export declare const ModelProvider: ({ children }: ProviderProps) => import("react/jsx-runtime").JSX.Element;
export declare function useModelStore<T>(selector: (state: ModelStoreWithHistory) => T, equalityFn?: (left: T, right: T) => boolean): T;
export {};
