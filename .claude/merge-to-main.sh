#!/bin/bash
# Stop hook: commit staged/unstaged changes, fast-forward main, push both branches
set -e

cd "$(git rev-parse --show-toplevel)"

CURRENT=$(git branch --show-current)

# Stage and commit any leftover changes
if ! git diff --quiet || ! git diff --cached --quiet; then
  git add -A
  git commit -m "chore: auto-commit session changes" 2>/dev/null || true
fi

# Nothing to merge if already on main
if [ "$CURRENT" = "main" ]; then
  git push origin main 2>/dev/null || true
  echo '{"systemMessage": "Auto-pushed main to origin."}'
  exit 0
fi

# Fast-forward main to current branch tip
git checkout main
git merge --ff-only "$CURRENT" 2>/dev/null || git merge "$CURRENT" -m "chore: merge $CURRENT into main"
git push origin main 2>/dev/null || true
git checkout "$CURRENT"
git push origin "$CURRENT" 2>/dev/null || true

echo '{"systemMessage": "Auto-merged '"$CURRENT"' → main and pushed."}'
