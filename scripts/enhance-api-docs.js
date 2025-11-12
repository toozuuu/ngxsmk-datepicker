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
  overflow-x: hidden !important;
  width: 100% !important;
  max-width: 100vw !important;
}

/* Ensure proper viewport handling */
html {
  width: 100% !important;
  max-width: 100vw !important;
  overflow-x: hidden !important;
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

/* Fixed width for datepicker input in API documentation - Desktop */
.tsd-panel .ngxsmk-datepicker-wrapper:not(.ngxsmk-inline-mode),
.tsd-page-content .ngxsmk-datepicker-wrapper:not(.ngxsmk-inline-mode),
.tsd-member .ngxsmk-datepicker-wrapper:not(.ngxsmk-inline-mode) {
  width: 300px !important;
  max-width: 300px !important;
  min-width: 300px !important;
  display: inline-block !important;
  vertical-align: top !important;
}

.tsd-panel .ngxsmk-input-group,
.tsd-page-content .ngxsmk-input-group,
.tsd-member .ngxsmk-input-group {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 200px !important;
  box-sizing: border-box !important;
}

.tsd-panel .ngxsmk-display-input,
.tsd-page-content .ngxsmk-display-input,
.tsd-member .ngxsmk-display-input {
  width: 100% !important;
  min-width: 0 !important;
  box-sizing: border-box !important;
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

/* Mobile Responsive Styles */
@media (max-width: 768px) {
  /* Toolbar adjustments */
  .tsd-page-toolbar {
    padding: 0.75rem 1rem !important;
    position: sticky !important;
    top: 0 !important;
    z-index: 1000 !important;
  }
  
  .tsd-page-toolbar .tsd-toolbar-contents {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .tsd-page-toolbar .table-cell {
    padding: 0.25rem !important;
  }
  
  .tsd-page-toolbar input[type="search"] {
    width: 100% !important;
    max-width: 100% !important;
    font-size: 16px !important; /* Prevent zoom on iOS */
    padding: 0.625rem 0.875rem !important;
  }
  
  /* Content area */
  .tsd-page-content {
    margin: 0.5rem !important;
    padding: 1rem !important;
    border-radius: 8px !important;
    overflow-x: hidden !important;
  }
  
  /* Headers */
  .tsd-page-title h1 {
    font-size: 1.75rem !important;
    line-height: 1.2 !important;
    margin-bottom: 0.75rem !important;
  }
  
  .tsd-page-title p {
    font-size: 1rem !important;
    line-height: 1.6 !important;
  }
  
  /* Navigation sidebar - ensure it works with mobile menu */
  .tsd-navigation {
    padding: 1rem !important;
    font-size: 0.9375rem !important;
  }
  
  .tsd-navigation a {
    padding: 0.625rem 0.875rem !important;
    font-size: 0.9375rem !important;
  }
  
  /* Panels and cards */
  .tsd-panel {
    padding: 1rem !important;
    margin: 1rem 0 !important;
    border-radius: 8px !important;
  }
  
  .tsd-panel-group {
    margin: 1.5rem 0 !important;
  }
  
  /* Tables - ensure they're responsive and scrollable */
  .tsd-page-content {
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
  }
  
  table {
    width: 100% !important;
    max-width: 100% !important;
    display: table !important;
    border-collapse: collapse !important;
    table-layout: auto !important;
    font-size: 0.875rem !important;
  }
  
  /* Allow tables to be wider than viewport if needed, but make them scrollable */
  .tsd-panel table {
    display: table !important;
    min-width: 100% !important;
  }
  
  table th,
  table td {
    padding: 0.75rem 0.5rem !important;
    font-size: 0.875rem !important;
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
    hyphens: auto !important;
    vertical-align: top !important;
  }
  
  /* Make table headers more compact on mobile */
  table th {
    font-size: 0.8125rem !important;
    font-weight: 600 !important;
    white-space: nowrap !important;
  }
  
  /* Allow table cells to wrap text */
  table td {
    white-space: normal !important;
    max-width: 200px !important;
  }
  
  /* Signatures and code */
  .tsd-signature {
    padding: 0.75rem !important;
    font-size: 0.875rem !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
    word-break: break-all !important;
  }
  
  .tsd-signature code {
    font-size: 0.875rem !important;
    line-height: 1.5 !important;
  }
  
  /* Code blocks */
  pre {
    padding: 1rem !important;
    font-size: 0.8125rem !important;
    line-height: 1.5 !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
    border-radius: 8px !important;
  }
  
  pre code {
    font-size: 0.8125rem !important;
    line-height: 1.5 !important;
    word-break: break-word !important;
    white-space: pre-wrap !important;
  }
  
  /* Lists */
  ul, ol {
    padding-left: 1.25rem !important;
  }
  
  li {
    margin-bottom: 0.5rem !important;
    line-height: 1.6 !important;
  }
  
  /* Tags */
  .tsd-tag {
    font-size: 0.6875rem !important;
    padding: 0.25rem 0.5rem !important;
    margin: 0.125rem !important;
  }
  
  /* Accordion summaries */
  .tsd-accordion-summary {
    padding: 0.625rem 0.875rem !important;
    font-size: 0.9375rem !important;
  }
  
  /* Member signatures */
  .tsd-member-signature {
    font-size: 0.875rem !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
  }
  
  /* Description text */
  .tsd-comment p {
    font-size: 0.9375rem !important;
    line-height: 1.6 !important;
  }
  
  /* Prevent horizontal overflow */
  body {
    overflow-x: hidden !important;
    width: 100% !important;
  }
  
  .container-main {
    width: 100% !important;
    max-width: 100% !important;
    overflow-x: hidden !important;
  }
  
  .col-content {
    width: 100% !important;
    max-width: 100% !important;
    padding: 0 !important;
  }
  
  /* Ensure sidebar menu works on mobile */
  .col-sidebar {
    width: 75vw !important;
    max-width: 300px !important;
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1) !important;
  }
  
  [data-theme="dark"] .col-sidebar {
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.5) !important;
  }
  
  /* Buttons */
  button {
    padding: 0.625rem 1rem !important;
    font-size: 0.9375rem !important;
    min-height: 44px !important; /* Touch target size */
    min-width: 44px !important;
  }
  
  /* Links */
  a {
    word-break: break-word !important;
  }
  
  /* TypeDoc specific elements */
  .tsd-kind-icon {
    font-size: 0.875rem !important;
  }
  
  .tsd-index-panel {
    margin: 1rem 0 !important;
  }
  
  .tsd-index-list {
    grid-template-columns: 1fr !important;
    gap: 0.5rem !important;
  }
  
  .tsd-index-list li {
    padding: 0.5rem !important;
    font-size: 0.875rem !important;
  }
  
  /* Member groups */
  .tsd-member-group {
    margin: 1.5rem 0 !important;
  }
  
  .tsd-member-group > h2 {
    font-size: 1.25rem !important;
    margin-bottom: 1rem !important;
  }
  
  /* Type parameters and hierarchy */
  .tsd-hierarchy {
    font-size: 0.875rem !important;
    padding: 0.75rem !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
  }
  
  /* Breadcrumbs */
  .tsd-breadcrumb {
    font-size: 0.875rem !important;
    margin-bottom: 1rem !important;
    flex-wrap: wrap !important;
  }
  
  .tsd-breadcrumb a {
    font-size: 0.875rem !important;
  }
  
  /* Page navigation */
  .tsd-page-navigation {
    margin: 1.5rem 0 !important;
    padding: 1rem !important;
    font-size: 0.875rem !important;
  }
  
  /* Widget buttons (menu, options) */
  .tsd-widget {
    min-width: 44px !important;
    min-height: 44px !important;
    padding: 0.5rem !important;
  }
  
  /* Ensure datepicker works as modal in docs on mobile */
  .ngxsmk-datepicker-wrapper {
    width: 100% !important;
    max-width: 100% !important;
    position: relative !important;
  }
  
  /* Fixed width for datepicker input in API documentation on mobile - allow full width */
  .tsd-panel .ngxsmk-datepicker-wrapper:not(.ngxsmk-inline-mode),
  .tsd-page-content .ngxsmk-datepicker-wrapper:not(.ngxsmk-inline-mode),
  .tsd-member .ngxsmk-datepicker-wrapper:not(.ngxsmk-inline-mode) {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 200px !important;
    display: block !important;
  }
  
  .tsd-panel .ngxsmk-input-group,
  .tsd-page-content .ngxsmk-input-group,
  .tsd-member .ngxsmk-input-group {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 200px !important;
  }
  
  .tsd-panel .ngxsmk-display-input,
  .tsd-page-content .ngxsmk-display-input,
  .tsd-member .ngxsmk-display-input {
    width: 100% !important;
    min-width: 0 !important;
  }
  
  /* Inline calendar mobile responsive styles */
  .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode {
    width: 100% !important;
    max-width: 100% !important;
    overflow-x: hidden !important;
  }
  
  .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode .ngxsmk-popover-container.ngxsmk-inline-container {
    position: static !important;
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    transform: none !important;
    -webkit-transform: none !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
    border-radius: 8px !important;
  }
  
  .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode .ngxsmk-datepicker-container {
    width: 100% !important;
    max-width: 100% !important;
    flex-direction: column !important;
  }
  
  .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode .ngxsmk-calendar-container {
    width: 100% !important;
    max-width: 100% !important;
    padding: 1rem !important;
    box-sizing: border-box !important;
  }
  
  .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode .ngxsmk-ranges-container {
    width: 100% !important;
    padding: 0.75rem !important;
    border-right: none !important;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
    border-radius: 8px 8px 0 0 !important;
  }
  
  .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode .ngxsmk-ranges-container ul {
    flex-direction: row !important;
    flex-wrap: wrap !important;
    gap: 0.5rem !important;
    justify-content: flex-start !important;
  }
  
  .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode .ngxsmk-ranges-container li {
    padding: 0.5rem 0.75rem !important;
    font-size: 0.875rem !important;
    flex: 0 1 auto !important;
    min-width: fit-content !important;
  }
  
  .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode .ngxsmk-days-grid-wrapper {
    width: 100% !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
    padding: 0 !important;
    margin-top: 0.75rem !important;
  }
  
  .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode .ngxsmk-days-grid {
    width: 100% !important;
    max-width: 100% !important;
    gap: 0.25rem !important;
    justify-content: center !important;
  }
  
  .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode .ngxsmk-day-cell {
    width: calc((100% - 1.5rem) / 7) !important;
    max-width: 44px !important;
    min-width: 32px !important;
    height: calc((100% - 1.5rem) / 7) !important;
    max-height: 44px !important;
    min-height: 32px !important;
    aspect-ratio: 1 !important;
  }
  
  .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode .ngxsmk-day-number {
    width: 100% !important;
    max-width: 36px !important;
    height: 100% !important;
    max-height: 36px !important;
    aspect-ratio: 1 !important;
  }
  
  .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode .ngxsmk-day-name {
    font-size: 0.75rem !important;
    padding: 0.5rem 0 !important;
  }
  
  .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode .ngxsmk-header {
    flex-wrap: wrap !important;
    gap: 0.5rem !important;
    margin-bottom: 0.75rem !important;
    padding: 0 !important;
  }
  
  .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode .ngxsmk-month-year-selects {
    width: 100% !important;
    flex: 1 1 100% !important;
    gap: 0.5rem !important;
  }
  
  .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode .ngxsmk-nav-buttons {
    gap: 0.25rem !important;
  }
  
  .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode .ngxsmk-nav-button {
    min-width: 36px !important;
    min-height: 36px !important;
    padding: 0.5rem !important;
  }
  
  .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode .ngxsmk-time-selection {
    flex-wrap: wrap !important;
    gap: 0.5rem !important;
    padding: 0.75rem 0 !important;
    margin-top: 0.75rem !important;
    width: 100% !important;
  }
  
  .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode .ngxsmk-time-selection > * {
    flex: 1 1 auto !important;
    min-width: 0 !important;
  }
  
  .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode .ngxsmk-footer {
    margin-top: 0.75rem !important;
    padding-top: 0.75rem !important;
    flex-wrap: wrap !important;
    gap: 0.5rem !important;
  }
  
  .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode .ngxsmk-clear-button-footer,
  .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode .ngxsmk-close-button {
    flex: 1 1 auto !important;
    min-width: 100px !important;
    padding: 0.625rem 1rem !important;
    font-size: 0.875rem !important;
  }
  
  /* Show backdrop for modal on mobile in API docs */
  .ngxsmk-datepicker-wrapper.ngxsmk-calendar-open:not(.ngxsmk-inline-mode) .ngxsmk-backdrop {
    display: block !important;
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    height: 100dvh !important;
    z-index: 2147483646 !important;
    background: rgba(0, 0, 0, 0.5) !important;
    backdrop-filter: blur(4px) !important;
    -webkit-backdrop-filter: blur(4px) !important;
    pointer-events: auto !important;
  }
  
  /* Datepicker popover as centered modal on mobile in API docs */
  .ngxsmk-popover-container:not(.ngxsmk-inline-container) {
    position: fixed !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    -webkit-transform: translate(-50%, -50%) !important;
    width: calc(100vw - 32px) !important;
    max-width: min(calc(100vw - 32px), 500px) !important;
    max-height: calc(100vh - 32px) !important;
    max-height: calc(100dvh - 32px) !important;
    z-index: 2147483647 !important;
    margin: 0 !important;
    overflow-y: auto !important;
    -webkit-overflow-scrolling: touch !important;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2) !important;
    border-radius: 12px !important;
  }
  
  /* Ensure wrapper doesn't interfere with modal */
  .ngxsmk-datepicker-wrapper.ngxsmk-calendar-open:not(.ngxsmk-inline-mode) {
    isolation: auto !important;
    transform: none !important;
    -webkit-transform: none !important;
    contain: none !important;
  }
  
  /* Toolbar icons and links */
  .tsd-toolbar-icon {
    width: 32px !important;
    height: 32px !important;
    padding: 0.5rem !important;
  }
  
  /* Search results */
  .tsd-search-results {
    max-height: 60vh !important;
    overflow-y: auto !important;
    -webkit-overflow-scrolling: touch !important;
  }
  
  /* Ensure overlay works properly */
  .overlay {
    background-color: rgba(0, 0, 0, 0.75) !important;
    z-index: 1023 !important;
  }
  
  /* Footer */
  footer {
    padding: 1rem !important;
    font-size: 0.875rem !important;
    text-align: center !important;
  }
  
  /* Ensure no horizontal scroll - be more specific */
  .tsd-page-content > *,
  .tsd-panel > *,
  .tsd-member > * {
    max-width: 100% !important;
    box-sizing: border-box !important;
  }
  
  img, svg {
    max-width: 100% !important;
    height: auto !important;
  }
  
  /* Fix for TypeDoc container */
  .container-main {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
  }
  
  /* Ensure inline calendar is contained within panels and content */
  .tsd-panel .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode,
  .tsd-page-content .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode,
  .tsd-member .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode {
    width: 100% !important;
    max-width: 100% !important;
    overflow-x: hidden !important;
    box-sizing: border-box !important;
  }
  
  .tsd-panel .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode .ngxsmk-popover-container,
  .tsd-page-content .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode .ngxsmk-popover-container,
  .tsd-member .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode .ngxsmk-popover-container {
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
  }
  
  /* Page menu (table of contents on right) - hide on mobile */
  .page-menu {
    display: none !important;
  }
  
  /* Ensure proper text wrapping */
  h1, h2, h3, h4, h5, h6 {
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
  }
  
  /* Parameter lists and descriptions */
  .tsd-parameters,
  .tsd-returns,
  .tsd-comment {
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
  }
  
  /* Type parameters */
  .tsd-type-parameters {
    font-size: 0.875rem !important;
    overflow-x: auto !important;
  }
}

