import { renderHook, act } from '@testing-library/react';
import { useInteractionManager } from '../useInteractionManager';

// Helper to create keyboard event with proper target
const createKeyboardEvent = (
  key: string,
  options: Partial<KeyboardEventInit> = {}
) => {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    ...options
  });
  // Mock target with required methods
  const target = document.createElement('div');
  Object.defineProperty(event, 'target', {
    value: target,
    writable: false
  });
  return event;
};

// Mock stores
const mockUiStateActions = {
  setItemControls: jest.fn(),
  setMode: jest.fn(),
  setMouse: jest.fn(),
  setContextMenu: jest.fn(),
  setDialog: jest.fn(),
  setScroll: jest.fn(),
  setZoom: jest.fn()
};

const mockUiState = {
  itemControls: null as { type: string; id: string } | null,
  mode: { type: 'CURSOR', showCursor: true, mousedownItem: null },
  hotkeyProfile: 'default',
  actions: mockUiStateActions,
  mouse: {
    position: { screen: { x: 0, y: 0 }, tile: { x: 0, y: 0 } },
    mousedown: null,
    delta: null
  },
  scroll: { position: { x: 0, y: 0 }, offset: { x: 0, y: 0 } },
  zoom: 1,
  rendererEl: null,
  panSettings: { rightClickPan: false },
  zoomSettings: { zoomToCursor: false },
  connectorInteractionMode: 'click'
};

const mockScene = {
  deleteViewItem: jest.fn(),
  deleteConnector: jest.fn(),
  deleteTextBox: jest.fn(),
  deleteRectangle: jest.fn(),
  createTextBox: jest.fn()
};

const mockHistory = {
  undo: jest.fn(),
  redo: jest.fn(),
  canUndo: false,
  canRedo: false
};

jest.mock('../../stores/uiStateStore', () => {
  return {
    useUiStateStore: jest.fn((selector) => {
      return selector ? selector(mockUiState) : mockUiState;
    })
  };
});

jest.mock('../../stores/modelStore', () => {
  return {
    useModelStore: jest.fn((selector) => {
      const state = { views: [], items: [], colors: [] };
      return selector ? selector(state) : state;
    })
  };
});

jest.mock('../../hooks/useScene', () => {
  return {
    useScene: jest.fn(() => {
      return mockScene;
    })
  };
});

jest.mock('../../hooks/useHistory', () => {
  return {
    useHistory: jest.fn(() => {
      return mockHistory;
    })
  };
});

jest.mock('../../hooks/useResizeObserver', () => {
  return {
    useResizeObserver: jest.fn(() => {
      return { size: { width: 800, height: 600 } };
    })
  };
});

jest.mock('../usePanHandlers', () => {
  return {
    usePanHandlers: jest.fn(() => {
      return {
        handleMouseDown: jest.fn(() => {
          return false;
        }),
        handleMouseUp: jest.fn(() => {
          return false;
        })
      };
    })
  };
});

jest.mock('../../config/hotkeys', () => {
  return {
    HOTKEY_PROFILES: {
      default: {
        select: 's',
        pan: 'm',
        addItem: 'n',
        rectangle: 'r',
        connector: 'c',
        text: 't',
        lasso: 'l',
        freehandLasso: 'f'
      }
    }
  };
});

