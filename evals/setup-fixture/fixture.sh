#!/usr/bin/env bash
# Seeds the same Node fixture the fixture-compatibility CI matrix builds by hand.
set -euo pipefail
cat > package.json <<'JSON'
{ "name": "test-app", "version": "1.0.0", "description": "Fixture service for the setup eval" }
JSON
mkdir -p src
echo "module.exports = () => 'ok';" > src/index.js
git init -q .
git add -A
git -c user.name=eval -c user.email=eval@example.com commit -qm "fixture"
