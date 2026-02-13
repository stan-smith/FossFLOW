import React from 'react';
import { renderHook, act } from '@testing-library/react';
import {
  HistoryProvider,
  useHistoryStore,
  useHistoryStoreApi
} from '../historyStore';
import type { HistoryEntry } from '../historyStore';

const makeEntry = (id: number): HistoryEntry => ({
  model: {
    version: `v${id}`,
    title: `Model ${id}`,
    colors: [],
    icons: [],
    items: [],
    views: []
  },
  scene: {
    connectors: {},
    textBoxes: {}
  }
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <HistoryProvider>{children}</HistoryProvider>
);

describe('historyStore', () => {
  describe('saveSnapshot', () => {
    it('adds entry to past and clears future', () => {
      const { result } = renderHook(
        () => ({
          api: useHistoryStoreApi(),
          past: useHistoryStore((s) => s.past),
          future: useHistoryStore((s) => s.future)
        }),
        { wrapper }
      );

      act(() => {
        result.current.api.getState().actions.saveSnapshot(makeEntry(1));
      });

      expect(result.current.past).toHaveLength(1);
      expect(result.current.past[0].model.title).toBe('Model 1');
      expect(result.current.future).toHaveLength(0);
    });

    it('enforces max size', () => {
      const { result } = renderHook(
        () => ({
          api: useHistoryStoreApi(),
          past: useHistoryStore((s) => s.past)
        }),
        { wrapper }
      );

      act(() => {
        for (let i = 0; i < 55; i++) {
          result.current.api.getState().actions.saveSnapshot(makeEntry(i));
        }
      });

      expect(result.current.past).toHaveLength(50);
      // Oldest entries should have been shifted off
      expect(result.current.past[0].model.title).toBe('Model 5');
    });

    it('skips save during gesture', () => {
      const { result } = renderHook(
        () => ({
          api: useHistoryStoreApi(),
          past: useHistoryStore((s) => s.past)
        }),
        { wrapper }
      );

      act(() => {
        result.current.api.getState().actions.beginGesture(makeEntry(0));
      });

      act(() => {
        result.current.api.getState().actions.saveSnapshot(makeEntry(1));
      });

      // Only the beginGesture entry should be there
      expect(result.current.past).toHaveLength(1);
      expect(result.current.past[0].model.title).toBe('Model 0');
    });
  });

  describe('undo', () => {
    it('returns previous entry and moves current to future', () => {
      const { result } = renderHook(
        () => ({
          api: useHistoryStoreApi(),
          past: useHistoryStore((s) => s.past),
          future: useHistoryStore((s) => s.future)
        }),
        { wrapper }
      );

      act(() => {
        result.current.api.getState().actions.saveSnapshot(makeEntry(1));
      });

      let undone: HistoryEntry | null = null;
      act(() => {
        undone = result.current.api.getState().actions.undo(makeEntry(2));
      });

      expect(undone).not.toBeNull();
      expect(undone!.model.title).toBe('Model 1');
      expect(result.current.past).toHaveLength(0);
      expect(result.current.future).toHaveLength(1);
      expect(result.current.future[0].model.title).toBe('Model 2');
    });

    it('returns null when past is empty', () => {
      const { result } = renderHook(
        () => ({
          api: useHistoryStoreApi()
        }),
        { wrapper }
      );

      let undone: HistoryEntry | null = null;
      act(() => {
        undone = result.current.api.getState().actions.undo(makeEntry(1));
      });

      expect(undone).toBeNull();
    });
  });

  describe('redo', () => {
    it('returns next entry and pushes current to past', () => {
      const { result } = renderHook(
        () => ({
          api: useHistoryStoreApi(),
          past: useHistoryStore((s) => s.past),
          future: useHistoryStore((s) => s.future)
        }),
        { wrapper }
      );

      // Build up: save then undo
      act(() => {
        result.current.api.getState().actions.saveSnapshot(makeEntry(1));
      });
      act(() => {
        result.current.api.getState().actions.undo(makeEntry(2));
      });

      // Now redo, passing current state (makeEntry(1) since undo restored it)
      let redone: HistoryEntry | null = null;
      act(() => {
        redone = result.current.api.getState().actions.redo(makeEntry(1));
      });

      expect(redone).not.toBeNull();
      expect(redone!.model.title).toBe('Model 2');
      expect(result.current.future).toHaveLength(0);
      // past should contain the current state we passed, not the redo'd entry
      expect(result.current.past).toHaveLength(1);
      expect(result.current.past[0].model.title).toBe('Model 1');
    });

    it('returns null when future is empty', () => {
      const { result } = renderHook(
        () => ({
          api: useHistoryStoreApi()
        }),
        { wrapper }
      );

      let redone: HistoryEntry | null = null;
      act(() => {
        redone = result.current.api.getState().actions.redo(makeEntry(99));
      });

      expect(redone).toBeNull();
    });

    it('undo+redo+undo cycle preserves correct entries', () => {
      const { result } = renderHook(
        () => ({
          api: useHistoryStoreApi(),
          past: useHistoryStore((s) => s.past),
          future: useHistoryStore((s) => s.future)
        }),
        { wrapper }
      );

      // State A is "current", save snapshot and change to B
      act(() => {
        result.current.api.getState().actions.saveSnapshot(makeEntry(1)); // past=[A]
      });

      // Undo: current is B(=2), want to go back to A(=1)
      let undone: HistoryEntry | null = null;
      act(() => {
        undone = result.current.api.getState().actions.undo(makeEntry(2));
      });
      expect(undone!.model.title).toBe('Model 1');
      // past=[], future=[B(2)]

      // Redo: current is A(=1), want to go forward to B(=2)
      let redone: HistoryEntry | null = null;
      act(() => {
        redone = result.current.api.getState().actions.redo(makeEntry(1));
      });
      expect(redone!.model.title).toBe('Model 2');
      // past=[A(1)], future=[]

      // Undo again: current is B(=2), should go back to A(=1)
      act(() => {
        undone = result.current.api.getState().actions.undo(makeEntry(2));
      });
      expect(undone!.model.title).toBe('Model 1');
      // past=[], future=[B(2)]

      expect(result.current.past).toHaveLength(0);
      expect(result.current.future).toHaveLength(1);
      expect(result.current.future[0].model.title).toBe('Model 2');
    });
  });

  describe('gesture lifecycle', () => {
    it('beginGesture saves state and sets flag', () => {
      const { result } = renderHook(
        () => ({
          api: useHistoryStoreApi(),
          gestureInProgress: useHistoryStore((s) => s.gestureInProgress),
          past: useHistoryStore((s) => s.past)
        }),
        { wrapper }
      );

      expect(result.current.gestureInProgress).toBe(false);

      act(() => {
        result.current.api.getState().actions.beginGesture(makeEntry(1));
      });

      expect(result.current.gestureInProgress).toBe(true);
      expect(result.current.past).toHaveLength(1);
    });

    it('endGesture clears flag', () => {
      const { result } = renderHook(
        () => ({
          api: useHistoryStoreApi(),
          gestureInProgress: useHistoryStore((s) => s.gestureInProgress)
        }),
        { wrapper }
      );

      act(() => {
        result.current.api.getState().actions.beginGesture(makeEntry(1));
      });
      act(() => {
        result.current.api.getState().actions.endGesture();
      });

      expect(result.current.gestureInProgress).toBe(false);
    });

    it('cancelGesture pops past entry and clears flag', () => {
      const { result } = renderHook(
        () => ({
          api: useHistoryStoreApi(),
          gestureInProgress: useHistoryStore((s) => s.gestureInProgress),
          past: useHistoryStore((s) => s.past)
        }),
        { wrapper }
      );

      act(() => {
        result.current.api.getState().actions.beginGesture(makeEntry(1));
      });

      expect(result.current.past).toHaveLength(1);

      let cancelled: HistoryEntry | null = null;
      act(() => {
        cancelled = result.current.api.getState().actions.cancelGesture();
      });

      expect(cancelled).not.toBeNull();
      expect(cancelled!.model.title).toBe('Model 1');
      expect(result.current.past).toHaveLength(0);
      expect(result.current.gestureInProgress).toBe(false);
    });

    it('cancelGesture returns null when no gesture in progress', () => {
      const { result } = renderHook(
        () => ({
          api: useHistoryStoreApi()
        }),
        { wrapper }
      );

      let cancelled: HistoryEntry | null = null;
      act(() => {
        cancelled = result.current.api.getState().actions.cancelGesture();
      });

      expect(cancelled).toBeNull();
    });

    it('beginGesture is idempotent when already in gesture', () => {
      const { result } = renderHook(
        () => ({
          api: useHistoryStoreApi(),
          past: useHistoryStore((s) => s.past)
        }),
        { wrapper }
      );

      act(() => {
        result.current.api.getState().actions.beginGesture(makeEntry(1));
      });
      act(() => {
        result.current.api.getState().actions.beginGesture(makeEntry(2));
      });

      // Should only have one entry (second beginGesture was a no-op)
      expect(result.current.past).toHaveLength(1);
      expect(result.current.past[0].model.title).toBe('Model 1');
    });
  });

  describe('clearHistory', () => {
    it('resets past, future, and gestureInProgress', () => {
      const { result } = renderHook(
        () => ({
          api: useHistoryStoreApi(),
          past: useHistoryStore((s) => s.past),
          future: useHistoryStore((s) => s.future),
          gestureInProgress: useHistoryStore((s) => s.gestureInProgress)
        }),
        { wrapper }
      );

      act(() => {
        result.current.api.getState().actions.saveSnapshot(makeEntry(1));
        result.current.api.getState().actions.saveSnapshot(makeEntry(2));
      });

      act(() => {
        result.current.api.getState().actions.clearHistory();
      });

      expect(result.current.past).toHaveLength(0);
      expect(result.current.future).toHaveLength(0);
      expect(result.current.gestureInProgress).toBe(false);
    });
  });
});
