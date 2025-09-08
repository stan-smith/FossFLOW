import {
  createTextBox,
  updateTextBox,
  deleteTextBox,
  syncTextBox
} from '../textBox';
import { State, ViewReducerContext } from '../types';
import { TextBox, View } from 'src/types';

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
  getTextBoxDimensions: jest.fn((textBox: TextBox) => ({
    width: (textBox.content?.length || 0) * 10,
    height: textBox.fontSize || 16
  }))
}));

describe('textBox reducer', () => {
  let mockState: State;
  let mockContext: ViewReducerContext;
  let mockTextBox: TextBox;
  let mockView: View;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockTextBox = {
      id: 'textbox1',
      position: { x: 10, y: 20 },
      content: 'Test Content',
      fontSize: 14,
      color: 'color1',
      backgroundColor: 'color2',
      borderColor: 'color3',
      alignment: 'left'
    };

    mockView = {
      id: 'view1',
      name: 'Test View',
      items: [],
      connectors: [],
      rectangles: [],
      textBoxes: [mockTextBox]
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
        rectangles: {},
        textBoxes: {
          'textbox1': {
            size: { width: 120, height: 14 }
          }
        }
      }
    };

    mockContext = {
      viewId: 'view1',
      state: mockState
    };
  });

  describe('syncTextBox', () => {
    it('should sync text box dimensions to scene', () => {
      const getTextBoxDimensions = require('src/utils').getTextBoxDimensions;
      getTextBoxDimensions.mockClear();
      getTextBoxDimensions.mockReturnValue({ width: 150, height: 20 });
      
      const result = syncTextBox('textbox1', mockContext);
      
      expect(getTextBoxDimensions).toHaveBeenCalled();
      expect(result.scene.textBoxes['textbox1'].size).toEqual({
        width: 150,
        height: 20
      });
    });

    it('should throw error when text box does not exist', () => {
      expect(() => {
        syncTextBox('nonexistent', mockContext);
      }).toThrow('Item with id nonexistent not found');
    });

    it('should handle empty textBoxes array', () => {
      mockState.model.views[0].textBoxes = [];
      
      expect(() => {
        syncTextBox('textbox1', mockContext);
      }).toThrow('Item with id textbox1 not found');
    });

    it('should create scene entry if it doesn\'t exist', () => {
      delete mockState.scene.textBoxes['textbox1'];
      
      const result = syncTextBox('textbox1', mockContext);
      
      expect(result.scene.textBoxes['textbox1']).toBeDefined();
      expect(result.scene.textBoxes['textbox1'].size).toBeDefined();
    });
  });

  describe('updateTextBox', () => {
    it('should update text box properties', () => {
      const updates = {
        id: 'textbox1',
        content: 'Updated Content',
        fontSize: 18,
        color: 'color4'
      };
      
      const result = updateTextBox(updates, mockContext);
      
      expect(result.model.views[0].textBoxes![0].content).toBe('Updated Content');
      expect(result.model.views[0].textBoxes![0].fontSize).toBe(18);
      expect(result.model.views[0].textBoxes![0].color).toBe('color4');
    });

    it('should sync when content is updated', () => {
      const getTextBoxDimensions = require('src/utils').getTextBoxDimensions;
      getTextBoxDimensions.mockClear();
      
      const updates = {
        id: 'textbox1',
        content: 'New Content That Is Longer'
      };
      
      updateTextBox(updates, mockContext);
      
      // Should trigger sync because content changed
      expect(getTextBoxDimensions).toHaveBeenCalled();
    });

    it('should sync when fontSize is updated', () => {
      const getTextBoxDimensions = require('src/utils').getTextBoxDimensions;
      getTextBoxDimensions.mockClear();
      
      const updates = {
        id: 'textbox1',
        fontSize: 24
      };
      
      updateTextBox(updates, mockContext);
      
      // Should trigger sync because fontSize changed
      expect(getTextBoxDimensions).toHaveBeenCalled();
    });

    it('should not sync when other properties are updated', () => {
      const getTextBoxDimensions = require('src/utils').getTextBoxDimensions;
      getTextBoxDimensions.mockClear();
      
      const updates = {
        id: 'textbox1',
        color: 'color5',
        backgroundColor: 'color6'
      };
      
      updateTextBox(updates, mockContext);
      
      // Should NOT trigger sync for non-size-affecting properties
      expect(getTextBoxDimensions).not.toHaveBeenCalled();
    });

    it('should handle undefined textBoxes array', () => {
      mockState.model.views[0].textBoxes = undefined;
      
      const result = updateTextBox({ id: 'textbox1', content: 'test' }, mockContext);
      
      // Should return state unchanged
      expect(result).toEqual(mockState);
    });

    it('should preserve other properties when partially updating', () => {
      const updates = {
        id: 'textbox1',
        content: 'Partial Update'
      };
      
      const result = updateTextBox(updates, mockContext);
      
      // Original properties should be preserved
      expect(result.model.views[0].textBoxes![0].fontSize).toBe(mockTextBox.fontSize);
      expect(result.model.views[0].textBoxes![0].color).toBe(mockTextBox.color);
      expect(result.model.views[0].textBoxes![0].position).toEqual(mockTextBox.position);
      // Updated property
      expect(result.model.views[0].textBoxes![0].content).toBe('Partial Update');
    });

    it('should throw error when text box does not exist', () => {
      expect(() => {
        updateTextBox({ id: 'nonexistent', content: 'test' }, mockContext);
      }).toThrow('Item with id nonexistent not found');
    });
  });

  describe('createTextBox', () => {
    it('should create a new text box', () => {
      const newTextBox: TextBox = {
        id: 'textbox2',
        position: { x: 30, y: 40 },
        content: 'New Text Box',
        fontSize: 16
      };
      
      const result = createTextBox(newTextBox, mockContext);
      
      // Should be added at the beginning (unshift)
      expect(result.model.views[0].textBoxes).toHaveLength(2);
      expect(result.model.views[0].textBoxes![0].id).toBe('textbox2');
      expect(result.model.views[0].textBoxes![1].id).toBe('textbox1');
      
      // Should sync the new text box
      expect(result.scene.textBoxes['textbox2']).toBeDefined();
      expect(result.scene.textBoxes['textbox2'].size).toBeDefined();
    });

    it('should initialize textBoxes array if undefined', () => {
      mockState.model.views[0].textBoxes = undefined;
      
      const newTextBox: TextBox = {
        id: 'textbox2',
        position: { x: 30, y: 40 },
        content: 'New Text Box'
      };
      
      const result = createTextBox(newTextBox, mockContext);
      
      expect(result.model.views[0].textBoxes).toHaveLength(1);
      expect(result.model.views[0].textBoxes![0].id).toBe('textbox2');
    });

    it('should create text box with all properties', () => {
      const newTextBox: TextBox = {
        id: 'textbox2',
        position: { x: 30, y: 40 },
        content: 'Full Text Box',
        fontSize: 20,
        color: 'color7',
        backgroundColor: 'color8',
        borderColor: 'color9',
        alignment: 'center',
        bold: true,
        italic: true
      };
      
      const result = createTextBox(newTextBox, mockContext);
      
      const created = result.model.views[0].textBoxes![0];
      expect(created.content).toBe('Full Text Box');
      expect(created.fontSize).toBe(20);
      expect(created.color).toBe('color7');
      expect(created.backgroundColor).toBe('color8');
      expect(created.borderColor).toBe('color9');
      expect(created.alignment).toBe('center');
      expect(created.bold).toBe(true);
      expect(created.italic).toBe(true);
    });

    it('should throw error when view does not exist', () => {
      mockContext.viewId = 'nonexistent';
      
      const newTextBox: TextBox = {
        id: 'textbox2',
        position: { x: 30, y: 40 },
        content: 'New Text Box'
      };
      
      expect(() => {
        createTextBox(newTextBox, mockContext);
      }).toThrow('Item with id nonexistent not found');
    });
  });

  describe('deleteTextBox', () => {
    it('should delete a text box from both model and scene', () => {
      const result = deleteTextBox('textbox1', mockContext);
      
      // Check text box is removed from model
      expect(result.model.views[0].textBoxes).toHaveLength(0);
      
      // Check text box is removed from scene
      expect(result.scene.textBoxes['textbox1']).toBeUndefined();
    });

    it('should throw error when text box does not exist', () => {
      expect(() => {
        deleteTextBox('nonexistent', mockContext);
      }).toThrow('Item with id nonexistent not found');
    });

    it('should throw error when view does not exist', () => {
      mockContext.viewId = 'nonexistent';
      
      expect(() => {
        deleteTextBox('textbox1', mockContext);
      }).toThrow('Item with id nonexistent not found');
    });

    it('should handle empty textBoxes array', () => {
      mockState.model.views[0].textBoxes = [];
      
      expect(() => {
        deleteTextBox('textbox1', mockContext);
      }).toThrow('Item with id textbox1 not found');
    });

    it('should not affect other text boxes when deleting one', () => {
      const textBox2: TextBox = {
        id: 'textbox2',
        position: { x: 50, y: 60 },
        content: 'Second Text Box'
      };
      
      mockState.model.views[0].textBoxes = [mockTextBox, textBox2];
      mockState.scene.textBoxes['textbox2'] = { 
        size: { width: 150, height: 16 }
      };
      
      const result = deleteTextBox('textbox1', mockContext);
      
      expect(result.model.views[0].textBoxes).toHaveLength(1);
      expect(result.model.views[0].textBoxes![0].id).toBe('textbox2');
      
      // Verify proper scene cleanup
      expect(result.scene.textBoxes['textbox1']).toBeUndefined();
      expect(result.scene.textBoxes['textbox2']).toBeDefined();
    });
  });

  describe('edge cases and state immutability', () => {
    it('should not mutate the original state', () => {
      const originalState = JSON.parse(JSON.stringify(mockState));
      
      deleteTextBox('textbox1', mockContext);
      
      expect(mockState).toEqual(originalState);
    });

    it('should handle multiple operations in sequence', () => {
      // Create
      let result = createTextBox({
        id: 'textbox2',
        position: { x: 100, y: 100 },
        content: 'New Box'
      }, { ...mockContext, state: mockState });
      
      // Update
      result = updateTextBox({
        id: 'textbox2',
        content: 'Updated Box',
        fontSize: 24
      }, { ...mockContext, state: result });
      
      // Delete original
      result = deleteTextBox('textbox1', { ...mockContext, state: result });
      
      expect(result.model.views[0].textBoxes).toHaveLength(1);
      expect(result.model.views[0].textBoxes![0].id).toBe('textbox2');
      expect(result.model.views[0].textBoxes![0].content).toBe('Updated Box');
      expect(result.model.views[0].textBoxes![0].fontSize).toBe(24);
    });

    it('should handle view with multiple text boxes', () => {
      const textBoxes: TextBox[] = Array.from({ length: 5 }, (_, i) => ({
        id: `textbox${i}`,
        position: { x: i * 10, y: i * 10 },
        content: `Text ${i}`
      }));
      
      mockState.model.views[0].textBoxes = textBoxes;
      
      const result = deleteTextBox('textbox2', mockContext);
      
      expect(result.model.views[0].textBoxes).toHaveLength(4);
      expect(result.model.views[0].textBoxes!.find(t => t.id === 'textbox2')).toBeUndefined();
    });
  });
});