import { useCallback, useEffect, useRef } from 'react';
import { useModelStore } from 'src/stores/modelStore';
import { useUiStateStore } from 'src/stores/uiStateStore';
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

// Added some throttling in for the mouse updates, this was causing unnexessary re-renders  - Stan
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

    // Only schedule a new frame if one isn't already pending
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
    // Immediately process pending update (for mousedown/mouseup)
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
  const uiState = useUiStateStore((state) => {
    return state;
  });
  const model = useModelStore((state) => {
    return state;
  });
  const scene = useScene();
  const { size: rendererSize } = useResizeObserver(uiState.rendererEl);
  const { undo, redo, canUndo, canRedo } = useHistory();
  const { createTextBox } = scene;
  const { handleMouseDown: handlePanMouseDown, handleMouseUp: handlePanMouseUp } = usePanHandlers();
  const { scheduleUpdate, flushUpdate, cleanup } = useRAFThrottle();

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC key handling - should work even in input fields
      if (e.key === 'Escape') {
        e.preventDefault();

        // Priority 1: Close ItemControls (node menus) if open
        if (uiState.itemControls) {
          uiState.actions.setItemControls(null);
          return;
        }

        // Priority 2: Cancel in-progress connector
        if (uiState.mode.type === 'CONNECTOR') {
          const connectorMode = uiState.mode;

          // Check if connection is in progress
          const isConnectionInProgress =
            (uiState.connectorInteractionMode === 'click' && connectorMode.isConnecting) ||
            (uiState.connectorInteractionMode === 'drag' && connectorMode.id !== null);

          if (isConnectionInProgress && connectorMode.id) {
            // Delete the temporary connector
            scene.deleteConnector(connectorMode.id);

            // Reset connector mode to initial state
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

      // Don't handle shortcuts when typing in input fields
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true' ||
        target.closest('.ql-editor') // Quill editor
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

      // Help dialog shortcut
      if (e.key === 'F1') {
        e.preventDefault();
        uiState.actions.setDialog(DialogTypeEnum.HELP);
      }

      // Tool hotkeys
      const hotkeyMapping = HOTKEY_PROFILES[uiState.hotkeyProfile];
      const key = e.key.toLowerCase();

      // Quick icon selection for selected node (when ItemControls is an ItemReference with type 'ITEM')
      if (key === 'i' && uiState.itemControls && 'id' in uiState.itemControls && uiState.itemControls.type === 'ITEM') {
        e.preventDefault();
        // Trigger icon change mode
        const event = new CustomEvent('quickIconChange');
        window.dispatchEvent(event);
      }

      // Check if key matches any hotkey
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
  }, [undo, redo, canUndo, canRedo, uiState.hotkeyProfile, uiState.actions, createTextBox, uiState.mouse.position.tile, scene, uiState.itemControls, uiState.mode, uiState.connectorInteractionMode]);

  const processMouseUpdate = useCallback(
    (nextMouse: Mouse, e: SlimMouseEvent) => {
      if (!rendererRef.current) return;

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
    [model, scene, uiState, rendererSize]
  );

  const onMouseEvent = useCallback(
    (e: SlimMouseEvent) => {
      if (!rendererRef.current) return;

      // Check pan handlers first
      if (e.type === 'mousedown' && handlePanMouseDown(e)) {
        return;
      }
      if (e.type === 'mouseup' && handlePanMouseUp(e)) {
        return;
      }

      const nextMouse = getMouse({
        interactiveElement: rendererRef.current,
        zoom: uiState.zoom,
        scroll: uiState.scroll,
        lastMouse: uiState.mouse,
        mouseEvent: e,
        rendererSize
      });

      // For mousedown and mouseup, process immediately for responsiveness
      // For mousemove, throttle updates to align with renderer frame rate
      if (e.type === 'mousemove') {
        scheduleUpdate(nextMouse, e, (update) => {
          processMouseUpdate(update.mouse, update.event);
        });
      } else {
        // Flush any pending mousemove update before processing mousedown/mouseup
        flushUpdate();
        processMouseUpdate(nextMouse, e);
      }
    },
    [uiState.zoom, uiState.scroll, uiState.mouse, rendererSize, handlePanMouseDown, handlePanMouseUp, scheduleUpdate, flushUpdate, processMouseUpdate]
  );

  const onContextMenu = useCallback(
    (e: SlimMouseEvent) => {
      e.preventDefault();

      // Don't show context menu if right-click pan is enabled
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
    [uiState.mouse, scene, uiState.actions, uiState.panSettings]
  );

  useEffect(() => {
    if (uiState.mode.type === 'INTERACTIONS_DISABLED') return;

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
      const zoomToCursor = uiState.zoomSettings.zoomToCursor;
      const oldZoom = uiState.zoom;

      // Calculate new zoom level
      let newZoom: number;
      if (e.deltaY > 0) {
        newZoom = decrementZoom(oldZoom);
      } else {
        newZoom = incrementZoom(oldZoom);
      }

      // If zoom didn't change (at min/max), no need to adjust scroll
      if (newZoom === oldZoom) {
        return;
      }

      if (zoomToCursor && rendererRef.current && rendererSize) {
        // Get mouse position relative to the renderer viewport
        const rect = rendererRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Calculate mouse position relative to viewport center
        const mouseRelativeToCenterX = mouseX - rendererSize.width / 2;
        const mouseRelativeToCenterY = mouseY - rendererSize.height / 2;

        // The point under the cursor in world space (before zoom)
        // World coordinates = (screen coordinates - scroll offset) / zoom
        const worldX = (mouseRelativeToCenterX - uiState.scroll.position.x) / oldZoom;
        const worldY = (mouseRelativeToCenterY - uiState.scroll.position.y) / oldZoom;

        // After zooming, to keep the same world point under the cursor:
        // screen coordinates = world coordinates * newZoom + scroll offset
        // We want: mouseRelativeToCenterX = worldX * newZoom + newScrollX
        // Therefore: newScrollX = mouseRelativeToCenterX - worldX * newZoom
        const newScrollX = mouseRelativeToCenterX - worldX * newZoom;
        const newScrollY = mouseRelativeToCenterY - worldY * newZoom;

        // Apply zoom and adjusted scroll together
        uiState.actions.setZoom(newZoom);
        uiState.actions.setScroll({
          position: {
            x: newScrollX,
            y: newScrollY
          },
          offset: uiState.scroll.offset
        });
      } else {
        // Original behavior: zoom to center
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
    uiState.rendererEl?.addEventListener('wheel', onScroll, { passive: true });

    return () => {
      el.removeEventListener('mousemove', onMouseEvent);
      el.removeEventListener('mousedown', onMouseEvent);
      el.removeEventListener('mouseup', onMouseEvent);
      el.removeEventListener('contextmenu', onContextMenu);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      uiState.rendererEl?.removeEventListener('wheel', onScroll);
      cleanup(); // Cancel any pending RAF updates
    };
  }, [
    uiState.editorMode,
    onMouseEvent,
    uiState.mode.type,
    onContextMenu,
    uiState.actions,
    uiState.rendererEl,
    uiState.zoom,
    uiState.scroll,
    uiState.zoomSettings,
    rendererSize,
    cleanup
  ]);

  const setInteractionsElement = useCallback((element: HTMLElement) => {
    rendererRef.current = element;
  }, []);

  return {
    setInteractionsElement
  };
};
