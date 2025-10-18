import { Rectangle } from '../../types';
import { State, ViewReducerContext } from './types';
export declare const updateRectangle: ({ id, ...updates }: {
    id: string;
} & Partial<Rectangle>, { viewId, state }: ViewReducerContext) => State;
export declare const createRectangle: (newRectangle: Rectangle, { viewId, state }: ViewReducerContext) => State;
export declare const deleteRectangle: (id: string, { viewId, state }: ViewReducerContext) => State;
