# Using AI Software Architect with Claude Code Plugin

This guide covers installation and usage of the AI Software Architect framework as a Claude Code plugin.

## What is the Plugin Method?

The Claude Code plugin installation method provides:
- **Simplest installation**: Just two commands to get started
- **Automatic updates**: Keep the framework up-to-date with `/plugin update`
- **Cross-project availability**: Works automatically in all your projects
- **Zero file management**: No manual copying or configuration files
- **Same functionality**: Identical features to the MCP Server method

## Prerequisites

- **Claude Code**: Version 1.0.33 or later
- **Node.js**: Version 18 or later (usually pre-installed with Claude Code)
- **Internet connection**: Required for installation and updates

Check your Claude Code version:
```bash
claude --version
```

If you need to update Claude Code, see the [official documentation](https://code.claude.com/docs).

## Installation

### Step 1: Add the Marketplace

In Claude Code, run:
```bash
/plugin marketplace add codenamev/ai-software-architect
```

**What this does**: Adds the AI Software Architect plugin marketplace to your Claude Code installation. This is a one-time setup.

**Expected output**: "Marketplace added successfully"

### Step 2: Install the Plugin

```bash
/plugin install ai-software-architect@ai-software-architect
```

**What this does**:
- Downloads the plugin from GitHub
- Installs the underlying npm package (`ai-software-architect`)
- Configures the MCP server
- Makes all framework tools available

**Expected output**: "Plugin installed successfully"

**Installation time**: 30-60 seconds (first time, includes npm package download)

### Step 3: Verify Installation

Check that the plugin is installed:
```bash
/plugin list
```

You should see `ai-software-architect` in the list of installed plugins.

**That's it!** The framework is now available in all your projects.

## Using the Framework

Once installed, use the framework just like any other installation method:

### Setup a New Project

Navigate to your project directory and run:
```
Setup ai-software-architect
```

This will:
- Create the `.architecture/` directory structure in your target project
- Customize `members.yml` and `principles.md` for the detected tech stack
- Generate an initial system analysis at `.architecture/reviews/initial-system-analysis.md`
- Set up `templates/` ready for `create-adr` and review skills

The skill writes only into `.architecture/`. It does not modify code outside that directory.

**Setup successful when** all of the following are true:

- [ ] `.architecture/decisions/adrs/` exists (empty, ready for ADRs)
- [ ] `.architecture/reviews/initial-system-analysis.md` exists and is non-empty
- [ ] `.architecture/members.yml` and `.architecture/principles.md` show stack-specific entries (not just defaults)
- [ ] `.architecture/config.yml` exists
- [ ] `Check architecture status` returns a coherent summary

If any check fails, see the recovery section in [skills/setup-architect/SKILL.md](skills/setup-architect/SKILL.md#recovery).

### First 5 minutes after setup

In order, these are the smallest steps that demonstrate the framework end-to-end and surface any setup issues:

**1. (~30s) Verify the team and config**
```
List architecture members
```
You should see the seven core members plus any technology specialists the setup added for your stack.

**2. (~1 min) Read the initial analysis**

Open `.architecture/reviews/initial-system-analysis.md` in your editor. Skim the strengths, concerns, and recommendations — they're your team's first read on your codebase. If the analysis looks generic or the wrong stack, the customization step missed something; edit `members.yml` and re-run setup recovery (see SKILL.md).

**3. (~2 min) Document one decision you've already made**

Pick something concrete from your codebase — a database choice, an auth approach, the framework you picked — and run:
```
Create ADR for [that decision]
```
This produces a real ADR you can keep, and verifies `create-adr` is wired up. You can ask Claude to expand it later or commit it as-is.

**4. (~1.5 min) Get a focused specialist read**

Pick the strongest concern from the initial analysis and ask the specialist who raised it for a deeper take:
```
Ask [Specialist] to review [the area they flagged]
```
This dispatches one of the generated subagents (post-1.5.0 orchestrator pattern, see ADR-013) and produces a focused review.

If all four steps work, your install is healthy. If any step errors, the setup recovery section in `skills/setup-architect/SKILL.md` covers re-running cleanly without disturbing project code.

### Common Operations

All framework operations work identically to other installation methods:

**Create an ADR**:
```
Create ADR for [topic]
```

**Start Architecture Review**:
```
Start architecture review for [feature/version]
```

**Get Specialist Review**:
```
Ask [specialist role] to review [component]
```

**Check Status**:
```
Check architecture status
```

**Enable Pragmatic Mode**:
```
Enable pragmatic mode in [balanced/strict/lenient] intensity
```

See [USAGE.md](USAGE.md) for complete framework usage documentation.

## Plugin Management

### Update the Plugin

Keep the framework up-to-date:
```bash
/plugin update ai-software-architect@ai-software-architect
```

This updates both the plugin wrapper and the underlying npm package.

**Recommendation**: Update monthly or when you see a new release announcement.

### Check Plugin Status

See plugin information:
```bash
/plugin list
```

Or in Claude Code's plugin manager UI:
```bash
/plugin
```

### Disable Temporarily

Disable without uninstalling:
```bash
/plugin disable ai-software-architect@ai-software-architect
```

Re-enable:
```bash
/plugin enable ai-software-architect@ai-software-architect
```

### Uninstall

Remove the plugin completely:
```bash
/plugin uninstall ai-software-architect@ai-software-architect
```

This removes the plugin but preserves any `.architecture/` directories you've created in your projects.

## How It Works (Technical Details)

The plugin uses a "thin wrapper" architecture:

```
Claude Code Plugin System
         ↓
.claude-plugin/plugin.json (plugin manifest)
         ↓
.mcp.json (MCP server configuration)
         ↓
npx ai-software-architect (delegates to npm package)
         ↓
MCP Server Tier-1 Tools (setup, ADRs, status, etc.)
         +
Bundled Skills/Subagents (reviews, pragmatic enforcement — Tier 2)
```

**Key points**:
- The plugin itself is just configuration (manifest + MCP config)
- Tier-1 deterministic tools come from the `ai-software-architect` npm package
- Tier-2 capabilities (orchestrated reviews, specialist reviews, pragmatic
  enforcement) come from the bundled Skills and `pragmatic-enforcer` subagent —
  these are not MCP tools
- 100% code sharing with the MCP Server install for Tier-1 tools
- Updates to the npm package automatically benefit plugin users

This design means:
- Minimal maintenance burden
- Tier-1 parity with the MCP Server install, plus Tier-2 reviews via Skills
- Reliable updates
- Small download size

## Troubleshooting

### Plugin Installation Fails

**Error**: "Marketplace not found"
- **Solution**: Verify marketplace was added: `/plugin marketplace list`
- If missing, re-add: `/plugin marketplace add codenamev/ai-software-architect`

**Error**: "Plugin not found in marketplace"
- **Solution**: Check marketplace is correct: `ai-software-architect@ai-software-architect`
- Verify internet connection
- Try refreshing marketplace: `/plugin marketplace update ai-software-architect`

**Error**: "npm package not found"
- **Solution**: Verify npm registry is accessible
- Check Node.js is installed: `node --version` (requires v18+)
- Try manual npm install: `npm install -g ai-software-architect`

### Plugin Works But Framework Commands Fail

**Issue**: Plugin installed but framework operations don't work

**Solutions**:
1. Check MCP server is running:
   - Look for "ai-software-architect" in Claude Code's MCP server list
   - Restart Claude Code to reload MCP servers

2. Verify npm package is installed:
   ```bash
   npm list -g ai-software-architect
   ```

3. Check Node.js version:
   ```bash
   node --version  # Must be v18 or later
   ```

4. Check for error messages:
   - Look for MCP server errors in Claude Code logs
   - Run with debug flag: `claude --debug`

### Slow First Start

**Issue**: First operation after plugin install is slow

**Explanation**: The first time the MCP server runs, npm fetches the `ai-software-architect` package. This is normal and only happens once.

**Typical timing**:
- First start: 30-60 seconds
- Subsequent starts: <2 seconds

### Updates Not Working

**Issue**: `/plugin update` doesn't show new version

**Solutions**:
1. Refresh marketplace first:
   ```bash
   /plugin marketplace update ai-software-architect
   ```

2. Then update plugin:
   ```bash
   /plugin update ai-software-architect@ai-software-architect
   ```

3. Verify version updated:
   ```bash
   /plugin list
   ```

### Permission Errors

**Issue**: "Permission denied" during installation

**Solutions**:
- Install npm packages with user permissions (avoid global installs requiring sudo)
- Configure npm to use user directory: `npm config set prefix ~/.npm-global`
- Use user scope for plugin: `/plugin install ai-software-architect@ai-software-architect --scope user`

## Comparison with Other Installation Methods

### Plugin vs. Skills

| Aspect | Plugin | Skills |
|--------|--------|--------|
| **Installation** | 2 commands | _(retired in 1.4.0 — see below)_ |
| **Updates** | `/plugin update` | n/a |
| **Dependencies** | Node.js (auto) | n/a |
| **Offline** | Needs npm cache | n/a |

The standalone "Claude Skills" install path (`cp -r .../skills ~/.claude/skills/`) was retired in 1.4.0. The plugin now ships skills, MCP server, generated subagents, and the ADR-validation hook as a single unit. See [USAGE-WITH-CLAUDE-SKILLS.md](USAGE-WITH-CLAUDE-SKILLS.md) for the migration path.

### Plugin vs. MCP Server

| Aspect | Plugin | MCP Server |
|--------|--------|------------|
| **Installation** | 2 commands | npm + config file |
| **Configuration** | Automatic | Manual JSON editing |
| **Updates** | `/plugin update` | `npm update -g` |
| **Features** | Identical | Identical |

**Choose Plugin if**: You want automatic configuration
**Choose MCP Server if**: You prefer direct npm management or use multiple MCP tools

### Plugin vs. Traditional

| Aspect | Plugin | Traditional |
|--------|--------|-------------|
| **Installation** | 2 commands | Clone repo |
| **Setup** | Automatic | Manual |
| **Features** | MCP-based (33%) | Full (100%) |
| **Customization** | Fork npm pkg | Edit files directly |
| **Version Control** | External | In-repo |

**Choose Plugin if**: You want simple installation and automatic updates
**Choose Traditional if**: You need all advanced features, full customization, or want framework in repo

## Switching Installation Methods

You can switch from Plugin to another method (or vice versa) at any time:

### From Plugin to Skills

1. Uninstall plugin: `/plugin uninstall ai-software-architect@ai-software-architect`
2. Install skills: Follow [USAGE-WITH-CLAUDE-SKILLS.md](USAGE-WITH-CLAUDE-SKILLS.md)
3. Existing `.architecture/` directories work unchanged

### From Plugin to MCP Server

1. Uninstall plugin: `/plugin uninstall ai-software-architect@ai-software-architect`
2. Install MCP: `npm install -g ai-software-architect`
3. Configure `~/.claude/config.json` manually
4. Existing `.architecture/` directories work unchanged

### From Plugin to Traditional

1. Uninstall plugin: `/plugin uninstall ai-software-architect@ai-software-architect`
2. Clone repo: `git clone https://github.com/codenamev/ai-software-architect`
3. Use traditional setup process
4. Existing `.architecture/` directories work unchanged

**Important**: The `.architecture/` directory structure is the same across all installation methods. Switching methods doesn't affect your existing architecture documentation.

## Best Practices

### When to Update

**Recommended update schedule**:
- Check for updates monthly
- Update before starting major architecture work
- Update after seeing release announcements

**How to check for updates**:
1. Refresh marketplace: `/plugin marketplace update ai-software-architect`
2. Check plugin version: `/plugin list`
3. Compare with [GitHub releases](https://github.com/codenamev/ai-software-architect/releases)

### Multi-Project Usage

The plugin works automatically across all your projects:

1. Install plugin once (global to Claude Code)
2. Navigate to any project
3. Run `Setup ai-software-architect` to initialize that project
4. Framework is available immediately

**No need to reinstall per-project** - the plugin is global.

### Version Control

Add `.architecture/` to your repository to version control architectural decisions:

```gitignore
# Don't gitignore .architecture/ - it should be tracked!
# Only exclude generated temp files if needed:
.architecture/.tmp/
```

The plugin itself is external (not in repo), but the documentation it creates should be tracked.

### Offline Considerations

The plugin requires internet connection for:
- Initial installation
- Updates
- First run (npm package download)

After initial setup, the npm package is cached locally and works offline. However, if you need guaranteed offline capability, consider the Skills or Traditional installation methods instead.

## Getting Help

### Documentation

- **Framework usage**: [USAGE.md](USAGE.md)
- **Troubleshooting**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Skills comparison**: [USAGE-WITH-CLAUDE-SKILLS.md](USAGE-WITH-CLAUDE-SKILLS.md)
- **MCP comparison**: See README Installation section

### Support Channels

- **GitHub Issues**: [Report bugs or request features](https://github.com/codenamev/ai-software-architect/issues)
- **GitHub Discussions**: [Community support and questions](https://github.com/codenamev/ai-software-architect/discussions)
- **Documentation**: [Full documentation](https://github.com/codenamev/ai-software-architect)

### Common Questions

**Q: Can I use Plugin and Skills together?**
A: Not recommended. Choose one installation method per Claude Code instance to avoid conflicts.

**Q: Does Plugin work with Cursor?**
A: No, the Claude Code plugin system is specific to Claude Code. For Cursor, use the MCP Server method.

**Q: Will my ADRs and reviews work if I switch methods?**
A: Yes! The `.architecture/` directory structure is identical across all methods. Your documentation is portable.

**Q: How do I see what version I have installed?**
A: Run `/plugin list` to see installed version, or check the framework directly after running any command.

**Q: Can I install an older version?**
A: Not directly through the plugin system. For version control, use the MCP Server method with `npm install -g ai-software-architect@1.2.0` or Traditional method with git tags.

## Summary

The Claude Code Plugin installation method provides:
- ✅ Simplest installation (2 commands)
- ✅ Automatic updates
- ✅ Cross-project availability
- ✅ Zero configuration
- ✅ Identical functionality to MCP Server

**Perfect for**: Claude Code users who want the most streamlined experience.

**Not ideal for**: Offline work, maximum customization, or multi-AI-assistant workflows (use Traditional instead).

---

**Next Steps**:
1. Install the plugin (if you haven't already)
2. Navigate to a project directory
3. Run `Setup ai-software-architect`
4. Read [USAGE.md](USAGE.md) for framework usage guide
5. Start documenting your architecture!
