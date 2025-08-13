import React, { createContext, useRef, useContext } from 'react';
import { createStore, useStore } from 'zustand';
import { ModelStore, Model } from 'src/types';
import { INITIAL_DATA } from 'src/config';

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

const MAX_HISTORY_SIZE = 50;

const createHistoryState = (initialModel: Model): HistoryState => {
  return {
    past: [],
    present: initialModel,
    future: [],
    maxHistorySize: MAX_HISTORY_SIZE
  };
};

const extractModelData = (state: ModelStoreWithHistory): Model => {
  return {
    version: state.version,
    title: state.title,
    description: state.description,
    colors: state.colors,
    icons: state.icons,
    items: state.items,
    views: state.views
  };
};

const initialState = () => {
  return createStore<ModelStoreWithHistory>((set, get) => {
    const initialModel = { ...INITIAL_DATA };

    const saveToHistory = () => {
      set((state) => {
        const currentModel = extractModelData(state);
        const newPast = [...state.history.past, state.history.present];

        // Limit history size to prevent memory issues
        if (newPast.length > state.history.maxHistorySize) {
          newPast.shift();
        }

        return {
          ...state,
          history: {
            ...state.history,
            past: newPast,
            present: currentModel,
            future: [] // Clear future when new action is performed
          }
        };
      });
    };

    const undo = (): boolean => {
      const { history } = get();
      if (history.past.length === 0) return false;

      const previous = history.past[history.past.length - 1];
      const newPast = history.past.slice(0, history.past.length - 1);

      set((state) => {
        return {
          ...previous,
          history: {
            ...state.history,
            past: newPast,
            present: previous,
            future: [state.history.present, ...state.history.future]
          }
        };
      });

      return true;
    };

    const redo = (): boolean => {
      const { history } = get();
      if (history.future.length === 0) return false;

      const next = history.future[0];
      const newFuture = history.future.slice(1);

      set((state) => {
        return {
          ...next,
          history: {
            ...state.history,
            past: [...state.history.past, state.history.present],
            present: next,
            future: newFuture
          }
        };
      });

      return true;
    };

    const canUndo = () => {
      return get().history.past.length > 0;
    };
    const canRedo = () => {
      return get().history.future.length > 0;
    };

    const clearHistory = () => {
      const currentState = get();
      const currentModel = extractModelData(currentState);

      set((state) => {
        return {
          ...state,
          history: createHistoryState(currentModel)
        };
      });
    };

    return {
      ...initialModel,
      history: createHistoryState(initialModel),
      actions: {
        get,
        set: (updates: Partial<Model>, skipHistory = false) => {
          if (!skipHistory) {
            saveToHistory();
          }
          set((state) => {
            return { ...state, ...updates };
          });
        },
        undo,
        redo,
        canUndo,
        canRedo,
        saveToHistory,
        clearHistory
      }
    };
  });
};

const ModelContext = createContext<ReturnType<typeof initialState> | null>(
  null
);

interface ProviderProps {
  children: React.ReactNode;
}

export const ModelProvider = ({ children }: ProviderProps) => {
  const storeRef = useRef<ReturnType<typeof initialState>>();

  if (!storeRef.current) {
    storeRef.current = initialState();
  }

  return (
    <ModelContext.Provider value={storeRef.current}>
      {children}
    </ModelContext.Provider>
  );
};

export function useModelStore<T>(
  selector: (state: ModelStoreWithHistory) => T,
  equalityFn?: (left: T, right: T) => boolean
) {
  const store = useContext(ModelContext);

  if (store === null) {
    throw new Error('Missing provider in the tree');
  }

  const value = useStore(store, selector, equalityFn);
  return value;
}
