#!/usr/bin/env bash

set -x            # print each command before execution
set -o errexit    # always exit on error
set -o pipefail   # don't ignore exit codes when piping output
set -o nounset    # fail on unset variables

git clone https://github.com/electron/download-stats module

cd module

npm install
npm run build

[[ `git status --porcelain` ]] || exit

git add .
git config user.email "electron@github.com"
git config user.name "Electron Bot"
git commit -m "chore: update download stats"
git push origin master --follow-tags