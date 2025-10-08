import { TextBox } from '../../types';
import { State, ViewReducerContext } from './types';
export declare const syncTextBox: (id: string, { viewId, state }: ViewReducerContext) => State;
export declare const updateTextBox: ({ id, ...updates }: {
    id: string;
} & Partial<TextBox>, { viewId, state }: ViewReducerContext) => State;
export declare const createTextBox: (newTextBox: TextBox, { viewId, state }: ViewReducerContext) => State;
export declare const deleteTextBox: (id: string, { viewId, state }: ViewReducerContext) => State;
