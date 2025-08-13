import { useCallback } from 'react';
import { useUiStateStore } from 'src/stores/uiStateStore';
import { Size, Coords } from 'src/types';
import {
  getUnprojectedBounds as getUnprojectedBoundsUtil,
  getFitToViewParams as getFitToViewParamsUtil,
  CoordsUtils
} from 'src/utils';
import { useScene } from 'src/hooks/useScene';
import { useResizeObserver } from './useResizeObserver';

export const useDiagramUtils = () => {
  const scene = useScene();
  const rendererEl = useUiStateStore((state) => {
    return state.rendererEl;
  });
  const { size: rendererSize } = useResizeObserver(rendererEl);
  const uiStateActions = useUiStateStore((state) => {
    return state.actions;
  });

  const getUnprojectedBounds = useCallback((): Size & Coords => {
    return getUnprojectedBoundsUtil(scene.currentView);
  }, [scene.currentView]);

  const getFitToViewParams = useCallback(
    (viewportSize: Size) => {
      return getFitToViewParamsUtil(scene.currentView, viewportSize);
    },
    [scene.currentView]
  );

  const fitToView = useCallback(async () => {
    const { zoom, scroll } = getFitToViewParams(rendererSize);

    uiStateActions.setScroll({
      position: scroll,
      offset: CoordsUtils.zero()
    });
    uiStateActions.setZoom(zoom);
  }, [uiStateActions, getFitToViewParams, rendererSize]);

  return {
    getUnprojectedBounds,
    fitToView,
    getFitToViewParams
  };
};
