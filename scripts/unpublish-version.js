#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Read package.json to get version
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const packageName = packageJson.name;
const version = packageJson.version;

// Get OTP from command line arguments
const otpIndex = process.argv.indexOf('--otp');
const otp = otpIndex !== -1 && process.argv[otpIndex + 1] ? process.argv[otpIndex + 1] : null;

if (!otp) {
  console.error('Error: OTP code is required. Usage: npm run unpublish:version -- --otp=<code>');
  process.exit(1);
}

console.log(`Unpublishing ${packageName}@${version}...`);

try {
  const command = `npm unpublish ${packageName}@${version} --otp=${otp}`;
  execSync(command, { stdio: 'inherit' });
  console.log(`Successfully unpublished ${packageName}@${version}`);
} catch (error) {
  console.error(`Failed to unpublish ${packageName}@${version}`);
  process.exit(1);
}

