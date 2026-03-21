'use strict';

/**
 * Blocks `npm publish` when run from projects/ngxsmk-datepicker without ng-packagr output.
 * Always publish from dist/ngxsmk-datepicker after `npm run build:optimized`.
 */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const mjs = path.join(root, 'fesm2022', 'ngxsmk-datepicker.mjs');
const dts = path.join(root, 'types', 'ngxsmk-datepicker.d.ts');

if (!fs.existsSync(mjs) || !fs.existsSync(dts)) {
  console.error(
    '[assert-lib-publish-artifacts] Missing built library files in:',
    root
  );
  console.error('Expected:', path.relative(root, mjs), 'and', path.relative(root, dts));
  console.error('From repo root: npm run build:optimized && npm run prepublish:copy-assets');
  console.error('Then publish from: dist/ngxsmk-datepicker only (not projects/ngxsmk-datepicker).');
  process.exit(1);
}
