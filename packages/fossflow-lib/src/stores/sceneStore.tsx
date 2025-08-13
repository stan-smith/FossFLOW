import React, { createContext, useRef, useContext } from 'react';
import { createStore, useStore } from 'zustand';
import { SceneStore, Scene } from 'src/types';

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

const MAX_HISTORY_SIZE = 50;

const createSceneHistoryState = (initialScene: Scene): SceneHistoryState => {
  return {
    past: [],
    present: initialScene,
    future: [],
    maxHistorySize: MAX_HISTORY_SIZE
  };
};

const extractSceneData = (state: SceneStoreWithHistory): Scene => {
  return {
    connectors: state.connectors,
    textBoxes: state.textBoxes
  };
};

const initialState = () => {
  return createStore<SceneStoreWithHistory>((set, get) => {
    const initialScene: Scene = {
      connectors: {},
      textBoxes: {}
    };

    const saveToHistory = () => {
      set((state) => {
        const currentScene = extractSceneData(state);
        const newPast = [...state.history.past, state.history.present];

        // Limit history size
        if (newPast.length > state.history.maxHistorySize) {
          newPast.shift();
        }

        return {
          ...state,
          history: {
            ...state.history,
            past: newPast,
            present: currentScene,
            future: []
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
      const currentScene = extractSceneData(currentState);

      set((state) => {
        return {
          ...state,
          history: createSceneHistoryState(currentScene)
        };
      });
    };

    return {
      ...initialScene,
      history: createSceneHistoryState(initialScene),
      actions: {
        get,
        set: (updates: Partial<Scene>, skipHistory = false) => {
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

const SceneContext = createContext<ReturnType<typeof initialState> | null>(
  null
);

interface ProviderProps {
  children: React.ReactNode;
}

export const SceneProvider = ({ children }: ProviderProps) => {
  const storeRef = useRef<ReturnType<typeof initialState>>();

  if (!storeRef.current) {
    storeRef.current = initialState();
  }

  return (
    <SceneContext.Provider value={storeRef.current}>
      {children}
    </SceneContext.Provider>
  );
};

export function useSceneStore<T>(
  selector: (state: SceneStoreWithHistory) => T,
  equalityFn?: (left: T, right: T) => boolean
) {
  const store = useContext(SceneContext);

  if (store === null) {
    throw new Error('Missing provider in the tree');
  }

  const value = useStore(store, selector, equalityFn);
  return value;
}
