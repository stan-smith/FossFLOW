import { View } from '../../types';
import type { ViewReducerContext, State, ViewReducerParams } from './types';
export declare const updateViewTimestamp: (ctx: ViewReducerContext) => State;
export declare const syncScene: ({ viewId, state }: ViewReducerContext) => State;
export declare const deleteView: (ctx: ViewReducerContext) => State;
export declare const updateView: (updates: Partial<Pick<View, "name">>, ctx: ViewReducerContext) => State;
export declare const createView: (newView: Partial<View>, ctx: ViewReducerContext) => State;
export declare const view: ({ action, payload, ctx }: ViewReducerParams) => State;
