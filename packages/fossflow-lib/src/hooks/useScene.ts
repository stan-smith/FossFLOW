import { useCallback, useMemo } from 'react';
import { shallow } from 'zustand/shallow';
import {
  ModelItem,
  ViewItem,
  Connector,
  TextBox,
  Rectangle
} from 'src/types';
import { useUiStateStore } from 'src/stores/uiStateStore';
import { useModelStore, useModelStoreApi } from 'src/stores/modelStore';
import { useSceneStore, useSceneStoreApi } from 'src/stores/sceneStore';
import * as reducers from 'src/stores/reducers';
import type { State } from 'src/stores/reducers/types';
import { getItemByIdOrThrow } from 'src/utils';
import {
  CONNECTOR_DEFAULTS,
  RECTANGLE_DEFAULTS,
  TEXTBOX_DEFAULTS
} from 'src/config';
import { useHistory } from 'src/hooks/useHistory';

export const useScene = () => {
  const { views, colors, icons, items, version, title, description } =
    useModelStore(
      (state) => ({
        views: state.views,
        colors: state.colors,
        icons: state.icons,
        items: state.items,
        version: state.version,
        title: state.title,
        description: state.description
      }),
      shallow
    );
  const { connectors: sceneConnectors, textBoxes: sceneTextBoxes } =
    useSceneStore(
      (state) => ({
        connectors: state.connectors,
        textBoxes: state.textBoxes
      }),
      shallow
    );
  const currentViewId = useUiStateStore((state) => state.view);

  const modelStoreApi = useModelStoreApi();
  const sceneStoreApi = useSceneStoreApi();
  const { saveSnapshot, beginGesture, endGesture } = useHistory();

  const currentView = useMemo(() => {
    if (!views || !currentViewId) {
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
      return getItemByIdOrThrow(views, currentViewId).value;
    } catch (error) {
      return (
        views[0] || {
          id: currentViewId,
          name: 'Default View',
          items: [],
          connectors: [],
          rectangles: [],
          textBoxes: []
        }
      );
    }
  }, [currentViewId, views]);

  const itemsList = useMemo(() => {
    return currentView.items ?? [];
  }, [currentView.items]);

  const colorsList = useMemo(() => {
    return colors ?? [];
  }, [colors]);

  const connectorsList = useMemo(() => {
    return (currentView.connectors ?? []).map((connector) => {
      const sceneConnector = sceneConnectors?.[connector.id];

      return {
        ...CONNECTOR_DEFAULTS,
        ...connector,
        ...sceneConnector
      };
    });
  }, [currentView.connectors, sceneConnectors]);

  const rectanglesList = useMemo(() => {
    return (currentView.rectangles ?? []).map((rectangle) => {
      return {
        ...RECTANGLE_DEFAULTS,
        ...rectangle
      };
    });
  }, [currentView.rectangles]);

  const textBoxesList = useMemo(() => {
    return (currentView.textBoxes ?? []).map((textBox) => {
      const sceneTextBox = sceneTextBoxes?.[textBox.id];

      return {
        ...TEXTBOX_DEFAULTS,
        ...textBox,
        ...sceneTextBox
      };
    });
  }, [currentView.textBoxes, sceneTextBoxes]);

  const getState = useCallback((): State => {
    const model = modelStoreApi.getState();
    const scene = sceneStoreApi.getState();
    return {
      model: {
        version: model.version,
        title: model.title,
        description: model.description,
        colors: model.colors,
        icons: model.icons,
        items: model.items,
        views: model.views
      },
      scene: {
        connectors: scene.connectors,
        textBoxes: scene.textBoxes
      }
    };
  }, [modelStoreApi, sceneStoreApi]);

  const setState = useCallback(
    (newState: State) => {
      modelStoreApi.getState().actions.set(newState.model);
      sceneStoreApi.getState().actions.set(newState.scene);
    },
    [modelStoreApi, sceneStoreApi]
  );

  const createModelItem = useCallback(
    (newModelItem: ModelItem) => {
      saveSnapshot();
      const newState = reducers.createModelItem(newModelItem, getState());
      setState(newState);
      return newState;
    },
    [getState, setState, saveSnapshot]
  );

  const updateModelItem = useCallback(
    (id: string, updates: Partial<ModelItem>) => {
      saveSnapshot();
      const newState = reducers.updateModelItem(id, updates, getState());
      setState(newState);
    },
    [getState, setState, saveSnapshot]
  );

  const deleteModelItem = useCallback(
    (id: string) => {
      saveSnapshot();
      const newState = reducers.deleteModelItem(id, getState());
      setState(newState);
    },
    [getState, setState, saveSnapshot]
  );

  const createViewItem = useCallback(
    (newViewItem: ViewItem, currentState?: State) => {
      if (!currentViewId) return;

      saveSnapshot();

      const stateToUse = currentState || getState();

      const newState = reducers.view({
        action: 'CREATE_VIEWITEM',
        payload: newViewItem,
        ctx: { viewId: currentViewId, state: stateToUse }
      });
      setState(newState);
      return newState;
    },
    [getState, setState, currentViewId, saveSnapshot]
  );

  const updateViewItem = useCallback(
    (id: string, updates: Partial<ViewItem>, currentState?: State) => {
      if (!currentViewId) return getState();

      saveSnapshot();

      const stateToUse = currentState || getState();
      const newState = reducers.view({
        action: 'UPDATE_VIEWITEM',
        payload: { id, ...updates },
        ctx: { viewId: currentViewId, state: stateToUse }
      });
      setState(newState);
      return newState;
    },
    [getState, setState, currentViewId, saveSnapshot]
  );

  const deleteViewItem = useCallback(
    (id: string) => {
      if (!currentViewId) return;

      saveSnapshot();
      const newState = reducers.view({
        action: 'DELETE_VIEWITEM',
        payload: id,
        ctx: { viewId: currentViewId, state: getState() }
      });
      setState(newState);
    },
    [getState, setState, currentViewId, saveSnapshot]
  );

  const createConnector = useCallback(
    (newConnector: Connector) => {
      if (!currentViewId) return;

      saveSnapshot();
      const newState = reducers.view({
        action: 'CREATE_CONNECTOR',
        payload: newConnector,
        ctx: { viewId: currentViewId, state: getState() }
      });
      setState(newState);
    },
    [getState, setState, currentViewId, saveSnapshot]
  );

  const updateConnector = useCallback(
    (id: string, updates: Partial<Connector>) => {
      if (!currentViewId) return;

      saveSnapshot();
      const newState = reducers.view({
        action: 'UPDATE_CONNECTOR',
        payload: { id, ...updates },
        ctx: { viewId: currentViewId, state: getState() }
      });
      setState(newState);
    },
    [getState, setState, currentViewId, saveSnapshot]
  );

  const deleteConnector = useCallback(
    (id: string) => {
      if (!currentViewId) return;

      saveSnapshot();
      const newState = reducers.view({
        action: 'DELETE_CONNECTOR',
        payload: id,
        ctx: { viewId: currentViewId, state: getState() }
      });
      setState(newState);
    },
    [getState, setState, currentViewId, saveSnapshot]
  );

  const createTextBox = useCallback(
    (newTextBox: TextBox) => {
      if (!currentViewId) return;

      saveSnapshot();
      const newState = reducers.view({
        action: 'CREATE_TEXTBOX',
        payload: newTextBox,
        ctx: { viewId: currentViewId, state: getState() }
      });
      setState(newState);
    },
    [getState, setState, currentViewId, saveSnapshot]
  );

  const updateTextBox = useCallback(
    (id: string, updates: Partial<TextBox>, currentState?: State) => {
      if (!currentViewId) return currentState || getState();

      saveSnapshot();

      const stateToUse = currentState || getState();
      const newState = reducers.view({
        action: 'UPDATE_TEXTBOX',
        payload: { id, ...updates },
        ctx: { viewId: currentViewId, state: stateToUse }
      });
      setState(newState);
      return newState;
    },
    [getState, setState, currentViewId, saveSnapshot]
  );

  const deleteTextBox = useCallback(
    (id: string) => {
      if (!currentViewId) return;

      saveSnapshot();
      const newState = reducers.view({
        action: 'DELETE_TEXTBOX',
        payload: id,
        ctx: { viewId: currentViewId, state: getState() }
      });
      setState(newState);
    },
    [getState, setState, currentViewId, saveSnapshot]
  );

  const createRectangle = useCallback(
    (newRectangle: Rectangle) => {
      if (!currentViewId) return;

      saveSnapshot();
      const newState = reducers.view({
        action: 'CREATE_RECTANGLE',
        payload: newRectangle,
        ctx: { viewId: currentViewId, state: getState() }
      });
      setState(newState);
    },
    [getState, setState, currentViewId, saveSnapshot]
  );

  const updateRectangle = useCallback(
    (id: string, updates: Partial<Rectangle>, currentState?: State) => {
      if (!currentViewId) return currentState || getState();

      saveSnapshot();

      const stateToUse = currentState || getState();
      const newState = reducers.view({
        action: 'UPDATE_RECTANGLE',
        payload: { id, ...updates },
        ctx: { viewId: currentViewId, state: stateToUse }
      });
      setState(newState);
      return newState;
    },
    [getState, setState, currentViewId, saveSnapshot]
  );

  const deleteRectangle = useCallback(
    (id: string) => {
      if (!currentViewId) return;

      saveSnapshot();
      const newState = reducers.view({
        action: 'DELETE_RECTANGLE',
        payload: id,
        ctx: { viewId: currentViewId, state: getState() }
      });
      setState(newState);
    },
    [getState, setState, currentViewId, saveSnapshot]
  );

  const transaction = useCallback(
    (operations: () => void) => {
      beginGesture();
      try {
        operations();
      } finally {
        endGesture();
      }
    },
    [beginGesture, endGesture]
  );

  const placeIcon = useCallback(
    (params: { modelItem: ModelItem; viewItem: ViewItem }) => {
      beginGesture();

      try {
        const stateAfterModelItem = createModelItem(params.modelItem);

        if (stateAfterModelItem) {
          createViewItem(params.viewItem, stateAfterModelItem);
        }
      } finally {
        endGesture();
      }
    },
    [createModelItem, createViewItem, beginGesture, endGesture]
  );

  return {
    items: itemsList,
    connectors: connectorsList,
    colors: colorsList,
    rectangles: rectanglesList,
    textBoxes: textBoxesList,
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
