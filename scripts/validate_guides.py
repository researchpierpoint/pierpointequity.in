from pathlib import Path
from html.parser import HTMLParser
import re,sys
ROOT=Path(__file__).resolve().parents[1]
errors=[]
pages=[*ROOT.glob("*.html"),*ROOT.glob("guides/*.html"),*ROOT.glob("countries/*.html")]
for p in pages:
    s=p.read_text(encoding="utf-8",errors="ignore")
    if "<title>" not in s: errors.append(f"{p}: missing title")
    if 'meta name="description"' not in s: errors.append(f"{p}: missing description")
    for href in re.findall(r'href=["\']([^"\'#]+)',s,re.I):
        if href.startswith(("http:","https:","mailto:","javascript:")): continue
        target=(p.parent/href).resolve()
        if not target.exists(): errors.append(f"{p}: broken link {href}")
for p in [ROOT/"guides.html",ROOT/"countries.html",ROOT/"glossary.html",ROOT/"compare.html"]:
    if not p.exists(): errors.append(f"missing hub: {p}")
if errors:
    print("\n".join(errors));sys.exit(1)
print(f"Guide QA passed: {len(pages)} HTML pages checked.")
