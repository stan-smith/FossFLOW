import { useCallback, useRef } from 'react';
import { useModelStore } from 'src/stores/modelStore';
import { useSceneStore } from 'src/stores/sceneStore';

export const useHistory = () => {
  // Track if we're in a transaction to prevent nested history saves
  const transactionInProgress = useRef(false);

  // Get store actions
  const modelActions = useModelStore((state) => {
    return state?.actions;
  });
  const sceneActions = useSceneStore((state) => {
    return state?.actions;
  });

  // Get history state
  const modelCanUndo = useModelStore((state) => {
    return state?.actions?.canUndo?.() ?? false;
  });
  const sceneCanUndo = useSceneStore((state) => {
    return state?.actions?.canUndo?.() ?? false;
  });
  const modelCanRedo = useModelStore((state) => {
    return state?.actions?.canRedo?.() ?? false;
  });
  const sceneCanRedo = useSceneStore((state) => {
    return state?.actions?.canRedo?.() ?? false;
  });

  // Derived values
  const canUndo = modelCanUndo || sceneCanUndo;
  const canRedo = modelCanRedo || sceneCanRedo;

  // Transaction wrapper - groups multiple operations into single history entry
  const transaction = useCallback(
    (operations: () => void) => {
      if (!modelActions || !sceneActions) return;

      // Prevent nested transactions
      if (transactionInProgress.current) {
        operations();
        return;
      }

      // Save current state before transaction
      modelActions.saveToHistory();
      sceneActions.saveToHistory();

      // Mark transaction as in progress
      transactionInProgress.current = true;

      try {
        // Execute all operations without saving intermediate history
        operations();
      } finally {
        // Always reset transaction state
        transactionInProgress.current = false;
      }

      // Note: We don't save after transaction - the final state is already current
    },
    [modelActions, sceneActions]
  );

  const undo = useCallback(() => {
    if (!modelActions || !sceneActions) return false;

    let undoPerformed = false;

    // Try to undo model first, then scene
    if (modelActions.canUndo()) {
      undoPerformed = modelActions.undo() || undoPerformed;
    }
    if (sceneActions.canUndo()) {
      undoPerformed = sceneActions.undo() || undoPerformed;
    }

    return undoPerformed;
  }, [modelActions, sceneActions]);

  const redo = useCallback(() => {
    if (!modelActions || !sceneActions) return false;

    let redoPerformed = false;

    // Try to redo model first, then scene
    if (modelActions.canRedo()) {
      redoPerformed = modelActions.redo() || redoPerformed;
    }
    if (sceneActions.canRedo()) {
      redoPerformed = sceneActions.redo() || redoPerformed;
    }

    return redoPerformed;
  }, [modelActions, sceneActions]);

  const saveToHistory = useCallback(() => {
    // Don't save during transactions
    if (transactionInProgress.current) {
      return;
    }

    if (!modelActions || !sceneActions) return;

    modelActions.saveToHistory();
    sceneActions.saveToHistory();
  }, [modelActions, sceneActions]);

  const clearHistory = useCallback(() => {
    if (!modelActions || !sceneActions) return;

    modelActions.clearHistory();
    sceneActions.clearHistory();
  }, [modelActions, sceneActions]);

  return {
    undo,
    redo,
    canUndo,
    canRedo,
    saveToHistory,
    clearHistory,
    transaction,
    isInTransaction: () => {
      return transactionInProgress.current;
    }
  };
};
