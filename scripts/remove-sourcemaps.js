#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🗑️  Removing source maps from production build...');

const distPath = path.join(__dirname, '../dist/ngxsmk-datepicker');

function removeSourceMaps(dir) {
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
}

if (fs.existsSync(distPath)) {
  removeSourceMaps(distPath);
  console.log('✅ Source maps removed');
} else {
  console.log('⚠️  Dist folder not found. Run build first.');
  process.exit(1);
}

