# FossFLOW Packaging Guide

This document provides comprehensive instructions for packaging FossFLOW as a Flatpak or Snap for Linux distributions.

## Overview

FossFLOW is packaged using Electron to provide a native desktop experience while leveraging the existing web application. Both Flatpak and Snap packages are supported.

## Prerequisites

### For Flatpak
- `flatpak` (version 1.0 or later)
- `flatpak-builder`
- Flathub repository configured

### For Snap
- `snapcraft` (version 7.0 or later)
- `multipass` or `lxd` for building
- Ubuntu 22.04 or later (recommended)

## Building a Flatpak

### Step 1: Install Dependencies

```bash
# Install Flatpak and flatpak-builder
sudo apt install flatpak flatpak-builder

# Add Flathub repository
flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo

# Install required runtimes and SDKs
flatpak install flathub org.freedesktop.Platform//23.08
flatpak install flathub org.freedesktop.Sdk//23.08
flatpak install flathub org.electronjs.Electron2.BaseApp//23.08
```

### Step 2: Build the Flatpak

```bash
# Clone the repository
git clone https://github.com/stan-smith/FossFLOW.git
cd FossFLOW

# Build the Flatpak
flatpak-builder --force-clean build-dir org.fossflow.FossFLOW.yml
```

### Step 3: Install and Test

```bash
# Install the Flatpak locally
flatpak-builder --user --install --force-clean build-dir org.fossflow.FossFLOW.yml

# Run the application
flatpak run org.fossflow.FossFLOW
```

### Step 4: Export for Distribution (Optional)

```bash
# Create a repository
flatpak-builder --repo=repo --force-clean build-dir org.fossflow.FossFLOW.yml

# Create a single-file bundle
flatpak build-bundle repo fossflow.flatpak org.fossflow.FossFLOW

# Users can install from the bundle
flatpak install fossflow.flatpak
```

## Building a Snap

### Step 1: Install Snapcraft

```bash
# Install snapcraft
sudo apt install snapcraft

# Install multipass for building (recommended)
sudo snap install multipass
```

### Step 2: Build the Snap

```bash
# Clone the repository
git clone https://github.com/stan-smith/FossFLOW.git
cd FossFLOW

# Build the snap (uses multipass VM)
snapcraft

# Or build in an LXD container
snapcraft --use-lxd
```

### Step 3: Install and Test

```bash
# Install the snap locally (dangerous flag for unsigned snap)
sudo snap install --dangerous fossflow_1.5.1_amd64.snap

# Run the application
fossflow
```

### Step 4: Publish to Snap Store (Optional)

```bash
# Login to Snap Store
snapcraft login

# Upload and release
snapcraft upload fossflow_1.5.1_amd64.snap --release=stable
```

## Architecture Support

Both packaging formats support multiple architectures:

### Flatpak
- x86_64 (Intel/AMD 64-bit)
- aarch64 (ARM 64-bit)

### Snap
- amd64 (Intel/AMD 64-bit)
- arm64 (ARM 64-bit)

## Troubleshooting

### Flatpak Issues

**Build fails with "Module not found":**
- Ensure all dependencies are specified in the manifest
- Check that the Node.js version matches the one used in development

**Application doesn't start:**
- Check logs: `flatpak run --verbose org.fossflow.FossFLOW`
- Verify Electron base app is installed correctly

### Snap Issues

**Build fails during npm install:**
- Clear the build cache: `snapcraft clean`
- Try building with `--destructive-mode` on a clean Ubuntu system

**Permission denied errors:**
- Check that all required plugs are declared in snapcraft.yaml
- Some features may require manual connection: `snap connect fossflow:home`

## Manifest Files

### Flatpak Manifest
- `org.fossflow.FossFLOW.yml` - Main Flatpak manifest

### Snap Manifest
- `snap/snapcraft.yaml` - Main Snap manifest

### Shared Files
- `org.fossflow.FossFLOW.desktop` - Desktop entry file
- `org.fossflow.FossFLOW.metainfo.xml` - AppStream metadata

## Version Management

When releasing a new version:

1. Update version in `package.json`
2. Update version in `snap/snapcraft.yaml`
3. Update release date in `org.fossflow.FossFLOW.metainfo.xml`
4. Update git tag reference in `org.fossflow.FossFLOW.yml`
5. Rebuild both packages

## Resources

- [Flatpak Documentation](https://docs.flatpak.org/)
- [Snapcraft Documentation](https://snapcraft.io/docs)
- [Electron Packaging](https://www.electronjs.org/docs/latest/tutorial/application-distribution)
- [AppStream Specification](https://www.freedesktop.org/software/appstream/docs/)

## Support

For issues specific to packaging:
- Open an issue on [GitHub](https://github.com/stan-smith/FossFLOW/issues)
- Tag issues with `packaging` label

## Contributing

Improvements to packaging configurations are welcome! Please ensure:
- Both Flatpak and Snap manifests are updated consistently
- Desktop and AppStream metadata follow standards
- Changes are tested on multiple architectures if possible
