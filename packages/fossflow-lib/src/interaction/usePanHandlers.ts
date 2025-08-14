import { useCallback, useEffect, useRef } from 'react';
import { useUiStateStore } from 'src/stores/uiStateStore';
import { CoordsUtils, getItemAtTile } from 'src/utils';
import { useScene } from 'src/hooks/useScene';
import { SlimMouseEvent } from 'src/types';

export const usePanHandlers = () => {
  const uiState = useUiStateStore((state) => state);
  const scene = useScene();
  const isPanningRef = useRef(false);
  const panMethodRef = useRef<string | null>(null);

  // Helper to start panning
  const startPan = useCallback((method: string) => {
    if (uiState.mode.type !== 'PAN') {
      isPanningRef.current = true;
      panMethodRef.current = method;
      uiState.actions.setMode({
        type: 'PAN',
        showCursor: false
      });
    }
  }, [uiState.mode.type, uiState.actions]);

  // Helper to end panning
  const endPan = useCallback(() => {
    if (isPanningRef.current) {
      isPanningRef.current = false;
      panMethodRef.current = null;
      uiState.actions.setMode({
        type: 'CURSOR',
        showCursor: true,
        mousedownItem: null
      });
    }
  }, [uiState.actions]);

  // Check if click is on empty area
  const isEmptyArea = useCallback((e: SlimMouseEvent): boolean => {
    if (!uiState.rendererEl || e.target !== uiState.rendererEl) return false;
    
    const itemAtTile = getItemAtTile({
      tile: uiState.mouse.position.tile,
      scene
    });
    
    return !itemAtTile;
  }, [uiState.rendererEl, uiState.mouse.position.tile, scene]);

  // Enhanced mouse down handler
  const handleMouseDown = useCallback((e: SlimMouseEvent): boolean => {
    const panSettings = uiState.panSettings;
    
    // Middle click pan
    if (panSettings.middleClickPan && e.button === 1) {
      e.preventDefault();
      startPan('middle');
      return true;
    }
    
    // Right click pan
    if (panSettings.rightClickPan && e.button === 2) {
      e.preventDefault();
      startPan('right');
      return true;
    }
    
    // Ctrl + click pan
    if (panSettings.ctrlClickPan && e.ctrlKey && e.button === 0) {
      e.preventDefault();
      startPan('ctrl');
      return true;
    }
    
    // Alt + click pan
    if (panSettings.altClickPan && e.altKey && e.button === 0) {
      e.preventDefault();
      startPan('alt');
      return true;
    }
    
    // Empty area click pan
    if (panSettings.emptyAreaClickPan && e.button === 0 && isEmptyArea(e)) {
      startPan('empty');
      return true;
    }
    
    return false;
  }, [uiState.panSettings, startPan, isEmptyArea]);

  // Enhanced mouse up handler
  const handleMouseUp = useCallback((e: SlimMouseEvent): boolean => {
    if (isPanningRef.current) {
      endPan();
      return true;
    }
    return false;
  }, [endPan]);

  // Keyboard pan handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle if typing in input fields
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true' ||
        target.closest('.ql-editor')
      ) {
        return;
      }

      const panSettings = uiState.panSettings;
      const speed = panSettings.keyboardPanSpeed;
      let dx = 0;
      let dy = 0;

      // Arrow keys
      if (panSettings.arrowKeysPan) {
        if (e.key === 'ArrowUp') {
          dy = speed;
          e.preventDefault();
        } else if (e.key === 'ArrowDown') {
          dy = -speed;
          e.preventDefault();
        } else if (e.key === 'ArrowLeft') {
          dx = speed;
          e.preventDefault();
        } else if (e.key === 'ArrowRight') {
          dx = -speed;
          e.preventDefault();
        }
      }

      // WASD keys
      if (panSettings.wasdPan) {
        const key = e.key.toLowerCase();
        if (key === 'w') {
          dy = speed;
          e.preventDefault();
        } else if (key === 's') {
          dy = -speed;
          e.preventDefault();
        } else if (key === 'a') {
          dx = speed;
          e.preventDefault();
        } else if (key === 'd') {
          dx = -speed;
          e.preventDefault();
        }
      }

      // IJKL keys
      if (panSettings.ijklPan) {
        const key = e.key.toLowerCase();
        if (key === 'i') {
          dy = speed;
          e.preventDefault();
        } else if (key === 'k') {
          dy = -speed;
          e.preventDefault();
        } else if (key === 'j') {
          dx = speed;
          e.preventDefault();
        } else if (key === 'l') {
          dx = -speed;
          e.preventDefault();
        }
      }

      // Apply pan if any movement
      if (dx !== 0 || dy !== 0) {
        const newPosition = CoordsUtils.add(
          uiState.scroll.position,
          { x: dx, y: dy }
        );
        uiState.actions.setScroll({
          position: newPosition,
          offset: uiState.scroll.offset
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [uiState.panSettings, uiState.scroll, uiState.actions]);

  return {
    handleMouseDown,
    handleMouseUp,
    isPanning: isPanningRef.current
  };
};