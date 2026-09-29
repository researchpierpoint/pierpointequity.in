"""Fail-fast audit for the public PirePoint website surface."""
from __future__ import annotations
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HTML = sorted(ROOT.glob("*.html"))
FORBIDDEN = [
    "COMING",
    "will be added",
    "active build",
]
errors = []
for path in HTML:
    text = path.read_text(encoding="utf-8")
    low = text.lower()
    for phrase in FORBIDDEN:
        if phrase.lower() in low:
            errors.append(f"{path.name}: contains unfinished public copy: {phrase}")
    for target in re.findall(r'href=["\']([^"\'#?]+)', text):
        if target.startswith(("http://", "https://", "mailto:", "javascript:")):
            continue
        target_path = (path.parent / target).resolve()
        if not target_path.exists():
            errors.append(f"{path.name}: broken local link: {target}")
    for target in re.findall(r'src=["\']([^"\']+)', text):
        if target.startswith(("http://", "https://", "//")):
            continue
        target_path = (path.parent / target).resolve()
        if not target_path.exists():
            errors.append(f"{path.name}: missing local asset: {target}")

if errors:
    print("\n".join(errors))
    raise SystemExit(1)
print(f"Public surface audit passed: {len(HTML)} HTML pages checked.")
