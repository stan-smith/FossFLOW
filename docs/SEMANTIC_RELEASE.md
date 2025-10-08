# Semantic Release Setup

This document explains how FossFLOW uses automated semantic versioning and releases.

## Overview

FossFLOW uses [semantic-release](https://github.com/semantic-release/semantic-release) to automate:
- Version number calculation based on commit messages
- CHANGELOG.md generation
- GitHub release creation
- Git tag creation
- Docker image tagging with version numbers

## How It Works

### 1. Commit Messages Drive Versioning

When you commit code using conventional commits, the commit type determines the version bump:

| Commit Type | Version Bump | Example |
|-------------|--------------|---------|
| `feat:` | Minor (1.0.0 → 1.1.0) | New features |
| `fix:` | Patch (1.0.0 → 1.0.1) | Bug fixes |
| `perf:` | Patch (1.0.0 → 1.0.1) | Performance improvements |
| `refactor:` | Patch (1.0.0 → 1.0.1) | Code refactoring |
| `feat!:` or `BREAKING CHANGE:` | Major (1.0.0 → 2.0.0) | Breaking changes |
| `docs:`, `style:`, `test:`, `chore:` | No bump | Non-code changes |

### 2. Automated Workflow

When you push to `master` branch:

1. **Tests run** (via `.github/workflows/test.yml`)
2. **If tests pass**, semantic-release workflow triggers (`.github/workflows/release.yml`)
3. **Semantic-release analyzes** commits since last release
4. **If version bump needed**:
   - Calculates new version number
   - Updates `package.json` files in all workspace packages
   - Generates CHANGELOG.md
   - Creates git tag (e.g., `v1.2.0`)
   - Commits changes with `[skip ci]`
   - Pushes tag to GitHub
   - Creates GitHub release with notes
5. **Docker workflow triggers** on new tag (`.github/workflows/docker.yml`)
6. **Docker images are tagged** with:
   - `latest`
   - `1.2.0` (full version)
   - `1.2` (major.minor)
   - `1` (major only)

### 3. Multiple Package Versioning

FossFLOW is a monorepo with multiple packages. All packages are versioned together:
- Root `package.json`
- `packages/fossflow-lib/package.json`
- `packages/fossflow-app/package.json`
- `packages/fossflow-backend/package.json`

The `scripts/update-version.js` script syncs version numbers across all packages.

## Configuration Files

### `.releaserc.json`

Main semantic-release configuration:
- Defines which branches trigger releases (`master`, `main`)
- Configures commit analysis rules
- Sets up changelog generation
- Defines which files to commit

### `.github/workflows/release.yml`

GitHub Actions workflow that:
- Runs after tests pass
- Executes semantic-release
- Uses `GITHUB_TOKEN` for GitHub API access
- Uses `NPM_TOKEN` for npm publishing (optional)

### `scripts/update-version.js`

Node.js script that updates version numbers in all package.json files simultaneously.

## Example Release Flow

### Scenario: Adding a New Feature

```bash
# Make your changes
git add .
git commit -m "feat(connector): add multi-point connector routing"
git push origin master
```

**Result:**
- Tests run and pass
- Semantic-release detects `feat:` commit
- Version bumps from 1.0.5 → 1.1.0
- CHANGELOG.md updated with new entry
- Git tag `v1.1.0` created
- GitHub release created
- Docker images tagged: `1.1.0`, `1.1`, `1`, `latest`

### Scenario: Fixing a Bug

```bash
git commit -m "fix(export): resolve image export quality issue"
git push origin master
```

**Result:**
- Version bumps from 1.1.0 → 1.1.1
- Patch release created

### Scenario: Breaking Change

```bash
git commit -m "feat(api)!: redesign node creation API

BREAKING CHANGE: createNode() now requires nodeType parameter"
git push origin master
```

**Result:**
- Version bumps from 1.1.1 → 2.0.0
- Major release created with breaking change highlighted

### Scenario: Documentation Update

```bash
git commit -m "docs: update installation instructions"
git push origin master
```

**Result:**
- No version bump
- No release created
- Changes still merged to master

## Manual Testing Locally

You can test semantic-release locally without publishing:

```bash
# Dry run (no changes made)
npx semantic-release --dry-run

# See what version would be released
npx semantic-release --dry-run --no-ci
```

## Troubleshooting

### No Release Created

Check if:
- Commits follow conventional commit format
- Commits include version-bumping types (`feat`, `fix`, etc.)
- Tests passed successfully
- You're on the `master` or `main` branch

### Version Not Updated

Ensure:
- `scripts/update-version.js` has execute permissions
- Script is referenced in `.releaserc.json` under `@semantic-release/exec`

### Docker Not Tagged

Verify:
- Git tag was created successfully
- Docker workflow has permission to run

## Additional Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Semantic Release Documentation](https://semantic-release.gitbook.io/semantic-release/)
- [Keep a Changelog](https://keepachangelog.com/)

## Maintaining This System

### Updating Semantic Release

```bash
npm update semantic-release @semantic-release/changelog @semantic-release/git @semantic-release/exec
```

### Adding New Commit Types

Edit `.releaserc.json` under `releaseRules` to add custom commit type behaviors.

### Changing Release Branch

Edit `.releaserc.json` and `.github/workflows/release.yml` to target different branches.
