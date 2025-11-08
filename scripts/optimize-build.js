#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting build optimization...');

// Update package.json with optimized build settings
const packageJsonPath = path.join(__dirname, '../projects/ngxsmk-datepicker/package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Add sideEffects optimization
packageJson.sideEffects = false;

// Add module resolution optimizations
packageJson.exports = {
  '.': {
    'import': './fesm2022/ngxsmk-datepicker.mjs',
    'require': './fesm2020/ngxsmk-datepicker.mjs'
  }
};

// Add optimization metadata
packageJson.optimization = {
  'treeShaking': true,
  'sideEffects': false,
  'usedExports': true
};

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('✅ Package.json optimized');

// Create optimized tsconfig for production
const optimizedTsConfig = {
  "extends": "./tsconfig.lib.json",
  "compilerOptions": {
    "declarationMap": false,
    "sourceMap": false,
    "removeComments": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true
  },
  "angularCompilerOptions": {
    "compilationMode": "partial",
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true,
    "optimization": {
      "scripts": true,
      "styles": true
    }
  }
};

fs.writeFileSync(
  path.join(__dirname, '../projects/ngxsmk-datepicker/tsconfig.lib.optimized.json'),
  JSON.stringify(optimizedTsConfig, null, 2)
);

console.log('✅ Optimized TypeScript configuration created');

// Create bundle analyzer script
const bundleAnalyzerScript = `#!/usr/bin/env node

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
  
  console.log('\\n📈 Bundle Analysis:');
  console.log('Total size:', (totalSize / 1024).toFixed(2), 'KB');
  console.log('\\nFile breakdown:');
  fileSizes
    .sort((a, b) => b.size - a.size)
    .forEach(({ file, size }) => console.log(\`  \${file}: \${size}\`));
    
} catch (error) {
  console.error('❌ Bundle analysis failed:', error.message);
  process.exit(1);
}
`;

fs.writeFileSync(
  path.join(__dirname, 'analyze-bundle.js'),
  bundleAnalyzerScript
);

// Make it executable
fs.chmodSync(path.join(__dirname, 'analyze-bundle.js'), '755');

console.log('✅ Bundle analyzer script created');

console.log('🎉 Build optimization complete!');
console.log('\\nNext steps:');
console.log('1. Run: npm run build');
console.log('2. Run: node scripts/analyze-bundle.js');
console.log('3. Check the optimized bundle in dist/ngxsmk-datepicker/');