/* Small mobile devices */
@media (max-width: 480px) {
  .tsd-page-toolbar {
    padding: 0.5rem 0.75rem !important;
  }
  
  .tsd-page-content {
    margin: 0.25rem !important;
    padding: 0.75rem !important;
  }
  
  .tsd-page-title h1 {
    font-size: 1.5rem !important;
  }
  
  .tsd-page-title p {
    font-size: 0.9375rem !important;
  }
  
  .tsd-panel {
    padding: 0.75rem !important;
  }
  
  pre {
    padding: 0.75rem !important;
    font-size: 0.75rem !important;
  }
  
  pre code {
    font-size: 0.75rem !important;
  }
  
  table th,
  table td {
    padding: 0.5rem 0.375rem !important;
    font-size: 0.8125rem !important;
  }
  
  .tsd-signature {
    padding: 0.5rem !important;
    font-size: 0.8125rem !important;
  }
  
  .tsd-navigation {
    padding: 0.75rem !important;
  }
  
  .tsd-navigation a {
    padding: 0.5rem 0.75rem !important;
    font-size: 0.875rem !important;
  }
  
  /* Inline calendar small mobile adjustments */
  .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode .ngxsmk-calendar-container {
    padding: 0.75rem !important;
  }
  
  .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode .ngxsmk-day-cell {
    min-width: 28px !important;
    max-width: 36px !important;
    min-height: 28px !important;
    max-height: 36px !important;
  }
  
  .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode .ngxsmk-day-number {
    max-width: 32px !important;
    max-height: 32px !important;
  }
  
  .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode .ngxsmk-day-name {
    font-size: 0.6875rem !important;
    padding: 0.375rem 0 !important;
  }
  
  .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode .ngxsmk-header {
    margin-bottom: 0.5rem !important;
  }
  
  .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode .ngxsmk-ranges-container {
    padding: 0.5rem !important;
  }
  
  .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode .ngxsmk-ranges-container li {
    padding: 0.375rem 0.5rem !important;
    font-size: 0.8125rem !important;
  }
  
  .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode .ngxsmk-nav-button {
    min-width: 32px !important;
    min-height: 32px !important;
    padding: 0.375rem !important;
  }
  
  .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode .ngxsmk-time-selection {
    padding: 0.5rem 0 !important;
    margin-top: 0.5rem !important;
  }
  
  .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode .ngxsmk-footer {
    margin-top: 0.5rem !important;
    padding-top: 0.5rem !important;
  }
  
  .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode .ngxsmk-clear-button-footer,
  .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode .ngxsmk-close-button {
    padding: 0.5rem 0.75rem !important;
    font-size: 0.8125rem !important;
  }
}

