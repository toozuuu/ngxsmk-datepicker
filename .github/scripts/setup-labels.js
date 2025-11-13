#!/usr/bin/env node

/**
 * GitHub Labels Setup Script
 * 
 * This script helps set up labels for the ngxsmk-datepicker repository.
 * 
 * Usage:
 *   1. Install GitHub CLI: https://cli.github.com/
 *   2. Authenticate: gh auth login
 *   3. Run: node .github/scripts/setup-labels.js
 * 
 * Or manually create labels using the GitHub web interface:
 *   Settings → Labels → Import labels from .github/labels.json
 */

const fs = require('fs');
const path = require('path');

const labelsPath = path.join(__dirname, '..', 'labels.json');
const labels = JSON.parse(fs.readFileSync(labelsPath, 'utf8'));

console.log('📋 GitHub Labels Setup\n');
console.log('Labels to create:\n');

labels.forEach((label, index) => {
  console.log(`${index + 1}. ${label.name}`);
  console.log(`   Color: #${label.color}`);
  console.log(`   Description: ${label.description}\n`);
});

console.log('\n📝 To set up labels:');
console.log('\nOption 1: Using GitHub CLI (recommended)');
console.log('  gh label create <name> --color <color> --description "<description>"');
console.log('\nOption 2: Using GitHub Web Interface');
console.log('  1. Go to: https://github.com/NGXSMK/ngxsmk-datepicker/labels');
console.log('  2. Click "New label"');
console.log('  3. Fill in name, color, and description');
console.log('  4. Repeat for each label');
console.log('\nOption 3: Using GitHub API');
console.log('  See: https://docs.github.com/en/rest/issues/labels#create-a-label');
console.log('\n💡 Tip: You can also use a tool like "github-label-sync" to automate this.');

