import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { callLightRagQueryStream } from './lightragClient.js';
import { AUTH_CORS_ORIGIN, AUTH_ENABLED } from './authConfig.js';
import { createUser, findUserByEmail, validateUserCredentials } from './userStore.js';
import { clearAuthCookie, setAuthCookie, verifyUserToken } from './authJwt.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

// Configuration from environment variables
const STORAGE_ENABLED = process.env.ENABLE_SERVER_STORAGE === 'true';
const STORAGE_PATH = process.env.STORAGE_PATH || '/data/diagrams';
const ENABLE_GIT_BACKUP = process.env.ENABLE_GIT_BACKUP === 'true';

// Middleware
const corsOptions = AUTH_CORS_ORIGIN
  ? {
      origin: AUTH_CORS_ORIGIN.split(',').map((origin) => {
        return origin.trim();
      }),
      credentials: true
    }
  : undefined;

if (corsOptions) {
  app.use(cors(corsOptions));
} else {
  app.use(cors());
}
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));

// Health check / Storage status endpoint
app.get('/api/storage/status', (req, res) => {
  res.json({
    enabled: STORAGE_ENABLED,
    gitBackup: ENABLE_GIT_BACKUP,
    version: '1.0.0'
  });
});

// Auth endpoints
if (AUTH_ENABLED) {
  app.post('/auth/signup', async (req, res) => {
    const { email, password, name } = req.body ?? {};

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' });
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return res
        .status(400)
        .json({ error: 'Password must be at least 8 characters long' });
    }

    try {
      const user = await createUser({ email, password, name });
      const token = setUserTokenCookie(res, user);

      return res.status(201).json({
        user,
        tokenSet: Boolean(token)
      });
    } catch (error) {
      if (error.message === 'USER_ALREADY_EXISTS') {
        return res.status(409).json({ error: 'User with this email already exists' });
      }

      // eslint-disable-next-line no-console
      console.error('[POST /auth/signup] Error:', error);
      return res.status(500).json({ error: 'Failed to create user' });
    }
  });

  app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body ?? {};

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' });
    }

    if (!password || typeof password !== 'string') {
      return res.status(400).json({ error: 'Password is required' });
    }

    try {
      const user = await validateUserCredentials(email, password);

      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = setUserTokenCookie(res, user);

      return res.json({
        user,
        tokenSet: Boolean(token)
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[POST /auth/login] Error:', error);
      return res.status(500).json({ error: 'Failed to log in' });
    }
  });

  app.post('/auth/logout', (req, res) => {
    clearAuthCookie(res);
    return res.json({ success: true });
  });

  app.get('/auth/me', (req, res) => {
    const token = req.cookies?.fossflow_auth;

    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
      const user = verifyUserToken(token);
      const fullUser = findUserByEmail(user.email) ?? {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: null
      };

      return res.json({
        user: {
          id: fullUser.id,
          email: fullUser.email,
          name: fullUser.name,
          createdAt: fullUser.createdAt
        }
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[GET /auth/me] Error verifying token:', error);
      return res.status(401).json({ error: 'Invalid or expired session' });
    }
  });
} else {
  // When auth is disabled, keep endpoints present but return a clear message.
  app.post('/auth/signup', (req, res) => {
    return res
      .status(503)
      .json({ error: 'Authentication is disabled on this server' });
  });

  app.post('/auth/login', (req, res) => {
    return res
      .status(503)
      .json({ error: 'Authentication is disabled on this server' });
  });

  app.post('/auth/logout', (req, res) => {
    return res
      .status(503)
      .json({ error: 'Authentication is disabled on this server' });
  });

  app.get('/auth/me', (req, res) => {
    return res
      .status(503)
      .json({ error: 'Authentication is disabled on this server' });
  });
}

function setUserTokenCookie(res, user) {
  try {
    const token = setAuthCookieAndReturn(res, user);
    return token;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[auth] Failed to sign JWT token:', error);
    return null;
  }
}

function setAuthCookieAndReturn(res, user) {
  const { signUserToken, setAuthCookie: setCookie } = requireAuthJwt();
  const token = signUserToken(user);
  setCookie(res, token);
  return token;
}

function requireAuthJwt() {
  // Dynamic import helper to avoid potential import cycles in some bundlers
  // while keeping types and behavior explicit.
  // eslint-disable-next-line global-require
  const jwtModule = require('./authJwt.js');
  return {
    signUserToken: jwtModule.signUserToken,
    setAuthCookie: jwtModule.setAuthCookie
  };
}

