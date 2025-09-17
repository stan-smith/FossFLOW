# FossFLOW - Isometric Diagramming Tool <img width="30" height="30" alt="fossflow" src="https://github.com/user-attachments/assets/56d78887-601c-4336-ab87-76f8ee4cde96" />

<p align="center">
 <a href="README.md">English</a> | <a href="docs/README.cn.md">简体中文</a>
</p>

<b>Hey!</b> Stan here, if you've used FossFLOW and it's helped you, <b>I'd really appreciate if you could donate something small :)</b> I work full time, and finding the time to work on this project is challenging enough.
If you've had a feature that I've implemented for you, or fixed a bug it'd be great if you could :) if not, that's not a problem, this software will always remain free!


<b>Also!</b> If you haven't yet, please check out the underlying library this is built on by <a href="https://github.com/markmanx/isoflow">@markmanx</a> I truly stand on the shoulders of a giant here 🫡

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/P5P61KBXA3)

<img width="30" height="30" alt="image" src="https://github.com/user-attachments/assets/dc6ec9ca-48d7-4047-94cf-5c4f7ed63b84" /> <b> https://buymeacoffee.com/stan.smith </b>


Thanks,

-Stan


------------------------------------------------------------------------------------------------------------------------------
FossFLOW is a powerful, open-source Progressive Web App (PWA) for creating beautiful isometric diagrams. Built with React and the <a href="https://github.com/markmanx/isoflow">Isoflow</a> (Now forked and published to NPM as fossflow) library, it runs entirely in your browser with offline support.

![Screenshot_20250630_160954](https://github.com/user-attachments/assets/e7f254ad-625f-4b8a-8efc-5293b5be9d55)

- **📝 [FOSSFLOW_TODO.md](https://github.com/stan-smith/FossFLOW/blob/master/ISOFLOW_TODO.md)** - Current issues and roadmap with codebase mappings, most gripes are with the isoflow library itself.
- **🤝 [CONTRIBUTORS.md](https://github.com/stan-smith/FossFLOW/blob/master/CONTRIBUTORS.md)** - How to contribute to the project.

## Recent Updates (August 2025)

### Improved Connector Tool
- **Click-based Creation** - New default mode: click first node, then second node to connect
- **Drag Mode Option** - Original drag-and-drop still available via settings
- **Mode Selection** - Switch between click and drag modes in Settings → Connectors tab
- **Better Reliability** - Click mode provides more predictable connection creation

### Custom Icon Import
- **Import Your Own Icons** - Upload custom icons (PNG, JPG, SVG) to use in your diagrams
- **Automatic Scaling** - Icons are automatically scaled to consistent sizes for professional appearance
- **Isometric/Flat Toggle** - Choose whether imported icons appear as 3D isometric or flat 2D
- **Smart Persistence** - Custom icons are saved with diagrams and work across all storage methods
- **Icon Resources** - Find free icons at:
  - [Iconify Icon Sets](https://icon-sets.iconify.design/) - Thousands of free SVG icons
  - [Flaticon Isometric Icons](https://www.flaticon.com/free-icons/isometric) - High-quality isometric icon packs

### Server Storage Support
- **Persistent Storage** - Diagrams saved to server filesystem, persist across browser sessions
- **Multi-device Access** - Access your diagrams from any device when using Docker deployment
- **Automatic Detection** - UI automatically shows server storage when available
- **Overwrite Protection** - Confirmation dialog when saving with duplicate names
- **Docker Integration** - Server storage enabled by default in Docker deployments

### Enhanced Interaction Features
- **Configurable Hotkeys** - Three profiles (QWERTY, SMNRCT, None) for tool selection with visual indicators
- **Advanced Pan Controls** - Multiple pan methods including empty area drag, middle/right click, modifier keys (Ctrl/Alt), and keyboard navigation (Arrow/WASD/IJKL)
- **Toggle Connector Arrows** - Option to show/hide arrows on individual connectors
- **Persistent Tool Selection** - Connector tool remains active after creating connections
- **Settings Dialog** - Centralized configuration for hotkeys and pan controls

### Docker & CI/CD Improvements
- **Automated Docker Builds** - GitHub Actions workflow for automatic Docker Hub deployment on commits
- **Multi-architecture Support** - Docker images for both `linux/amd64` and `linux/arm64`
- **Pre-built Images** - Available at `stnsmith/fossflow:latest`

### Monorepo Architecture
- **Single repository** for both library and application
- **NPM Workspaces** for streamlined dependency management
- **Unified build process** with `npm run build` at the root

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
- 🗄️ **Server Storage** - Optional persistent storage when using Docker (enabled by default)

## Try it online

Go to https://stan-smith.github.io/FossFLOW/

## 🐳 Quick Deploy with Docker

```bash
# Using Docker Compose (recommended - includes persistent storage)
docker compose up

# Or run directly from Docker Hub with persistent storage
docker run -p 80:80 -v $(pwd)/diagrams:/data/diagrams stnsmith/fossflow:latest
```

Server storage is enabled by default in Docker. Your diagrams will be saved to `./diagrams` on the host.

To disable server storage, set `ENABLE_SERVER_STORAGE=false`:
```bash
docker run -p 80:80 -e ENABLE_SERVER_STORAGE=false stnsmith/fossflow:latest
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

2. **Connect Items**: 
   - Select the Connector tool (press 'C' or click connector icon)
   - **Click mode** (default): Click first node, then click second node
   - **Drag mode** (optional): Click and drag from first to second node
   - Switch modes in Settings → Connectors tab

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
