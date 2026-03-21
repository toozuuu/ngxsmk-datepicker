'use strict';

/**
 * Ensures ng-packagr output exists before npm publish (semantic-release or manual).
 * See https://github.com/NGXSMK/ngxsmk-datepicker/issues/230
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'dist', 'ngxsmk-datepicker');
const required = [
  ['fesm2022', 'ngxsmk-datepicker.mjs'],
  ['types', 'ngxsmk-datepicker.d.ts'],
];

let ok = true;
for (const parts of required) {
  const abs = path.join(root, ...parts);
  if (!fs.existsSync(abs)) {
    console.error('[assert-dist-lib-ready] Missing:', path.join('dist', 'ngxsmk-datepicker', ...parts));
    ok = false;
  }
}

if (!ok) {
  console.error(
    '[assert-dist-lib-ready] Run from repo root: npm run build:optimized && npm run prepublish:copy-assets'
  );
  process.exit(1);
}

console.log('[assert-dist-lib-ready] dist/ngxsmk-datepicker is ready to publish.');
