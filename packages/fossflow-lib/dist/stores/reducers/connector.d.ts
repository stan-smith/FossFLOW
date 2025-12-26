import { Connector } from '../../types';
import { State, ViewReducerContext } from './types';
export declare const deleteConnector: (id: string, { viewId, state }: ViewReducerContext) => State;
export declare const syncConnector: (id: string, { viewId, state }: ViewReducerContext) => State;
export declare const updateConnector: ({ id, ...updates }: {
    id: string;
} & Partial<Connector>, { state, viewId }: ViewReducerContext) => State;
export declare const createConnector: (newConnector: Connector, { state, viewId }: ViewReducerContext) => State;
