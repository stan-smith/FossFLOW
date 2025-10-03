import React, { useState, useEffect } from 'react';
import { storageManager, DiagramInfo } from '../services/storageService';
import './DiagramManager.css';

interface Props {
  onLoadDiagram: (id: string, data: any) => void;
  currentDiagramId?: string;
  currentDiagramData?: any;
  onClose: () => void;
}

export const DiagramManager: React.FC<Props> = ({ 
  onLoadDiagram, 
  currentDiagramId, 
  currentDiagramData,
  onClose 
}) => {
  const [diagrams, setDiagrams] = useState<DiagramInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isServerStorage, setIsServerStorage] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  useEffect(() => {
    loadDiagrams();
  }, []);

  const loadDiagrams = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('DiagramManager: Initializing storage...');
      // Initialize storage if not already done
      await storageManager.initialize();
      const isServer = storageManager.isServerStorage();
      setIsServerStorage(isServer);
      console.log(`DiagramManager: Using ${isServer ? 'server' : 'session'} storage`);

      // Load diagram list
      const storage = storageManager.getStorage();
      console.log('DiagramManager: Loading diagram list...');
      const list = await storage.listDiagrams();
      console.log(`DiagramManager: Loaded ${list.length} diagrams`);
      setDiagrams(list);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load diagrams';
      console.error('DiagramManager error:', err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleLoad = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`DiagramManager: Loading diagram ${id}...`);

      const storage = storageManager.getStorage();
      const data = await storage.loadDiagram(id);

      console.log(`DiagramManager: Successfully loaded diagram ${id}`);
      onLoadDiagram(id, data);

      // Small delay to ensure parent component finishes state updates
      await new Promise(resolve => setTimeout(resolve, 100));

      onClose();
    } catch (err) {
      console.error(`DiagramManager: Failed to load diagram ${id}:`, err);
      setError(err instanceof Error ? err.message : 'Failed to load diagram');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this diagram?')) {
      return;
    }

    try {
      const storage = storageManager.getStorage();
      await storage.deleteDiagram(id);
      await loadDiagrams(); // Refresh list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete diagram');
    }
  };

  const handleSave = async () => {
    if (!saveName.trim()) {
      setError('Please enter a diagram name');
      return;
    }

    try {
      const storage = storageManager.getStorage();

      // Check if a diagram with this name already exists (excluding current diagram)
      const existingDiagram = diagrams.find(d =>
        d.name === saveName.trim() && d.id !== currentDiagramId
      );

      if (existingDiagram) {
        const confirmOverwrite = window.confirm(
          `A diagram named "${saveName}" already exists. This will overwrite it. Are you sure you want to continue?`
        );
        if (!confirmOverwrite) {
          return;
        }

        // Delete the existing diagram first
        await storage.deleteDiagram(existingDiagram.id);
      }

      /**
       * Icon Persistence: Save ALL icons (default + imported)
       *
       * currentDiagramData comes from parent's currentModel/diagramData which includes:
       * - All default icon collections (isoflow, aws, gcp, azure, kubernetes)
       * - All imported custom icons (collection='imported')
       *
       * This ensures when loading, we have the complete icon set and don't lose
       * any custom imported icons.
       */
      const dataToSave = {
        ...currentDiagramData,
        name: saveName
      };

      console.log(`DiagramManager: Saving diagram with ${dataToSave.icons?.length || 0} icons`);
      const importedCount = (dataToSave.icons || []).filter((icon: any) => icon.collection === 'imported').length;
      console.log(`DiagramManager: Including ${importedCount} imported icons`);

      if (currentDiagramId) {
        // Update existing
        await storage.saveDiagram(currentDiagramId, dataToSave);
      } else {
        // Create new
        await storage.createDiagram(dataToSave);
      }

      setShowSaveDialog(false);
      setSaveName('');
      await loadDiagrams(); // Refresh list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save diagram');
    }
  };

  return (
    <div className="diagram-manager-overlay">
      <div className="diagram-manager">
        <div className="diagram-manager-header">
          <h2>Diagram Manager</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="storage-info">
          <span className={`storage-badge ${isServerStorage ? 'server' : 'local'}`}>
            {isServerStorage ? '🌐 Server Storage' : '💾 Local Storage'}
          </span>
          {isServerStorage && (
            <span className="storage-note">
              Diagrams are saved on the server and available across all devices
            </span>
          )}
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="diagram-manager-actions">
          <button 
            className="action-button primary"
            onClick={() => {
              setSaveName(currentDiagramData?.name || 'Untitled Diagram');
              setShowSaveDialog(true);
            }}
          >
            💾 Save Current Diagram
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading diagrams...</div>
        ) : (
          <div className="diagram-list">
            {diagrams.length === 0 ? (
              <div className="empty-state">
                <p>No saved diagrams</p>
                <p className="hint">Save your current diagram to get started</p>
              </div>
            ) : (
              diagrams.map(diagram => (
                <div key={diagram.id} className="diagram-item">
                  <div className="diagram-info">
                    <h3>{diagram.name}</h3>
                    <span className="diagram-meta">
                      Last modified: {diagram.lastModified.toLocaleString()}
                      {diagram.size && ` • ${(diagram.size / 1024).toFixed(1)} KB`}
                    </span>
                  </div>
                  <div className="diagram-actions">
                    <button
                      className="action-button"
                      onClick={() => handleLoad(diagram.id)}
                      disabled={loading}
                    >
                      {loading ? 'Loading...' : 'Load'}
                    </button>
                    <button
                      className="action-button danger"
                      onClick={() => handleDelete(diagram.id)}
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Save Dialog */}
        {showSaveDialog && (
          <div className="save-dialog">
            <h3>Save Diagram</h3>
            <input
              type="text"
              placeholder="Diagram name"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              autoFocus
            />
            <div className="dialog-buttons">
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setShowSaveDialog(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};