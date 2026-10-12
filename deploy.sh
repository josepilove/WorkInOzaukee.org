#!/bin/bash
#
# Local deploy — same lftp pattern as joeelmendorf.com, with one difference:
#
#   THIS SITE HAS A BUILD STEP.
#
# Your other sites mirror ./ because the repo *is* the site. Here the repo is
# source; the site is dist/. Mirroring ./ would publish src/, node_modules and
# your private /todo source, and miss the actual HTML. So: build, then mirror
# dist/ only.
#
#   ./deploy.sh          build and deploy
#   ./deploy.sh --dry    show what would transfer, change nothing

set -euo pipefail
cd "$(dirname "$0")"

REMOTE="/home/josepilove/workinozaukee.org"

# The generated cheat sheets aren't build inputs, so a stale one won't break the
# site — but it will quietly lie to you next time you add a venue. Warn, don't block.
npm run vocab >/dev/null 2>&1 || true
if ! git diff --quiet -- src/content 2>/dev/null; then
  echo "==> NOTE: _vocabulary.md was out of date and has been regenerated."
  echo "    Commit the change when you get a chance."
fi

echo "==> Building"
npm run build

# Guard: --delete against an empty dist would wipe the live site.
if [[ ! -f dist/index.html ]]; then
  echo "dist/index.html missing — refusing to deploy." >&2
  exit 1
fi

DRY=""
if [[ "${1:-}" == "--dry" ]]; then
  DRY="--dry-run"
  echo "==> DRY RUN — nothing will be written"
fi

echo "==> Mirroring dist/ to ${REMOTE}"
# '-u user,x': the dummy password stops lftp dropping the username when it has no
# terminal to prompt on (it falls back to anonymous). Auth is still the SSH key.
# --delete removes anything on the server that isn't in dist/. Leave Dreamhost's
# own housekeeping files alone — .dh-diag is theirs, not ours, and deleting it
# just makes their panel unhappy.
lftp -e "
  set sftp:auto-confirm yes;
  open -u josepilove,x sftp://iad1-shared-b8-12.dreamhost.com;
  mirror -R --delete $DRY \
    --exclude-glob .dh-diag \
    --exclude-glob .well-known/ \
    ./dist/ ${REMOTE};
  bye
"

echo "==> Done. https://workinozaukee.org/"
