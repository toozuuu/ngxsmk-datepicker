# GitHub Configuration

This directory contains GitHub-specific configuration files for the ngxsmk-datepicker repository.

## 📁 Contents

### Issue Templates

- **bug_report.yml** - Template for reporting bugs
- **feature_request.yml** - Template for requesting features
- **question.yml** - Template for asking questions
- **config.yml** - Configuration for issue templates

### Labels

- **labels.json** - Standard labels for issues and PRs
- **scripts/setup-labels.js** - Script to help set up labels

### Project Board

- **PROJECT_BOARD.md** - Guide for setting up and using GitHub Project Boards

## 🚀 Quick Setup

### 1. Set Up Labels

Labels help organize issues and attract contributors:

```bash
# Option 1: Use GitHub CLI (recommended)
gh label create good-first-issue --color 7057ff --description "Good for newcomers"
gh label create help-wanted --color 008672 --description "Extra attention is needed"
# ... (see labels.json for all labels)

# Option 2: Use the setup script
node .github/scripts/setup-labels.js

# Option 3: Import via GitHub web interface
# Go to: Settings → Labels → Import labels
```

### 2. Create Project Board

1. Go to your repository
2. Click "Projects" → "New project"
3. Follow the guide in [PROJECT_BOARD.md](PROJECT_BOARD.md)

### 3. Enable Issue Templates

Issue templates are automatically available when you push this directory to GitHub.

## 🏷️ Important Labels

### For Contributors

- **`good-first-issue`** - Perfect for new contributors
- **`help-wanted`** - Community assistance needed

### For Organization

- **`needs-triage`** - Needs review/prioritization
- **`bug`** - Something isn't working
- **`enhancement`** - New feature or improvement
- **`documentation`** - Documentation improvements

## 📚 Resources

- [GitHub Issue Templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository)
- [GitHub Labels](https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/managing-labels)
- [GitHub Project Boards](https://docs.github.com/en/issues/organizing-your-work-with-project-boards)

---

*For more information, see the main [README.md](../README.md) and [CONTRIBUTING.md](../CONTRIBUTING.md).*

