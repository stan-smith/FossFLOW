import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { createStore } from 'zustand';
import { useHistory } from '../useHistory';
import type { HistoryStoreState, HistoryEntry } from 'src/stores/historyStore';
import type { Model, Scene } from 'src/types';

// --- Minimal mock data ---

const makeModel = (title: string): Model => ({
  title,
  colors: [],
  icons: [],
  items: [],
  views: []
});

const makeScene = (extra?: Record<string, unknown>): Scene => ({
  connectors: {},
  textBoxes: {},
  ...extra
});

const makeEntry = (title: string): HistoryEntry => ({
  model: makeModel(title),
  scene: makeScene()
});

// --- Mock stores ---

const createMockModelStore = (initial: Model) => {
  return createStore<{
    title: string;
    colors: Model['colors'];
    icons: Model['icons'];
    items: Model['items'];
    views: Model['views'];
    version?: string;
    description?: string;
    actions: {
      get: () => any;
      set: (updates: Partial<Model>) => void;
    };
  }>((set, get) => ({
    ...initial,
    actions: {
      get,
      set: (updates: Partial<Model>) => set((state) => ({ ...state, ...updates }))
    }
  }));
};

const createMockSceneStore = (initial: Scene) => {
  return createStore<{
    connectors: Scene['connectors'];
    textBoxes: Scene['textBoxes'];
    actions: {
      get: () => any;
      set: (updates: Partial<Scene>) => void;
    };
  }>((set, get) => ({
    ...initial,
    actions: {
      get,
      set: (updates: Partial<Scene>) => set((state) => ({ ...state, ...updates }))
    }
  }));
};

const MAX_HISTORY = 50;

