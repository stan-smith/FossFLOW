# FossFLOW Packaging Implementation Summary

This document summarizes the Linux packaging support added to FossFLOW for both Flatpak and Snap distribution formats.

## What Was Added

### Core Packaging Files

1. **org.fossflow.FossFLOW.yml** - Flatpak manifest
   - Defines how to build FossFLOW as a Flatpak application
   - Uses Electron base app for native desktop experience
   - Includes Node.js 22 for building the application
   - Supports both x86_64 and aarch64 architectures

2. **snap/snapcraft.yaml** - Snap manifest
   - Defines how to build FossFLOW as a Snap package
   - Based on core22 (Ubuntu 22.04 LTS)
   - Includes Electron for native desktop wrapper
   - Supports amd64 and arm64 architectures

3. **org.fossflow.FossFLOW.desktop** - Desktop entry file
   - Provides desktop integration (menu entry, launcher)
   - Follows FreeDesktop.org standards
   - Categories: Graphics, VectorGraphics, Engineering

4. **org.fossflow.FossFLOW.metainfo.xml** - AppStream metadata
   - Provides metadata for software centers (GNOME Software, KDE Discover)
   - Includes description, screenshots, license information
   - Enables discovery in Linux app stores

### Documentation

5. **PACKAGING.md** - Comprehensive packaging guide
   - Detailed instructions for building both formats
   - Prerequisites and dependencies
   - Step-by-step build process
   - Troubleshooting tips
   - Distribution and publishing information

6. **docs/packaging-quick-start.md** - Quick reference
   - One-command build instructions
   - Quick troubleshooting
   - Key files reference

### Automation

7. **.github/workflows/flatpak.yml** - Flatpak CI/CD
   - Automated Flatpak builds on push/tag
   - Uploads artifacts for release
   - Uses official Flatpak GitHub Actions

8. **.github/workflows/snap.yml** - Snap CI/CD
   - Automated Snap builds on push/tag
   - Uploads artifacts for release
   - Uses Snapcore official actions

### Validation

9. **scripts/validate-packaging.sh** - Validation script
   - Checks all required files exist
   - Validates YAML syntax
   - Validates XML syntax
   - Checks icon files
   - Can be run before building packages

### Configuration Updates

10. **.gitignore** - Updated to exclude build artifacts
    - Flatpak build directories
    - Snap build directories
    - Built package files

11. **README.md** - Updated with packaging information
    - Quick start sections for both formats
    - Links to detailed documentation

## How It Works

### Packaging Architecture

Both Flatpak and Snap packages work by:

1. **Building the Application**
   - Install Node.js 22 in the build environment
   - Run `npm install` to get dependencies
   - Run `npm run build:lib` to build the library
   - Run `npm run build:app` to build the React application

2. **Wrapping with Electron**
   - Download and include Electron runtime
   - Create launcher scripts that use Electron to display the web app
   - Provide native desktop window with web content

3. **Desktop Integration**
   - Install desktop file for menu/launcher integration
   - Install icons in standard locations (192x192, 512x512)
   - Install AppStream metadata for app store discovery

4. **Sandboxing & Permissions**
   - Both formats run in sandboxed environments
   - Declare required permissions (home directory access, network)
   - Use XDG portals where appropriate

### Why Electron?

FossFLOW is a Progressive Web App (PWA) built with React. To package it as a native Linux application, we use Electron because:

- It provides a native window and desktop integration
- Users can install it like any other desktop application
- It works offline (already a PWA feature)
- It provides consistent experience across platforms
- It renders web technologies natively

Alternative approaches considered:
- Browser wrapper (requires browser installation)
- Native rewrite (too much effort, not maintainable)
- WebView wrapper (less mature ecosystem)

## File Locations

```
FossFLOW/
├── org.fossflow.FossFLOW.yml           # Flatpak manifest
├── org.fossflow.FossFLOW.desktop       # Desktop entry
├── org.fossflow.FossFLOW.metainfo.xml  # AppStream metadata
├── snap/
│   └── snapcraft.yaml                   # Snap manifest
├── .github/workflows/
│   ├── flatpak.yml                      # Flatpak CI/CD
│   └── snap.yml                         # Snap CI/CD
├── scripts/
│   └── validate-packaging.sh            # Validation script
├── docs/
│   ├── packaging-quick-start.md         # Quick reference
│   └── packaging-summary.md             # This file
├── PACKAGING.md                         # Full guide
└── README.md                            # Updated with packaging info
```

## Building Packages

### Flatpak
```bash
flatpak-builder --user --install --force-clean build-dir org.fossflow.FossFLOW.yml
flatpak run org.fossflow.FossFLOW
```

### Snap
```bash
snapcraft
sudo snap install --dangerous fossflow_1.5.1_amd64.snap
fossflow
```

## Distribution

### Flatpak Options
1. **Flathub** - Submit to Flathub.org for public distribution
2. **Own Repository** - Host your own Flatpak repository
3. **Single File** - Distribute .flatpak bundle files

### Snap Options
1. **Snap Store** - Publish to snapcraft.io store
2. **Own Channel** - Use brand stores for private distribution
3. **Direct Install** - Distribute .snap files directly

## Testing Checklist

Before releasing packages:

- [ ] Run `./scripts/validate-packaging.sh`
- [ ] Build Flatpak successfully
- [ ] Install and run Flatpak
- [ ] Test diagram creation and saving in Flatpak
- [ ] Build Snap successfully
- [ ] Install and run Snap
- [ ] Test diagram creation and saving in Snap
- [ ] Verify desktop integration (menu entry, icon)
- [ ] Test on both x86_64 and aarch64 (if possible)
- [ ] Check file permissions work correctly
- [ ] Verify offline functionality

## Future Improvements

Potential enhancements:

1. **Distribution**
   - Submit to Flathub for easy installation
   - Publish to Snap Store
   - Add update mechanisms

2. **Features**
   - Add native file dialogs via XDG portals
   - Improve Electron integration
   - Reduce package size

3. **CI/CD**
   - Automatic releases on version tags
   - Multi-architecture builds
   - Automated testing in CI

4. **Documentation**
   - Video tutorials for building
   - Screenshots of installation process
   - User guide for installed app

## Maintenance

When updating FossFLOW versions:

1. Update version in `package.json`
2. Update version in `snap/snapcraft.yaml`
3. Add new release entry in `org.fossflow.FossFLOW.metainfo.xml`
4. Update git reference in `org.fossflow.FossFLOW.yml` (if using tags)
5. Rebuild and test both packages
6. Update CHANGELOG.md with packaging changes if any

## Support

- GitHub Issues: https://github.com/stan-smith/FossFLOW/issues
- Tag packaging issues with `packaging` label
- Flatpak-specific: Tag with `flatpak`
- Snap-specific: Tag with `snap`

## Credits

Packaging implementation follows best practices from:
- Flatpak documentation and community guidelines
- Snapcraft best practices
- FreeDesktop.org specifications
- Electron packaging guidelines
