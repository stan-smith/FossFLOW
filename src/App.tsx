import { useState, useEffect, useRef } from 'react';
import { Isoflow } from 'fossflow';
import { flattenCollections } from '@isoflow/isopacks/dist/utils';
import isoflowIsopack from '@isoflow/isopacks/dist/isoflow';
import awsIsopack from '@isoflow/isopacks/dist/aws';
import gcpIsopack from '@isoflow/isopacks/dist/gcp';
import azureIsopack from '@isoflow/isopacks/dist/azure';
import kubernetesIsopack from '@isoflow/isopacks/dist/kubernetes';
import { DiagramData, mergeDiagramData, extractSavableData } from './diagramUtils';
import { StorageManager } from './StorageManager';
import './App.css';

const icons = flattenCollections([
  isoflowIsopack,
  awsIsopack,
  azureIsopack,
  gcpIsopack,
  kubernetesIsopack
]);


interface SavedDiagram {
  id: string;
  name: string;
  data: any;
  createdAt: string;
  updatedAt: string;
}

function App() {
  const [diagrams, setDiagrams] = useState<SavedDiagram[]>([]);
  const [currentDiagram, setCurrentDiagram] = useState<SavedDiagram | null>(null);
  const [diagramName, setDiagramName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [importJson, setImportJson] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fossflowKey, setFossflowKey] = useState(0); // Key to force re-render of FossFLOW
  const [currentModel, setCurrentModel] = useState<DiagramData | null>(null); // Store current model state
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastAutoSave, setLastAutoSave] = useState<Date | null>(null);
  const [showStorageManager, setShowStorageManager] = useState(false);
  
  // Initialize with empty diagram data
  // Create default colors for connectors
  const defaultColors = [
    { id: 'blue', value: '#0066cc' },
    { id: 'green', value: '#00aa00' },
    { id: 'red', value: '#cc0000' },
    { id: 'orange', value: '#ff9900' },
    { id: 'purple', value: '#9900cc' },
    { id: 'black', value: '#000000' },
    { id: 'gray', value: '#666666' }
  ];
  
  
  const [diagramData, setDiagramData] = useState<DiagramData>({
    title: 'Untitled Diagram',
    icons: icons, // Keep full icon set for FossFLOW
    colors: defaultColors,
    items: [],
    views: [],
    fitToScreen: true
  });

  // Load diagrams from localStorage on component mount
  useEffect(() => {
    const savedDiagrams = localStorage.getItem('fossflow-diagrams');
    if (savedDiagrams) {
      setDiagrams(JSON.parse(savedDiagrams));
    }
    
    // Load last opened diagram
    const lastOpenedId = localStorage.getItem('fossflow-last-opened');
    const lastOpenedData = localStorage.getItem('fossflow-last-opened-data');
    
    if (lastOpenedId && lastOpenedData) {
      try {
        const data = JSON.parse(lastOpenedData);
        // Always include full icon set
        const dataWithIcons = {
          ...data,
          icons: icons // Replace with full icon set
        };
        setDiagramData(dataWithIcons);
        setCurrentModel(dataWithIcons);
        
        // Find and set the diagram metadata
        if (savedDiagrams) {
          const allDiagrams = JSON.parse(savedDiagrams);
          const lastDiagram = allDiagrams.find((d: SavedDiagram) => d.id === lastOpenedId);
          if (lastDiagram) {
            setCurrentDiagram(lastDiagram);
            setDiagramName(lastDiagram.name);
          }
        }
      } catch (e) {
        console.error('Failed to restore last diagram:', e);
      }
    }
  }, []);

    // Save diagrams to localStorage whenever they change
  useEffect(() => {
    try {
      // Store diagrams without the full icon data
      const diagramsToStore = diagrams.map(d => ({
        ...d,
        data: {
          ...d.data,
          icons: [] // Don't store icons with each diagram
        }
      }));
      localStorage.setItem('fossflow-diagrams', JSON.stringify(diagramsToStore));
    } catch (e) {
      console.error('Failed to save diagrams:', e);
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        alert('Storage quota exceeded. Please export important diagrams and clear some space.');
      }
    }
  }, [diagrams]);

  const saveDiagram = () => {
    if (!diagramName.trim()) {
      alert('Please enter a diagram name');
      return;
    }

    // Construct save data WITHOUT icons (they're loaded separately)
    const savedData = {
      title: diagramName,
      icons: [], // Don't save icons with diagram
      colors: currentModel?.colors || diagramData.colors || [],
      items: currentModel?.items || diagramData.items || [],
      views: currentModel?.views || diagramData.views || [],
      fitToScreen: true
    };
    

    const newDiagram: SavedDiagram = {
      id: currentDiagram?.id || Date.now().toString(),
      name: diagramName,
      data: savedData,
      createdAt: currentDiagram?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (currentDiagram) {
      // Update existing diagram
      setDiagrams(diagrams.map(d => d.id === currentDiagram.id ? newDiagram : d));
    } else {
      // Add new diagram
      setDiagrams([...diagrams, newDiagram]);
    }

    setCurrentDiagram(newDiagram);
    setShowSaveDialog(false);
    setHasUnsavedChanges(false);
    setLastAutoSave(new Date());
    
    // Save as last opened
    try {
      localStorage.setItem('fossflow-last-opened', newDiagram.id);
      localStorage.setItem('fossflow-last-opened-data', JSON.stringify(newDiagram.data));
    } catch (e) {
      console.error('Failed to save diagram:', e);
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        alert('Storage full! Opening Storage Manager...');
        setShowStorageManager(true);
      }
    }
  };

  const loadDiagram = (diagram: SavedDiagram) => {
    if (hasUnsavedChanges && !window.confirm('You have unsaved changes. Continue loading?')) {
      return;
    }
    
    // Always ensure icons are present when loading
    const dataWithIcons = {
      ...diagram.data,
      icons: icons // Replace with full icon set
    };
    
    setCurrentDiagram(diagram);
    setDiagramName(diagram.name);
    setDiagramData(dataWithIcons);
    setCurrentModel(dataWithIcons);
    setFossflowKey(prev => prev + 1); // Force re-render of FossFLOW
    setShowLoadDialog(false);
    setHasUnsavedChanges(false);
    
    // Save as last opened (without icons)
    try {
      localStorage.setItem('fossflow-last-opened', diagram.id);
      localStorage.setItem('fossflow-last-opened-data', JSON.stringify(diagram.data));
    } catch (e) {
      console.error('Failed to save last opened:', e);
    }
  };

  const deleteDiagram = (id: string) => {
    if (window.confirm('Are you sure you want to delete this diagram?')) {
      setDiagrams(diagrams.filter(d => d.id !== id));
      if (currentDiagram?.id === id) {
        setCurrentDiagram(null);
        setDiagramName('');
      }
    }
  };

  const newDiagram = () => {
    const message = hasUnsavedChanges 
      ? 'You have unsaved changes. Export your diagram first to save it. Continue?'
      : 'Create a new diagram?';
      
    if (window.confirm(message)) {
      const emptyDiagram: DiagramData = {
        title: 'Untitled Diagram',
        icons: icons, // Always include full icon set
        colors: defaultColors,
        items: [],
        views: [],
        fitToScreen: true
      };
      setCurrentDiagram(null);
      setDiagramName('');
      setDiagramData(emptyDiagram);
      setCurrentModel(emptyDiagram); // Reset current model too
      setFossflowKey(prev => prev + 1); // Force re-render of FossFLOW
      setHasUnsavedChanges(false);
      
      // Clear last opened
      localStorage.removeItem('fossflow-last-opened');
      localStorage.removeItem('fossflow-last-opened-data');
    }
  };

  const handleModelUpdated = (model: any) => {
    // Store the current model state whenever it updates
    // Model update received
    
    // Deep merge the model update with our current state
    // This handles both complete and partial updates
    setCurrentModel((prevModel: DiagramData | null) => {
      const merged = {
        // Start with previous model or diagram data
        ...(prevModel || diagramData),
        // Override with any new data from the model update
        ...model,
        // Ensure we always have required fields
        title: model.title || prevModel?.title || diagramData.title || 'Untitled',
        // Keep icons in the data structure for FossFLOW to work
        icons: icons, // Always use full icon set
        colors: model.colors || prevModel?.colors || diagramData.colors || [],
        // These fields likely come from the model update
        items: model.items !== undefined ? model.items : (prevModel?.items || diagramData.items || []),
        views: model.views !== undefined ? model.views : (prevModel?.views || diagramData.views || []),
        fitToScreen: true
      };
      setHasUnsavedChanges(true);
      return merged;
    });
  };

  const exportDiagram = () => {
    // For export, DO include icons so the file is self-contained
    const exportData = {
      title: diagramName || currentModel?.title || diagramData.title || 'Exported Diagram',
      icons: icons, // Include ALL icons for portability
      colors: currentModel?.colors || diagramData.colors || [],
      items: currentModel?.items || diagramData.items || [],
      views: currentModel?.views || diagramData.views || [],
      fitToScreen: true
    };
    
    const jsonString = JSON.stringify(exportData, null, 2);
    
    // Create a blob and download link
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${diagramName || 'diagram'}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    setShowExportDialog(false);
    setHasUnsavedChanges(false); // Mark as saved after export
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedData = JSON.parse(content);
        
        // Merge imported data with our icons
        const mergedData: DiagramData = {
          ...parsedData,
          title: parsedData.title || 'Imported Diagram',
          icons: icons, // Always use app icons
          colors: parsedData.colors?.length ? parsedData.colors : defaultColors,
          fitToScreen: parsedData.fitToScreen !== false
        };
        
        setDiagramData(mergedData);
        setDiagramName(parsedData.title || 'Imported Diagram');
        setCurrentModel(mergedData);
        setFossflowKey(prev => prev + 1); // Force re-render
        setShowImportDialog(false);
        setHasUnsavedChanges(true);
        
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        // Success message
        setTimeout(() => {
          alert(`Diagram "${parsedData.title || 'Untitled'}" imported successfully!`);
        }, 100);
      } catch (error) {
        alert('Invalid JSON file. Please check the file format.');
      }
    };
    
    reader.onerror = () => {
      alert('Error reading file. Please try again.');
    };
    
    reader.readAsText(file);
  };
  
  const importDiagram = () => {
    // Trigger file input click
    fileInputRef.current?.click();
  };
  
  // Auto-save functionality
  useEffect(() => {
    if (!currentModel || !hasUnsavedChanges || !currentDiagram) return;
    
    const autoSaveTimer = setTimeout(() => {
      const savedData = {
        title: diagramName || currentDiagram.name,
        icons: [], // Don't save icons in auto-save
        colors: currentModel.colors || [],
        items: currentModel.items || [],
        views: currentModel.views || [],
        fitToScreen: true
      };
      
      const updatedDiagram: SavedDiagram = {
        ...currentDiagram,
        data: savedData,
        updatedAt: new Date().toISOString()
      };
      
      setDiagrams(prevDiagrams => 
        prevDiagrams.map(d => d.id === currentDiagram.id ? updatedDiagram : d)
      );
      
      // Update last opened data
      try {
        localStorage.setItem('fossflow-last-opened-data', JSON.stringify(savedData));
        setLastAutoSave(new Date());
        setHasUnsavedChanges(false);
      } catch (e) {
        console.error('Auto-save failed:', e);
        if (e instanceof DOMException && e.name === 'QuotaExceededError') {
          alert('Storage full! Please use Storage Manager to free up space.');
          setShowStorageManager(true);
        }
      }
    }, 5000); // Auto-save after 5 seconds of changes
    
    return () => clearTimeout(autoSaveTimer);
  }, [currentModel, hasUnsavedChanges, currentDiagram, diagramName]);
  
  // Warn before closing if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return (
    <div className="App">
      <div className="toolbar">
        <button onClick={newDiagram}>New Diagram</button>
        <button onClick={() => setShowSaveDialog(true)}>Save (Session Only)</button>
        <button onClick={() => setShowLoadDialog(true)}>Load (Session Only)</button>
        <button 
          onClick={() => setShowImportDialog(true)}
          style={{ backgroundColor: '#28a745' }}
        >
          📂 Import File
        </button>
        <button 
          onClick={() => setShowExportDialog(true)}
          style={{ backgroundColor: '#007bff' }}
        >
          💾 Export File
        </button>
        <button 
          onClick={() => {
            if (currentDiagram && hasUnsavedChanges) {
              saveDiagram();
            }
          }}
          disabled={!currentDiagram || !hasUnsavedChanges}
          style={{ 
            backgroundColor: currentDiagram && hasUnsavedChanges ? '#ffc107' : '#6c757d',
            opacity: currentDiagram && hasUnsavedChanges ? 1 : 0.5,
            cursor: currentDiagram && hasUnsavedChanges ? 'pointer' : 'not-allowed'
          }}
          title="Save to current session only"
        >
          Quick Save (Session)
        </button>
        <span className="current-diagram">
          {currentDiagram ? `Current: ${currentDiagram.name}` : diagramName || 'Untitled Diagram'}
          {hasUnsavedChanges && <span style={{ color: '#ff9800', marginLeft: '10px' }}>• Modified</span>}
          <span style={{ fontSize: '12px', color: '#666', marginLeft: '10px' }}>
            (Session storage only - export to save permanently)
          </span>
        </span>
      </div>

      <div className="fossflow-container">
        <Isoflow 
          key={fossflowKey}
          initialData={diagramData}
          onModelUpdated={handleModelUpdated}
          editorMode="EDITABLE"
        />
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h2>Save Diagram (Current Session Only)</h2>
            <div style={{
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeeba',
              padding: '15px',
              borderRadius: '4px',
              marginBottom: '20px'
            }}>
              <strong>⚠️ Important:</strong> This save is temporary and will be lost when you close the browser.
              <br />
              Use <strong>Export File</strong> to permanently save your work.
            </div>
            <input
              type="text"
              placeholder="Enter diagram name"
              value={diagramName}
              onChange={(e) => setDiagramName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveDiagram()}
              autoFocus
            />
            <div className="dialog-buttons">
              <button onClick={saveDiagram}>Save</button>
              <button onClick={() => setShowSaveDialog(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Load Dialog */}
      {showLoadDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h2>Load Diagram (Current Session Only)</h2>
            <div style={{
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeeba',
              padding: '15px',
              borderRadius: '4px',
              marginBottom: '20px'
            }}>
              <strong>⚠️ Note:</strong> These saves are temporary. Export your diagrams to keep them permanently.
            </div>
            <div className="diagram-list">
              {diagrams.length === 0 ? (
                <p>No saved diagrams found in this session</p>
              ) : (
                diagrams.map(diagram => (
                  <div key={diagram.id} className="diagram-item">
                    <div>
                      <strong>{diagram.name}</strong>
                      <br />
                      <small>Updated: {new Date(diagram.updatedAt).toLocaleString()}</small>
                    </div>
                    <div className="diagram-actions">
                      <button onClick={() => loadDiagram(diagram)}>Load</button>
                      <button onClick={() => deleteDiagram(diagram.id)}>Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="dialog-buttons">
              <button onClick={() => setShowLoadDialog(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      
      {/* Import Dialog */}
      {showImportDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h2>Import Diagram</h2>
            <div style={{
              border: '2px dashed #ccc',
              borderRadius: '8px',
              padding: '40px',
              textAlign: 'center',
              marginBottom: '20px',
              backgroundColor: '#f8f9fa'
            }}>
              <p style={{ fontSize: '18px', marginBottom: '20px' }}>Choose a JSON file to import</p>
              <button 
                onClick={importDiagram}
                style={{
                  padding: '12px 24px',
                  fontSize: '16px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Select File
              </button>
              <p style={{ marginTop: '20px', color: '#666', fontSize: '14px' }}>
                Supported format: .json files exported from Isoflow
              </p>
            </div>
            <div className="dialog-buttons">
              <button onClick={() => setShowImportDialog(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Export Dialog */}
      {showExportDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h2>Export Diagram</h2>
            <div style={{
              backgroundColor: '#d4edda',
              border: '1px solid #c3e6cb',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <p style={{ margin: '0 0 10px 0' }}>
                <strong>✅ Recommended:</strong> This is the best way to save your work permanently.
              </p>
              <p style={{ margin: 0, fontSize: '14px', color: '#155724' }}>
                Exported JSON files can be imported later or shared with others.
              </p>
            </div>
            <div className="dialog-buttons">
              <button onClick={exportDiagram}>Download JSON</button>
              <button onClick={() => setShowExportDialog(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Storage Manager */}
      {showStorageManager && (
        <StorageManager onClose={() => setShowStorageManager(false)} />
      )}
    </div>
  );
}

export default App;
