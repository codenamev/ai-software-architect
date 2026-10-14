---
type: llm
focus: last_message
---
The workspace's `.architecture/config.yml` records `framework_version: "1.2.0"`.

PASS if the report states the installed framework version as 1.2.0 (any phrasing:
"framework version 1.2.0", "running 1.2.0", "pinned at 1.2.0"), and if it also
mentions the version the plugin ships, or that the install is behind or out of date,
that is a bonus but not required.

FAIL if the report gives no framework version, gives a different number, or only
describes the ADRs without saying what version of the framework is installed.
