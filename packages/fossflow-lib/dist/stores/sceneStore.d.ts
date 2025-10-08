import React from 'react';
import { SceneStore, Scene } from '../types';
export interface SceneHistoryState {
    past: Scene[];
    present: Scene;
    future: Scene[];
    maxHistorySize: number;
}
export interface SceneStoreWithHistory extends Omit<SceneStore, 'actions'> {
    history: SceneHistoryState;
    actions: {
        get: () => SceneStoreWithHistory;
        set: (scene: Partial<Scene>, skipHistory?: boolean) => void;
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
export declare const SceneProvider: ({ children }: ProviderProps) => import("react/jsx-runtime").JSX.Element;
export declare function useSceneStore<T>(selector: (state: SceneStoreWithHistory) => T, equalityFn?: (left: T, right: T) => boolean): T;
export {};
