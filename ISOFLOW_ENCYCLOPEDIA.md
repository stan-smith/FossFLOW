# FossFLOW Codebase Encyclopedia

## Overview

FossFLOW is a monorepo containing both a React component library for drawing isometric network diagrams (fossflow-lib) and a Progressive Web App that uses this library (fossflow-app). This encyclopedia provides a comprehensive guide to navigating and understanding the codebase structure, making it easy to locate specific functionality and understand the architecture.

## Table of Contents

1. [Monorepo Structure](#monorepo-structure)
2. [Library Architecture (fossflow-lib)](#library-architecture-fossflow-lib)
3. [Application Architecture (fossflow-app)](#application-architecture-fossflow-app)
4. [State Management](#state-management)
5. [Component Organization](#component-organization)
6. [Key Technologies](#key-technologies)
7. [Build System](#build-system)
8. [Testing Structure](#testing-structure)
9. [Development Workflow](#development-workflow)

## Monorepo Structure

```
fossflow-monorepo/
├── packages/
│   ├── fossflow-lib/            # React component library
│   │   ├── src/                 # Library source code
│   │   │   ├── Isoflow.tsx    # Main component entry
│   │   │   ├── index.tsx       # Development entry
│   │   │   ├── config.ts       # Configuration
│   │   │   ├── components/     # React components
│   │   │   ├── stores/         # State management (Zustand)
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   ├── types/          # TypeScript types
│   │   │   ├── schemas/        # Zod validation
│   │   │   ├── interaction/    # Interaction handling
│   │   │   ├── utils/          # Utility functions
│   │   │   ├── assets/         # Static assets
│   │   │   └── styles/         # Styling
│   │   ├── webpack.config.js   # Webpack configuration
│   │   ├── package.json        # Library dependencies
│   │   └── tsconfig.json       # TypeScript config
│   │
│   └── fossflow-app/            # Progressive Web App
│       ├── src/                 # App source code
│       │   ├── index.tsx       # App entry point
│       │   ├── App.tsx         # Main app component
│       │   ├── components/     # App-specific components
│       │   ├── serviceWorkerRegistration.ts
│       │   └── setupTests.ts
│       ├── public/             # Static assets
│       ├── rsbuild.config.ts   # RSBuild configuration
│       ├── package.json        # App dependencies
│       └── tsconfig.json       # TypeScript config
│
├── package.json                 # Root workspace configuration
├── Dockerfile                   # Multi-stage Docker build
├── compose.yml                  # Docker Compose config
├── README.md                    # Project documentation
├── CONTRIBUTORS.md              # Contributing guidelines
└── ISOFLOW_TODO.md             # Issues and roadmap
```

## Library Architecture (fossflow-lib)

### Entry Points

- **`packages/fossflow-lib/src/index.tsx`**: Development mode entry with examples
- **`packages/fossflow-lib/src/Isoflow.tsx`**: Main component exported for library usage
- **`packages/fossflow-lib/src/index-docker.tsx`**: Docker-specific entry point

### Provider Hierarchy

```typescript
<ThemeProvider>
  <ModelProvider>     // Core data model
    <SceneProvider>   // Visual state
      <UiStateProvider> // UI interaction state
        <App>
          <Renderer />   // Canvas rendering
          <UiOverlay />  // UI controls
        </App>
      </UiStateProvider>
    </SceneProvider>
  </ModelProvider>
</ThemeProvider>
```

### Data Flow

1. **Model Data** → Items, Views, Icons, Colors
2. **Scene Data** → Connector paths, Text box sizes
3. **UI State** → Zoom, Pan, Selection, Mode

## State Management

### 1. ModelStore (`src/stores/modelStore.tsx`)

**Purpose**: Core business data

**Key Data**:
- `items`: Diagram elements (nodes)
- `views`: Different diagram perspectives
- `icons`: Available icon library
- `colors`: Color palette

**Location**: `/packages/fossflow-lib/src/stores/modelStore.tsx`
**Types**: `/packages/fossflow-lib/src/types/model.ts`

### 2. SceneStore (`src/stores/sceneStore.tsx`)

**Purpose**: Visual/rendering state

**Key Data**:
- `connectors`: Path and position data
- `textBoxes`: Size information

**Location**: `/packages/fossflow-lib/src/stores/sceneStore.tsx`
**Types**: `/packages/fossflow-lib/src/types/scene.ts`

### 3. UiStateStore (`src/stores/uiStateStore.tsx`)

**Purpose**: User interface state

**Key Data**:
- `zoom`: Current zoom level
- `scroll`: Viewport position
- `mode`: Interaction mode
- `editorMode`: Edit/readonly state

**Location**: `/packages/fossflow-lib/src/stores/uiStateStore.tsx`
**Types**: `/packages/fossflow-lib/src/types/ui.ts`

## Application Architecture (fossflow-app)

### Overview

The FossFLOW application is a Progressive Web App (PWA) built with RSBuild that provides a complete diagram editor interface using the fossflow-lib library.

### Key Components

#### App Entry (`packages/fossflow-app/src/index.tsx`)
- Initializes the React app
- Registers service worker for PWA functionality
- Sets up Quill editor styles

#### Main App (`packages/fossflow-app/src/App.tsx`)
- Contains the Isoflow component from fossflow-lib
- Manages auto-save functionality
- Handles import/export operations
- Provides UI for session management

#### Service Worker
- **Location**: `packages/fossflow-app/src/serviceWorkerRegistration.ts`
- Enables offline functionality
- Caches app resources
- Provides PWA installation capability

### App Features

- **Auto-Save**: Saves diagram to session storage every 5 seconds
- **Import/Export**: JSON file format for diagram sharing
- **PWA Support**: Installable on desktop and mobile
- **Offline Mode**: Full functionality without internet
- **Session Storage**: Quick save without file dialogs

## Component Organization

### Core Components (Library)

#### Renderer (`packages/fossflow-lib/src/components/Renderer/`)
- **Purpose**: Main canvas rendering
- **Key Files**:
  - `Renderer.tsx`: Container component
- **Renders**: All visual layers

#### UiOverlay (`src/components/UiOverlay/`)
- **Purpose**: UI controls overlay
- **Key Files**:
  - `UiOverlay.tsx`: Control panel container

#### SceneLayer (`src/components/SceneLayer/`)
- **Purpose**: Transformable layer wrapper
- **Uses**: GSAP for animations
- **Key Files**:
  - `SceneLayer.tsx`: Transform container

### Scene Layers (`packages/fossflow-lib/src/components/SceneLayers/`)

#### Nodes (`/Nodes/`)
- **Purpose**: Render diagram nodes/icons
- **Key Files**:
  - `Node.tsx`: Individual node component
  - `Nodes.tsx`: Node collection renderer
- **Icon Types**:
  - `IsometricIcon.tsx`: 3D-style icons
  - `NonIsometricIcon.tsx`: Flat icons

#### Connectors (`/Connectors/`)
- **Purpose**: Lines between nodes
- **Key Files**:
  - `Connector.tsx`: Individual connector
  - `Connectors.tsx`: Connector collection

#### Rectangles (`/Rectangles/`)
- **Purpose**: Background shapes/regions
- **Key Files**:
  - `Rectangle.tsx`: Individual rectangle
  - `Rectangles.tsx`: Rectangle collection

#### TextBoxes (`/TextBoxes/`)
- **Purpose**: Text annotations
- **Key Files**:
  - `TextBox.tsx`: Individual text box
  - `TextBoxes.tsx`: Text box collection

### UI Components (Library)

#### MainMenu (`packages/fossflow-lib/src/components/MainMenu/`)
- **Purpose**: Application menu
- **Features**: Open, Export, Clear

#### ToolMenu (`packages/fossflow-lib/src/components/ToolMenu/`)
- **Purpose**: Drawing tools palette
- **Tools**: Select, Pan, Add Icon, Draw Rectangle, Add Text

#### ItemControls (`packages/fossflow-lib/src/components/ItemControls/`)
- **Purpose**: Property panels for selected items
- **Subdirectories**:
  - `/NodeControls/`: Node properties
  - `/ConnectorControls/`: Connector properties
  - `/RectangleControls/`: Rectangle properties
  - `/TextBoxControls/`: Text properties
  - `/IconSelectionControls/`: Icon picker

#### TransformControlsManager (`packages/fossflow-lib/src/components/TransformControlsManager/`)
- **Purpose**: Selection and manipulation handles
- **Key Files**:
  - `TransformAnchor.tsx`: Resize handles
  - `NodeTransformControls.tsx`: Node-specific controls

### Other Components

- **Grid** (`/Grid/`): Isometric grid overlay
- **Cursor** (`/Cursor/`): Custom cursor display
- **ContextMenu** (`/ContextMenu/`): Right-click menus
- **ZoomControls** (`/ZoomControls/`): Zoom in/out buttons
- **ColorSelector** (`/ColorSelector/`): Color picker UI
- **ExportImageDialog** (`/ExportImageDialog/`): Export to PNG dialog

## Key Technologies

### Core Framework
- **React** (^18.2.0): UI framework
- **TypeScript** (^5.1.6): Type safety
- **Zustand** (^4.3.3): State management
- **Immer** (^10.0.2): Immutable updates

### UI Libraries
- **Material-UI** (@mui/material ^5.11.10): Component library
- **Emotion** (@emotion/react): CSS-in-JS styling

### Graphics & Animation
- **Paper.js** (^0.12.17): Vector graphics
- **GSAP** (^3.11.4): Animations
- **Pathfinding** (^0.4.18): Connector routing

### Validation & Forms
- **Zod** (3.22.2): Schema validation
- **React Hook Form** (^7.43.2): Form handling

### Build Tools
- **Webpack** (^5.76.2): Module bundler
- **Jest** (^29.5.0): Testing framework

## Build System

### Monorepo Build Architecture

The project uses NPM workspaces to manage both packages:
- **fossflow-lib**: Built with Webpack (CommonJS2 format)
- **fossflow-app**: Built with RSBuild (modern bundler)

### Build Configurations

#### Library (Webpack)
- **Config**: `/packages/fossflow-lib/webpack.config.js`
- **Output**: CommonJS2 module for npm publishing
- **Externals**: React, React-DOM

#### Application (RSBuild)
- **Config**: `/packages/fossflow-app/rsbuild.config.ts`
- **Features**: Hot reload, PWA support, optimized production builds
- **Output**: Static files in `build/` directory

### NPM Scripts (Root Level)

```bash
# Development
npm run dev          # Start app development server
npm run dev:lib      # Watch mode for library development

# Building
npm run build        # Build both library and app
npm run build:lib    # Build library only
npm run build:app    # Build app only

# Testing & Quality
npm test             # Run tests in all workspaces
npm run lint         # Lint all workspaces

# Publishing
npm run publish:lib  # Build and publish library to npm

# Clean
npm run clean        # Clean all build artifacts
```

### Docker Build

```dockerfile
# Multi-stage build
FROM node:22 AS build
WORKDIR /app
# Install dependencies for monorepo
RUN npm install
# Build library first, then app
RUN npm run build:lib && npm run build:app

# Production stage
FROM nginx:alpine
COPY --from=build /app/packages/fossflow-app/build /usr/share/nginx/html
```

## Testing Structure

### Test Files Location
- Library tests: `packages/fossflow-lib/src/**/__tests__/`
- App tests: `packages/fossflow-app/src/**/*.test.tsx`
- Test utilities: `packages/fossflow-lib/src/fixtures/`

### Key Test Areas
- `/packages/fossflow-lib/src/schemas/__tests__/`: Schema validation
- `/packages/fossflow-lib/src/stores/reducers/__tests__/`: State logic
- `/packages/fossflow-lib/src/utils/__tests__/`: Utility functions

## Development Workflow

### Monorepo Development Setup

1. **Clone and Install**:
```bash
git clone https://github.com/stan-smith/FossFLOW
cd FossFLOW
npm install  # Installs dependencies for all workspaces
```

2. **Development Mode**:
```bash
# First build the library (required for initial setup)
npm run build:lib

# Start app development (includes library in dev mode)
npm run dev
```

3. **Making Library Changes**:
- Edit files in `packages/fossflow-lib/src/`
- Changes are immediately available in the app
- No need to rebuild or republish during development

4. **Making App Changes**:
- Edit files in `packages/fossflow-app/src/`
- Hot reload updates the browser automatically

### 1. Configuration (`packages/fossflow-lib/src/config.ts`)

**Key Constants**:
- `TILE_SIZE`: Base tile dimensions
- `DEFAULT_ZOOM`: Initial zoom level
- `DEFAULT_FONT_SIZE`: Text defaults
- `INITIAL_DATA`: Default model state

### 2. Hooks Directory (`packages/fossflow-lib/src/hooks/`)

**Common Hooks**:
- `useScene.ts`: Merged scene data
- `useModelItem.ts`: Individual item access (returns `ModelItem | null`)
- `useViewItem.ts`: View item access (returns `ViewItem | null`)
- `useConnector.ts`: Connector management (returns `Connector | null`)
- `useRectangle.ts`: Rectangle access (returns `Rectangle | null`)
- `useTextBox.ts`: Text box access (returns `TextBox | null`)
- `useIcon.tsx`: Icon access (returns `Icon | null`)
- `useColor.ts`: Color access (returns `Color | null`)
- `useIsoProjection.ts`: Coordinate conversion
- `useDiagramUtils.ts`: Diagram operations

**Important**: All item access hooks now return `null` instead of throwing when items don't exist, preventing React unmount errors.

### 3. Interaction System (`packages/fossflow-lib/src/interaction/`)

**Main File**: `useInteractionManager.ts`

**Interaction Modes** (`/modes/`):
- `Cursor.ts`: Selection mode
- `Pan.ts`: Canvas panning
- `PlaceIcon.ts`: Icon placement
- `Connector.ts`: Drawing connections
- `DragItems.ts`: Moving elements
- `Rectangle/`: Rectangle tools
- `TextBox.ts`: Text editing

### 4. Utilities (`packages/fossflow-lib/src/utils/`)

**Key Utilities**:
- `CoordsUtils.ts`: Coordinate calculations
- `SizeUtils.ts`: Size computations
- `renderer.ts`: Rendering helpers
- `model.ts`: Model manipulation
- `pathfinder.ts`: Connector routing

### 5. Type System (`packages/fossflow-lib/src/types/`)

**Core Types**:
- `model.ts`: Business data types
- `scene.ts`: Visual state types
- `ui.ts`: Interface types
- `common.ts`: Shared types
- `interactions.ts`: Interaction types

### 6. Schema Validation (`packages/fossflow-lib/src/schemas/`)

**Validation Schemas**:
- `model.ts`: Model validation
- `connector.ts`: Connector validation
- `rectangle.ts`: Rectangle validation
- `textBox.ts`: Text box validation
- `views.ts`: View validation

## Undo/Redo System

### Implementation Details

The undo/redo system uses a transaction-based approach to ensure atomic operations:

**Key Components**:
- **Transaction System**: Groups related operations together
- **Dual Store Coordination**: Synchronizes model and scene stores
- **History Tracking**: Maintains separate history for each store

**Important Considerations**:
- Operations that affect both model and scene (like placing icons) must use transactions
- Without transactions, undo/redo can cause "Invalid item in view" errors
- The system prevents partial states by grouping related changes

### Error Handling Patterns

**Problem**: Components can try to access deleted items during React unmounting
**Solution**: Graceful null handling throughout the codebase

**Key Changes**:
1. Added `getItemById` utility that returns `null` instead of throwing
2. Updated all hooks to return `null` when items don't exist
3. Added null checks in all components using these hooks

**Affected Files**:
- `/src/utils/common.ts`: Added `getItemById` function
- All hooks in `/src/hooks/`: Updated to handle missing items
- All components: Added null checks and early returns

## Navigation Quick Reference

### Need to modify...

**Icons?** → `/src/components/ItemControls/IconSelectionControls/`
**Node rendering?** → `/src/components/SceneLayers/Nodes/`
**Connector drawing?** → `/src/components/SceneLayers/Connectors/`
**Zoom behavior?** → `/src/stores/uiStateStore.tsx` + `/src/components/ZoomControls/`
**Grid display?** → `/src/components/Grid/`
**Export functionality?** → `/src/components/ExportImageDialog/`
**Color picker?** → `/src/components/ColorSelector/`
**Context menus?** → `/src/components/ContextMenu/`
**Keyboard shortcuts?** → `/src/interaction/useInteractionManager.ts`
**Tool selection?** → `/src/components/ToolMenu/`
**Selection handles?** → `/src/components/TransformControlsManager/`
**Undo/Redo?** → Check transaction system in model/scene stores

### Want to understand...

**How items are positioned?** → `/src/hooks/useIsoProjection.ts`
**How connectors find paths?** → `/src/utils/pathfinder.ts`
**How state updates work?** → `/src/stores/reducers/`
**How validation works?** → `/src/schemas/`
**Available icons?** → `/src/fixtures/icons.ts`
**Default configurations?** → `/src/config.ts`

## Key Files Reference

| Purpose | File Path |
|---------|-----------|
| Main entry | `/src/Isoflow.tsx` |
| Configuration | `/src/config.ts` |
| Model types | `/src/types/model.ts` |
| UI state types | `/src/types/ui.ts` |
| Model store | `/src/stores/modelStore.tsx` |
| Scene store | `/src/stores/sceneStore.tsx` |
| UI store | `/src/stores/uiStateStore.tsx` |
| Main renderer | `/src/components/Renderer/Renderer.tsx` |
| UI overlay | `/src/components/UiOverlay/UiOverlay.tsx` |
| Interaction manager | `/src/interaction/useInteractionManager.ts` |
| Coordinate utils | `/src/utils/CoordsUtils.ts` |
| Public API hook | `/src/hooks/useIsoflow.ts` |

This encyclopedia serves as a comprehensive guide to the Isoflow codebase. Use the table of contents and quick references to efficiently navigate to the areas you need to modify or understand.