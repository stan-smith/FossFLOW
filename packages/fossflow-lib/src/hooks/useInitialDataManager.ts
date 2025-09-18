import { useCallback, useState, useRef } from 'react';
import { InitialData, IconCollectionState } from 'src/types';
import { INITIAL_DATA, INITIAL_SCENE_STATE } from 'src/config';
import {
  getFitToViewParams,
  CoordsUtils,
  categoriseIcons,
  generateId,
  getItemByIdOrThrow
} from 'src/utils';
import * as reducers from 'src/stores/reducers';
import { useModelStore } from 'src/stores/modelStore';
import { useView } from 'src/hooks/useView';
import { useUiStateStore } from 'src/stores/uiStateStore';
import { modelSchema } from 'src/schemas/model';

export const useInitialDataManager = () => {
  const [isReady, setIsReady] = useState(false);
  const prevInitialData = useRef<InitialData>();
  const model = useModelStore((state) => {
    return state;
  });
  const uiStateActions = useUiStateStore((state) => {
    return state.actions;
  });
  const rendererEl = useUiStateStore((state) => {
    return state.rendererEl;
  });
  const editorMode = useUiStateStore((state) => {
    return state.editorMode;
  });
  const { changeView } = useView();

  const load = useCallback(
    (_initialData: InitialData) => {
      if (!_initialData || prevInitialData.current === _initialData) return;

      // Deep comparison to prevent unnecessary reloads when data hasn't actually changed
      // Skip this check for NON_INTERACTIVE mode (used by export) to ensure proper initialization
      if (prevInitialData.current && editorMode !== 'NON_INTERACTIVE') {
        const prevConnectors = JSON.stringify(prevInitialData.current.views?.[0]?.connectors || []);
        const newConnectors = JSON.stringify(_initialData.views?.[0]?.connectors || []);
        const prevItems = JSON.stringify(prevInitialData.current.items || []);
        const newItems = JSON.stringify(_initialData.items || []);
        
        if (prevConnectors === newConnectors && prevItems === newItems) {
          // Data hasn't actually changed, skip reload
          return;
        }
      }

      setIsReady(false);

      const validationResult = modelSchema.safeParse(_initialData);

      if (!validationResult.success) {
        // TODO: let's get better at reporting error messages here (starting with how we present them to users)
        // - not in console but in a modal
        console.log(validationResult.error.errors);
        window.alert('There is an error in your model.');
        return;
      }

      // Clean up invalid connector references before loading
      const initialData = { ..._initialData };
      initialData.views = initialData.views.map(view => {
        if (!view.connectors) return view;

        const validConnectors = view.connectors.filter(connector => {
          // Check if all anchors reference existing items
          const hasValidAnchors = connector.anchors.every(anchor => {
            if (anchor.ref.item) {
              // Check if the referenced item exists in the view
              return view.items.some(item => item.id === anchor.ref.item);
            }
            return true; // Allow anchors that reference other anchors
          });

          if (!hasValidAnchors) {
            console.warn(`Removing connector ${connector.id} due to invalid item references`);
          }

          return hasValidAnchors;
        });

        return { ...view, connectors: validConnectors };
      });

      if (initialData.views.length === 0) {
        const updates = reducers.view({
          action: 'CREATE_VIEW',
          payload: {},
          ctx: {
            state: { model: initialData, scene: INITIAL_SCENE_STATE },
            viewId: generateId()
          }
        });

        Object.assign(initialData, updates.model);
      }

      prevInitialData.current = initialData;
      model.actions.set(initialData);

      const view = getItemByIdOrThrow(
        initialData.views,
        initialData.view ?? initialData.views[0].id
      );

      changeView(view.value.id, initialData);

      if (initialData.fitToView) {
        const rendererSize = rendererEl?.getBoundingClientRect();

        const { zoom, scroll } = getFitToViewParams(view.value, {
          width: rendererSize?.width ?? 0,
          height: rendererSize?.height ?? 0
        });

        uiStateActions.setScroll({
          position: scroll,
          offset: CoordsUtils.zero()
        });

        uiStateActions.setZoom(zoom);
      }

      const categoriesState: IconCollectionState[] = categoriseIcons(
        initialData.icons
      ).map((collection) => {
        return {
          id: collection.name,
          isExpanded: false
        };
      });

      uiStateActions.setIconCategoriesState(categoriesState);

      setIsReady(true);
    },
    [changeView, model.actions, rendererEl, uiStateActions, editorMode]
  );

  const clear = useCallback(() => {
    load({ ...INITIAL_DATA, icons: model.icons, colors: model.colors });
    uiStateActions.resetUiState();
  }, [load, model.icons, model.colors, uiStateActions]);

  return {
    load,
    clear,
    isReady
  };
};
