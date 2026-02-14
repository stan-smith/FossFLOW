import { renderHook, act } from '@testing-library/react';
import { useHistory } from '../useHistory';

// Mock implementations
const mockModelStore = {
  canUndo: jest.fn(),
  canRedo: jest.fn(),
  undo: jest.fn(),
  redo: jest.fn(),
  saveToHistory: jest.fn(),
  clearHistory: jest.fn()
};

const mockSceneStore = {
  canUndo: jest.fn(),
  canRedo: jest.fn(),
  undo: jest.fn(),
  redo: jest.fn(),
  saveToHistory: jest.fn(),
  clearHistory: jest.fn()
};

// Mock the store hooks
jest.mock('../../stores/modelStore', () => ({
  useModelStore: jest.fn((selector) => {
    const state = {
      actions: mockModelStore
    };
    return selector ? selector(state) : state;
  })
}));

jest.mock('../../stores/sceneStore', () => ({
  useSceneStore: jest.fn((selector) => {
    const state = {
      actions: mockSceneStore
    };
    return selector ? selector(state) : state;
  })
}));

describe('useHistory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset mock implementations
    mockModelStore.canUndo.mockReturnValue(false);
    mockModelStore.canRedo.mockReturnValue(false);
    mockModelStore.undo.mockReturnValue(true);
    mockModelStore.redo.mockReturnValue(true);
    
    mockSceneStore.canUndo.mockReturnValue(false);
    mockSceneStore.canRedo.mockReturnValue(false);
    mockSceneStore.undo.mockReturnValue(true);
    mockSceneStore.redo.mockReturnValue(true);
  });

  describe('undo/redo basic functionality', () => {
    it('should initialize with no undo/redo capability', () => {
      const { result } = renderHook(() => useHistory());
      
      expect(result.current.canUndo).toBe(false);
      expect(result.current.canRedo).toBe(false);
    });

    it('should call saveToHistory on both stores', () => {
      const { result } = renderHook(() => useHistory());
      
      act(() => {
        result.current.saveToHistory();
      });
      
      expect(mockModelStore.saveToHistory).toHaveBeenCalled();
      expect(mockSceneStore.saveToHistory).toHaveBeenCalled();
    });

    it('should perform undo when model store has history', () => {
      mockModelStore.canUndo.mockReturnValue(true);
      const { result } = renderHook(() => useHistory());
      
      expect(result.current.canUndo).toBe(true);
      
      act(() => {
        const success = result.current.undo();
        expect(success).toBe(true);
      });
      
      expect(mockModelStore.undo).toHaveBeenCalled();
    });

    it('should perform undo when scene store has history', () => {
      mockSceneStore.canUndo.mockReturnValue(true);
      const { result } = renderHook(() => useHistory());
      
      expect(result.current.canUndo).toBe(true);
      
      act(() => {
        const success = result.current.undo();
        expect(success).toBe(true);
      });
      
      expect(mockSceneStore.undo).toHaveBeenCalled();
    });

    it('should perform redo when model store has future', () => {
      mockModelStore.canRedo.mockReturnValue(true);
      const { result } = renderHook(() => useHistory());
      
      expect(result.current.canRedo).toBe(true);
      
      act(() => {
        const success = result.current.redo();
        expect(success).toBe(true);
      });
      
      expect(mockModelStore.redo).toHaveBeenCalled();
    });

    it('should return false when undo is called with no history', () => {
      mockModelStore.undo.mockReturnValue(false);
      mockSceneStore.undo.mockReturnValue(false);
      
      const { result } = renderHook(() => useHistory());
      
      act(() => {
        const success = result.current.undo();
        expect(success).toBe(false);
      });
    });

    it('should return false when redo is called with no future', () => {
      mockModelStore.redo.mockReturnValue(false);
      mockSceneStore.redo.mockReturnValue(false);
      
      const { result } = renderHook(() => useHistory());
      
      act(() => {
        const success = result.current.redo();
        expect(success).toBe(false);
      });
    });
  });

  describe('transaction functionality', () => {
    it('should save history before transaction and not during', () => {
      const { result } = renderHook(() => useHistory());
      
      act(() => {
        result.current.transaction(() => {
          // This should not trigger saveToHistory due to transaction
          result.current.saveToHistory();
        });
      });
      
      // Should save once before transaction starts
      expect(mockModelStore.saveToHistory).toHaveBeenCalledTimes(1);
      expect(mockSceneStore.saveToHistory).toHaveBeenCalledTimes(1);
    });

    it('should track transaction state correctly', () => {
      const { result } = renderHook(() => useHistory());
      
      expect(result.current.isInTransaction()).toBe(false);
      
      act(() => {
        result.current.transaction(() => {
          expect(result.current.isInTransaction()).toBe(true);
        });
      });
      
      expect(result.current.isInTransaction()).toBe(false);
    });

    it('should prevent nested transactions', () => {
      const { result } = renderHook(() => useHistory());
      
      act(() => {
        result.current.transaction(() => {
          // First transaction saves history
          expect(mockModelStore.saveToHistory).toHaveBeenCalledTimes(1);
          
          // Nested transaction should not save again
          result.current.transaction(() => {
            // Still in transaction
            expect(result.current.isInTransaction()).toBe(true);
          });
          
          // Should still be 1 save
          expect(mockModelStore.saveToHistory).toHaveBeenCalledTimes(1);
        });
      });
    });

    it('should handle transaction errors gracefully', () => {
      const { result } = renderHook(() => useHistory());
      
      expect(() => {
        act(() => {
          result.current.transaction(() => {
            throw new Error('Test error');
          });
        });
      }).toThrow('Test error');
      
      // Transaction should be cleaned up
      expect(result.current.isInTransaction()).toBe(false);
    });
  });

  describe('history management', () => {
    it('should clear all history', () => {
      const { result } = renderHook(() => useHistory());
      
      act(() => {
        result.current.clearHistory();
      });
      
      expect(mockModelStore.clearHistory).toHaveBeenCalled();
      expect(mockSceneStore.clearHistory).toHaveBeenCalled();
    });

    it('should check both stores for undo capability', () => {
      // Only model has undo
      mockModelStore.canUndo.mockReturnValue(true);
      mockSceneStore.canUndo.mockReturnValue(false);
      
      const { result: result1 } = renderHook(() => useHistory());
      expect(result1.current.canUndo).toBe(true);
      
      // Only scene has undo
      mockModelStore.canUndo.mockReturnValue(false);
      mockSceneStore.canUndo.mockReturnValue(true);
      
      const { result: result2 } = renderHook(() => useHistory());
      expect(result2.current.canUndo).toBe(true);
      
      // Both have undo
      mockModelStore.canUndo.mockReturnValue(true);
      mockSceneStore.canUndo.mockReturnValue(true);
      
      const { result: result3 } = renderHook(() => useHistory());
      expect(result3.current.canUndo).toBe(true);
      
      // Neither has undo
      mockModelStore.canUndo.mockReturnValue(false);
      mockSceneStore.canUndo.mockReturnValue(false);
      
      const { result: result4 } = renderHook(() => useHistory());
      expect(result4.current.canUndo).toBe(false);
    });

    it('should check both stores for redo capability', () => {
      // Only model has redo
      mockModelStore.canRedo.mockReturnValue(true);
      mockSceneStore.canRedo.mockReturnValue(false);
      
      const { result: result1 } = renderHook(() => useHistory());
      expect(result1.current.canRedo).toBe(true);
      
      // Only scene has redo
      mockModelStore.canRedo.mockReturnValue(false);
      mockSceneStore.canRedo.mockReturnValue(true);
      
      const { result: result2 } = renderHook(() => useHistory());
      expect(result2.current.canRedo).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle missing store actions gracefully', () => {
      // Mock stores returning undefined actions
      const useModelStore = require('../../stores/modelStore').useModelStore;
      const useSceneStore = require('../../stores/sceneStore').useSceneStore;
      
      useModelStore.mockImplementation((selector) => {
        const state = { actions: undefined };
        return selector ? selector(state) : state;
      });
      useSceneStore.mockImplementation((selector) => {
        const state = { actions: undefined };
        return selector ? selector(state) : state;
      });
      
      const { result } = renderHook(() => useHistory());
      
      // Should not throw and return safe defaults
      expect(result.current.canUndo).toBe(false);
      expect(result.current.canRedo).toBe(false);
      
      act(() => {
        expect(result.current.undo()).toBe(false);
        expect(result.current.redo()).toBe(false);
        // These should not throw
        result.current.saveToHistory();
        result.current.clearHistory();
        result.current.transaction(() => {});
      });
      
      // Restore mocks for other tests
      useModelStore.mockImplementation((selector) => {
        const state = { actions: mockModelStore };
        return selector ? selector(state) : state;
      });
      useSceneStore.mockImplementation((selector) => {
        const state = { actions: mockSceneStore };
        return selector ? selector(state) : state;
      });
    });

    it('should not save history during active transaction', () => {
      const { result } = renderHook(() => useHistory());
      
      act(() => {
        result.current.transaction(() => {
          // Clear previous calls from transaction setup
          mockModelStore.saveToHistory.mockClear();
          mockSceneStore.saveToHistory.mockClear();
          
          // Try to save during transaction
          result.current.saveToHistory();
          
          // Should not have saved
          expect(mockModelStore.saveToHistory).not.toHaveBeenCalled();
          expect(mockSceneStore.saveToHistory).not.toHaveBeenCalled();
        });
      });
    });
  });
});