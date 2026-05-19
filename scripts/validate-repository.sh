#!/usr/bin/env bash
set -euo pipefail

required_files=(
  "README.md"
  "AGENTS.md"
  "AGENTS.local.md"
  ".github/pull_request_template.md"
  "docs/README.md"
  "docs/TEMPLATE.md"
  "docs/prd/README.md"
  "docs/plans/README.md"
  "docs/design/README.md"
  "docs/acceptance/README.md"
  "docs/operations/README.md"
  "openspec/config.yaml"
)

for file in "${required_files[@]}"; do
  test -f "$file"
done

grep -q "## Test-First PR 提交规范" AGENTS.md
grep -q "test: add failing tests for xxx" AGENTS.md
grep -q "impl: make xxx tests pass" AGENTS.md
grep -q "中间产物" AGENTS.md
grep -q "npm test" AGENTS.md
grep -q "Test-first Evidence" .github/pull_request_template.md

git diff --check
