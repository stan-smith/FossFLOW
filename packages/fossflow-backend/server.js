import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

const STORAGE_ENABLED = process.env.ENABLE_SERVER_STORAGE === 'true';
const STORAGE_PATH = path.resolve(process.env.STORAGE_PATH || '/data/diagrams');
const ENABLE_GIT_BACKUP = process.env.ENABLE_GIT_BACKUP === 'true';

const SAFE_ID = /^[a-zA-Z0-9._-]+$/;

function safeDiagramPath(id) {
  if (!SAFE_ID.test(id)) return null;
  const resolved = path.resolve(STORAGE_PATH, `${id}.json`);
  if (!resolved.startsWith(STORAGE_PATH + path.sep) && resolved !== STORAGE_PATH) return null;
  return resolved;
}

const readLimiter = rateLimit({ windowMs: 60_000, max: 200, standardHeaders: true, legacyHeaders: false });
const writeLimiter = rateLimit({ windowMs: 60_000, max: 50, standardHeaders: true, legacyHeaders: false });

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check / Storage status endpoint
app.get('/api/storage/status', (req, res) => {
  res.json({
    enabled: STORAGE_ENABLED,
    gitBackup: ENABLE_GIT_BACKUP,
    version: '1.0.0'
  });
});

// Only enable storage endpoints if storage is enabled
if (STORAGE_ENABLED) {
  // Ensure storage directory exists
  async function ensureStorageDir() {
    try {
      await fs.access(STORAGE_PATH);
      console.log(`Storage directory exists: ${STORAGE_PATH}`);

      // Log current files
      const files = await fs.readdir(STORAGE_PATH);
      console.log(`Current files in storage: ${files.length} files`);
      if (files.length > 0) {
        console.log('Files:', files.join(', '));
      }
    } catch {
      console.log(`Creating storage directory: ${STORAGE_PATH}`);
      await fs.mkdir(STORAGE_PATH, { recursive: true });
      console.log(`Created storage directory: ${STORAGE_PATH}`);
    }
  }

  // Initialize storage
  ensureStorageDir().catch((err) => {
    console.error('Failed to initialize storage:', err);
  });

  app.get('/api/diagrams', readLimiter, async (req, res) => {
    try {
      try {
        await fs.access(STORAGE_PATH);
      } catch {
        return res.json([]);
      }

      const files = await fs.readdir(STORAGE_PATH);
      const diagrams = [];

      for (const file of files) {
        if (file.endsWith('.json') && file !== 'metadata.json') {
          const diagramId = file.replace('.json', '');
          const filePath = safeDiagramPath(diagramId);
          if (!filePath) continue;
          try {
            const stats = await fs.stat(filePath);
            const content = await fs.readFile(filePath, 'utf-8');
            const data = JSON.parse(content);
            const name = data.name || data.title || 'Untitled Diagram';
            diagrams.push({
              id: diagramId,
              name: name,
              lastModified: stats.mtime,
              size: stats.size
            });
          } catch {
            continue;
          }
        }
      }

      res.json(diagrams);
    } catch (error) {
      console.error('Error listing diagrams:', error);
      res.status(500).json({ error: 'Failed to list diagrams' });
    }
  });

  app.get('/api/diagrams/:id', readLimiter, async (req, res) => {
    const diagramId = req.params.id;
    const filePath = safeDiagramPath(diagramId);
    if (!filePath) {
      return res.status(400).json({ error: 'Invalid diagram ID' });
    }

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(content);
      res.json(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        res.status(404).json({ error: 'Diagram not found' });
      } else {
        console.error('Error reading diagram: %s', error.message);
        res.status(500).json({ error: 'Failed to read diagram' });
      }
    }
  });

  app.put('/api/diagrams/:id', writeLimiter, async (req, res) => {
    const diagramId = req.params.id;
    const filePath = safeDiagramPath(diagramId);
    if (!filePath) {
      return res.status(400).json({ error: 'Invalid diagram ID' });
    }

    try {
      const data = {
        ...req.body,
        id: diagramId,
        lastModified: new Date().toISOString()
      };

      await fs.writeFile(filePath, JSON.stringify(data, null, 2));

      if (ENABLE_GIT_BACKUP) {
        console.log('[PUT] Git backup not yet implemented');
      }

      res.json({ success: true, id: diagramId });
    } catch (error) {
      console.error('Error saving diagram: %s', error.message);
      res.status(500).json({ error: 'Failed to save diagram' });
    }
  });

  app.delete('/api/diagrams/:id', writeLimiter, async (req, res) => {
    const filePath = safeDiagramPath(req.params.id);
    if (!filePath) {
      return res.status(400).json({ error: 'Invalid diagram ID' });
    }

    try {
      await fs.unlink(filePath);
      res.json({ success: true });
    } catch (error) {
      if (error.code === 'ENOENT') {
        res.status(404).json({ error: 'Diagram not found' });
      } else {
        console.error('Error deleting diagram: %s', error.message);
        res.status(500).json({ error: 'Failed to delete diagram' });
      }
    }
  });

  app.post('/api/diagrams', writeLimiter, async (req, res) => {
    try {
      const rawId = req.body.id || `diagram_${Date.now()}`;
      const filePath = safeDiagramPath(rawId);
      if (!filePath) {
        return res.status(400).json({ error: 'Invalid diagram ID' });
      }
      const id = rawId;

      try {
        await fs.access(filePath);
        return res.status(409).json({ error: 'Diagram already exists' });
      } catch {
        // File doesn't exist, proceed
      }

      const data = {
        ...req.body,
        id,
        created: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };

      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      res.status(201).json({ success: true, id });
    } catch (error) {
      console.error('Error creating diagram: %s', error.message);
      res.status(500).json({ error: 'Failed to create diagram' });
    }
  });

} else {
  // Storage disabled - return appropriate responses
  app.get('/api/diagrams', (req, res) => {
    res.status(503).json({ error: 'Server storage is disabled' });
  });
  
  app.get('/api/diagrams/:id', (req, res) => {
    res.status(503).json({ error: 'Server storage is disabled' });
  });
  
  app.put('/api/diagrams/:id', (req, res) => {
    res.status(503).json({ error: 'Server storage is disabled' });
  });
  
  app.delete('/api/diagrams/:id', (req, res) => {
    res.status(503).json({ error: 'Server storage is disabled' });
  });
  
  app.post('/api/diagrams', (req, res) => {
    res.status(503).json({ error: 'Server storage is disabled' });
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`FossFLOW Backend Server running on port ${PORT}`);
  console.log(`Server storage: ${STORAGE_ENABLED ? 'ENABLED' : 'DISABLED'}`);
  if (STORAGE_ENABLED) {
    console.log(`Storage path: ${STORAGE_PATH}`);
    console.log(`Git backup: ${ENABLE_GIT_BACKUP ? 'ENABLED' : 'DISABLED'}`);
  }
});