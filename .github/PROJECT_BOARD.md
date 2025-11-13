# 📋 Project Board Setup Guide

This guide explains how to set up and use GitHub Project Boards for ngxsmk-datepicker.

## 🎯 Recommended Project Board Structure

### Board: "ngxsmk-datepicker Development"

Create a GitHub Project Board with the following columns:

1. **📥 Backlog**
   - New issues that need triage
   - Label: `needs-triage`

2. **🔍 Triage**
   - Issues being reviewed and prioritized
   - Label: `needs-triage`

3. **📋 To Do**
   - Prioritized issues ready to be worked on
   - Sorted by priority (High → Medium → Low)

4. **🚧 In Progress**
   - Issues currently being worked on
   - Assign to developers

5. **👀 In Review**
   - Pull requests and completed issues awaiting review

6. **✅ Done**
   - Completed issues and merged PRs
   - Auto-archive after 30 days

## 🏷️ Label-Based Automation

### Auto-Label Issues

Use GitHub Actions or manual labeling to organize issues:

- **Priority Labels** (optional):
  - `priority: high` - Critical bugs or high-value features
  - `priority: medium` - Important but not urgent
  - `priority: low` - Nice to have

- **Type Labels**:
  - `bug` - Bugs and issues
  - `enhancement` - Feature requests
  - `documentation` - Docs improvements
  - `question` - Questions and support

- **Status Labels**:
  - `good-first-issue` - For new contributors
  - `help-wanted` - Needs community help
  - `needs-triage` - Needs review

## 📊 Milestone Tracking

Create milestones for major releases:

- **v2.0.0** - Major features and breaking changes
- **v1.10.0** - Next minor release
- **v1.9.x** - Patch releases

Link issues to milestones for release planning.

## 🔄 Workflow

### For Maintainers

1. **New Issue Arrives**
   - Add `needs-triage` label
   - Move to "Triage" column
   - Review and add appropriate labels
   - Set priority if needed

2. **Issue Ready for Work**
   - Remove `needs-triage` label
   - Add `good-first-issue` or `help-wanted` if applicable
   - Move to "To Do" column
   - Assign to milestone if relevant

3. **Work Starts**
   - Assign to developer
   - Move to "In Progress"
   - Link to PR when created

4. **Work Complete**
   - Move to "In Review"
   - After merge, move to "Done"

### For Contributors

1. **Find an Issue**
   - Check "To Do" column
   - Look for `good-first-issue` label
   - Comment on issue to claim it

2. **Start Working**
   - Fork and create branch
   - Work on the issue
   - Create PR when ready

3. **After PR Merge**
   - Issue automatically moves to "Done"
   - Celebrate! 🎉

## 🎨 Board Views

### View 1: By Priority
- Group by priority labels
- Sort by creation date

### View 2: By Type
- Group by issue type (bug, enhancement, etc.)
- Useful for release planning

### View 3: By Milestone
- Group by milestone
- Track release progress

### View 4: By Assignee
- Group by assigned developer
- Track individual workload

## 📈 Metrics to Track

- **Open Issues**: Total number of open issues
- **Good First Issues**: Count of `good-first-issue` labeled items
- **Help Wanted**: Count of `help-wanted` labeled items
- **Average Time to Resolution**: Track issue lifecycle
- **Contributor Activity**: Track new contributors

## 🔗 Integration with Issues

### Issue Templates

Issue templates automatically add labels:
- Bug reports → `bug`, `needs-triage`
- Feature requests → `enhancement`, `needs-triage`
- Questions → `question`, `help-wanted`

### Automation

Consider using GitHub Actions to:
- Auto-label issues based on content
- Auto-move issues based on labels
- Auto-close stale issues (with warning)
- Auto-assign reviewers for PRs

## 📝 Example Project Board Query

To filter issues for the board:

```
is:issue is:open label:good-first-issue
is:issue is:open label:help-wanted
is:issue is:open label:needs-triage
```

## 🚀 Quick Start

1. Go to your repository
2. Click "Projects" → "New project"
3. Choose "Board" template
4. Add columns as described above
5. Configure automation (optional)
6. Start organizing issues!

## 💡 Tips

- **Regular Triage**: Review "Triage" column weekly
- **Clear Labels**: Use consistent labeling
- **Update Status**: Keep board updated as work progresses
- **Archive Old**: Archive completed items after 30 days
- **Engage Community**: Highlight `good-first-issue` items in README

---

*This is a template guide. Customize it based on your team's workflow and needs.*

