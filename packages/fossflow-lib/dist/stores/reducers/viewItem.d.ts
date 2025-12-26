import { ViewItem } from '../../types';
import { State, ViewReducerContext } from './types';
export declare const updateViewItem: ({ id, ...updates }: {
    id: string;
} & Partial<ViewItem>, { viewId, state }: ViewReducerContext) => State;
export declare const createViewItem: (newViewItem: ViewItem, ctx: ViewReducerContext) => State;
export declare const deleteViewItem: (id: string, { state, viewId }: ViewReducerContext) => State;
