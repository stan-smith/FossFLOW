# Quick Start Guide: Packaging FossFLOW

This is a quick reference guide for building FossFLOW packages. For comprehensive documentation, see [PACKAGING.md](../PACKAGING.md).

## Flatpak

### One-Command Build and Install

```bash
flatpak-builder --user --install --force-clean build-dir org.fossflow.FossFLOW.yml
```

### Run the App

```bash
flatpak run org.fossflow.FossFLOW
```

## Snap

### One-Command Build

```bash
snapcraft
```

### Install and Run

```bash
sudo snap install --dangerous fossflow_1.5.1_amd64.snap
fossflow
```

## Quick Validation

Before building, validate your configuration:

```bash
./scripts/validate-packaging.sh
```

## Key Files

- **Flatpak**: `org.fossflow.FossFLOW.yml`
- **Snap**: `snap/snapcraft.yaml`
- **Desktop Entry**: `org.fossflow.FossFLOW.desktop`
- **AppStream Metadata**: `org.fossflow.FossFLOW.metainfo.xml`

## Troubleshooting

### Flatpak: "Module not found" errors
```bash
# Clear cache and rebuild
rm -rf build-dir .flatpak-builder
flatpak-builder --force-clean build-dir org.fossflow.FossFLOW.yml
```

### Snap: Build fails
```bash
# Clean and rebuild
snapcraft clean
snapcraft
```

### Both: Permission issues
Check that all required files are committed to git and accessible.

## Next Steps

- Read the [full packaging guide](../PACKAGING.md) for detailed instructions
- Check [GitHub Actions workflow](.github/workflows/flatpak.yml) for automated builds
- Report packaging issues on [GitHub](https://github.com/stan-smith/FossFLOW/issues)
