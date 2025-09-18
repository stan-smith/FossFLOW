import { renderHook, act } from '@testing-library/react';
import { useInitialDataManager } from '../useInitialDataManager';
import { InitialData } from 'src/types';
import * as modelStoreModule from 'src/stores/modelStore';
import * as uiStateStoreModule from 'src/stores/uiStateStore';
import * as useViewModule from 'src/hooks/useView';

// Mock console methods
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;
const originalAlert = window.alert;

beforeAll(() => {
  console.warn = jest.fn();
  console.log = jest.fn();
  window.alert = jest.fn();
});

afterAll(() => {
  console.warn = originalConsoleWarn;
  console.log = originalConsoleLog;
  window.alert = originalAlert;
});

// Mock dependencies
jest.mock('src/stores/modelStore');
jest.mock('src/stores/uiStateStore');
jest.mock('src/hooks/useView');
jest.mock('src/schemas/model', () => ({
  modelSchema: {
    safeParse: jest.fn()
  }
}));

describe('useInitialDataManager - Orphaned Connector Handling', () => {
  let mockModelStore: any;
  let mockUiStateStore: any;
  let mockChangeView: jest.Mock;
  let mockModelSchema: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock model store
    mockModelStore = {
      actions: {
        set: jest.fn()
      },
      icons: [],
      colors: []
    };
    (modelStoreModule.useModelStore as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockModelStore);
      }
      return mockModelStore;
    });

    // Setup mock UI state store
    mockUiStateStore = {
      actions: {
        setScroll: jest.fn(),
        setZoom: jest.fn(),
        setIconCategoriesState: jest.fn(),
        resetUiState: jest.fn()
      },
      rendererEl: null,
      editorMode: 'INTERACTIVE'
    };
    (uiStateStoreModule.useUiStateStore as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockUiStateStore);
      }
      return mockUiStateStore;
    });

    // Setup mock changeView
    mockChangeView = jest.fn();
    (useViewModule.useView as jest.Mock).mockReturnValue({
      changeView: mockChangeView
    });

    // Setup mock model schema
    mockModelSchema = require('src/schemas/model').modelSchema;
    mockModelSchema.safeParse.mockReturnValue({ success: true });
  });

  it('should filter out connectors with invalid item references during load', () => {
    const { result } = renderHook(() => useInitialDataManager());

    const initialData: InitialData = {
      version: '1.0',
      title: 'Test',
      description: '',
      colors: [],
      icons: [],
      items: [],
      views: [
        {
          id: 'view1',
          name: 'Test View',
          items: [
            { id: 'item1', tile: { x: 0, y: 0 } },
            { id: 'item2', tile: { x: 1, y: 0 } }
          ],
          connectors: [
            {
              id: 'connector1',
              anchors: [
                { id: 'anchor1', ref: { item: 'item1' }, face: 'right' },
                { id: 'anchor2', ref: { item: 'item2' }, face: 'left' }
              ]
            },
            {
              id: 'connector2',
              anchors: [
                { id: 'anchor3', ref: { item: 'item1' }, face: 'top' },
                { id: 'anchor4', ref: { item: 'nonexistent' }, face: 'bottom' } // Invalid reference
              ]
            },
            {
              id: 'connector3',
              anchors: [
                { id: 'anchor5', ref: { item: 'nonexistent1' }, face: 'right' }, // Invalid reference
                { id: 'anchor6', ref: { item: 'nonexistent2' }, face: 'left' } // Invalid reference
              ]
            }
          ],
          rectangles: [],
          textBoxes: []
        }
      ]
    };

    act(() => {
      result.current.load(initialData);
    });

    // Check that the model store was called with filtered connectors
    const setCall = mockModelStore.actions.set.mock.calls[0][0];
    expect(setCall.views[0].connectors).toHaveLength(1);
    expect(setCall.views[0].connectors[0].id).toBe('connector1');

    // Check that warnings were logged for removed connectors
    expect(console.warn).toHaveBeenCalledWith('Removing connector connector2 due to invalid item references');
    expect(console.warn).toHaveBeenCalledWith('Removing connector connector3 due to invalid item references');
  });

  it('should allow connectors that reference other anchors', () => {
    const { result } = renderHook(() => useInitialDataManager());

    const initialData: InitialData = {
      version: '1.0',
      title: 'Test',
      description: '',
      colors: [],
      icons: [],
      items: [],
      views: [
        {
          id: 'view1',
          name: 'Test View',
          items: [
            { id: 'item1', tile: { x: 0, y: 0 } }
          ],
          connectors: [
            {
              id: 'connector1',
              anchors: [
                { id: 'anchor1', ref: { item: 'item1' }, face: 'right' },
                { id: 'anchor2', ref: { anchor: 'anchor3' }, face: 'left' } // References another anchor
              ]
            }
          ],
          rectangles: [],
          textBoxes: []
        }
      ]
    };

    act(() => {
      result.current.load(initialData);
    });

    // Connector with anchor reference should be preserved
    const setCall = mockModelStore.actions.set.mock.calls[0][0];
    expect(setCall.views[0].connectors).toHaveLength(1);
    expect(setCall.views[0].connectors[0].id).toBe('connector1');
  });

  it('should handle views with no connectors', () => {
    const { result } = renderHook(() => useInitialDataManager());

    const initialData: InitialData = {
      version: '1.0',
      title: 'Test',
      description: '',
      colors: [],
      icons: [],
      items: [],
      views: [
        {
          id: 'view1',
          name: 'Test View',
          items: [{ id: 'item1', tile: { x: 0, y: 0 } }],
          rectangles: [],
          textBoxes: []
        }
      ]
    };

    act(() => {
      result.current.load(initialData);
    });

    // Should not throw and should load successfully
    expect(mockModelStore.actions.set).toHaveBeenCalled();
    expect(result.current.isReady).toBe(true);
  });

  it('should handle all connectors being invalid', () => {
    const { result } = renderHook(() => useInitialDataManager());

    const initialData: InitialData = {
      version: '1.0',
      title: 'Test',
      description: '',
      colors: [],
      icons: [],
      items: [],
      views: [
        {
          id: 'view1',
          name: 'Test View',
          items: [{ id: 'item1', tile: { x: 0, y: 0 } }],
          connectors: [
            {
              id: 'connector1',
              anchors: [
                { id: 'anchor1', ref: { item: 'nonexistent1' }, face: 'right' },
                { id: 'anchor2', ref: { item: 'nonexistent2' }, face: 'left' }
              ]
            },
            {
              id: 'connector2',
              anchors: [
                { id: 'anchor3', ref: { item: 'deleted1' }, face: 'top' },
                { id: 'anchor4', ref: { item: 'deleted2' }, face: 'bottom' }
              ]
            }
          ],
          rectangles: [],
          textBoxes: []
        }
      ]
    };

    act(() => {
      result.current.load(initialData);
    });

    // All connectors should be removed
    const setCall = mockModelStore.actions.set.mock.calls[0][0];
    expect(setCall.views[0].connectors).toHaveLength(0);
    expect(console.warn).toHaveBeenCalledTimes(2);
  });

  it('should handle mixed valid and invalid anchor references', () => {
    const { result } = renderHook(() => useInitialDataManager());

    const initialData: InitialData = {
      version: '1.0',
      title: 'Test',
      description: '',
      colors: [],
      icons: [],
      items: [],
      views: [
        {
          id: 'view1',
          name: 'Test View',
          items: [
            { id: 'item1', tile: { x: 0, y: 0 } },
            { id: 'item2', tile: { x: 1, y: 0 } }
          ],
          connectors: [
            {
              id: 'connector1',
              anchors: [
                { id: 'anchor1', ref: { item: 'item1' }, face: 'right' }, // Valid
                { id: 'anchor2', ref: { item: 'item2' }, face: 'left' }, // Valid
                { id: 'anchor3', ref: { item: 'nonexistent' }, face: 'top' } // Invalid
              ]
            }
          ],
          rectangles: [],
          textBoxes: []
        }
      ]
    };

    act(() => {
      result.current.load(initialData);
    });

    // Connector with any invalid anchor should be removed
    const setCall = mockModelStore.actions.set.mock.calls[0][0];
    expect(setCall.views[0].connectors).toHaveLength(0);
    expect(console.warn).toHaveBeenCalledWith('Removing connector connector1 due to invalid item references');
  });

  it('should not modify original initialData object', () => {
    const { result } = renderHook(() => useInitialDataManager());

    const initialData: InitialData = {
      version: '1.0',
      title: 'Test',
      description: '',
      colors: [],
      icons: [],
      items: [],
      views: [
        {
          id: 'view1',
          name: 'Test View',
          items: [{ id: 'item1', tile: { x: 0, y: 0 } }],
          connectors: [
            {
              id: 'connector1',
              anchors: [
                { id: 'anchor1', ref: { item: 'nonexistent' }, face: 'right' },
                { id: 'anchor2', ref: { item: 'item1' }, face: 'left' }
              ]
            }
          ],
          rectangles: [],
          textBoxes: []
        }
      ]
    };

    const originalData = JSON.parse(JSON.stringify(initialData));

    act(() => {
      result.current.load(initialData);
    });

    // Original data should not be modified
    expect(initialData).toEqual(originalData);
  });

  it('should handle validation errors gracefully', () => {
    const { result } = renderHook(() => useInitialDataManager());

    mockModelSchema.safeParse.mockReturnValueOnce({
      success: false,
      error: {
        errors: [{ message: 'Validation failed' }]
      }
    });

    const initialData: InitialData = {
      version: '1.0',
      title: 'Test',
      description: '',
      colors: [],
      icons: [],
      items: [],
      views: []
    };

    act(() => {
      result.current.load(initialData);
    });

    expect(window.alert).toHaveBeenCalledWith('There is an error in your model.');
    expect(mockModelStore.actions.set).not.toHaveBeenCalled();
    expect(result.current.isReady).toBe(false);
  });

  it('should preserve connectors with all valid references', () => {
    const { result } = renderHook(() => useInitialDataManager());

    const initialData: InitialData = {
      version: '1.0',
      title: 'Test',
      description: '',
      colors: [],
      icons: [],
      items: [],
      views: [
        {
          id: 'view1',
          name: 'Test View',
          items: [
            { id: 'item1', tile: { x: 0, y: 0 } },
            { id: 'item2', tile: { x: 1, y: 0 } },
            { id: 'item3', tile: { x: 2, y: 0 } }
          ],
          connectors: [
            {
              id: 'connector1',
              anchors: [
                { id: 'anchor1', ref: { item: 'item1' }, face: 'right' },
                { id: 'anchor2', ref: { item: 'item2' }, face: 'left' }
              ]
            },
            {
              id: 'connector2',
              anchors: [
                { id: 'anchor3', ref: { item: 'item2' }, face: 'right' },
                { id: 'anchor4', ref: { item: 'item3' }, face: 'left' }
              ]
            }
          ],
          rectangles: [],
          textBoxes: []
        }
      ]
    };

    act(() => {
      result.current.load(initialData);
    });

    // All valid connectors should be preserved
    const setCall = mockModelStore.actions.set.mock.calls[0][0];
    expect(setCall.views[0].connectors).toHaveLength(2);
    expect(setCall.views[0].connectors[0].id).toBe('connector1');
    expect(setCall.views[0].connectors[1].id).toBe('connector2');
    expect(console.warn).not.toHaveBeenCalled();
  });
});