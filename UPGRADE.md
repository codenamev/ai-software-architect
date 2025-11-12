# Upgrade Guide

This guide explains how to upgrade your existing AI Software Architect installation using your AI coding assistant.

## Quick Upgrade

The simplest way to upgrade is to ask your AI assistant to handle it:

```
Upgrade my AI Software Architect framework from https://github.com/codenamev/ai-software-architect
```

Your AI assistant will:
1. Clone the latest version of the framework
2. Identify what has changed
3. Preserve your customizations (ADRs, custom members, etc.)
4. Update core templates and framework files
5. Update integration files (CLAUDE.md, etc.)
6. Verify the upgrade was successful

## Before You Upgrade

### 1. Commit Your Current Work

Ensure all your current work is committed:

```
git status
git add .
git commit -m "Pre-upgrade snapshot"
```

### 2. Note Your Customizations

Be aware of what you've customized so you can verify they're preserved:
- Custom architecture members in `.architecture/members.yml`
- Custom principles in `.architecture/principles.md`
- Your ADRs in `.architecture/decisions/adrs/`
- Your architecture reviews in `.architecture/reviews/`

## Upgrade Process

### Standard Upgrade

For routine upgrades to get the latest features:

```
Upgrade AI Software Architect framework to the latest version
```

### Upgrade to Specific Version

If you want a specific version:

```
Upgrade AI Software Architect framework to version X.Y.Z
```

### Upgrade with Specific Features

If you know what feature you want:

```
Upgrade AI Software Architect to add Pragmatic Guard Mode
```

## What Your AI Assistant Will Do

During the upgrade, your AI assistant will:

1. **Fetch Latest Framework**
   - Clone or download the latest version
   - Identify differences from your current installation

2. **Preserve Customizations**
   - Backup your custom ADRs
   - Preserve custom architecture members
   - Keep your architectural principles (with option to merge new ones)
   - Retain your reviews and recalibration documents

3. **Update Core Files**
   - Update templates to latest versions
   - Update framework integration files
   - Add new configuration files if needed
   - Update coding assistant instructions

4. **Migrate Structure Changes**
   - Handle any directory reorganization
   - Update file references in documentation
   - Fix broken links

5. **Verify Upgrade**
   - Test that templates are accessible
   - Verify new features are available
   - Check that existing functionality still works

## After Upgrade

### Verify the Upgrade

Ask your AI assistant to verify:

```
Verify that the AI Software Architect framework upgrade was successful
```

### Review Changes

Ask what changed:

```
What's new in this AI Software Architect framework version?
```

### Test New Features

Try out new capabilities. For example, if pragmatic mode was added:

```
Enable pragmatic mode
```

## Common Upgrade Scenarios

### Upgrading from Template Reorganization

If you installed before templates were reorganized:

```
Upgrade my framework - I have the old template structure where templates were in different locations
```

### Upgrading to Add Pragmatic Mode

```
Add Pragmatic Guard Mode to my AI Software Architect setup
```

### Upgrading After Breaking Changes

```
Upgrade AI Software Architect and help me fix any breaking changes
```

## Troubleshooting

### Upgrade Failed or Incomplete

If something goes wrong:

```
The upgrade didn't complete successfully. Please diagnose and fix the issues.
```

### Lost Customizations

If customizations were accidentally overwritten:

```
git diff HEAD~1
```

Then ask your AI assistant:

```
Restore my custom architecture members/principles from the previous commit
```

### New Features Not Working

```
I upgraded but [feature] isn't working. Please diagnose and fix.
```

## Rollback

If you need to rollback an upgrade:

```
Rollback the AI Software Architect framework upgrade to the previous version
```

Or manually:

```bash
git log --oneline  # Find the pre-upgrade commit
git revert <commit-hash>
```

## Migration Guides

### Migrating to Pragmatic Guard Mode

After upgrading to include pragmatic mode:

1. **Review the configuration:**
   ```
   Show me the pragmatic mode configuration options
   ```

2. **Enable pragmatic mode:**
   ```
   Enable pragmatic mode with balanced intensity
   ```

3. **Update existing ADRs (optional):**
   ```
   Should I update my existing ADRs to include pragmatic analysis?
   ```

### Migrating from Old Template Locations

Your AI assistant will automatically handle this, but you can verify:

```
Check if any of my ADRs or reviews reference the old template locations and update them
```

## Best Practices

1. **Commit Before Upgrading** - Always have a clean git state before upgrading
2. **Review Changes** - Ask your AI assistant to explain what changed
3. **Test Incrementally** - Verify each new feature works before relying on it
4. **Update Documentation** - After upgrading, update any custom documentation you maintain
5. **Check Breaking Changes** - Ask about breaking changes: "Are there any breaking changes in this upgrade?"

## Getting Help

If you encounter issues during upgrade:

1. **Ask your AI assistant first:**
   ```
   I'm having trouble with the upgrade: [describe issue]
   ```

2. **Check the GitHub repository:**
   - [Issues](https://github.com/codenamev/ai-software-architect/issues)
   - [Releases](https://github.com/codenamev/ai-software-architect/releases)

3. **Create an issue** with:
   - Your AI assistant (Claude Code, Cursor, etc.)
   - Current version (if known)
   - Target version
   - Error messages or unexpected behavior

## Version-Specific Upgrade Notes

### Upgrading to Include Pragmatic Mode

**What's New:**
- Pragmatic Enforcer architecture member
- Configuration system (`.architecture/config.yml`)
- Deferral tracking (`.architecture/deferrals.md`)
- Enhanced ADR and review templates with pragmatic analysis sections

**Upgrade command:**
```
Add Pragmatic Guard Mode to my architecture framework
```

### Upgrading from Pre-Template-Reorganization

**What Changed:**
- `adr.md` → `adr-template.md`
- `reviews/template.md` → `templates/review-template.md`
- All templates now consolidated in `.architecture/templates/`

**Upgrade command:**
```
Upgrade my framework and migrate to the new template organization
```

## FAQ

**Q: Will I lose my ADRs during upgrade?**
A: No, your AI assistant will preserve all your ADRs and other custom content.

**Q: Can I upgrade incrementally?**
A: Yes, you can ask for specific features: "Add just the pragmatic mode feature"

**Q: How do I know what version I have?**
A: Ask your AI assistant: "What version of AI Software Architect am I using?"

**Q: Can I customize the upgrade process?**
A: Yes, give specific instructions: "Upgrade but don't modify my custom members"

**Q: What if I've heavily customized the framework?**
A: Tell your AI assistant: "I've heavily customized X, Y, Z - please preserve these during upgrade"
