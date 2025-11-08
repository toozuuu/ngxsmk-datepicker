# Publishing to npm

## Quick Start

1. **Login to npm:**
   ```bash
   npm login
   ```

2. **Build and prepare:**
   ```bash
   npm run build:optimized
   npm run prepublish:copy-license
   ```

3. **Publish:**
   ```bash
   cd dist/ngxsmk-datepicker
   npm publish --access public
   cd ../..
   ```

## Detailed Steps

### Step 1: Login to npm

```bash
npm login
```

Enter your:
- Username
- Password (or use 2FA token if enabled)
- Email

### Step 2: Build the Library

```bash
npm run build:optimized
```

This creates the distributable package in `dist/ngxsmk-datepicker/`.

### Step 3: Copy License File

```bash
npm run prepublish:copy-license
```

Or manually:
```bash
copy LICENSE dist\ngxsmk-datepicker\LICENSE
```

### Step 4: Verify Package Contents

```bash
cd dist/ngxsmk-datepicker
npm pack --dry-run
```

This shows what will be published without actually publishing.

### Step 5: Publish

```bash
# Make sure you're in dist/ngxsmk-datepicker
npm publish --access public
```

### Step 6: Verify Publication

Visit: https://www.npmjs.com/package/ngxsmk-datepicker

## What Gets Published

The package includes:
- ✅ Compiled JavaScript (`fesm2022/`)
- ✅ TypeScript definitions (`types/`, `index.d.ts`)
- ✅ Package metadata (`package.json`)
- ✅ Documentation (`README.md`)
- ✅ License (`LICENSE`)

The package size should be approximately **50-100 KB**.

## Troubleshooting

### "need auth" Error
```bash
npm login
```

### Version Already Exists
Update the version in:
- `package.json`
- `projects/ngxsmk-datepicker/package.json`  
- `projects/demo-app/src/app/app.component.html`

Then rebuild and publish.

### Package Too Large
- Check `.npmignore` is working
- Verify only `dist/ngxsmk-datepicker` files are included
- Ensure no cache or build artifacts are included

### Wrong Directory
Always publish from `dist/ngxsmk-datepicker`, not from the root!

## After Publishing

1. **Create GitHub Release:**
   ```bash
   git tag v1.6.0
   git push origin v1.6.0
   ```

2. **Test Installation:**
   ```bash
   npm install ngxsmk-datepicker@1.6.0
   ```

## Notes

- The `.npmignore` file prevents unwanted files from being included
- Only files from `dist/ngxsmk-datepicker` should be published
- The `prepublishOnly` script runs automatically before `npm publish` (if publishing from root)
