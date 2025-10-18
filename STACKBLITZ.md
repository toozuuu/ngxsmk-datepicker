# Stackblitz Setup Guide

## 🚀 Quick Start for Stackblitz

This guide helps you run the `ngxsmk-datepicker` project in Stackblitz.

### Prerequisites

- Stackblitz account (free)
- Modern web browser

### Setup Steps

1. **Fork the Repository**
   - Click the "Fork" button on GitHub
   - Or import directly into Stackblitz

2. **Install Dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the Demo App**
   ```bash
   npm start
   ```

### 🔧 Troubleshooting

#### Error: `jsh: command not found: ng`

**Solution**: The Angular CLI is now included as a dev dependency and scripts use `npx` to ensure it's available.

#### Error: `Cannot find module '@angular/core'`

**Solution**: Make sure all dependencies are installed:
```bash
npm install --legacy-peer-deps
```

#### Error: `ERESOLVE could not resolve` or dependency conflicts

**Solution**: Use the legacy peer deps flag to resolve version conflicts:
```bash
npm install --legacy-peer-deps
```

#### Error: `Cannot find module 'typescript'` or `Cannot find package '@angular/compiler'`

**Solution**: The required dependencies are now included in package.json. Make sure to install all dependencies:
```bash
npm install --legacy-peer-deps
```

#### Error: `Unable to import pipe JsonPipe` or `Unable to import directive NgClass`

**Solution**: These issues have been resolved by:
- Replacing `JsonPipe` with `JSON.stringify()` in templates
- Adding `JSON` as a component property
- Removing unused imports
- Updated budget limits in `angular.json`

#### Error: `Unable to import directive NgClass` from library node_modules

**Solution**: Clean the library's node_modules and rebuild:
```bash
# Remove library's node_modules
Remove-Item -Recurse -Force "projects/ngxsmk-datepicker/node_modules"

# Rebuild the library
npm run build:optimized

# Start the demo app
npm start
```

#### Error: `Port already in use`

**Solution**: Stackblitz will automatically assign a different port.

### 📱 Demo Features

The demo app showcases:

- **Holiday Provider Integration** with US holidays
- **Single Date Selection** with weekend restrictions  
- **Inline Range Picker** with toggle controls
- **Date Range with Time** selection
- **Multiple Date Selection** with action tracking
- **Theme Toggle** (Light/Dark mode)

### 🎯 Available Scripts

```bash
# Start the demo app
npm start

# Build the library
npm run build

# Build optimized version
npm run build:optimized

# Run tests
npm test
```

### 🌐 Access the Demo

Once running, the demo will be available at:
- **Local**: `http://localhost:4200`
- **Stackblitz**: Automatically provided URL

### 🐛 Common Issues

1. **Build Errors**: Make sure all dependencies are installed
2. **TypeScript Errors**: Check that all imports are correct
3. **Styling Issues**: Ensure CSS files are properly linked
4. **Performance**: Stackblitz may be slower than local development

### 📚 Documentation

- [Main README](README.md)
- [Demo App README](projects/demo-app/README.md)
- [Library README](projects/ngxsmk-datepicker/README.md)
- [Contributing Guide](CONTRIBUTING.md)

### 🤝 Support

If you encounter issues:

1. Check the [GitHub Issues](https://github.com/toozuuu/ngxsmk-datepicker/issues)
2. Review the documentation
3. Create a new issue with details

### 🎉 Success!

Once everything is running, you should see the ngxsmk-datepicker demo with all its features working perfectly!

---

**Last Updated**: 2025-01-18  
**Version**: 1.4.0
