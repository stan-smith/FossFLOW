# Contributing to FossFLOW

Thank you for your interest in contributing to FossFLOW! This guide will help you get started with contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [How to Contribute](#how-to-contribute)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Community](#community)
- [Recognition](#recognition)
- [License](#license)

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- **Be respectful**: Treat everyone with respect. No harassment, discrimination, or inappropriate behavior.
- **Be collaborative**: Work together to resolve conflicts and assume good intentions.
- **Be patient**: Remember that everyone has different levels of experience.
- **Be welcoming**: Help new contributors feel welcome and supported.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Git
- A code editor (VS Code recommended)
- Docker (optional, for containerized deployment)

### Quick Start

1. Fork the repository on GitHub
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/FossFLOW.git
   cd FossFLOW
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build the library:
   ```bash
   npm run build:lib
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Open http://localhost:3000 in your browser

## Development Setup

### IDE Setup (VS Code)

Recommended extensions:
- ESLint
- Prettier
- TypeScript and JavaScript Language Features

### Environment Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Available scripts**:
   ```bash
   npm run dev          # Start app development server
   npm run dev:lib      # Watch mode for library development
   npm run build        # Build both library and app
   npm run build:lib    # Build library only
   npm run build:app    # Build app only
   npm test             # Run tests
   npm run lint         # Check for linting errors
   npm run publish:lib  # Publish library to npm
   ```

## Project Structure

This is a monorepo containing two packages:

```
FossFLOW/
├── packages/
│   ├── fossflow-lib/     # React component library
│   │   ├── src/
│   │   │   ├── components/    # React components
│   │   │   ├── stores/        # State management (Zustand)
│   │   │   ├── hooks/         # Custom React hooks
│   │   │   ├── interaction/   # User interaction handling
│   │   │   ├── types/         # TypeScript types
│   │   │   └── utils/         # Utility functions
│   │   ├── webpack.config.js  # Library build config
│   │   └── package.json
│   │
│   └── fossflow-app/      # PWA application
│       ├── src/
│       │   ├── App.tsx         # Main app component
│       │   ├── diagramUtils.ts # Diagram utilities
│       │   └── index.tsx       # App entry point
│       ├── public/            # Static assets
│       ├── rsbuild.config.ts  # App build config
│       └── package.json
│
├── Dockerfile             # Docker configuration
├── compose.yml           # Docker Compose config
├── package.json          # Root workspace config
└── tsconfig.base.json    # Shared TypeScript config
```

### Key Differences:
- **fossflow-lib**: The core library, built with Webpack
- **fossflow-app**: The PWA application, built with RSBuild
- Both packages are managed as npm workspaces

## How to Contribute

### Finding Issues to Work On

1. Check the [Issues](https://github.com/stan-smith/FossFLOW/issues) page
2. Look for issues labeled:
   - `good first issue` - Great for newcomers
   - `help wanted` - Community help needed
   - `bug` - Bug fixes
   - `enhancement` - New features

3. Check [ISOFLOW_TODO.md](./ISOFLOW_TODO.md) for prioritized tasks

### Types of Contributions

We welcome all types of contributions:

- **Bug fixes**: Help us squash bugs
- **Features**: Implement new functionality
- **Documentation**: Improve docs, add examples
- **Tests**: Increase test coverage
- **UI/UX improvements**: Make FossFLOW better to use
- **Performance**: Optimize code for better performance

## Development Workflow

### Working with the Monorepo

#### Library Development (fossflow-lib)
```bash
# Start library in watch mode
npm run dev:lib

# Build library
npm run build:lib

# Run library tests
cd packages/fossflow-lib && npm test
```

#### App Development (fossflow-app)
```bash
# Start app dev server
npm run dev

# Build app for production
npm run build:app

# The app automatically uses the local library
```

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/updates

### 2. Make Your Changes

- Write clean, readable code
- Follow existing patterns in the codebase
- Add comments for complex logic
- Update tests if needed
- Update documentation if needed
- Test changes in both library and app if applicable

### 3. Test Your Changes

```bash
# Run all tests
npm test

# Run linting
npm run lint

# Test library changes
npm run build:lib

# Test app with library changes
npm run dev
```

### 4. Commit Your Changes

We follow conventional commits:

```bash
git commit -m "feat: add undo/redo functionality"
git commit -m "fix: prevent menu from opening during drag"
git commit -m "docs: update installation instructions"
```

Commit types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Avoid `any` types
- Define interfaces for component props
- Use meaningful variable and function names

Example:
```typescript
interface NodeProps {
  id: string;
  position: { x: number; y: number };
  icon: IconType;
  isSelected?: boolean;
}

const Node: React.FC<NodeProps> = ({ id, position, icon, isSelected = false }) => {
  // Component implementation
};
```

### React

- Use functional components with hooks
- Keep components focused and small
- Use custom hooks for reusable logic
- Memoize expensive computations

### State Management

- Use Zustand stores appropriately:
  - `modelStore`: Business data
  - `sceneStore`: Visual state
  - `uiStateStore`: UI state
- Keep actions pure and predictable

### Styling

- Use Material-UI components when possible
- Follow existing styling patterns
- Use theme variables for colors
- Ensure responsive design

## Testing

### Running Tests

```bash
npm test                    # Run all tests
npm test -- --watch        # Watch mode
npm test -- --coverage     # Coverage report
```

### Writing Tests

- Write tests for new features
- Update tests when changing existing code
- Test edge cases and error scenarios
- Use meaningful test descriptions

Example:
```typescript
describe('useIsoProjection', () => {
  it('should convert tile coordinates to screen coordinates', () => {
    const { tileToScreen } = useIsoProjection();
    const result = tileToScreen({ x: 1, y: 1 });
    expect(result).toEqual({ x: 100, y: 50 });
  });
});
```

## Submitting Changes

### Pull Request Process

1. **Update your fork**:
   ```bash
   git remote add upstream https://github.com/stan-smith/FossFLOW.git
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Push your branch**:
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create Pull Request**:
   - Go to GitHub and create a PR from your branch
   - Fill out the PR template
   - Link related issues
   - Add screenshots/GIFs for UI changes

### PR Title Format

Follow the same convention as commits:
- `feat: Add undo/redo functionality`
- `fix: Prevent menu from opening during drag`

### PR Description Template

```markdown
## Description
Brief description of changes

## Related Issue
Fixes #123

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing
- [ ] Tests pass locally
- [ ] Added new tests
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots or GIFs here
```

### Code Review

- Be open to feedback
- Respond to review comments
- Make requested changes promptly
- Ask questions if something is unclear

## Docker Development

### Building and Running with Docker

```bash
# Build multi-architecture image
docker buildx build --platform linux/amd64,linux/arm64 -t fossflow:local .

# Run with Docker Compose
docker compose up

# Or pull from Docker Hub
docker run -p 80:80 stnsmith/fossflow:latest
```

## Community

### Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and ideas
- **Code Encyclopedia**: See [ISOFLOW_ENCYCLOPEDIA.md](./ISOFLOW_ENCYCLOPEDIA.md)
- **TODO List**: See [ISOFLOW_TODO.md](./ISOFLOW_TODO.md)

### Communication Guidelines

- Be clear and concise
- Provide context and examples
- Search existing issues before creating new ones
- Use issue templates when available

## Recognition

Contributors will be recognized in:
- The project README
- Release notes
- Contributors list on GitHub

## License

By contributing to FossFLOW, you agree that your contributions will be licensed under the project's license.

---

Thank you for contributing to FossFLOW! Your efforts help make this project better for everyone. If you have any questions, don't hesitate to ask in the issues or discussions.

-S
