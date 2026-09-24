#!/usr/bin/env bash
# A tiny auth module with obvious findings, plus the members roster the skill reads.
set -euo pipefail
mkdir -p src .architecture
cat > src/auth.js <<'JS'
const crypto = require('crypto');
const users = { admin: { hash: crypto.createHash('md5').update('admin123').digest('hex') } };

function login(username, password) {
  const user = users[username];
  if (!user) return null;
  const hash = crypto.createHash('md5').update(password).digest('hex');
  if (hash == user.hash) {
    return { token: Buffer.from(username + ':' + Date.now()).toString('base64') };
  }
  return null;
}

function verify(token) {
  const [username] = Buffer.from(token, 'base64').toString().split(':');
  return users[username] ? username : null;
}

module.exports = { login, verify };
JS
cat > .architecture/members.yml <<'YML'
members:
  - id: security_specialist
    name: "Security Specialist"
    title: "Security Specialist"
    specialties: ["threat modeling", "security patterns", "data protection"]
  - id: performance_specialist
    name: "Performance Specialist"
    title: "Performance Specialist"
    specialties: ["scalability", "latency", "resource efficiency"]
YML