/* Tablet styles */
@media (min-width: 640px) and (max-width: 1024px) {
  .tsd-page-content {
    margin: 1rem !important;
    padding: 1.5rem !important;
  }
  
  .tsd-page-title h1 {
    font-size: 2.25rem !important;
    line-height: 1.3 !important;
  }
  
  .tsd-page-title p {
    font-size: 1.0625rem !important;
  }
  
  table th,
  table td {
    padding: 0.875rem 0.75rem !important;
    font-size: 0.9375rem !important;
  }
  
  /* Tablet navigation */
  .tsd-navigation {
    padding: 1.25rem !important;
  }
  
  .tsd-navigation a {
    padding: 0.625rem 1rem !important;
    font-size: 0.9375rem !important;
  }
  
  /* Tablet panels */
  .tsd-panel {
    padding: 1.25rem !important;
    margin: 1.25rem 0 !important;
  }
  
  /* Tablet code blocks */
  pre {
    padding: 1.25rem !important;
    font-size: 0.875rem !important;
  }
  
  /* Tablet signatures */
  .tsd-signature {
    padding: 1rem !important;
    font-size: 0.9375rem !important;
  }
  
  /* Ensure datepicker works well on tablet */
  .ngxsmk-datepicker-wrapper {
    max-width: 100% !important;
  }
  
  /* Fixed width for datepicker input in API documentation on tablet */
  .tsd-panel .ngxsmk-datepicker-wrapper:not(.ngxsmk-inline-mode),
  .tsd-page-content .ngxsmk-datepicker-wrapper:not(.ngxsmk-inline-mode),
  .tsd-member .ngxsmk-datepicker-wrapper:not(.ngxsmk-inline-mode) {
    width: 300px !important;
    max-width: 300px !important;
    min-width: 300px !important;
  }
  
  .tsd-panel .ngxsmk-input-group,
  .tsd-page-content .ngxsmk-input-group,
  .tsd-member .ngxsmk-input-group {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 200px !important;
  }
  
  /* Inline calendar tablet responsive styles */
  .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode {
    width: 100% !important;
    max-width: 100% !important;
  }
  
  .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode .ngxsmk-popover-container.ngxsmk-inline-container {
    width: 100% !important;
    max-width: 100% !important;
  }
  
  .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode .ngxsmk-calendar-container {
    padding: 1.25rem !important;
  }
  
  .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode .ngxsmk-day-cell {
    width: 40px !important;
    max-width: 40px !important;
    height: 40px !important;
    max-height: 40px !important;
  }
  
  .ngxsmk-datepicker-wrapper.ngxsmk-inline-mode .ngxsmk-day-number {
    width: 36px !important;
    max-width: 36px !important;
    height: 36px !important;
    max-height: 36px !important;
  }
  
  /* Tablet toolbar */
  .tsd-page-toolbar {
    padding: 0.875rem 1.5rem !important;
  }
  
  .tsd-page-toolbar input[type="search"] {
    font-size: 16px !important;
    max-width: 400px !important;
  }
}

