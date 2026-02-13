import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { ModelProvider, useModelStoreApi } from 'src/stores/modelStore';
import { SceneProvider, useSceneStoreApi } from 'src/stores/sceneStore';
import { HistoryProvider, useHistoryStoreApi } from 'src/stores/historyStore';
import { UiStateProvider } from 'src/stores/uiStateStore';
import { useHistory } from 'src/hooks/useHistory';

/**
 * Integration tests using real providers (no mocks).
 * Verifies the unified history system works end-to-end
 * across model, scene, and history stores.
 */

const AllProviders = ({ children }: { children: React.ReactNode }) => (
  <ModelProvider>
    <SceneProvider>
      <HistoryProvider>
        <UiStateProvider>{children}</UiStateProvider>
      </HistoryProvider>
    </SceneProvider>
  </ModelProvider>
);

/** Hook that exposes history + imperative store APIs for testing */
function useTestHarness() {
  const history = useHistory();
  const modelApi = useModelStoreApi();
  const sceneApi = useSceneStoreApi();
  const historyApi = useHistoryStoreApi();
  return { history, modelApi, sceneApi, historyApi };
}

describe('history integration (real providers)', () => {
  const renderTestHook = () =>
    renderHook(() => useTestHarness(), { wrapper: AllProviders });

  describe('saveSnapshot + undo + redo round-trip', () => {
    it('undo restores model state atomically', () => {
      const { result } = renderTestHook();

      // Save initial state as a snapshot
      act(() => {
        result.current.history.saveSnapshot();
      });

      // Mutate model
      act(() => {
        result.current.modelApi.getState().actions.set({ title: 'Changed' });
      });

      // Undo should restore original title
      let success = false;
      act(() => {
        success = result.current.history.undo();
      });

      expect(success).toBe(true);
      expect(result.current.modelApi.getState().title).toBe('Untitled');
    });

    it('undo restores scene state atomically', () => {
      const { result } = renderTestHook();

      act(() => {
        result.current.history.saveSnapshot();
      });

      // Mutate scene
      act(() => {
        result.current.sceneApi.getState().actions.set({
          connectors: {
            'conn-1': {
              path: {
                tiles: [{ x: 0, y: 0 }],
                rectangle: { x: 0, y: 0, width: 1, height: 1 }
              }
            }
          }
        });
      });

      let success = false;
      act(() => {
        success = result.current.history.undo();
      });

      expect(success).toBe(true);
      expect(result.current.sceneApi.getState().connectors).toEqual({});
    });

    it('redo re-applies the undone state', () => {
      const { result } = renderTestHook();

      act(() => {
        result.current.history.saveSnapshot();
      });

      act(() => {
        result.current.modelApi.getState().actions.set({ title: 'V2' });
      });

      act(() => {
        result.current.history.undo();
      });

      expect(result.current.modelApi.getState().title).toBe('Untitled');

      let success = false;
      act(() => {
        success = result.current.history.redo();
      });

      expect(success).toBe(true);
      // Redo restores the state that was current when we undid (the V2 state)
      expect(result.current.modelApi.getState().title).toBe('V2');
    });

    it('undo returns false when history is empty', () => {
      const { result } = renderTestHook();

      let success = true;
      act(() => {
        success = result.current.history.undo();
      });

      expect(success).toBe(false);
    });

    it('redo returns false when future is empty', () => {
      const { result } = renderTestHook();

      let success = true;
      act(() => {
        success = result.current.history.redo();
      });

      expect(success).toBe(false);
    });
  });

  describe('gesture lifecycle produces single history entry', () => {
    it('beginGesture + multiple mutations + endGesture = single undo step', () => {
      const { result } = renderTestHook();

      act(() => {
        result.current.history.beginGesture();
      });

      // Multiple mutations during gesture
      act(() => {
        result.current.modelApi.getState().actions.set({ title: 'Step1' });
      });
      act(() => {
        result.current.modelApi.getState().actions.set({ title: 'Step2' });
      });
      act(() => {
        result.current.modelApi.getState().actions.set({ title: 'Step3' });
      });

      act(() => {
        result.current.history.endGesture();
      });

      // Only 1 history entry (from beginGesture)
      const historyState = result.current.historyApi.getState();
      expect(historyState.past).toHaveLength(1);

      // Undo restores pre-gesture state in one step
      act(() => {
        result.current.history.undo();
      });

      expect(result.current.modelApi.getState().title).toBe('Untitled');
    });

    it('saveSnapshot is blocked during gesture', () => {
      const { result } = renderTestHook();

      act(() => {
        result.current.history.beginGesture();
      });

      // These should be no-ops
      act(() => {
        result.current.history.saveSnapshot();
        result.current.history.saveSnapshot();
        result.current.history.saveSnapshot();
      });

      act(() => {
        result.current.history.endGesture();
      });

      // Only the beginGesture entry
      expect(result.current.historyApi.getState().past).toHaveLength(1);
    });

    it('beginGesture is idempotent when already in gesture', () => {
      const { result } = renderTestHook();

      act(() => {
        result.current.history.beginGesture();
      });

      act(() => {
        result.current.modelApi.getState().actions.set({ title: 'Changed' });
      });

      // Second beginGesture should be ignored
      act(() => {
        result.current.history.beginGesture();
      });

      act(() => {
        result.current.history.endGesture();
      });

      // Only 1 entry
      expect(result.current.historyApi.getState().past).toHaveLength(1);
      // The saved state is from the FIRST beginGesture (pre-mutation)
      expect(result.current.historyApi.getState().past[0].model.title).toBe(
        'Untitled'
      );
    });
  });

  describe('cancelGesture restores pre-gesture state', () => {
    it('restores model state on cancel', () => {
      const { result } = renderTestHook();

      act(() => {
        result.current.history.beginGesture();
      });

      act(() => {
        result.current.modelApi.getState().actions.set({ title: 'During gesture' });
      });

      expect(result.current.modelApi.getState().title).toBe('During gesture');

      act(() => {
        result.current.history.cancelGesture();
      });

      expect(result.current.modelApi.getState().title).toBe('Untitled');
      expect(result.current.historyApi.getState().gestureInProgress).toBe(false);
      expect(result.current.historyApi.getState().past).toHaveLength(0);
    });

    it('restores scene state on cancel', () => {
      const { result } = renderTestHook();

      act(() => {
        result.current.history.beginGesture();
      });

      act(() => {
        result.current.sceneApi.getState().actions.set({
          connectors: {
            'temp-conn': {
              path: {
                tiles: [{ x: 0, y: 0 }],
                rectangle: { x: 0, y: 0, width: 1, height: 1 }
              }
            }
          }
        });
      });

      act(() => {
        result.current.history.cancelGesture();
      });

      expect(result.current.sceneApi.getState().connectors).toEqual({});
    });

    it('cancelGesture is a no-op when no gesture in progress', () => {
      const { result } = renderTestHook();

      // Should not throw
      act(() => {
        result.current.history.cancelGesture();
      });

      expect(result.current.historyApi.getState().past).toHaveLength(0);
    });
  });

  describe('undo + redo restores model+scene atomically', () => {
    it('combined model+scene mutation undoes as one unit', () => {
      const { result } = renderTestHook();

      // Save pre-change snapshot
      act(() => {
        result.current.history.saveSnapshot();
      });

      // Mutate both stores
      act(() => {
        result.current.modelApi.getState().actions.set({ title: 'New Title' });
        result.current.sceneApi.getState().actions.set({
          textBoxes: {
            'tb-1': { size: { width: 100, height: 50 } }
          }
        });
      });

      // Undo should restore both
      act(() => {
        result.current.history.undo();
      });

      expect(result.current.modelApi.getState().title).toBe('Untitled');
      expect(result.current.sceneApi.getState().textBoxes).toEqual({});

      // Redo should bring both back
      act(() => {
        result.current.history.redo();
      });

      expect(result.current.modelApi.getState().title).toBe('New Title');
      expect(result.current.sceneApi.getState().textBoxes).toEqual({
        'tb-1': { size: { width: 100, height: 50 } }
      });
    });
  });

  describe('clearHistory resets everything', () => {
    it('clears past, future, and gestureInProgress', () => {
      const { result } = renderTestHook();

      // Build up some history
      act(() => {
        result.current.history.saveSnapshot();
      });
      act(() => {
        result.current.modelApi.getState().actions.set({ title: 'V2' });
        result.current.history.saveSnapshot();
      });
      act(() => {
        result.current.history.undo();
      });

      // Verify we have past and future
      expect(result.current.historyApi.getState().past.length).toBeGreaterThan(0);
      expect(result.current.historyApi.getState().future.length).toBeGreaterThan(0);

      act(() => {
        result.current.history.clearHistory();
      });

      const state = result.current.historyApi.getState();
      expect(state.past).toHaveLength(0);
      expect(state.future).toHaveLength(0);
      expect(state.gestureInProgress).toBe(false);
    });
  });

  describe('new snapshot clears future (branching)', () => {
    it('saving after undo discards redo stack', () => {
      const { result } = renderTestHook();

      act(() => {
        result.current.history.saveSnapshot();
      });
      act(() => {
        result.current.modelApi.getState().actions.set({ title: 'V2' });
        result.current.history.saveSnapshot();
      });

      // Undo once
      act(() => {
        result.current.history.undo();
      });

      expect(result.current.historyApi.getState().future.length).toBeGreaterThan(0);

      // New action should clear future
      act(() => {
        result.current.modelApi.getState().actions.set({ title: 'V3' });
        result.current.history.saveSnapshot();
      });

      expect(result.current.historyApi.getState().future).toHaveLength(0);
    });
  });

  describe('multiple undo/redo traversals', () => {
    it('can undo and redo through multiple states', () => {
      const { result } = renderTestHook();

      // Create 3 snapshots
      act(() => {
        result.current.history.saveSnapshot(); // saves "Untitled"
        result.current.modelApi.getState().actions.set({ title: 'A' });
      });
      act(() => {
        result.current.history.saveSnapshot(); // saves "A"
        result.current.modelApi.getState().actions.set({ title: 'B' });
      });
      act(() => {
        result.current.history.saveSnapshot(); // saves "B"
        result.current.modelApi.getState().actions.set({ title: 'C' });
      });

      // Current state is "C", past has [Untitled, A, B]
      expect(result.current.modelApi.getState().title).toBe('C');

      // Undo 3 times
      act(() => {
        result.current.history.undo(); // restores "B", pushes "C" to future
      });
      expect(result.current.modelApi.getState().title).toBe('B');

      act(() => {
        result.current.history.undo(); // restores "A", pushes "B" to future
      });
      expect(result.current.modelApi.getState().title).toBe('A');

      act(() => {
        result.current.history.undo(); // restores "Untitled", pushes "A" to future
      });
      expect(result.current.modelApi.getState().title).toBe('Untitled');

      // No more undo
      let success = true;
      act(() => {
        success = result.current.history.undo();
      });
      expect(success).toBe(false);

      // Redo back through
      act(() => {
        result.current.history.redo();
      });
      expect(result.current.modelApi.getState().title).toBe('A');

      act(() => {
        result.current.history.redo();
      });
      expect(result.current.modelApi.getState().title).toBe('B');

      act(() => {
        result.current.history.redo();
      });
      expect(result.current.modelApi.getState().title).toBe('C');

      // No more redo
      success = true;
      act(() => {
        success = result.current.history.redo();
      });
      expect(success).toBe(false);
    });
  });

  describe('gesture + undo interaction', () => {
    it('gesture followed by undo restores pre-gesture state', () => {
      const { result } = renderTestHook();

      // Do a gesture (simulates drag, draw, etc.)
      act(() => {
        result.current.history.beginGesture();
      });
      act(() => {
        result.current.modelApi.getState().actions.set({ title: 'Dragged' });
        result.current.sceneApi.getState().actions.set({
          connectors: {
            'drag-conn': {
              path: {
                tiles: [{ x: 1, y: 1 }, { x: 2, y: 2 }],
                rectangle: { x: 1, y: 1, width: 1, height: 1 }
              }
            }
          }
        });
      });
      act(() => {
        result.current.history.endGesture();
      });

      // Now undo the entire gesture as one step
      act(() => {
        result.current.history.undo();
      });

      expect(result.current.modelApi.getState().title).toBe('Untitled');
      expect(result.current.sceneApi.getState().connectors).toEqual({});
    });
  });
});
