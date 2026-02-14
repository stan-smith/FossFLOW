import { useCallback, useEffect, useRef } from 'react';
import { useModelStoreApi } from 'src/stores/modelStore';
import { useUiStateStore, useUiStateStoreApi } from 'src/stores/uiStateStore';
import { ModeActions, State, SlimMouseEvent, Mouse } from 'src/types';
import { DialogTypeEnum } from 'src/types/ui';
import { getMouse, getItemAtTile, generateId, incrementZoom, decrementZoom } from 'src/utils';
import { useResizeObserver } from 'src/hooks/useResizeObserver';
import { useScene } from 'src/hooks/useScene';
import { useHistory } from 'src/hooks/useHistory';
import { HOTKEY_PROFILES } from 'src/config/hotkeys';
import { TEXTBOX_DEFAULTS } from 'src/config';
import { Cursor } from './modes/Cursor';
import { DragItems } from './modes/DragItems';
import { DrawRectangle } from './modes/Rectangle/DrawRectangle';
import { TransformRectangle } from './modes/Rectangle/TransformRectangle';
import { Connector } from './modes/Connector';
import { Pan } from './modes/Pan';
import { PlaceIcon } from './modes/PlaceIcon';
import { TextBox } from './modes/TextBox';
import { Lasso } from './modes/Lasso';
import { FreehandLasso } from './modes/FreehandLasso';
import { usePanHandlers } from './usePanHandlers';

interface PendingMouseUpdate {
  mouse: Mouse;
  event: SlimMouseEvent;
}

const useRAFThrottle = () => {
  const rafIdRef = useRef<number | null>(null);
  const pendingUpdateRef = useRef<PendingMouseUpdate | null>(null);
  const callbackRef = useRef<((update: PendingMouseUpdate) => void) | null>(null);

  const scheduleUpdate = useCallback((mouse: Mouse, event: SlimMouseEvent, callback: (update: PendingMouseUpdate) => void) => {
    pendingUpdateRef.current = { mouse, event };
    callbackRef.current = callback;

    if (rafIdRef.current === null) {
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        if (pendingUpdateRef.current && callbackRef.current) {
          callbackRef.current(pendingUpdateRef.current);
          pendingUpdateRef.current = null;
        }
      });
    }
  }, []);

  const flushUpdate = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    if (pendingUpdateRef.current && callbackRef.current) {
      callbackRef.current(pendingUpdateRef.current);
      pendingUpdateRef.current = null;
    }
  }, []);

  const cleanup = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    pendingUpdateRef.current = null;
  }, []);

  return { scheduleUpdate, flushUpdate, cleanup };
};

const modes: { [k in string]: ModeActions } = {
  CURSOR: Cursor,
  DRAG_ITEMS: DragItems,
  'RECTANGLE.DRAW': DrawRectangle,
  'RECTANGLE.TRANSFORM': TransformRectangle,
  CONNECTOR: Connector,
  PAN: Pan,
  PLACE_ICON: PlaceIcon,
  TEXTBOX: TextBox,
  LASSO: Lasso,
  FREEHAND_LASSO: FreehandLasso
};

const getModeFunction = (mode: ModeActions, e: SlimMouseEvent) => {
  switch (e.type) {
    case 'mousemove':
      return mode.mousemove;
    case 'mousedown':
      return mode.mousedown;
    case 'mouseup':
      return mode.mouseup;
    default:
      return null;
  }
};

