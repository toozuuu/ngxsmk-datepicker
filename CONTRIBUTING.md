# Contributing to ngxsmk-datepicker

Thank you for your interest in contributing to ngxsmk-datepicker! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 8.x or higher
- Angular 17+ knowledge

### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ngxsmk-datepicker.git
   cd ngxsmk-datepicker
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the demo app:
   ```bash
   npm start
   ```

5. Run tests:
   ```bash
   npm test
   ```

## Development Workflow

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/updates

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Test additions/changes
- `chore:` - Build process or auxiliary tool changes
- `perf:` - Performance improvements
- `ci:` - CI configuration changes

Example:
```
feat: add keyboard navigation support
fix: resolve date range selection issue
docs: update README with SSR examples
```

### Pull Request Process

1. Create a feature branch from `main` or `develop`
2. Make your changes
3. Ensure all tests pass: `npm test`
4. Ensure the build succeeds: `npm run build:optimized`
   - This automatically removes source maps from production builds
   - Use `npm run build:analyze` to check bundle size
5. Update documentation if needed
6. Create a pull request with a clear description

### PR Checklist

- [ ] Code follows the project's style guidelines
- [ ] Tests added/updated and passing
- [ ] Documentation updated
- [ ] No breaking changes (or clearly documented)
- [ ] Build succeeds (`npm run build:optimized`)
- [ ] Bundle size checked (`npm run build:analyze`)
- [ ] Linter passes (if configured)

## Code Style

### TypeScript

- Use TypeScript strict mode
- Prefer `interface` over `type` for public APIs
- Use meaningful variable names
- Add JSDoc comments for public APIs

### Angular

- Use standalone components
- Prefer `inject()` over constructor injection
- Use `OnPush` change detection strategy
- Guard browser-only APIs with platform checks

### Testing

- Write unit tests for new features
- Maintain or improve test coverage
- Test edge cases and error scenarios
- Test SSR compatibility when applicable

## Project Structure

```
projects/ngxsmk-datepicker/
├── src/
│   ├── lib/
│   │   ├── components/     # Reusable components
│   │   ├── utils/          # Utility functions
│   │   ├── issues/         # Issue-specific tests
│   │   └── styles/         # CSS files
│   └── public-api.ts       # Public API exports
├── docs/                    # Documentation
└── package.json
```

## Public API Guidelines

### Breaking Changes

Breaking changes require:
1. Major version bump (semver)
2. Migration guide in `MIGRATION.md`
3. Clear documentation in CHANGELOG.md
4. Deprecation notice (if applicable) in previous version

### Adding New Features

1. Update `public-api.ts` if exporting new types/components
2. Add tests
3. Update README.md with examples
4. Add JSDoc comments

### Deprecation Policy

- Deprecated features remain for at least one major version
- Clear deprecation warnings in code and docs
- Migration path provided

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- --include="**/issue-13.spec.ts"
```

### Writing Tests

- Use Jasmine/Karma
- Test both happy paths and edge cases
- Test SSR compatibility when applicable
- Test accessibility features

## Documentation

### README Updates

- Update README.md for user-facing changes
- Add examples for new features
- Update compatibility table if needed

### API Documentation

- Add JSDoc comments for public APIs
- Document parameters and return types
- Include usage examples in comments

## Release Process

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Create git tag: `git tag v1.x.x`
4. Push tag: `git push origin v1.x.x`
5. Publish to npm: `npm publish`

## Questions?

- Open an issue for questions
- Check existing issues/PRs
- Review the documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

