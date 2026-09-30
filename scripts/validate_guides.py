from pathlib import Path
import re,sys
ROOT=Path(__file__).resolve().parents[1]
errors=[]
pages=[*ROOT.glob("*.html"),*ROOT.glob("guides/*.html"),*ROOT.glob("countries/*.html")]
legacy=("stocks.html","research.html","funds.html","etfs.html","status.html","what-changed.html","traffic.html")
for p in pages:
    s=p.read_text(encoding="utf-8",errors="ignore")
    if "<title>" not in s: errors.append(f"{p}: missing title")
    if 'meta name="description"' not in s: errors.append(f"{p}: missing description")
    if p.parent.name=="guides":
        if "assets/guide.js" not in s: errors.append(f"{p}: missing guide reading shell")
        nav=re.search(r"<nav>(.*?)</nav>",s,re.S|re.I)
        if not nav or "../guides.html" not in nav.group(1) or "../countries.html" not in nav.group(1): errors.append(f"{p}: non-standard guide navigation")
    for href in re.findall(r'href=["\']([^"\'#]+)',s,re.I):
        if href.startswith(("http:","https:","mailto:","javascript:")): continue
        if any(x in href for x in legacy): errors.append(f"{p}: legacy product link {href}")
        target=(p.parent/href).resolve()
        if not target.exists(): errors.append(f"{p}: broken link {href}")
for p in [ROOT/"guides.html",ROOT/"countries.html",ROOT/"glossary.html",ROOT/"compare.html"]:
    if not p.exists(): errors.append(f"missing hub: {p}")
if errors:
    print("\n".join(errors));sys.exit(1)
print(f"Guide QA passed: {len(pages)} HTML pages checked.")
