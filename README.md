# FossFLOW Monorepo

A monorepo containing the FossFLOW diagram editor library and application.

## Structure

- `packages/fossflow-lib` - React component library for drawing network diagrams
- `packages/fossflow-app` - Progressive Web App for creating isometric diagrams

## Quick Start

```bash
# Install dependencies
npm install

# Run the app in development mode
npm run dev

# Build both packages
npm run build

# Build only the library
npm run build:lib

# Build only the app
npm run build:app

# Run tests
npm test

# Publish the library to npm
npm run publish:lib
```

## Development

This monorepo uses npm workspaces to manage dependencies and build processes.

### Working on the library

```bash
npm run dev:lib
```

### Working on the app

```bash
npm run dev
```

Changes to the library are immediately available in the app during development.

## Documentation

- [ISOFLOW_ENCYCLOPEDIA.md](packages/fossflow-lib/ISOFLOW_ENCYCLOPEDIA.md) - Comprehensive guide to the codebase
- [ISOFLOW_TODO.md](packages/fossflow-lib/ISOFLOW_TODO.md) - Current issues and roadmap
- [CONTRIBUTORS.md](packages/fossflow-lib/CONTRIBUTORS.md) - Contributing guidelines

## License

MIT