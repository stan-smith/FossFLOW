# FossFLOW - Isometric Diagramming Tool

FossFLOW is a powerful, open-source Progressive Web App (PWA) for creating beautiful isometric diagrams. Built with React and the Isoflow (Now forked and published to NPM as fossflow) library, it runs entirely in your browser with offline support.

![Screenshot_20250630_160954](https://github.com/user-attachments/assets/e7f254ad-625f-4b8a-8efc-5293b5be9d55)

- **📝 [FOSSFLOW_TODO.md](https://github.com/stan-smith/FossFLOW/blob/main/ISOFLOW_TODO.md)** - Current issues and roadmap with codebase mappings, most gripes are with the isoflow library itself.
- **🤝 [CONTRIBUTORS.md](https://github.com/stan-smith/FossFLOW/blob/main/CONTRIBUTORS.md)** - How to contribute to the project.

## ✨ Recent Updates (August 2025)

### Monorepo Architecture
We've successfully migrated from separate repositories to a unified monorepo structure, making development and contribution significantly easier:
- **Single repository** for both the library (`fossflow-lib`) and application (`fossflow-app`)
- **NPM Workspaces** for streamlined dependency management
- **Instant library updates** available in the app during development
- **Unified build process** with `npm run build` at the root

### 🐳 Docker & Deployment Improvements
- **Multi-architecture Docker support** - Images now support both `linux/amd64` and `linux/arm64`
- **Docker Hub integration** - Pre-built images available at `stnsmith/fossflow:latest`
- **Simple deployment** - Just run `docker compose up` to deploy
- **Production-ready** - Nginx-based serving with optimized builds

### UI Fixes
- Fixed Quill editor toolbar icons display issue
- Resolved React key warnings in context menus
- Improved markdown editor styling

## Features

- 🎨 **Isometric Diagramming** - Create stunning 3D-style technical diagrams
- 💾 **Auto-Save** - Your work is automatically saved every 5 seconds
- 📱 **PWA Support** - Install as a native app on Mac and Linux
- 🔒 **Privacy-First** - All data stored locally in your browser
- 📤 **Import/Export** - Share diagrams as JSON files
- 🎯 **Session Storage** - Quick save without dialogs
- 🌐 **Offline Support** - Work without internet connection

## Try it online

Go to https://stan-smith.github.io/FossFLOW/

## 🐳 Quick Deploy with Docker

```bash
# Using Docker Compose (recommended)
docker compose up

# Or run directly from Docker Hub
docker run -p 80:80 stnsmith/fossflow:latest
```

## Quick Start (Local Development)

```bash
# Clone the repository
git clone https://github.com/stan-smith/FossFLOW
cd FossFLOW

# Install dependencies
npm install

# Build the library (required first time)
npm run build:lib

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Monorepo Structure

This is a monorepo containing two packages:

- `packages/fossflow-lib` - React component library for drawing network diagrams (built with Webpack)
- `packages/fossflow-app` - Progressive Web App for creating isometric diagrams (built with RSBuild)

### Development Commands

```bash
# Development
npm run dev          # Start app development server
npm run dev:lib      # Watch mode for library development

# Building
npm run build        # Build both library and app
npm run build:lib    # Build library only
npm run build:app    # Build app only

# Testing & Linting
npm test             # Run tests
npm run lint         # Check for linting errors

# Publishing
npm run publish:lib  # Publish library to npm
```

## How to Use

### Creating Diagrams

1. **Add Items**:
   - Press the "+" button on the top right menu, the library of components will appear on the left
   - Drag and drop components from the library onto the canvas
   - Or right-click on the grid and select "Add node"

2. **Connect Items**: Use connectors to show relationships

3. **Save Your Work**:
   - **Quick Save** - Saves to browser session
   - **Export** - Download as JSON file
   - **Import** - Load from JSON file

### Storage Options

- **Session Storage**: Temporary saves cleared when browser closes
- **Export/Import**: Permanent storage as JSON files
- **Auto-Save**: Automatically saves changes every 5 seconds to session

## Contributing

We welcome contributions! Please see [CONTRIBUTORS.md](CONTRIBUTORS.md) for guidelines.

## Documentation

- [ISOFLOW_ENCYCLOPEDIA.md](ISOFLOW_ENCYCLOPEDIA.md) - Comprehensive guide to the codebase
- [ISOFLOW_TODO.md](ISOFLOW_TODO.md) - Current issues and roadmap
- [CONTRIBUTORS.md](CONTRIBUTORS.md) - Contributing guidelines

## License

MIT