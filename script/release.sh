#!/usr/bin/env bash

set -v            # print each command before execution
set -o errexit    # always exit on error
set -o pipefail   # don't ignore exit codes when piping output
set -o nounset    # fail on unset variables

git clone "https://electron-bot:$GITHUB_TOKEN@github.com/electron/download-stats" module

cd module
npm ci

npm run build

# bail if nothing changed
if [ "$(git status --porcelain)" = "" ]; then
  echo "No new content found: exiting!"
  exit
fi

git config user.email electron@github.com
git config user.name electron-bot
git add .
git commit -m "chore: update download stats"
git push origin main --follow-tags