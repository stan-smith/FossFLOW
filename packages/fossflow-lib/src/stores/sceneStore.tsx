import React, { createContext, useRef, useContext } from 'react';
import { createStore, useStore } from 'zustand';
import { SceneStore, Scene } from 'src/types';

const initialState = () => {
  return createStore<SceneStore>((set, get) => {
    const initialScene: Scene = {
      connectors: {},
      textBoxes: {}
    };

    return {
      ...initialScene,
      actions: {
        get,
        set: (updates: Partial<Scene>) => {
          set((state) => {
            return { ...state, ...updates };
          });
        }
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
  const storeRef = useRef<ReturnType<typeof initialState> | undefined>(undefined);

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
  selector: (state: SceneStore) => T,
  equalityFn?: (left: T, right: T) => boolean
) {
  const store = useContext(SceneContext);

  if (store === null) {
    throw new Error('Missing provider in the tree');
  }

  const value = useStore(store, selector, equalityFn);
  return value;
}

export function useSceneStoreApi() {
  const store = useContext(SceneContext);

  if (store === null) {
    throw new Error('Missing provider in the tree');
  }

  return store;
}
