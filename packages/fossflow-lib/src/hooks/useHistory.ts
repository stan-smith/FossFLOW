import { useCallback } from 'react';
import { useModelStoreApi } from 'src/stores/modelStore';
import { useSceneStoreApi } from 'src/stores/sceneStore';
import {
  useHistoryStore,
  useHistoryStoreApi,
  extractModelData,
  extractSceneData
} from 'src/stores/historyStore';
import type { HistoryEntry } from 'src/stores/historyStore';

export const useHistory = () => {
  const modelStoreApi = useModelStoreApi();
  const sceneStoreApi = useSceneStoreApi();
  const historyStoreApi = useHistoryStoreApi();

  const canUndo = useHistoryStore((s) => s.past.length > 0);
  const canRedo = useHistoryStore((s) => s.future.length > 0);

  const getCurrentEntry = useCallback((): HistoryEntry => {
    const model = modelStoreApi.getState();
    const scene = sceneStoreApi.getState();
    return {
      model: extractModelData(model),
      scene: extractSceneData(scene)
    };
  }, [modelStoreApi, sceneStoreApi]);

  const applyEntry = useCallback(
    (entry: HistoryEntry) => {
      modelStoreApi.getState().actions.set(entry.model);
      sceneStoreApi.getState().actions.set(entry.scene);
    },
    [modelStoreApi, sceneStoreApi]
  );

  const saveSnapshot = useCallback(() => {
    historyStoreApi.getState().actions.saveSnapshot(getCurrentEntry());
  }, [historyStoreApi, getCurrentEntry]);

  const undo = useCallback(() => {
    const entry = historyStoreApi.getState().actions.undo(getCurrentEntry());
    if (entry) {
      applyEntry(entry);
      return true;
    }
    return false;
  }, [historyStoreApi, getCurrentEntry, applyEntry]);

  const redo = useCallback(() => {
    const entry = historyStoreApi.getState().actions.redo(getCurrentEntry());
    if (entry) {
      applyEntry(entry);
      return true;
    }
    return false;
  }, [historyStoreApi, getCurrentEntry, applyEntry]);

  const clearHistory = useCallback(() => {
    historyStoreApi.getState().actions.clearHistory();
  }, [historyStoreApi]);

  const beginGesture = useCallback(() => {
    historyStoreApi.getState().actions.beginGesture(getCurrentEntry());
  }, [historyStoreApi, getCurrentEntry]);

  const endGesture = useCallback(() => {
    historyStoreApi.getState().actions.endGesture();
  }, [historyStoreApi]);

  const cancelGesture = useCallback(() => {
    const entry = historyStoreApi.getState().actions.cancelGesture();
    if (entry) {
      applyEntry(entry);
    }
  }, [historyStoreApi, applyEntry]);

  const isGestureInProgress = useCallback(() => {
    return historyStoreApi.getState().gestureInProgress;
  }, [historyStoreApi]);

  return {
    undo,
    redo,
    canUndo,
    canRedo,
    saveSnapshot,
    clearHistory,
    beginGesture,
    endGesture,
    cancelGesture,
    isGestureInProgress
  };
};
