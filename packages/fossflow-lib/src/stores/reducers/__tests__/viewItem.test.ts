import {
  deleteViewItem,
  updateViewItem,
  createViewItem
} from '../viewItem';
import { State, ViewReducerContext } from '../types';
import { ViewItem, View, Connector } from 'src/types';

// Mock the utility functions and reducers
jest.mock('src/utils', () => ({
  getItemByIdOrThrow: jest.fn((items: any[], id: string) => {
    const index = items.findIndex((item: any) =>
      (typeof item === 'object' && item.id === id) || item === id
    );
    if (index === -1) {
      throw new Error(`Item with id ${id} not found`);
    }
    return { value: items[index], index };
  }),
  getConnectorsByViewItem: jest.fn((viewItemId: string, connectors: Connector[]) => {
    return connectors.filter(connector =>
      connector.anchors.some((anchor: any) =>
        anchor.ref?.item === viewItemId
      )
    );
  })
}));

jest.mock('src/schemas/validation', () => ({
  validateView: jest.fn(() => [])
}));

jest.mock('../view', () => ({
  view: jest.fn((params: any) => params.ctx.state)
}));

describe('viewItem reducer', () => {
  let mockState: State;
  let mockContext: ViewReducerContext;
  let mockViewItem: ViewItem;
  let mockView: View;
  let mockConnector: Connector;

  beforeEach(() => {
    jest.clearAllMocks();

    mockViewItem = {
      id: 'item1',
      tile: { x: 0, y: 0 },
      size: { width: 100, height: 100 }
    };

    mockConnector = {
      id: 'connector1',
      anchors: [
        {
          id: 'anchor1',
          ref: { item: 'item1' },
          face: 'right',
          offset: 0
        },
        {
          id: 'anchor2',
          ref: { item: 'item2' },
          face: 'left',
          offset: 0
        }
      ]
    };

    mockView = {
      id: 'view1',
      name: 'Test View',
      items: [mockViewItem, { id: 'item2', tile: { x: 1, y: 0 } }],
      connectors: [mockConnector],
      rectangles: [],
      textBoxes: []
    };

    mockState = {
      model: {
        version: '1.0',
        title: 'Test Model',
        description: '',
        colors: [],
        icons: [],
        items: [],
        views: [mockView]
      },
      scene: {
        viewId: 'view1',
        viewport: { x: 0, y: 0, zoom: 1 },
        grid: { enabled: true, size: 10, style: 'dots' },
        connectors: {
          'connector1': {
            path: {
              tiles: [],
              rectangle: { from: { x: 0, y: 0 }, to: { x: 1, y: 0 } }
            }
          }
        },
        viewItems: {},
        rectangles: {},
        textBoxes: {}
      }
    };

    mockContext = {
      viewId: 'view1',
      state: mockState
    };
  });

  describe('deleteViewItem', () => {
    it('should delete a view item and its associated connectors', () => {
      const result = deleteViewItem('item1', mockContext);

      // Check item is removed from model
      expect(result.model.views[0].items).toHaveLength(1);
      expect(result.model.views[0].items.find(item => item.id === 'item1')).toBeUndefined();

      // Check connectors referencing the item are removed
      expect(result.model.views[0].connectors).toHaveLength(0);
      expect(result.scene.connectors['connector1']).toBeUndefined();
    });

    it('should only remove connectors that reference the deleted item', () => {
      const connector2: Connector = {
        id: 'connector2',
        anchors: [
          {
            id: 'anchor3',
            ref: { item: 'item2' },
            face: 'top'
          },
          {
            id: 'anchor4',
            ref: { item: 'item3' },
            face: 'bottom'
          }
        ]
      };

      mockState.model.views[0].connectors = [mockConnector, connector2];
      mockState.scene.connectors['connector2'] = {
        path: { tiles: [], rectangle: { from: { x: 1, y: 1 }, to: { x: 2, y: 2 } } }
      };

      const result = deleteViewItem('item1', mockContext);

      // Check only connector1 is removed
      expect(result.model.views[0].connectors).toHaveLength(1);
      expect(result.model.views[0].connectors![0].id).toBe('connector2');
      expect(result.scene.connectors['connector1']).toBeUndefined();
      expect(result.scene.connectors['connector2']).toBeDefined();
    });

    it('should handle deletion when no connectors reference the item', () => {
      // Create a connector that doesn't reference item1
      mockState.model.views[0].connectors = [{
        id: 'connector2',
        anchors: [
          {
            id: 'anchor3',
            ref: { item: 'item2' },
            face: 'top'
          },
          {
            id: 'anchor4',
            ref: { item: 'item3' },
            face: 'bottom'
          }
        ]
      }];

      const result = deleteViewItem('item1', mockContext);

      // Item should be removed but connector should remain
      expect(result.model.views[0].items).toHaveLength(1);
      expect(result.model.views[0].connectors).toHaveLength(1);
    });

    it('should handle deletion when view has no connectors', () => {
      mockState.model.views[0].connectors = undefined;

      const result = deleteViewItem('item1', mockContext);

      expect(result.model.views[0].items).toHaveLength(1);
      expect(result.model.views[0].connectors).toBeUndefined();
    });

    it('should throw error when item does not exist', () => {
      expect(() => {
        deleteViewItem('nonexistent', mockContext);
      }).toThrow('Item with id nonexistent not found');
    });

    it('should throw error when view does not exist', () => {
      mockContext.viewId = 'nonexistent';
      expect(() => {
        deleteViewItem('item1', mockContext);
      }).toThrow('Item with id nonexistent not found');
    });

    it('should handle connectors with multiple anchors referencing the same item', () => {
      const complexConnector: Connector = {
        id: 'connector3',
        anchors: [
          {
            id: 'anchor5',
            ref: { item: 'item1' },
            face: 'top'
          },
          {
            id: 'anchor6',
            ref: { item: 'item1' },
            face: 'bottom'
          },
          {
            id: 'anchor7',
            ref: { item: 'item2' },
            face: 'left'
          }
        ]
      };

      mockState.model.views[0].connectors = [complexConnector];

      const result = deleteViewItem('item1', mockContext);

      // Connector should be removed since it references the deleted item
      expect(result.model.views[0].connectors).toHaveLength(0);
    });
  });

  describe('updateViewItem', () => {
    it('should update view item properties', () => {
      const updates = {
        id: 'item1',
        tile: { x: 2, y: 2 },
        size: { width: 200, height: 200 }
      };

      const result = updateViewItem(updates, mockContext);

      const updatedItem = result.model.views[0].items.find(item => item.id === 'item1');
      expect(updatedItem?.tile).toEqual({ x: 2, y: 2 });
      expect(updatedItem?.size).toEqual({ width: 200, height: 200 });
    });

    it('should update connectors when item tile position changes', () => {
      const updates = {
        id: 'item1',
        tile: { x: 5, y: 5 }
      };

      const result = updateViewItem(updates, mockContext);

      // The item should be updated with new position
      const updatedItem = result.model.views[0].items.find(item => item.id === 'item1');
      expect(updatedItem?.tile).toEqual({ x: 5, y: 5 });

      // When tile changes, connectors that reference this item are updated
      // The mock implementation tracks that connectors referencing the item were found
      const getConnectorsByViewItem = require('src/utils').getConnectorsByViewItem;
      expect(getConnectorsByViewItem).toHaveBeenCalled();
    });

    it('should validate view after update', () => {
      const validateView = require('src/schemas/validation').validateView;
      validateView.mockReturnValueOnce([{ message: 'Validation error' }]);

      expect(() => {
        updateViewItem({ id: 'item1', tile: { x: 1, y: 1 } }, mockContext);
      }).toThrow('Validation error');
    });

    it('should not update connectors when tile position is not changed', () => {
      const view = require('../view').view;
      view.mockClear();

      const updates = {
        id: 'item1',
        size: { width: 150, height: 150 }
      };

      updateViewItem(updates, mockContext);

      // View reducer should not be called for connector updates
      expect(view).not.toHaveBeenCalled();
    });

    it('should throw error when item does not exist', () => {
      expect(() => {
        updateViewItem({ id: 'nonexistent', tile: { x: 1, y: 1 } }, mockContext);
      }).toThrow('Item with id nonexistent not found');
    });
  });

  describe('createViewItem', () => {
    it('should create a new view item', () => {
      const newItem: ViewItem = {
        id: 'item3',
        tile: { x: 3, y: 3 },
        size: { width: 100, height: 100 }
      };

      const result = createViewItem(newItem, mockContext);

      // Should be added at the beginning (unshift)
      expect(result.model.views[0].items).toHaveLength(3);
      expect(result.model.views[0].items[0].id).toBe('item3');
    });

    it('should validate view after creation', () => {
      const validateView = require('src/schemas/validation').validateView;
      validateView.mockReturnValueOnce([{ message: 'Invalid item' }]);

      const newItem: ViewItem = {
        id: 'item3',
        tile: { x: 3, y: 3 }
      };

      expect(() => {
        createViewItem(newItem, mockContext);
      }).toThrow('Invalid item');
    });

    it('should throw error when view does not exist', () => {
      mockContext.viewId = 'nonexistent';

      const newItem: ViewItem = {
        id: 'item3',
        tile: { x: 3, y: 3 }
      };

      expect(() => {
        createViewItem(newItem, mockContext);
      }).toThrow('Item with id nonexistent not found');
    });
  });

  describe('edge cases and state immutability', () => {
    it('should not mutate the original state', () => {
      const originalState = JSON.parse(JSON.stringify(mockState));

      deleteViewItem('item1', mockContext);

      expect(mockState).toEqual(originalState);
    });

    it('should handle multiple operations in sequence', () => {
      // Create
      let result = createViewItem({
        id: 'item3',
        tile: { x: 2, y: 2 }
      }, { ...mockContext, state: mockState });

      // Update
      result = updateViewItem({
        id: 'item3',
        size: { width: 150, height: 150 }
      }, { ...mockContext, state: result });

      // Delete original
      result = deleteViewItem('item1', { ...mockContext, state: result });

      expect(result.model.views[0].items.find(item => item.id === 'item3')).toBeDefined();
      expect(result.model.views[0].items.find(item => item.id === 'item3')?.size).toEqual({ width: 150, height: 150 });
      expect(result.model.views[0].items.find(item => item.id === 'item1')).toBeUndefined();

      // Connector referencing item1 should be removed
      expect(result.model.views[0].connectors).toHaveLength(0);
    });

    it('should handle deletion of all items with connectors', () => {
      // Delete all items one by one
      let result = deleteViewItem('item1', mockContext);
      result = deleteViewItem('item2', { ...mockContext, state: result });

      expect(result.model.views[0].items).toHaveLength(0);
      expect(result.model.views[0].connectors).toHaveLength(0);
    });
  });
});