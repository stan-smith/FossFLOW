import { Model } from 'fossflow/dist/types';

export interface DiagramInfo {
  id: string;
  name: string;
  lastModified: Date;
  size?: number;
}

export interface StorageService {
  isAvailable(): Promise<boolean>;
  listDiagrams(): Promise<DiagramInfo[]>;
  loadDiagram(id: string): Promise<Model>;
  saveDiagram(id: string, data: Model): Promise<void>;
  deleteDiagram(id: string): Promise<void>;
  createDiagram(data: Model): Promise<string>;
}

// Server Storage Implementation
class ServerStorage implements StorageService {
  private baseUrl: string;
  private available: boolean | null = null;

  constructor(baseUrl: string = '') {
    // In production (Docker), use relative paths (nginx proxy)
    // In development, use localhost:3001
    const isDevelopment = window.location.hostname === 'localhost' && window.location.port === '3000';
    this.baseUrl = baseUrl || (isDevelopment ? 'http://localhost:3001' : '');
  }

  async isAvailable(): Promise<boolean> {
    if (this.available !== null) return this.available;

    try {
      const response = await fetch(`${this.baseUrl}/api/storage/status`);
      const data = await response.json();
      this.available = data.enabled;
      return this.available;
    } catch (error) {
      console.log('Server storage not available:', error);
      this.available = false;
      return false;
    }
  }

  async listDiagrams(): Promise<DiagramInfo[]> {
    const response = await fetch(`${this.baseUrl}/api/diagrams`);
    if (!response.ok) throw new Error('Failed to list diagrams');
    
    const diagrams = await response.json();
    return diagrams.map((d: any) => ({
      ...d,
      lastModified: new Date(d.lastModified)
    }));
  }

  async loadDiagram(id: string): Promise<Model> {
    const response = await fetch(`${this.baseUrl}/api/diagrams/${id}`);
    if (!response.ok) throw new Error('Failed to load diagram');
    return response.json();
  }

  async saveDiagram(id: string, data: Model): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/diagrams/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to save diagram');
  }

  async deleteDiagram(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/diagrams/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete diagram');
  }

  async createDiagram(data: Model): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/diagrams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create diagram');
    const result = await response.json();
    return result.id;
  }
}

// Session Storage Implementation (existing functionality)
class SessionStorage implements StorageService {
  private readonly KEY_PREFIX = 'fossflow_diagram_';
  private readonly LIST_KEY = 'fossflow_diagrams';

  async isAvailable(): Promise<boolean> {
    return true; // Session storage is always available
  }

  async listDiagrams(): Promise<DiagramInfo[]> {
    const listStr = sessionStorage.getItem(this.LIST_KEY);
    if (!listStr) return [];
    
    const list = JSON.parse(listStr);
    return list.map((item: any) => ({
      ...item,
      lastModified: new Date(item.lastModified)
    }));
  }

  async loadDiagram(id: string): Promise<Model> {
    const data = sessionStorage.getItem(`${this.KEY_PREFIX}${id}`);
    if (!data) throw new Error('Diagram not found');
    return JSON.parse(data);
  }

  async saveDiagram(id: string, data: Model): Promise<void> {
    sessionStorage.setItem(`${this.KEY_PREFIX}${id}`, JSON.stringify(data));
    
    // Update list
    const list = await this.listDiagrams();
    const existing = list.findIndex(d => d.id === id);
    const info: DiagramInfo = {
      id,
      name: (data as any).name || 'Untitled Diagram',
      lastModified: new Date(),
      size: JSON.stringify(data).length
    };
    
    if (existing >= 0) {
      list[existing] = info;
    } else {
      list.push(info);
    }
    
    sessionStorage.setItem(this.LIST_KEY, JSON.stringify(list));
  }

  async deleteDiagram(id: string): Promise<void> {
    sessionStorage.removeItem(`${this.KEY_PREFIX}${id}`);
    
    // Update list
    const list = await this.listDiagrams();
    const filtered = list.filter(d => d.id !== id);
    sessionStorage.setItem(this.LIST_KEY, JSON.stringify(filtered));
  }

  async createDiagram(data: Model): Promise<string> {
    const id = `diagram_${Date.now()}`;
    await this.saveDiagram(id, data);
    return id;
  }
}

// Storage Manager - decides which storage to use
class StorageManager {
  private serverStorage: ServerStorage;
  private sessionStorage: SessionStorage;
  private activeStorage: StorageService | null = null;

  constructor() {
    this.serverStorage = new ServerStorage();
    this.sessionStorage = new SessionStorage();
  }

  async initialize(): Promise<StorageService> {
    // Try server storage first
    if (await this.serverStorage.isAvailable()) {
      console.log('Using server storage');
      this.activeStorage = this.serverStorage;
    } else {
      console.log('Using session storage');
      this.activeStorage = this.sessionStorage;
    }
    return this.activeStorage;
  }

  getStorage(): StorageService {
    if (!this.activeStorage) {
      throw new Error('Storage not initialized. Call initialize() first.');
    }
    return this.activeStorage;
  }

  isServerStorage(): boolean {
    return this.activeStorage === this.serverStorage;
  }
}

// Export singleton instance
export const storageManager = new StorageManager();