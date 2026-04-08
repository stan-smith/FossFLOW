import { 
  deleteConnector, 
  syncConnector, 
  updateConnector, 
  createConnector 
} from '../connector';
import { State, ViewReducerContext } from '../types';
import { Connector, View, Model, Scene } from 'src/types';

// Mock the utility functions
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
  getConnectorPath: jest.fn(({ anchors }) => ({
    tiles: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
    rectangle: {
      from: { x: 0, y: 0 },
      to: { x: 1, y: 1 }
    }
  }))
}));

describe('connector reducer', () => {
  let mockState: State;
  let mockContext: ViewReducerContext;
  let mockConnector: Connector;
  let mockView: View;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockConnector = {
      id: 'connector1',
      anchors: [
        { id: 'anchor1', ref: { item: 'item1' } },
        { id: 'anchor2', ref: { item: 'item2' } }
      ],
      description: 'Test Connection',
      style: 'SOLID',
      color: 'color1'
    };

    mockView = {
      id: 'view1',
      name: 'Test View',
      items: [],
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
        connectors: {
          'connector1': {
            path: {
              tiles: [],
              rectangle: { from: { x: 0, y: 0 }, to: { x: 2, y: 0 } }
            }
          }
        },
        textBoxes: {}
      }
    };

    mockContext = {
      viewId: 'view1',
      state: mockState
    };
  });

  describe('deleteConnector', () => {
    it('should delete a connector from both model and scene', () => {
      const result = deleteConnector('connector1', mockContext);
      
      // Check connector is removed from model
      expect(result.model.views[0].connectors).toHaveLength(0);
      
      // Check connector is removed from scene by ID
      expect(result.scene.connectors['connector1']).toBeUndefined();
    });

    it('should throw error when connector does not exist', () => {
      expect(() => {
        deleteConnector('nonexistent', mockContext);
      }).toThrow('Item with id nonexistent not found');
    });

    it('should throw error when view does not exist', () => {
      mockContext.viewId = 'nonexistent';
      expect(() => {
        deleteConnector('connector1', mockContext);
      }).toThrow('Item with id nonexistent not found');
    });

    it('should handle empty connectors array gracefully', () => {
      mockState.model.views[0].connectors = [];
      mockState.scene.connectors = {};
      
      expect(() => {
        deleteConnector('connector1', mockContext);
      }).toThrow('Item with id connector1 not found');
    });

    it('should not affect other connectors when deleting one', () => {
      const connector2: Connector = {
        id: 'connector2',
        anchors: [
          { id: 'anchor3', ref: { item: 'item3' } },
          { id: 'anchor4', ref: { item: 'item4' } }
        ]
      };
      
      mockState.model.views[0].connectors = [mockConnector, connector2];
      mockState.scene.connectors['connector2'] = { 
        path: { tiles: [], rectangle: { from: { x: 1, y: 1 }, to: { x: 2, y: 2 } } }
      };
      
      const result = deleteConnector('connector1', mockContext);
      
      expect(result.model.views[0].connectors).toHaveLength(1);
      expect(result.model.views[0].connectors![0].id).toBe('connector2');
      expect(result.scene.connectors['connector2']).toBeDefined();
      expect(result.scene.connectors['connector1']).toBeUndefined();
    });
  });

  describe('syncConnector', () => {
    it('should sync connector path successfully', () => {
      const getConnectorPath = require('src/utils').getConnectorPath;
      
      // Clear previous calls and set up fresh mock
      getConnectorPath.mockClear();
      getConnectorPath.mockReturnValue({
        tiles: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
        rectangle: {
          from: { x: 0, y: 0 },
          to: { x: 2, y: 0 }
        }
      });
      
      const result = syncConnector('connector1', mockContext);
      
      expect(getConnectorPath).toHaveBeenCalled();
      
      expect(result.scene.connectors['connector1'].path).toEqual({
        tiles: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
        rectangle: {
          from: { x: 0, y: 0 },
          to: { x: 2, y: 0 }
        }
      });
    });

    it('should handle path calculation errors gracefully', () => {
      const getConnectorPath = require('src/utils').getConnectorPath;
      getConnectorPath.mockImplementationOnce(() => {
        throw new Error('Path calculation failed');
      });
      
      const result = syncConnector('connector1', mockContext);
      
      // Should create empty path on error
      expect(result.scene.connectors['connector1'].path).toEqual({
        tiles: [],
        rectangle: {
          from: { x: 0, y: 0 },
          to: { x: 0, y: 0 }
        }
      });
    });

    it('should throw error when connector does not exist', () => {
      expect(() => {
        syncConnector('nonexistent', mockContext);
      }).toThrow('Item with id nonexistent not found');
    });

    it('should handle connectors with partial anchor data', () => {
      mockConnector.anchors = [
        { id: 'anchor1', ref: { item: 'item1' } },
        { id: 'anchor2', ref: { item: 'item2' } }
      ];
      
      const result = syncConnector('connector1', mockContext);
      
      expect(result.scene.connectors['connector1'].path).toBeDefined();
    });
  });

  describe('updateConnector', () => {
    it('should update connector properties', () => {
      const updates = {
        id: 'connector1',
        description: 'Updated Connection',
        color: 'color2',
        style: 'DASHED' as const
      };
      
      const result = updateConnector(updates, mockContext);
      
      expect(result.model.views[0].connectors![0].description).toBe('Updated Connection');
      expect(result.model.views[0].connectors![0].color).toBe('color2');
      expect(result.model.views[0].connectors![0].style).toBe('DASHED');
    });

    it('should sync connector when anchors are updated', () => {
      const updates = {
        id: 'connector1',
        anchors: [
          { id: 'anchor3', ref: { item: 'item3' } },
          { id: 'anchor4', ref: { item: 'item4' } }
        ]
      };
      
      const result = updateConnector(updates, mockContext);
      
      expect(result.model.views[0].connectors![0].anchors).toEqual(updates.anchors);
      // Verify sync was called by checking the path was updated
      expect(result.scene.connectors['connector1'].path).toBeDefined();
    });

    it('should not sync when anchors are not updated', () => {
      const getConnectorPath = require('src/utils').getConnectorPath;
      getConnectorPath.mockClear();
      
      const updates = {
        id: 'connector1',
        description: 'Just a description update'
      };
      
      updateConnector(updates, mockContext);
      
      // getConnectorPath should not be called when anchors aren't updated
      expect(getConnectorPath).not.toHaveBeenCalled();
    });

    it('should throw error when connector does not exist', () => {
      expect(() => {
        updateConnector({ id: 'nonexistent', description: 'test' }, mockContext);
      }).toThrow('Item with id nonexistent not found');
    });

    it('should handle empty connectors array', () => {
      mockState.model.views[0].connectors = undefined;
      
      const result = updateConnector({ id: 'connector1', description: 'test' }, mockContext);
      
      // Should return state unchanged when connectors is undefined
      expect(result).toEqual(mockState);
    });

    it('should preserve other connector properties when partially updating', () => {
      const updates = {
        id: 'connector1',
        description: 'Partial Update'
      };
      
      const result = updateConnector(updates, mockContext);
      
      // Original properties should be preserved
      expect(result.model.views[0].connectors![0].anchors).toEqual(mockConnector.anchors);
      expect(result.model.views[0].connectors![0].color).toBe(mockConnector.color);
      expect(result.model.views[0].connectors![0].style).toBe(mockConnector.style);
      // Updated property
      expect(result.model.views[0].connectors![0].description).toBe('Partial Update');
    });
  });

  describe('createConnector', () => {
    it('should create a new connector', () => {
      const newConnector: Connector = {
        id: 'connector2',
        anchors: [
          { id: 'anchor5', ref: { item: 'item5' } },
          { id: 'anchor6', ref: { item: 'item6' } }
        ],
        description: 'New Connection'
      };
      
      const result = createConnector(newConnector, mockContext);
      
      // Should be added at the beginning (unshift)
      expect(result.model.views[0].connectors).toHaveLength(2);
      expect(result.model.views[0].connectors![0].id).toBe('connector2');
      expect(result.model.views[0].connectors![1].id).toBe('connector1');
      
      // Should sync the new connector
      expect(result.scene.connectors['connector2']).toBeDefined();
      expect(result.scene.connectors['connector2'].path).toBeDefined();
    });

    it('should initialize connectors array if undefined', () => {
      mockState.model.views[0].connectors = undefined;
      
      const newConnector: Connector = {
        id: 'connector2',
        anchors: [
          { id: 'anchor5', ref: { item: 'item5' } },
          { id: 'anchor6', ref: { item: 'item6' } }
        ]
      };
      
      const result = createConnector(newConnector, mockContext);
      
      expect(result.model.views[0].connectors).toHaveLength(1);
      expect(result.model.views[0].connectors![0].id).toBe('connector2');
    });

    it('should handle sync errors when creating connector', () => {
      const getConnectorPath = require('src/utils').getConnectorPath;
      getConnectorPath.mockImplementationOnce(() => {
        throw new Error('Path calculation failed');
      });
      
      const newConnector: Connector = {
        id: 'connector2',
        anchors: [
          { id: 'anchor5', ref: { item: 'item5' } },
          { id: 'anchor6', ref: { item: 'item6' } }
        ]
      };
      
      const result = createConnector(newConnector, mockContext);
      
      // Connector should still be created
      expect(result.model.views[0].connectors).toHaveLength(2);
      
      // But with empty path
      expect(result.scene.connectors['connector2'].path).toEqual({
        tiles: [],
        rectangle: {
          from: { x: 0, y: 0 },
          to: { x: 0, y: 0 }
        }
      });
    });

    it('should throw error when view does not exist', () => {
      mockContext.viewId = 'nonexistent';
      
      const newConnector: Connector = {
        id: 'connector2',
        anchors: [
          { id: 'anchor5', ref: { item: 'item5' } },
          { id: 'anchor6', ref: { item: 'item6' } }
        ]
      };
      
      expect(() => {
        createConnector(newConnector, mockContext);
      }).toThrow('Item with id nonexistent not found');
    });

    it('should create connector with all optional properties', () => {
      const newConnector: Connector = {
        id: 'connector2',
        anchors: [
          { id: 'anchor5', ref: { item: 'item5' } },
          { id: 'anchor6', ref: { item: 'item6' } }
        ],
        description: 'Full Connector',
        style: 'DOTTED',
        color: 'color3'
      };
      
      const result = createConnector(newConnector, mockContext);
      
      const created = result.model.views[0].connectors![0];
      expect(created.description).toBe('Full Connector');
      expect(created.style).toBe('DOTTED');
      expect(created.color).toBe('color3');
    });
  });

  describe('edge cases and state immutability', () => {
    it('should not mutate the original state', () => {
      const originalState = JSON.parse(JSON.stringify(mockState));
      
      deleteConnector('connector1', mockContext);
      
      expect(mockState).toEqual(originalState);
    });

    it('should handle multiple operations in sequence', () => {
      // Create
      let result = createConnector({
        id: 'connector2',
        anchors: [
          { id: 'anchor3', ref: { item: 'item3' } },
          { id: 'anchor4', ref: { item: 'item4' } }
        ]
      }, { ...mockContext, state: mockState });
      
      // Update
      result = updateConnector({
        id: 'connector2',
        description: 'Updated'
      }, { ...mockContext, state: result });
      
      // Delete original
      result = deleteConnector('connector1', { ...mockContext, state: result });
      
      expect(result.model.views[0].connectors).toHaveLength(1);
      expect(result.model.views[0].connectors![0].id).toBe('connector2');
      expect(result.model.views[0].connectors![0].description).toBe('Updated');
    });

    it('should handle view with multiple connectors', () => {
      const connectors: Connector[] = Array.from({ length: 5 }, (_, i) => ({
        id: `connector${i}`,
        anchors: [
          { id: `anchor${i * 2}`, ref: { item: `item${i}` } },
          { id: `anchor${i * 2 + 1}`, ref: { item: `item${i + 1}` } }
        ]
      }));
      
      mockState.model.views[0].connectors = connectors;
      
      const result = deleteConnector('connector2', mockContext);
      
      expect(result.model.views[0].connectors).toHaveLength(4);
      expect(result.model.views[0].connectors!.find(c => c.id === 'connector2')).toBeUndefined();
    });
  });
});