// AI assistant endpoint backed by LightRAG query/stream API
app.post('/api/ai/query', async (req, res) => {
  const { query, diagramContext, options } = req.body ?? {};

  if (!query || typeof query !== 'string') {
    return res
      .status(400)
      .json({ error: 'Missing required field "query" (string).' });
  }

  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('[POST /api/ai/query] Incoming diagramContext snapshot:', {
        hasContext: Boolean(diagramContext),
        diagramId: diagramContext?.diagramId,
        nodeCount: Array.isArray(diagramContext?.nodes)
          ? diagramContext.nodes.length
          : undefined,
        edgeCount: Array.isArray(diagramContext?.edges)
          ? diagramContext.edges.length
          : undefined
      });
    }

    const result = await callLightRagQueryStream({
      query,
      diagramContext,
      options
    });

    const includeRawChunks =
      process.env.LIGHTRAG_INCLUDE_RAW === 'true';

    return res.json({
      answer: result.answer,
      raw: includeRawChunks ? result.chunks : undefined
    });
  } catch (error) {
    // Normalize error output to avoid leaking internal details while
    // still giving enough information for debugging.
    const status =
      typeof error.status === 'number' && error.status >= 400
        ? error.status
        : 502;

    const message =
      error.code === 'LIGHTRAG_TIMEOUT'
        ? 'Upstream LightRAG request timed out'
        : 'Failed to query AI assistant';

    console.error('[POST /api/ai/query] LightRAG error:', {
      message: error.message,
      code: error.code,
      status: error.status,
      config: error.config
    });

    return res.status(status).json({
      error: message,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
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

  // List all diagrams
  app.get('/api/diagrams', async (req, res) => {
    try {
      // First check if storage directory exists
      try {
        await fs.access(STORAGE_PATH);
      } catch (err) {
        console.error(`Storage directory does not exist: ${STORAGE_PATH}`);
        return res.json([]); // Return empty array if directory doesn't exist
      }

      const files = await fs.readdir(STORAGE_PATH);
      console.log(`Found ${files.length} files in ${STORAGE_PATH}:`, files);
      const diagrams = [];

      for (const file of files) {
        if (file.endsWith('.json') && file !== 'metadata.json') {
          try {
            const filePath = path.join(STORAGE_PATH, file);
            const stats = await fs.stat(filePath);
            const content = await fs.readFile(filePath, 'utf-8');
            const data = JSON.parse(content);

            // Extract name from various possible locations
            const name = data.name || data.title || 'Untitled Diagram';

            console.log(`Successfully read diagram: ${file} (name: ${name})`);

            diagrams.push({
              id: file.replace('.json', ''),
              name: name,
              lastModified: stats.mtime,
              size: stats.size
            });
          } catch (fileError) {
            console.error(`Error reading diagram file ${file}:`, fileError.message);
            // Skip this file and continue with others
            continue;
          }
        }
      }

      console.log(`Returning ${diagrams.length} diagrams`);
      res.json(diagrams);
    } catch (error) {
      console.error('Error listing diagrams:', error);
      res.status(500).json({ error: 'Failed to list diagrams', details: error.message });
    }
  });

  // Get specific diagram
  app.get('/api/diagrams/:id', async (req, res) => {
    const diagramId = req.params.id;
    console.log(`[GET /api/diagrams/${diagramId}] Loading diagram...`);

    try {
      const filePath = path.join(STORAGE_PATH, `${diagramId}.json`);
      console.log(`[GET /api/diagrams/${diagramId}] Reading from: ${filePath}`);

      const content = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(content);

      console.log(`[GET /api/diagrams/${diagramId}] Successfully loaded, size: ${content.length} bytes, items: ${data.items?.length || 0}`);
      res.json(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.error(`[GET /api/diagrams/${diagramId}] Diagram not found`);
        res.status(404).json({ error: 'Diagram not found' });
      } else {
        console.error(`[GET /api/diagrams/${diagramId}] Error reading diagram:`, error);
        res.status(500).json({ error: 'Failed to read diagram' });
      }
    }
  });

  // Save or update diagram
  app.put('/api/diagrams/:id', async (req, res) => {
    const diagramId = req.params.id;
    console.log(`[PUT /api/diagrams/${diagramId}] Saving diagram...`);

    try {
      const filePath = path.join(STORAGE_PATH, `${diagramId}.json`);
      const data = {
        ...req.body,
        id: diagramId,
        lastModified: new Date().toISOString()
      };

      const iconCount = data.icons?.length || 0;
      const importedIconCount = (data.icons || []).filter(icon => icon.collection === 'imported').length;
      console.log(`[PUT /api/diagrams/${diagramId}] Writing to: ${filePath}`);
      console.log(`[PUT /api/diagrams/${diagramId}]   Items: ${data.items?.length || 0}, Icons: ${iconCount} (${importedIconCount} imported)`);

      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      console.log(`[PUT /api/diagrams/${diagramId}] Successfully saved`);

      // Git backup if enabled
      if (ENABLE_GIT_BACKUP) {
        // TODO: Implement git commit
        console.log('[PUT] Git backup not yet implemented');
      }

      res.json({ success: true, id: diagramId });
    } catch (error) {
      console.error(`[PUT /api/diagrams/${diagramId}] Error saving diagram:`, error);
      res.status(500).json({ error: 'Failed to save diagram' });
    }
  });

  // Delete diagram
  app.delete('/api/diagrams/:id', async (req, res) => {
    try {
      const filePath = path.join(STORAGE_PATH, `${req.params.id}.json`);
      await fs.unlink(filePath);
      
      res.json({ success: true });
    } catch (error) {
      if (error.code === 'ENOENT') {
        res.status(404).json({ error: 'Diagram not found' });
      } else {
        console.error('Error deleting diagram:', error);
        res.status(500).json({ error: 'Failed to delete diagram' });
      }
    }
  });

  // Create a new diagram
  app.post('/api/diagrams', async (req, res) => {
    try {
      const id = req.body.id || `diagram_${Date.now()}`;
      const filePath = path.join(STORAGE_PATH, `${id}.json`);
      
      // Check if already exists
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
      console.error('Error creating diagram:', error);
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