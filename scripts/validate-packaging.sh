#!/bin/bash

# Script to validate packaging configurations
set -e

echo "=== Validating FossFLOW Packaging Configuration ==="
echo ""

# Check required files exist
echo "Checking required files..."
files=(
    "org.fossflow.FossFLOW.desktop"
    "org.fossflow.FossFLOW.metainfo.xml"
    "org.fossflow.FossFLOW.yml"
    "snap/snapcraft.yaml"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✓ $file exists"
    else
        echo "✗ $file is missing"
        exit 1
    fi
done

echo ""
echo "Validating file formats..."

# Validate YAML files
if command -v yamllint &> /dev/null; then
    echo "Validating Flatpak manifest..."
    yamllint -d relaxed org.fossflow.FossFLOW.yml
    echo "✓ Flatpak manifest is valid"
    
    echo "Validating Snap manifest..."
    yamllint -d relaxed snap/snapcraft.yaml
    echo "✓ Snap manifest is valid"
else
    echo "⚠ yamllint not installed, skipping YAML validation"
fi

# Validate XML
if command -v xmllint &> /dev/null; then
    echo "Validating AppStream metadata..."
    xmllint --noout org.fossflow.FossFLOW.metainfo.xml
    echo "✓ AppStream metadata is valid"
elif command -v python3 &> /dev/null; then
    echo "Validating AppStream metadata with Python..."
    python3 -c "import xml.etree.ElementTree as ET; ET.parse('org.fossflow.FossFLOW.metainfo.xml')"
    echo "✓ AppStream metadata is valid"
else
    echo "⚠ No XML validator found, skipping XML validation"
fi

# Validate desktop file
if command -v desktop-file-validate &> /dev/null; then
    echo "Validating desktop file..."
    desktop-file-validate org.fossflow.FossFLOW.desktop
    echo "✓ Desktop file is valid"
else
    echo "⚠ desktop-file-validate not installed, skipping desktop file validation"
fi

# Check icon files exist
echo ""
echo "Checking icon files..."
icons=(
    "packages/fossflow-app/public/logo512.png"
    "packages/fossflow-app/public/logo192.png"
)

for icon in "${icons[@]}"; do
    if [ -f "$icon" ]; then
        echo "✓ $icon exists"
    else
        echo "✗ $icon is missing"
        exit 1
    fi
done

echo ""
echo "=== All packaging validations passed! ==="
