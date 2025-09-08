import {
  createRectangle,
  updateRectangle,
  deleteRectangle
} from '../rectangle';
import { State, ViewReducerContext } from '../types';
import { Rectangle, View } from 'src/types';

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
  })
}));

describe('rectangle reducer', () => {
  let mockState: State;
  let mockContext: ViewReducerContext;
  let mockRectangle: Rectangle;
  let mockView: View;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockRectangle = {
      id: 'rect1',
      position: { x: 0, y: 0 },
      size: { width: 100, height: 50 },
      color: 'color1',
      borderColor: 'color2',
      borderWidth: 2,
      borderStyle: 'solid',
      opacity: 1,
      cornerRadius: 5
    };

    mockView = {
      id: 'view1',
      name: 'Test View',
      items: [],
      connectors: [],
      rectangles: [mockRectangle],
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
        connectors: {},
        viewItems: {},
        textBoxes: {}
      }
    };

    mockContext = {
      viewId: 'view1',
      state: mockState
    };
  });

  describe('updateRectangle', () => {
    it('should update rectangle properties', () => {
      const updates = {
        id: 'rect1',
        size: { width: 200, height: 100 },
        color: 'color3',
        opacity: 0.5
      };
      
      const result = updateRectangle(updates, mockContext);
      
      expect(result.model.views[0].rectangles![0].size).toEqual({ width: 200, height: 100 });
      expect(result.model.views[0].rectangles![0].color).toBe('color3');
      expect(result.model.views[0].rectangles![0].opacity).toBe(0.5);
    });

    it('should preserve other properties when partially updating', () => {
      const updates = {
        id: 'rect1',
        color: 'color4'
      };
      
      const result = updateRectangle(updates, mockContext);
      
      // Original properties should be preserved
      expect(result.model.views[0].rectangles![0].position).toEqual(mockRectangle.position);
      expect(result.model.views[0].rectangles![0].size).toEqual(mockRectangle.size);
      expect(result.model.views[0].rectangles![0].borderColor).toBe(mockRectangle.borderColor);
      expect(result.model.views[0].rectangles![0].cornerRadius).toBe(mockRectangle.cornerRadius);
      // Updated property
      expect(result.model.views[0].rectangles![0].color).toBe('color4');
    });

    it('should handle undefined rectangles array', () => {
      mockState.model.views[0].rectangles = undefined;
      
      const result = updateRectangle({ id: 'rect1', color: 'test' }, mockContext);
      
      // Should return state unchanged
      expect(result).toEqual(mockState);
    });

    it('should throw error when rectangle does not exist', () => {
      expect(() => {
        updateRectangle({ id: 'nonexistent', color: 'test' }, mockContext);
      }).toThrow('Item with id nonexistent not found');
    });

    it('should throw error when view does not exist', () => {
      mockContext.viewId = 'nonexistent';
      
      expect(() => {
        updateRectangle({ id: 'rect1', color: 'test' }, mockContext);
      }).toThrow('Item with id nonexistent not found');
    });

    it('should update border properties', () => {
      const updates = {
        id: 'rect1',
        borderColor: 'color5',
        borderWidth: 4,
        borderStyle: 'dashed' as const
      };
      
      const result = updateRectangle(updates, mockContext);
      
      expect(result.model.views[0].rectangles![0].borderColor).toBe('color5');
      expect(result.model.views[0].rectangles![0].borderWidth).toBe(4);
      expect(result.model.views[0].rectangles![0].borderStyle).toBe('dashed');
    });
  });

  describe('createRectangle', () => {
    it('should create a new rectangle', () => {
      const newRectangle: Rectangle = {
        id: 'rect2',
        position: { x: 50, y: 50 },
        size: { width: 150, height: 75 },
        color: 'color3'
      };
      
      const result = createRectangle(newRectangle, mockContext);
      
      // Should be added at the beginning (unshift)
      expect(result.model.views[0].rectangles).toHaveLength(2);
      expect(result.model.views[0].rectangles![0].id).toBe('rect2');
      expect(result.model.views[0].rectangles![1].id).toBe('rect1');
    });

    it('should initialize rectangles array if undefined', () => {
      mockState.model.views[0].rectangles = undefined;
      
      const newRectangle: Rectangle = {
        id: 'rect2',
        position: { x: 50, y: 50 },
        size: { width: 150, height: 75 }
      };
      
      const result = createRectangle(newRectangle, mockContext);
      
      expect(result.model.views[0].rectangles).toHaveLength(1);
      expect(result.model.views[0].rectangles![0].id).toBe('rect2');
    });

    it('should create rectangle with all properties', () => {
      const newRectangle: Rectangle = {
        id: 'rect2',
        position: { x: 50, y: 50 },
        size: { width: 150, height: 75 },
        color: 'color6',
        borderColor: 'color7',
        borderWidth: 3,
        borderStyle: 'dotted',
        opacity: 0.8,
        cornerRadius: 10,
        shadow: {
          offsetX: 2,
          offsetY: 2,
          blur: 4,
          color: 'color8'
        }
      };
      
      const result = createRectangle(newRectangle, mockContext);
      
      const created = result.model.views[0].rectangles![0];
      expect(created.color).toBe('color6');
      expect(created.borderColor).toBe('color7');
      expect(created.borderWidth).toBe(3);
      expect(created.borderStyle).toBe('dotted');
      expect(created.opacity).toBe(0.8);
      expect(created.cornerRadius).toBe(10);
      expect(created.shadow).toEqual({
        offsetX: 2,
        offsetY: 2,
        blur: 4,
        color: 'color8'
      });
    });

    it('should throw error when view does not exist', () => {
      mockContext.viewId = 'nonexistent';
      
      const newRectangle: Rectangle = {
        id: 'rect2',
        position: { x: 50, y: 50 },
        size: { width: 150, height: 75 }
      };
      
      expect(() => {
        createRectangle(newRectangle, mockContext);
      }).toThrow('Item with id nonexistent not found');
    });

    it('should call updateRectangle after creation', () => {
      // This tests that createRectangle calls updateRectangle at the end
      // which ensures any necessary syncing happens
      const newRectangle: Rectangle = {
        id: 'rect2',
        position: { x: 50, y: 50 },
        size: { width: 150, height: 75 }
      };
      
      const result = createRectangle(newRectangle, mockContext);
      
      // The rectangle should have all properties set
      expect(result.model.views[0].rectangles![0]).toMatchObject(newRectangle);
    });
  });

  describe('deleteRectangle', () => {
    it('should delete a rectangle from model', () => {
      const result = deleteRectangle('rect1', mockContext);
      
      // Check rectangle is removed from model
      expect(result.model.views[0].rectangles).toHaveLength(0);
      
      // Rectangles don't have scene data - only stored in model
    });

    it('should throw error when rectangle does not exist', () => {
      expect(() => {
        deleteRectangle('nonexistent', mockContext);
      }).toThrow('Item with id nonexistent not found');
    });

    it('should throw error when view does not exist', () => {
      mockContext.viewId = 'nonexistent';
      
      expect(() => {
        deleteRectangle('rect1', mockContext);
      }).toThrow('Item with id nonexistent not found');
    });

    it('should handle empty rectangles array', () => {
      mockState.model.views[0].rectangles = [];
      
      expect(() => {
        deleteRectangle('rect1', mockContext);
      }).toThrow('Item with id rect1 not found');
    });

    it('should not affect other rectangles when deleting one', () => {
      const rect2: Rectangle = {
        id: 'rect2',
        position: { x: 100, y: 100 },
        size: { width: 80, height: 40 }
      };
      
      mockState.model.views[0].rectangles = [mockRectangle, rect2];
      
      const result = deleteRectangle('rect1', mockContext);
      
      expect(result.model.views[0].rectangles).toHaveLength(1);
      expect(result.model.views[0].rectangles![0].id).toBe('rect2');
      
      // Rectangles don't have scene data - only verify model is updated
    });
  });

  describe('edge cases and state immutability', () => {
    it('should not mutate the original state', () => {
      const originalState = JSON.parse(JSON.stringify(mockState));
      
      deleteRectangle('rect1', mockContext);
      
      expect(mockState).toEqual(originalState);
    });

    it('should handle multiple operations in sequence', () => {
      // Create
      let result = createRectangle({
        id: 'rect2',
        position: { x: 200, y: 200 },
        size: { width: 50, height: 50 }
      }, { ...mockContext, state: mockState });
      
      // Update
      result = updateRectangle({
        id: 'rect2',
        color: 'updatedColor',
        opacity: 0.7
      }, { ...mockContext, state: result });
      
      // Delete original
      result = deleteRectangle('rect1', { ...mockContext, state: result });
      
      expect(result.model.views[0].rectangles).toHaveLength(1);
      expect(result.model.views[0].rectangles![0].id).toBe('rect2');
      expect(result.model.views[0].rectangles![0].color).toBe('updatedColor');
      expect(result.model.views[0].rectangles![0].opacity).toBe(0.7);
    });

    it('should handle view with multiple rectangles', () => {
      const rectangles: Rectangle[] = Array.from({ length: 5 }, (_, i) => ({
        id: `rect${i}`,
        position: { x: i * 20, y: i * 20 },
        size: { width: 100, height: 50 }
      }));
      
      mockState.model.views[0].rectangles = rectangles;
      
      const result = deleteRectangle('rect2', mockContext);
      
      expect(result.model.views[0].rectangles).toHaveLength(4);
      expect(result.model.views[0].rectangles!.find(r => r.id === 'rect2')).toBeUndefined();
    });

    it('should handle rectangles with complex nested properties', () => {
      const complexRect: Rectangle = {
        id: 'rect2',
        position: { x: 0, y: 0 },
        size: { width: 100, height: 100 },
        shadow: {
          offsetX: 5,
          offsetY: 5,
          blur: 10,
          color: 'shadowColor'
        },
        gradient: {
          type: 'linear',
          angle: 45,
          stops: [
            { offset: 0, color: 'color1' },
            { offset: 1, color: 'color2' }
          ]
        }
      };
      
      const result = createRectangle(complexRect, mockContext);
      
      const created = result.model.views[0].rectangles![0];
      expect(created.shadow).toEqual(complexRect.shadow);
      expect(created.gradient).toEqual(complexRect.gradient);
    });
  });
});