export const useInteractionManager = () => {
  const rendererRef = useRef<HTMLElement | undefined>(undefined);
  const reducerTypeRef = useRef<string | undefined>(undefined);

  const modeType = useUiStateStore((state) => state.mode.type);
  const rendererEl = useUiStateStore((state) => state.rendererEl);
  const editorMode = useUiStateStore((state) => state.editorMode);

  const uiStateApi = useUiStateStoreApi();
  const modelStoreApi = useModelStoreApi();
  const scene = useScene();
  const { size: rendererSize } = useResizeObserver(rendererEl);
  const { undo, redo, canUndo, canRedo } = useHistory();
  const { createTextBox } = scene;
  const { handleMouseDown: handlePanMouseDown, handleMouseUp: handlePanMouseUp } = usePanHandlers();
  const { scheduleUpdate, flushUpdate, cleanup } = useRAFThrottle();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const uiState = uiStateApi.getState();

      if (e.key === 'Escape') {
        e.preventDefault();

        if (uiState.itemControls) {
          uiState.actions.setItemControls(null);
          return;
        }

        if (uiState.mode.type === 'CONNECTOR') {
          const connectorMode = uiState.mode;

          const isConnectionInProgress =
            (uiState.connectorInteractionMode === 'click' && connectorMode.isConnecting) ||
            (uiState.connectorInteractionMode === 'drag' && connectorMode.id !== null);

          if (isConnectionInProgress && connectorMode.id) {
            scene.deleteConnector(connectorMode.id);

            uiState.actions.setMode({
              type: 'CONNECTOR',
              showCursor: true,
              id: null,
              startAnchor: undefined,
              isConnecting: false
            });
          }
        }

        return;
      }

      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true' ||
        target.closest('.ql-editor')
      ) {
        return;
      }

      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      if (isCtrlOrCmd && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) {
          undo();
        }
      }

      if (
        isCtrlOrCmd &&
        (e.key.toLowerCase() === 'y' ||
          (e.key.toLowerCase() === 'z' && e.shiftKey))
      ) {
        e.preventDefault();
        if (canRedo) {
          redo();
        }
      }

      if (e.key === 'F1') {
        e.preventDefault();
        uiState.actions.setDialog(DialogTypeEnum.HELP);
      }

      const hotkeyMapping = HOTKEY_PROFILES[uiState.hotkeyProfile];
      const key = e.key.toLowerCase();

      if (key === 'i' && uiState.itemControls && 'id' in uiState.itemControls && uiState.itemControls.type === 'ITEM') {
        e.preventDefault();
        const event = new CustomEvent('quickIconChange');
        window.dispatchEvent(event);
      }

      if (hotkeyMapping.select && key === hotkeyMapping.select) {
        e.preventDefault();
        uiState.actions.setMode({
          type: 'CURSOR',
          showCursor: true,
          mousedownItem: null
        });
      } else if (hotkeyMapping.pan && key === hotkeyMapping.pan) {
        e.preventDefault();
        uiState.actions.setMode({
          type: 'PAN',
          showCursor: false
        });
        uiState.actions.setItemControls(null);
      } else if (hotkeyMapping.addItem && key === hotkeyMapping.addItem) {
        e.preventDefault();
        uiState.actions.setItemControls({
          type: 'ADD_ITEM'
        });
        uiState.actions.setMode({
          type: 'PLACE_ICON',
          showCursor: true,
          id: null
        });
      } else if (hotkeyMapping.rectangle && key === hotkeyMapping.rectangle) {
        e.preventDefault();
        uiState.actions.setMode({
          type: 'RECTANGLE.DRAW',
          showCursor: true,
          id: null
        });
      } else if (hotkeyMapping.connector && key === hotkeyMapping.connector) {
        e.preventDefault();
        uiState.actions.setMode({
          type: 'CONNECTOR',
          id: null,
          showCursor: true
        });
      } else if (hotkeyMapping.text && key === hotkeyMapping.text) {
        e.preventDefault();
        const textBoxId = generateId();
        createTextBox({
          ...TEXTBOX_DEFAULTS,
          id: textBoxId,
          tile: uiState.mouse.position.tile
        });
        uiState.actions.setMode({
          type: 'TEXTBOX',
          showCursor: false,
          id: textBoxId
        });
      } else if (hotkeyMapping.lasso && key === hotkeyMapping.lasso) {
        e.preventDefault();
        uiState.actions.setMode({
          type: 'LASSO',
          showCursor: true,
          selection: null,
          isDragging: false
        });
      } else if (hotkeyMapping.freehandLasso && key === hotkeyMapping.freehandLasso) {
        e.preventDefault();
        uiState.actions.setMode({
          type: 'FREEHAND_LASSO',
          showCursor: true,
          path: [],
          selection: null,
          isDragging: false
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      return window.removeEventListener('keydown', handleKeyDown);
    };
  }, [undo, redo, canUndo, canRedo, uiStateApi, createTextBox, scene]);

  const processMouseUpdate = useCallback(
    (nextMouse: Mouse, e: SlimMouseEvent) => {
      if (!rendererRef.current) return;

      const uiState = uiStateApi.getState();
      const model = modelStoreApi.getState();

      const mode = modes[uiState.mode.type];
      const modeFunction = getModeFunction(mode, e);

      if (!modeFunction) return;

      uiState.actions.setMouse(nextMouse);

      const baseState: State = {
        model,
        scene,
        uiState,
        rendererRef: rendererRef.current,
        rendererSize,
        isRendererInteraction: rendererRef.current === e.target
      };

      if (reducerTypeRef.current !== uiState.mode.type) {
        const prevReducer = reducerTypeRef.current
          ? modes[reducerTypeRef.current]
          : null;

        if (prevReducer && prevReducer.exit) {
          prevReducer.exit(baseState);
        }

        if (mode.entry) {
          mode.entry(baseState);
        }
      }

      modeFunction(baseState);
      reducerTypeRef.current = uiState.mode.type;
    },
    [uiStateApi, modelStoreApi, scene, rendererSize]
  );

  const onMouseEvent = useCallback(
    (e: SlimMouseEvent) => {
      if (!rendererRef.current) return;

      if (e.type === 'mousedown' && handlePanMouseDown(e)) {
        return;
      }
      if (e.type === 'mouseup' && handlePanMouseUp(e)) {
        return;
      }

      const uiState = uiStateApi.getState();

      const nextMouse = getMouse({
        interactiveElement: rendererRef.current,
        zoom: uiState.zoom,
        scroll: uiState.scroll,
        lastMouse: uiState.mouse,
        mouseEvent: e,
        rendererSize
      });

      if (e.type === 'mousemove') {
        scheduleUpdate(nextMouse, e, (update) => {
          processMouseUpdate(update.mouse, update.event);
        });
      } else {
        flushUpdate();
        processMouseUpdate(nextMouse, e);
      }
    },
    [uiStateApi, rendererSize, handlePanMouseDown, handlePanMouseUp, scheduleUpdate, flushUpdate, processMouseUpdate]
  );

  const onContextMenu = useCallback(
    (e: SlimMouseEvent) => {
      e.preventDefault();

      const uiState = uiStateApi.getState();

      if (uiState.panSettings.rightClickPan) {
        return;
      }

      const itemAtTile = getItemAtTile({
        tile: uiState.mouse.position.tile,
        scene
      });

      if (itemAtTile) {
        uiState.actions.setContextMenu({
          type: 'ITEM',
          item: itemAtTile,
          tile: uiState.mouse.position.tile
        });
      } else {
        uiState.actions.setContextMenu({
          type: 'EMPTY',
          tile: uiState.mouse.position.tile
        });
      }
    },
    [uiStateApi, scene]
  );

  useEffect(() => {
    if (modeType === 'INTERACTIONS_DISABLED') return;

    const el = window;

    const onTouchStart = (e: TouchEvent) => {
      onMouseEvent({
        ...e,
        clientX: Math.floor(e.touches[0].clientX),
        clientY: Math.floor(e.touches[0].clientY),
        type: 'mousedown',
        button: 0
      });
    };

    const onTouchMove = (e: TouchEvent) => {
      onMouseEvent({
        ...e,
        clientX: Math.floor(e.touches[0].clientX),
        clientY: Math.floor(e.touches[0].clientY),
        type: 'mousemove',
        button: 0
      });
    };

    const onTouchEnd = (e: TouchEvent) => {
      onMouseEvent({
        ...e,
        clientX: 0,
        clientY: 0,
        type: 'mouseup',
        button: 0
      });
    };

    const onScroll = (e: WheelEvent) => {
      const uiState = uiStateApi.getState();
      const zoomToCursor = uiState.zoomSettings.zoomToCursor;
      const oldZoom = uiState.zoom;

      let newZoom: number;
      if (e.deltaY > 0) {
        newZoom = decrementZoom(oldZoom);
      } else {
        newZoom = incrementZoom(oldZoom);
      }

      if (newZoom === oldZoom) {
        return;
      }

      if (zoomToCursor && rendererRef.current && rendererSize) {
        const rect = rendererRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const mouseRelativeToCenterX = mouseX - rendererSize.width / 2;
        const mouseRelativeToCenterY = mouseY - rendererSize.height / 2;

        const worldX = (mouseRelativeToCenterX - uiState.scroll.position.x) / oldZoom;
        const worldY = (mouseRelativeToCenterY - uiState.scroll.position.y) / oldZoom;

        const newScrollX = mouseRelativeToCenterX - worldX * newZoom;
        const newScrollY = mouseRelativeToCenterY - worldY * newZoom;

        uiState.actions.setZoom(newZoom);
        uiState.actions.setScroll({
          position: {
            x: newScrollX,
            y: newScrollY
          },
          offset: uiState.scroll.offset
        });
      } else {
        uiState.actions.setZoom(newZoom);
      }
    };

    el.addEventListener('mousemove', onMouseEvent);
    el.addEventListener('mousedown', onMouseEvent);
    el.addEventListener('mouseup', onMouseEvent);
    el.addEventListener('contextmenu', onContextMenu);
    el.addEventListener('touchstart', onTouchStart);
    el.addEventListener('touchmove', onTouchMove);
    el.addEventListener('touchend', onTouchEnd);
    rendererEl?.addEventListener('wheel', onScroll, { passive: true });

    return () => {
      el.removeEventListener('mousemove', onMouseEvent);
      el.removeEventListener('mousedown', onMouseEvent);
      el.removeEventListener('mouseup', onMouseEvent);
      el.removeEventListener('contextmenu', onContextMenu);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      rendererEl?.removeEventListener('wheel', onScroll);
      cleanup();
    };
  }, [
    editorMode,
    modeType,
    onMouseEvent,
    onContextMenu,
    rendererEl,
    rendererSize,
    uiStateApi,
    cleanup
  ]);

  const setInteractionsElement = useCallback((element: HTMLElement) => {
    rendererRef.current = element;
  }, []);

  return {
    setInteractionsElement
  };
};
