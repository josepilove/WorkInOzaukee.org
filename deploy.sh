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
lftp -e "
  set sftp:auto-confirm yes;
  open sftp://josepilove@iad1-shared-b8-12.dreamhost.com;
  mirror -R --delete $DRY ./dist/ ${REMOTE};
  bye
"

echo "==> Done. https://workinozaukee.org/"
