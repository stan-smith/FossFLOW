import { ModelItem } from '../../types';
import { State } from './types';
export declare const updateModelItem: (id: string, updates: Partial<ModelItem>, state: State) => State;
export declare const createModelItem: (newModelItem: ModelItem, state: State) => State;
export declare const deleteModelItem: (id: string, state: State) => State;
