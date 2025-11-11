#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🗑️  Removing source maps from production build...');

const distPath = path.join(__dirname, '../dist/ngxsmk-datepicker');

function removeSourceMaps(dir) {
  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        removeSourceMaps(filePath);
      } else if (filePath.endsWith('.map')) {
        fs.unlinkSync(filePath);
        console.log(`  Removed: ${path.relative(distPath, filePath)}`);
      }
    });
  } catch (error) {
    // Silently handle errors (e.g., permission issues, missing files)
    // This prevents build failures in CI environments
  }
}

if (fs.existsSync(distPath)) {
  removeSourceMaps(distPath);
  console.log('✅ Source maps removed');
} else {
  console.log('⚠️  Dist folder not found. Skipping source map removal.');
  // Don't fail the build if dist doesn't exist - it might be a clean build
}

