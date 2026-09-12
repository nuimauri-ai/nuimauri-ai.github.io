#!/bin/sh
# Builds a clean, standalone copy of the survey ready to push to the client's GitHub repo / Vercel project.
#   ./export-for-vercel.sh [final-url]        default final-url: https://survey.marc.health/
# The copy goes to ../marc-survey-deploy (a fresh git repo). Working files, raw client assets and message drafts are left out,
# and the Open Graph URLs (link preview) are rewritten to the final domain.
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
OUT="$HERE/../marc-survey-deploy"
URL="${1:-https://survey.marc.health/}"
rm -rf "$OUT"; mkdir -p "$OUT"
rsync -a --exclude '.git' --exclude '.DS_Store' --exclude 'assets-james' --exclude 'message-*.txt' --exclude 'export-for-vercel.sh' \
      --exclude 'GO-LIVE.md' --exclude 'quote' "$HERE/" "$OUT/"
sed -i '' "s#https://nuimauri-ai.github.io/marc-survey/#$URL#g" "$OUT/index.html"
printf '.DS_Store\n' > "$OUT/.gitignore"
cd "$OUT" && git init -q && git add -A && git commit -q -m "MARC survey — initial import" 
echo "Ready: $OUT  (OG URLs → $URL)"
echo "Push:  cd $OUT && git remote add origin <james-repo-url> && git branch -M main && git push -u origin main"
