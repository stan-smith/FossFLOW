import { useCallback, useMemo, useRef } from 'react';
import {
  ModelItem,
  ViewItem,
  Connector,
  TextBox,
  Rectangle
} from 'src/types';
import { useUiStateStore } from 'src/stores/uiStateStore';
import { useModelStore } from 'src/stores/modelStore';
import { useSceneStore } from 'src/stores/sceneStore';
import * as reducers from 'src/stores/reducers';
import type { State } from 'src/stores/reducers/types';
import { getItemByIdOrThrow } from 'src/utils';
import {
  CONNECTOR_DEFAULTS,
  RECTANGLE_DEFAULTS,
  TEXTBOX_DEFAULTS
} from 'src/config';

export const useScene = () => {
  const model = useModelStore((state) => {
    return state;
  });
  const scene = useSceneStore((state) => {
    return state;
  });
  const currentViewId = useUiStateStore((state) => {
    return state.view;
  });
  const transactionInProgress = useRef(false);

  const currentView = useMemo(() => {
    // Handle case where view doesn't exist yet or stores aren't initialized
    if (!model?.views || !currentViewId) {
      return {
        id: '',
        name: 'Default View',
        items: [],
        connectors: [],
        rectangles: [],
        textBoxes: []
      };
    }

    try {
      return getItemByIdOrThrow(model.views, currentViewId).value;
    } catch (error) {
      // console.warn(`View "${currentViewId}" not found, using fallback`);
      // Return first available view or empty view
      return (
        model.views[0] || {
          id: currentViewId,
          name: 'Default View',
          items: [],
          connectors: [],
          rectangles: [],
          textBoxes: []
        }
      );
    }
  }, [currentViewId, model?.views]);

  const items = useMemo(() => {
    return currentView.items ?? [];
  }, [currentView.items]);

  const colors = useMemo(() => {
    return model?.colors ?? [];
  }, [model?.colors]);

  const connectors = useMemo(() => {
    return (currentView.connectors ?? []).map((connector) => {
      const sceneConnector = scene?.connectors?.[connector.id];

      return {
        ...CONNECTOR_DEFAULTS,
        ...connector,
        ...sceneConnector
      };
    });
  }, [currentView.connectors, scene?.connectors]);

  const rectangles = useMemo(() => {
    return (currentView.rectangles ?? []).map((rectangle) => {
      return {
        ...RECTANGLE_DEFAULTS,
        ...rectangle
      };
    });
  }, [currentView.rectangles]);

  const textBoxes = useMemo(() => {
    return (currentView.textBoxes ?? []).map((textBox) => {
      const sceneTextBox = scene?.textBoxes?.[textBox.id];

      return {
        ...TEXTBOX_DEFAULTS,
        ...textBox,
        ...sceneTextBox
      };
    });
  }, [currentView.textBoxes, scene?.textBoxes]);

  const getState = useCallback(() => {
    return {
      model: {
        version: model?.version ?? '',
        title: model?.title ?? '',
        description: model?.description,
        colors: model?.colors ?? [],
        icons: model?.icons ?? [],
        items: model?.items ?? [],
        views: model?.views ?? []
      },
      scene: {
        connectors: scene?.connectors ?? {},
        textBoxes: scene?.textBoxes ?? {}
      }
    };
  }, [model, scene]);

  const setState = useCallback(
    (newState: State) => {
      if (model?.actions?.set && scene?.actions?.set) {
        model.actions.set(newState.model, true); // Skip history since we're managing it here
        scene.actions.set(newState.scene, true); // Skip history since we're managing it here
      }
    },
    [model?.actions, scene?.actions]
  );

  const saveToHistoryBeforeChange = useCallback(() => {
    // Prevent multiple saves during grouped operations
    if (transactionInProgress.current) {
      return;
    }

    model?.actions?.saveToHistory?.();
    scene?.actions?.saveToHistory?.();
  }, [model?.actions, scene?.actions]);

  const createModelItem = useCallback(
    (newModelItem: ModelItem) => {
      if (!model?.actions || !scene?.actions) return getState();

      if (!transactionInProgress.current) {
        saveToHistoryBeforeChange();
      }

      const newState = reducers.createModelItem(newModelItem, getState());
      setState(newState);
      return newState; // Return the new state for chaining
    },
    [
      getState,
      setState,
      saveToHistoryBeforeChange,
      model?.actions,
      scene?.actions
    ]
  );

  const updateModelItem = useCallback(
    (id: string, updates: Partial<ModelItem>) => {
      if (!model?.actions || !scene?.actions) return;

      saveToHistoryBeforeChange();
      const newState = reducers.updateModelItem(id, updates, getState());
      setState(newState);
    },
    [
      getState,
      setState,
      saveToHistoryBeforeChange,
      model?.actions,
      scene?.actions
    ]
  );

  const deleteModelItem = useCallback(
    (id: string) => {
      if (!model?.actions || !scene?.actions) return;

      saveToHistoryBeforeChange();
      const newState = reducers.deleteModelItem(id, getState());
      setState(newState);
    },
    [
      getState,
      setState,
      saveToHistoryBeforeChange,
      model?.actions,
      scene?.actions
    ]
  );

  const createViewItem = useCallback(
    (newViewItem: ViewItem, currentState?: State) => {
      if (!model?.actions || !scene?.actions || !currentViewId) return;

      if (!transactionInProgress.current) {
        saveToHistoryBeforeChange();
      }

      // Use provided state or get current state
      const stateToUse = currentState || getState();

      const newState = reducers.view({
        action: 'CREATE_VIEWITEM',
        payload: newViewItem,
        ctx: { viewId: currentViewId, state: stateToUse }
      });
      setState(newState);
      return newState;
    },
    [
      getState,
      setState,
      currentViewId,
      saveToHistoryBeforeChange,
      model?.actions,
      scene?.actions
    ]
  );

  const updateViewItem = useCallback(
    (id: string, updates: Partial<ViewItem>) => {
      if (!model?.actions || !scene?.actions || !currentViewId) return;

      saveToHistoryBeforeChange();
      const newState = reducers.view({
        action: 'UPDATE_VIEWITEM',
        payload: { id, ...updates },
        ctx: { viewId: currentViewId, state: getState() }
      });
      setState(newState);
    },
    [
      getState,
      setState,
      currentViewId,
      saveToHistoryBeforeChange,
      model?.actions,
      scene?.actions
    ]
  );

  const deleteViewItem = useCallback(
    (id: string) => {
      if (!model?.actions || !scene?.actions || !currentViewId) return;

      saveToHistoryBeforeChange();
      const newState = reducers.view({
        action: 'DELETE_VIEWITEM',
        payload: id,
        ctx: { viewId: currentViewId, state: getState() }
      });
      setState(newState);
    },
    [
      getState,
      setState,
      currentViewId,
      saveToHistoryBeforeChange,
      model?.actions,
      scene?.actions
    ]
  );

  const createConnector = useCallback(
    (newConnector: Connector) => {
      if (!model?.actions || !scene?.actions || !currentViewId) return;

      saveToHistoryBeforeChange();
      const newState = reducers.view({
        action: 'CREATE_CONNECTOR',
        payload: newConnector,
        ctx: { viewId: currentViewId, state: getState() }
      });
      setState(newState);
    },
    [
      getState,
      setState,
      currentViewId,
      saveToHistoryBeforeChange,
      model?.actions,
      scene?.actions
    ]
  );

  const updateConnector = useCallback(
    (id: string, updates: Partial<Connector>) => {
      if (!model?.actions || !scene?.actions || !currentViewId) return;

      saveToHistoryBeforeChange();
      const newState = reducers.view({
        action: 'UPDATE_CONNECTOR',
        payload: { id, ...updates },
        ctx: { viewId: currentViewId, state: getState() }
      });
      setState(newState);
    },
    [
      getState,
      setState,
      currentViewId,
      saveToHistoryBeforeChange,
      model?.actions,
      scene?.actions
    ]
  );

  const deleteConnector = useCallback(
    (id: string) => {
      if (!model?.actions || !scene?.actions || !currentViewId) return;

      saveToHistoryBeforeChange();
      const newState = reducers.view({
        action: 'DELETE_CONNECTOR',
        payload: id,
        ctx: { viewId: currentViewId, state: getState() }
      });
      setState(newState);
    },
    [
      getState,
      setState,
      currentViewId,
      saveToHistoryBeforeChange,
      model?.actions,
      scene?.actions
    ]
  );

  const createTextBox = useCallback(
    (newTextBox: TextBox) => {
      if (!model?.actions || !scene?.actions || !currentViewId) return;

      saveToHistoryBeforeChange();
      const newState = reducers.view({
        action: 'CREATE_TEXTBOX',
        payload: newTextBox,
        ctx: { viewId: currentViewId, state: getState() }
      });
      setState(newState);
    },
    [
      getState,
      setState,
      currentViewId,
      saveToHistoryBeforeChange,
      model?.actions,
      scene?.actions
    ]
  );

  const updateTextBox = useCallback(
    (id: string, updates: Partial<TextBox>) => {
      if (!model?.actions || !scene?.actions || !currentViewId) return;

      saveToHistoryBeforeChange();
      const newState = reducers.view({
        action: 'UPDATE_TEXTBOX',
        payload: { id, ...updates },
        ctx: { viewId: currentViewId, state: getState() }
      });
      setState(newState);
    },
    [
      getState,
      setState,
      currentViewId,
      saveToHistoryBeforeChange,
      model?.actions,
      scene?.actions
    ]
  );

  const deleteTextBox = useCallback(
    (id: string) => {
      if (!model?.actions || !scene?.actions || !currentViewId) return;

      saveToHistoryBeforeChange();
      const newState = reducers.view({
        action: 'DELETE_TEXTBOX',
        payload: id,
        ctx: { viewId: currentViewId, state: getState() }
      });
      setState(newState);
    },
    [
      getState,
      setState,
      currentViewId,
      saveToHistoryBeforeChange,
      model?.actions,
      scene?.actions
    ]
  );

  const createRectangle = useCallback(
    (newRectangle: Rectangle) => {
      if (!model?.actions || !scene?.actions || !currentViewId) return;

      saveToHistoryBeforeChange();
      const newState = reducers.view({
        action: 'CREATE_RECTANGLE',
        payload: newRectangle,
        ctx: { viewId: currentViewId, state: getState() }
      });
      setState(newState);
    },
    [
      getState,
      setState,
      currentViewId,
      saveToHistoryBeforeChange,
      model?.actions,
      scene?.actions
    ]
  );

  const updateRectangle = useCallback(
    (id: string, updates: Partial<Rectangle>) => {
      if (!model?.actions || !scene?.actions || !currentViewId) return;

      saveToHistoryBeforeChange();
      const newState = reducers.view({
        action: 'UPDATE_RECTANGLE',
        payload: { id, ...updates },
        ctx: { viewId: currentViewId, state: getState() }
      });
      setState(newState);
    },
    [
      getState,
      setState,
      currentViewId,
      saveToHistoryBeforeChange,
      model?.actions,
      scene?.actions
    ]
  );

  const deleteRectangle = useCallback(
    (id: string) => {
      if (!model?.actions || !scene?.actions || !currentViewId) return;

      saveToHistoryBeforeChange();
      const newState = reducers.view({
        action: 'DELETE_RECTANGLE',
        payload: id,
        ctx: { viewId: currentViewId, state: getState() }
      });
      setState(newState);
    },
    [
      getState,
      setState,
      currentViewId,
      saveToHistoryBeforeChange,
      model?.actions,
      scene?.actions
    ]
  );

  const transaction = useCallback(
    (operations: () => void) => {
      if (!model?.actions || !scene?.actions) return;

      // Prevent nested transactions
      if (transactionInProgress.current) {
        operations();
        return;
      }

      // Save state before transaction
      saveToHistoryBeforeChange();

      // Mark transaction as in progress
      transactionInProgress.current = true;

      try {
        // Execute all operations without saving intermediate history
        operations();
      } finally {
        // Always reset transaction state
        transactionInProgress.current = false;
      }
    },
    [saveToHistoryBeforeChange, model?.actions, scene?.actions]
  );

  const placeIcon = useCallback(
    (params: { modelItem: ModelItem; viewItem: ViewItem }) => {
      if (!model?.actions || !scene?.actions) return;

      // Save history before the transaction
      saveToHistoryBeforeChange();

      // Mark transaction as in progress
      transactionInProgress.current = true;

      try {
        // Create model item first and get the updated state
        const stateAfterModelItem = createModelItem(params.modelItem);

        // Create view item using the updated state
        if (stateAfterModelItem) {
          createViewItem(params.viewItem, stateAfterModelItem);
        }
      } finally {
        // Always reset transaction state
        transactionInProgress.current = false;
      }
    },
    [
      createModelItem,
      createViewItem,
      saveToHistoryBeforeChange,
      model?.actions,
      scene?.actions
    ]
  );

  return {
    items,
    connectors,
    colors,
    rectangles,
    textBoxes,
    currentView,
    createModelItem,
    updateModelItem,
    deleteModelItem,
    createViewItem,
    updateViewItem,
    deleteViewItem,
    createConnector,
    updateConnector,
    deleteConnector,
    createTextBox,
    updateTextBox,
    deleteTextBox,
    createRectangle,
    updateRectangle,
    deleteRectangle,
    transaction,
    placeIcon
  };
};