describe('useInteractionManager - Ctrl+Delete hotkey', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUiState.itemControls = null;
  });

  afterEach(() => {
    // Cleanup any event listeners
  });

  describe('delete selected item with Ctrl+Delete', () => {
    it('should delete selected ITEM when Ctrl+Delete is pressed', () => {
      // Set up a selected item
      mockUiState.itemControls = { type: 'ITEM', id: 'item-1' };

      renderHook(() => {
        return useInteractionManager();
      });

      // Simulate Ctrl+Delete
      act(() => {
        window.dispatchEvent(createKeyboardEvent('Delete', { ctrlKey: true }));
      });

      expect(mockUiStateActions.setItemControls).toHaveBeenCalledWith(null);
      expect(mockScene.deleteViewItem).toHaveBeenCalledWith('item-1');
    });

    it('should delete selected CONNECTOR when Ctrl+Delete is pressed', () => {
      mockUiState.itemControls = { type: 'CONNECTOR', id: 'connector-1' };

      renderHook(() => {
        return useInteractionManager();
      });

      act(() => {
        window.dispatchEvent(createKeyboardEvent('Delete', { ctrlKey: true }));
      });

      expect(mockUiStateActions.setItemControls).toHaveBeenCalledWith(null);
      expect(mockScene.deleteConnector).toHaveBeenCalledWith('connector-1');
    });

    it('should delete selected TEXTBOX when Ctrl+Delete is pressed', () => {
      mockUiState.itemControls = { type: 'TEXTBOX', id: 'textbox-1' };

      renderHook(() => {
        return useInteractionManager();
      });

      act(() => {
        window.dispatchEvent(createKeyboardEvent('Delete', { ctrlKey: true }));
      });

      expect(mockUiStateActions.setItemControls).toHaveBeenCalledWith(null);
      expect(mockScene.deleteTextBox).toHaveBeenCalledWith('textbox-1');
    });

    it('should delete selected RECTANGLE when Ctrl+Delete is pressed', () => {
      mockUiState.itemControls = { type: 'RECTANGLE', id: 'rectangle-1' };

      renderHook(() => {
        return useInteractionManager();
      });

      act(() => {
        window.dispatchEvent(createKeyboardEvent('Delete', { ctrlKey: true }));
      });

      expect(mockUiStateActions.setItemControls).toHaveBeenCalledWith(null);
      expect(mockScene.deleteRectangle).toHaveBeenCalledWith('rectangle-1');
    });

    it('should also work with Ctrl+Backspace', () => {
      mockUiState.itemControls = { type: 'ITEM', id: 'item-2' };

      renderHook(() => {
        return useInteractionManager();
      });

      act(() => {
        window.dispatchEvent(
          createKeyboardEvent('Backspace', { ctrlKey: true })
        );
      });

      expect(mockUiStateActions.setItemControls).toHaveBeenCalledWith(null);
      expect(mockScene.deleteViewItem).toHaveBeenCalledWith('item-2');
    });

    it('should also work with Cmd+Delete on Mac', () => {
      mockUiState.itemControls = { type: 'ITEM', id: 'item-3' };

      renderHook(() => {
        return useInteractionManager();
      });

      act(() => {
        window.dispatchEvent(createKeyboardEvent('Delete', { metaKey: true }));
      });

      expect(mockUiStateActions.setItemControls).toHaveBeenCalledWith(null);
      expect(mockScene.deleteViewItem).toHaveBeenCalledWith('item-3');
    });

    it('should not delete when nothing is selected', () => {
      mockUiState.itemControls = null;

      renderHook(() => {
        return useInteractionManager();
      });

      act(() => {
        window.dispatchEvent(createKeyboardEvent('Delete', { ctrlKey: true }));
      });

      expect(mockScene.deleteViewItem).not.toHaveBeenCalled();
      expect(mockScene.deleteConnector).not.toHaveBeenCalled();
      expect(mockScene.deleteTextBox).not.toHaveBeenCalled();
      expect(mockScene.deleteRectangle).not.toHaveBeenCalled();
    });

    it('should not delete when Delete is pressed without Ctrl', () => {
      mockUiState.itemControls = { type: 'ITEM', id: 'item-4' };

      renderHook(() => {
        return useInteractionManager();
      });

      act(() => {
        window.dispatchEvent(createKeyboardEvent('Delete', { ctrlKey: false }));
      });

      expect(mockScene.deleteViewItem).not.toHaveBeenCalled();
    });

    it('should not delete when in input field', () => {
      mockUiState.itemControls = { type: 'ITEM', id: 'item-5' };

      renderHook(() => {
        return useInteractionManager();
      });

      // Create an input element and dispatch event with it as target
      const input = document.createElement('input');
      document.body.appendChild(input);

      act(() => {
        const event = new KeyboardEvent('keydown', {
          key: 'Delete',
          ctrlKey: true,
          bubbles: true
        });
        Object.defineProperty(event, 'target', {
          value: input,
          writable: false
        });
        window.dispatchEvent(event);
      });

      expect(mockScene.deleteViewItem).not.toHaveBeenCalled();

      document.body.removeChild(input);
    });

    it('should not delete when ADD_ITEM controls are shown', () => {
      mockUiState.itemControls = { type: 'ADD_ITEM' } as any;

      renderHook(() => {
        return useInteractionManager();
      });

      act(() => {
        window.dispatchEvent(createKeyboardEvent('Delete', { ctrlKey: true }));
      });

      expect(mockScene.deleteViewItem).not.toHaveBeenCalled();
      expect(mockScene.deleteConnector).not.toHaveBeenCalled();
    });
  });
});
