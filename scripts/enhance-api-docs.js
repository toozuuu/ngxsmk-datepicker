const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../docs/api/index.html');
const stylePath = path.join(__dirname, '../docs/api/assets/style.css');

if (!fs.existsSync(indexPath)) {
  console.log('⚠️  API docs not found. Run "npm run docs" first.');
  process.exit(0);
}

// Read the index.html
let htmlContent = fs.readFileSync(indexPath, 'utf8');

// Modern custom CSS to inject
const modernCSS = `
<style id="modern-api-docs-css">
/* Modern API Documentation Styles */
:root {
  --api-primary: #667eea;
  --api-primary-dark: #764ba2;
  --api-bg: #ffffff;
  --api-bg-dark: #0a0a0a;
  --api-surface: #fafafa;
  --api-surface-dark: #111111;
  --api-text: #1a1a1a;
  --api-text-dark: #e5e5e5;
  --api-border: rgba(0, 0, 0, 0.08);
  --api-border-dark: rgba(255, 255, 255, 0.1);
  --api-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  --api-shadow-dark: 0 2px 8px rgba(0, 0, 0, 0.3);
  --api-shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
  --api-shadow-lg-dark: 0 8px 24px rgba(0, 0, 0, 0.5);
  --api-radius: 12px;
  --api-radius-lg: 16px;
  --api-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

[data-theme="dark"] {
  --api-bg: var(--api-bg-dark);
  --api-surface: var(--api-surface-dark);
  --api-text: var(--api-text-dark);
  --api-border: var(--api-border-dark);
  --api-shadow: var(--api-shadow-dark);
}

/* Modern Container */
body {
  background: linear-gradient(to bottom, var(--api-surface) 0%, var(--api-bg) 100%) !important;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
}

.tsd-page-toolbar {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--api-border);
  box-shadow: var(--api-shadow);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 1000;
}

[data-theme="dark"] .tsd-page-toolbar {
  background: rgba(17, 17, 17, 0.95) !important;
}

.tsd-page-toolbar .tsd-toolbar-contents {
  max-width: 1400px;
  margin: 0 auto;
}

/* Modern Sidebar */
.tsd-navigation {
  background: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(10px);
  border-right: 1px solid var(--api-border);
  padding: 1.5rem;
  box-shadow: var(--api-shadow);
}

[data-theme="dark"] .tsd-navigation {
  background: rgba(17, 17, 17, 0.8) !important;
}

.tsd-navigation .tsd-accordion-summary {
  font-weight: 600;
  color: var(--api-text);
  padding: 0.75rem 1rem;
  border-radius: var(--api-radius);
  transition: var(--api-transition);
  margin-bottom: 0.5rem;
}

.tsd-navigation .tsd-accordion-summary:hover {
  background: rgba(102, 126, 234, 0.1);
  color: var(--api-primary);
}

.tsd-navigation a {
  color: var(--api-text);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: var(--api-transition);
  display: block;
  margin: 0.25rem 0;
}

.tsd-navigation a:hover {
  background: rgba(102, 126, 234, 0.1);
  color: var(--api-primary);
  text-decoration: none;
  transform: translateX(4px);
}

.tsd-navigation a.tsd-kind-icon {
  font-weight: 500;
}

/* Modern Content Area */
.tsd-page-content {
  background: rgba(255, 255, 255, 0.6) !important;
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: var(--api-radius-lg);
  margin: 1.5rem;
  box-shadow: var(--api-shadow-lg);
  border: 1px solid var(--api-border);
}

[data-theme="dark"] .tsd-page-content {
  background: rgba(17, 17, 17, 0.6) !important;
  box-shadow: var(--api-shadow-lg-dark);
}

/* Modern Headers */
.tsd-page-title h1 {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--api-primary) 0%, var(--api-primary-dark) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.tsd-page-title p {
  font-size: 1.125rem;
  color: var(--api-text);
  opacity: 0.8;
  line-height: 1.7;
}

/* Modern Cards */
.tsd-panel {
  background: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(10px);
  border: 1px solid var(--api-border);
  border-radius: var(--api-radius);
  padding: 1.5rem;
  margin: 1.5rem 0;
  box-shadow: var(--api-shadow);
  transition: var(--api-transition);
}

[data-theme="dark"] .tsd-panel {
  background: rgba(17, 17, 17, 0.8) !important;
}

.tsd-panel:hover {
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
  transform: translateY(-2px);
  border-color: var(--api-primary);
}

[data-theme="dark"] .tsd-panel:hover {
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.tsd-panel-group {
  margin: 2rem 0;
}

/* Modern Tables */
.tsd-signature {
  background: var(--api-surface);
  border: 1px solid var(--api-border);
  border-radius: var(--api-radius);
  padding: 1rem;
  margin: 1rem 0;
  font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
  overflow-x: auto;
}

.tsd-signature code {
  background: transparent;
  color: var(--api-primary);
  font-weight: 500;
}

/* Modern Code Blocks */
pre {
  background: #1e1e1e !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--api-radius);
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

pre code {
  color: #d4d4d4;
  font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
}

/* Modern Links */
a {
  color: var(--api-primary);
  transition: var(--api-transition);
}

a:hover {
  color: var(--api-primary-dark);
  text-decoration: underline;
}

/* Modern Buttons */
button {
  background: var(--api-primary);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--api-transition);
}

button:hover {
  background: var(--api-primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* Modern Tags/Badges */
.tsd-tag {
  background: linear-gradient(135deg, var(--api-primary) 0%, var(--api-primary-dark) 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
  margin: 0.25rem;
}

/* Modern Search */
.tsd-page-toolbar input[type="search"] {
  background: var(--api-surface);
  border: 1px solid var(--api-border);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: var(--api-text);
  transition: var(--api-transition);
}

.tsd-page-toolbar input[type="search"]:focus {
  outline: none;
  border-color: var(--api-primary);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Modern Scrollbar */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: var(--api-surface);
}

::-webkit-scrollbar-thumb {
  background: var(--api-primary);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--api-primary-dark);
}

/* Responsive */
@media (max-width: 768px) {
  .tsd-page-content {
    margin: 1rem;
    padding: 1.5rem;
  }
  
  .tsd-page-title h1 {
    font-size: 2rem;
  }
  
  .tsd-navigation {
    padding: 1rem;
  }
}

/* Smooth Transitions */
* {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}
</style>
`;

// Inject CSS before </head>
if (htmlContent.includes('</head>')) {
  htmlContent = htmlContent.replace('</head>', `${modernCSS}</head>`);
} else {
  // Fallback: inject at the beginning of <body>
  htmlContent = htmlContent.replace('<body>', `<body>${modernCSS}`);
}

// Write the updated HTML
fs.writeFileSync(indexPath, htmlContent, 'utf8');
console.log('✅ Modern API documentation styles applied successfully!');