const createMockHistoryStore = () => {
  return createStore<HistoryStoreState>((set, get) => ({
    past: [],
    future: [],
    gestureInProgress: false,
    maxSize: MAX_HISTORY,
    actions: {
      saveSnapshot: (currentEntry: HistoryEntry) => {
        const { gestureInProgress, maxSize } = get();
        if (gestureInProgress) return;
        set((state) => {
          const newPast = [...state.past, currentEntry];
          if (newPast.length > maxSize) newPast.shift();
          return { past: newPast, future: [] };
        });
      },
      undo: (currentEntry: HistoryEntry) => {
        const { past } = get();
        if (past.length === 0) return null;
        const previous = past[past.length - 1];
        const newPast = past.slice(0, -1);
        set({ past: newPast, future: [currentEntry, ...get().future] });
        return previous;
      },
      redo: (currentEntry: HistoryEntry) => {
        const { future } = get();
        if (future.length === 0) return null;
        const next = future[0];
        const newFuture = future.slice(1);
        set((state) => ({ past: [...state.past, currentEntry], future: newFuture }));
        return next;
      },
      clearHistory: () => {
        set({ past: [], future: [], gestureInProgress: false });
      },
      beginGesture: (currentEntry: HistoryEntry) => {
        const { gestureInProgress, maxSize } = get();
        if (gestureInProgress) return;
        set((state) => {
          const newPast = [...state.past, currentEntry];
          if (newPast.length > maxSize) newPast.shift();
          return { past: newPast, future: [], gestureInProgress: true };
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
        set({ past: newPast, gestureInProgress: false });
        return previous;
      }
    }
  }));
};

// --- Mock context providers ---

let mockModelStore: ReturnType<typeof createMockModelStore>;
let mockSceneStore: ReturnType<typeof createMockSceneStore>;
let mockHistoryStore: ReturnType<typeof createMockHistoryStore>;

jest.mock('../../stores/modelStore', () => ({
  useModelStoreApi: () => mockModelStore
}));

jest.mock('../../stores/sceneStore', () => ({
  useSceneStoreApi: () => mockSceneStore
}));

jest.mock('../../stores/historyStore', () => ({
  useHistoryStore: (selector: (state: HistoryStoreState) => any) => {
    // Need to subscribe to trigger re-renders, but in tests we just call getState
    return selector(mockHistoryStore.getState());
  },
  useHistoryStoreApi: () => mockHistoryStore,
  extractModelData: (state: any) => ({
    version: state.version,
    title: state.title,
    description: state.description,
    colors: state.colors,
    icons: state.icons,
    items: state.items,
    views: state.views
  }),
  extractSceneData: (state: any) => ({
    connectors: state.connectors,
    textBoxes: state.textBoxes
  })
}));

describe('useHistory', () => {
  beforeEach(() => {
    mockModelStore = createMockModelStore(makeModel('initial'));
    mockSceneStore = createMockSceneStore(makeScene());
    mockHistoryStore = createMockHistoryStore();
  });

  describe('canUndo / canRedo', () => {
    it('should initialize with no undo/redo capability', () => {
      const { result } = renderHook(() => useHistory());
      expect(result.current.canUndo).toBe(false);
      expect(result.current.canRedo).toBe(false);
    });

    it('canUndo should be true after saveSnapshot', () => {
      const { result } = renderHook(() => useHistory());

      act(() => {
        result.current.saveSnapshot();
      });

      // Re-render to pick up store changes
      const { result: result2 } = renderHook(() => useHistory());
      expect(result2.current.canUndo).toBe(true);
      expect(result2.current.canRedo).toBe(false);
    });
  });

  describe('saveSnapshot', () => {
    it('should capture model + scene and delegate to history store', () => {
      const { result } = renderHook(() => useHistory());

      act(() => {
        result.current.saveSnapshot();
      });

      const state = mockHistoryStore.getState();
      expect(state.past).toHaveLength(1);
      expect(state.past[0].model.title).toBe('initial');
      expect(state.future).toHaveLength(0);
    });

    it('should clear future on new snapshot', () => {
      // Seed some past and future
      const entry1 = makeEntry('entry1');
      const entry2 = makeEntry('entry2');
      mockHistoryStore.setState({
        past: [entry1],
        future: [entry2]
      });

      const { result } = renderHook(() => useHistory());

      act(() => {
        result.current.saveSnapshot();
      });

      const state = mockHistoryStore.getState();
      expect(state.future).toHaveLength(0);
      expect(state.past).toHaveLength(2);
    });
  });

  describe('undo', () => {
    it('should return previous entry and apply to both stores atomically', () => {
      const previousEntry = makeEntry('previous');
      mockHistoryStore.setState({ past: [previousEntry] });

      const { result } = renderHook(() => useHistory());

      let success: boolean = false;
      act(() => {
        success = result.current.undo();
      });

      expect(success).toBe(true);
      // Model store should now have the previous entry's data
      expect(mockModelStore.getState().title).toBe('previous');
    });

    it('should return false when no history available', () => {
      const { result } = renderHook(() => useHistory());

      let success: boolean = true;
      act(() => {
        success = result.current.undo();
      });

      expect(success).toBe(false);
    });

    it('should push current state to future on undo', () => {
      const previousEntry = makeEntry('previous');
      mockHistoryStore.setState({ past: [previousEntry] });

      const { result } = renderHook(() => useHistory());

      act(() => {
        result.current.undo();
      });

      const state = mockHistoryStore.getState();
      expect(state.past).toHaveLength(0);
      expect(state.future).toHaveLength(1);
      expect(state.future[0].model.title).toBe('initial');
    });
  });

  describe('redo', () => {
    it('should return next entry and apply', () => {
      const futureEntry = makeEntry('future');
      mockHistoryStore.setState({ future: [futureEntry] });

      const { result } = renderHook(() => useHistory());

      let success: boolean = false;
      act(() => {
        success = result.current.redo();
      });

      expect(success).toBe(true);
      expect(mockModelStore.getState().title).toBe('future');
    });

    it('should return false when no future available', () => {
      const { result } = renderHook(() => useHistory());

      let success: boolean = true;
      act(() => {
        success = result.current.redo();
      });

      expect(success).toBe(false);
    });

    it('should push current state to past on redo (not the redo entry)', () => {
      const futureEntry = makeEntry('future');
      mockHistoryStore.setState({ future: [futureEntry] });

      const { result } = renderHook(() => useHistory());

      act(() => {
        result.current.redo();
      });

      const state = mockHistoryStore.getState();
      // past should contain what was current before redo (title='initial'), not 'future'
      expect(state.past).toHaveLength(1);
      expect(state.past[0].model.title).toBe('initial');
    });

    it('undo+redo+undo cycle should not cause data loss', () => {
      const { result } = renderHook(() => useHistory());

      // Save snapshot (captures 'initial'), then change model to 'changed'
      act(() => {
        result.current.saveSnapshot();
      });
      mockModelStore.getState().actions.set({ title: 'changed' });

      // Undo: should restore 'initial'
      act(() => {
        result.current.undo();
      });
      expect(mockModelStore.getState().title).toBe('initial');

      // Redo: should restore 'changed'
      act(() => {
        result.current.redo();
      });
      expect(mockModelStore.getState().title).toBe('changed');

      // Undo again: should restore 'initial' (not get stuck on 'changed')
      act(() => {
        result.current.undo();
      });
      expect(mockModelStore.getState().title).toBe('initial');
    });
  });

  describe('gesture lifecycle', () => {
    it('beginGesture should save snapshot and set gestureInProgress', () => {
      const { result } = renderHook(() => useHistory());

      act(() => {
        result.current.beginGesture();
      });

      const state = mockHistoryStore.getState();
      expect(state.gestureInProgress).toBe(true);
      expect(state.past).toHaveLength(1);
      expect(state.past[0].model.title).toBe('initial');
    });

    it('endGesture should clear gestureInProgress', () => {
      const { result } = renderHook(() => useHistory());

      act(() => {
        result.current.beginGesture();
      });

      expect(mockHistoryStore.getState().gestureInProgress).toBe(true);

      act(() => {
        result.current.endGesture();
      });

      expect(mockHistoryStore.getState().gestureInProgress).toBe(false);
    });

    it('saveSnapshot should be blocked during gesture', () => {
      const { result } = renderHook(() => useHistory());

      act(() => {
        result.current.beginGesture();
      });

      // past has 1 entry from beginGesture
      expect(mockHistoryStore.getState().past).toHaveLength(1);

      act(() => {
        result.current.saveSnapshot();
        result.current.saveSnapshot();
        result.current.saveSnapshot();
      });

      // Should still be 1 - saves blocked during gesture
      expect(mockHistoryStore.getState().past).toHaveLength(1);
    });

    it('cancelGesture should restore pre-gesture state', () => {
      // Set up initial state
      mockModelStore.getState().actions.set({ title: 'before-gesture' });

      const { result } = renderHook(() => useHistory());

      act(() => {
        result.current.beginGesture();
      });

      // Simulate changes during gesture
      mockModelStore.getState().actions.set({ title: 'during-gesture' });
      expect(mockModelStore.getState().title).toBe('during-gesture');

      act(() => {
        result.current.cancelGesture();
      });

      // Should be restored to pre-gesture state
      expect(mockModelStore.getState().title).toBe('before-gesture');
      expect(mockHistoryStore.getState().gestureInProgress).toBe(false);
    });

    it('isGestureInProgress should reflect state', () => {
      const { result } = renderHook(() => useHistory());

      expect(result.current.isGestureInProgress()).toBe(false);

      act(() => {
        result.current.beginGesture();
      });

      expect(result.current.isGestureInProgress()).toBe(true);

      act(() => {
        result.current.endGesture();
      });

      expect(result.current.isGestureInProgress()).toBe(false);
    });
  });

  describe('clearHistory', () => {
    it('should reset all history state', () => {
      mockHistoryStore.setState({
        past: [makeEntry('a'), makeEntry('b')],
        future: [makeEntry('c')],
        gestureInProgress: true
      });

      const { result } = renderHook(() => useHistory());

      act(() => {
        result.current.clearHistory();
      });

      const state = mockHistoryStore.getState();
      expect(state.past).toHaveLength(0);
      expect(state.future).toHaveLength(0);
      expect(state.gestureInProgress).toBe(false);
    });
  });
});
