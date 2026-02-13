import React, { createContext, useRef, useContext } from 'react';
import { createStore, useStore } from 'zustand';
import { Model, Scene } from 'src/types';

export interface HistoryEntry {
  model: Model;
  scene: Scene;
}

export interface HistoryStoreState {
  past: HistoryEntry[];
  future: HistoryEntry[];
  gestureInProgress: boolean;
  maxSize: number;
  actions: {
    saveSnapshot: (currentEntry: HistoryEntry) => void;
    undo: (currentEntry: HistoryEntry) => HistoryEntry | null;
    redo: (currentEntry: HistoryEntry) => HistoryEntry | null;
    clearHistory: () => void;
    beginGesture: (currentEntry: HistoryEntry) => void;
    endGesture: () => void;
    cancelGesture: () => HistoryEntry | null;
  };
}

const MAX_HISTORY_SIZE = 50;

const createHistoryStore = () => {
  return createStore<HistoryStoreState>((set, get) => ({
    past: [],
    future: [],
    gestureInProgress: false,
    maxSize: MAX_HISTORY_SIZE,

    actions: {
      saveSnapshot: (currentEntry: HistoryEntry) => {
        const { gestureInProgress, maxSize } = get();

        if (gestureInProgress) return;

        set((state) => {
          const newPast = [...state.past, currentEntry];

          if (newPast.length > maxSize) {
            newPast.shift();
          }

          return {
            past: newPast,
            future: []
          };
        });
      },

      undo: (currentEntry: HistoryEntry) => {
        const { past } = get();
        if (past.length === 0) return null;

        const previous = past[past.length - 1];
        const newPast = past.slice(0, -1);

        set({
          past: newPast,
          future: [currentEntry, ...get().future]
        });

        return previous;
      },

      redo: (currentEntry: HistoryEntry) => {
        const { future } = get();
        if (future.length === 0) return null;

        const next = future[0];
        const newFuture = future.slice(1);

        set((state) => ({
          past: [...state.past, currentEntry],
          future: newFuture
        }));

        return next;
      },

      clearHistory: () => {
        set({
          past: [],
          future: [],
          gestureInProgress: false
        });
      },

      beginGesture: (currentEntry: HistoryEntry) => {
        const { gestureInProgress, maxSize } = get();
        if (gestureInProgress) return;

        set((state) => {
          const newPast = [...state.past, currentEntry];

          if (newPast.length > maxSize) {
            newPast.shift();
          }

          return {
            past: newPast,
            future: [],
            gestureInProgress: true
          };
        });
      },

      endGesture: () => {
        set({ gestureInProgress: false });
      },

      cancelGesture: () => {
        const { past, gestureInProgress } = get();
        if (!gestureInProgress || past.length === 0) {
          set({ gestureInProgress: false });
          return null;
        }

        const previous = past[past.length - 1];
        const newPast = past.slice(0, -1);

        set({
          past: newPast,
          gestureInProgress: false
        });

        return previous;
      }
    }
  }));
};

const HistoryContext = createContext<ReturnType<typeof createHistoryStore> | null>(
  null
);

interface ProviderProps {
  children: React.ReactNode;
}

export const HistoryProvider = ({ children }: ProviderProps) => {
  const storeRef = useRef<ReturnType<typeof createHistoryStore> | undefined>(undefined);

  if (!storeRef.current) {
    storeRef.current = createHistoryStore();
  }

  return (
    <HistoryContext.Provider value={storeRef.current}>
      {children}
    </HistoryContext.Provider>
  );
};

export function useHistoryStore<T>(
  selector: (state: HistoryStoreState) => T,
  equalityFn?: (left: T, right: T) => boolean
) {
  const store = useContext(HistoryContext);

  if (store === null) {
    throw new Error('Missing HistoryProvider in the tree');
  }

  const value = useStore(store, selector, equalityFn);
  return value;
}

export function useHistoryStoreApi() {
  const store = useContext(HistoryContext);

  if (store === null) {
    throw new Error('Missing HistoryProvider in the tree');
  }

  return store;
}

export const extractModelData = (state: {
  version?: string;
  title: string;
  description?: string;
  colors: Model['colors'];
  icons: Model['icons'];
  items: Model['items'];
  views: Model['views'];
}): Model => {
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

export const extractSceneData = (state: {
  connectors: Scene['connectors'];
  textBoxes: Scene['textBoxes'];
}): Scene => {
  return {
    connectors: state.connectors,
    textBoxes: state.textBoxes
  };
};
