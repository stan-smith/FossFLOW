#!/usr/bin/env node

/**
 * Updates version numbers across all packages in the monorepo
 * Used by semantic-release to sync versions
 */

const fs = require('fs');
const path = require('path');

const version = process.argv[2];

if (!version) {
  console.error('Error: Version number required');
  process.exit(1);
}

console.log(`Updating all packages to version ${version}...`);

// List of package.json files to update
const packageFiles = [
  'package.json',
  'packages/fossflow-lib/package.json',
  'packages/fossflow-app/package.json',
  'packages/fossflow-backend/package.json'
];

packageFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);

  if (!fs.existsSync(filePath)) {
    console.warn(`Warning: ${file} not found, skipping...`);
    return;
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    packageJson.version = version;
    fs.writeFileSync(filePath, JSON.stringify(packageJson, null, 2) + '\n');
    console.log(`Updated ${file} to ${version}`);
  } catch (error) {
    console.error(`Error updating ${file}:`, error.message);
    process.exit(1);
  }
});

console.log('Version update complete!');