/* Additional Mobile Optimizations */
@media (max-width: 768px) {
  /* Improve touch targets */
  .tsd-widget.menu,
  .tsd-widget.options {
    width: 44px !important;
    height: 44px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  
  /* Better spacing for mobile */
  .tsd-page-title {
    margin-bottom: 1.5rem !important;
  }
  
  /* Improve readability */
  .tsd-comment {
    font-size: 0.9375rem !important;
    line-height: 1.7 !important;
  }
  
  /* Better code block handling */
  .tsd-signature-symbol {
    font-size: 0.875rem !important;
  }
  
  /* Member lists */
  .tsd-index-list a {
    padding: 0.625rem !important;
    display: block !important;
  }
}

/* Smooth Transitions - optimize for mobile performance */
@media (min-width: 769px) {
  * {
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, transform 0.3s ease !important;
  }
}

@media (max-width: 768px) {
  * {
    transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease !important;
  }
  
  /* Disable hover effects on mobile for better performance */
  .tsd-panel:hover {
    transform: none !important;
  }
}
</style>
`;

// Ensure viewport meta tag is mobile-friendly
const viewportRegex = /<meta\s+name=["']viewport["']\s+content=["'][^"']*["']\s*\/?>/i;
const mobileViewport = '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover"/>';

if (viewportRegex.test(htmlContent)) {
  // Replace existing viewport tag
  htmlContent = htmlContent.replace(viewportRegex, mobileViewport);
} else {
  // Add viewport tag if missing (shouldn't happen, but safety check)
  htmlContent = htmlContent.replace('</head>', `  ${mobileViewport}\n</head>`);
}

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

