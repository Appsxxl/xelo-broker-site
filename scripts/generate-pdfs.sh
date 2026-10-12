#!/bin/bash
# Regenerate privacy.pdf and terms.pdf from their HTML sources.
# Run after any change to privacy.html or terms.html.
# Requires Google Chrome installed at the standard macOS path.

set -e
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
DIR="$(cd "$(dirname "$0")/.." && pwd)"

"$CHROME" --headless=new --no-sandbox --disable-gpu \
  --print-to-pdf="${DIR}/privacy.pdf" \
  --print-to-pdf-no-header \
  "file://${DIR}/privacy.html" 2>/dev/null
echo "✓ privacy.pdf"

"$CHROME" --headless=new --no-sandbox --disable-gpu \
  --print-to-pdf="${DIR}/terms.pdf" \
  --print-to-pdf-no-header \
  "file://${DIR}/terms.html" 2>/dev/null
echo "✓ terms.pdf"
