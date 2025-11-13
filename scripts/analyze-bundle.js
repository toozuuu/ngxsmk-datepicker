#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('📊 Analyzing bundle size...');

try {
  // Build the library
  execSync('ng build ngxsmk-datepicker --configuration production', { stdio: 'inherit' });
  
  // Analyze bundle size
  const distPath = path.join(__dirname, '../dist/ngxsmk-datepicker');
  const files = fs.readdirSync(distPath, { recursive: true });
  
  let totalSize = 0;
  const fileSizes = [];
  
  files.forEach(file => {
    const filePath = path.join(distPath, file);
    if (fs.statSync(filePath).isFile()) {
      const size = fs.statSync(filePath).size;
      totalSize += size;
      fileSizes.push({ file, size: (size / 1024).toFixed(2) + ' KB' });
    }
  });
  
  console.log('\n📈 Bundle Analysis:');
  console.log('Total size:', (totalSize / 1024).toFixed(2), 'KB');
  console.log('\nFile breakdown:');
  fileSizes
    .sort((a, b) => b.size - a.size)
    .forEach(({ file, size }) => console.log(`  ${file}: ${size}`));
    
} catch (error) {
  console.error('❌ Bundle analysis failed:', error.message);
  process.exit(1);
}
