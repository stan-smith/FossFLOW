import React, { createContext, useRef, useContext } from 'react';
import { createStore, useStore } from 'zustand';
import { ModelStore, Model } from 'src/types';
import { INITIAL_DATA } from 'src/config';

const initialState = () => {
  return createStore<ModelStore>((set, get) => {
    const initialModel = { ...INITIAL_DATA };

    return {
      ...initialModel,
      actions: {
        get,
        set: (updates: Partial<Model>) => {
          set((state) => {
            return { ...state, ...updates };
          });
        }
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
  const storeRef = useRef<ReturnType<typeof initialState> | undefined>(undefined);

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
  selector: (state: ModelStore) => T,
  equalityFn?: (left: T, right: T) => boolean
) {
  const store = useContext(ModelContext);

  if (store === null) {
    throw new Error('Missing provider in the tree');
  }

  const value = useStore(store, selector, equalityFn);
  return value;
}

export function useModelStoreApi() {
  const store = useContext(ModelContext);

  if (store === null) {
    throw new Error('Missing provider in the tree');
  }

  return store;
}
