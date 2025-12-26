export declare const useHistory: () => {
    undo: () => boolean;
    redo: () => boolean;
    canUndo: boolean;
    canRedo: boolean;
    saveToHistory: () => void;
    clearHistory: () => void;
    transaction: (operations: () => void) => void;
    isInTransaction: () => boolean;
};
