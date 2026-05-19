#!/usr/bin/env python3
"""
Replace the 3-line Google Fonts block (preconnect + preconnect + stylesheet
link) in every HTML file at the repo root with a single self-hosted
stylesheet reference. Idempotent: skips files that already point to fonts/fonts.css.
"""
import re, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
REPLACEMENT = '  <link rel="stylesheet" href="fonts/fonts.css">'

# Matches the 3 consecutive font-related <link> lines (with the optional
# preconnects). The font-CSS <link> line itself is mandatory; the preconnects
# may or may not be present.
preconnect_googleapis = re.compile(
    r'^[ \t]*<link[^>]+rel=["\']preconnect["\'][^>]+fonts\.googleapis\.com[^>]*>\s*\n',
    re.M,
)
preconnect_gstatic = re.compile(
    r'^[ \t]*<link[^>]+rel=["\']preconnect["\'][^>]+fonts\.gstatic\.com[^>]*>\s*\n',
    re.M,
)
fontcss_link = re.compile(
    r'^[ \t]*<link[^>]+href=["\']https://fonts\.googleapis\.com/css2[^"\']+["\'][^>]*>\s*\n',
    re.M,
)

touched, skipped = [], []
for html in sorted(ROOT.glob("*.html")):
    src = html.read_text()
    if "fonts/fonts.css" in src and "fonts.googleapis.com" not in src:
        skipped.append(html.name)
        continue
    new = src
    new = preconnect_googleapis.sub("", new)
    new = preconnect_gstatic.sub("", new)
    # Replace the css <link> with our single self-hosted line
    new, count = fontcss_link.subn(REPLACEMENT + "\n", new, count=1)
    if count == 0 and "fonts.googleapis.com" in new:
        print(f"WARN: could not match font CSS link in {html.name}", file=sys.stderr)
        continue
    if new != src:
        html.write_text(new)
        touched.append(html.name)

print(f"touched {len(touched)} files; skipped {len(skipped)}")
