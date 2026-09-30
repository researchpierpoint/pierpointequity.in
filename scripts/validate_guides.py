from pathlib import Path
import re,sys
ROOT=Path(__file__).resolve().parents[1]
errors=[]; warnings=[]
pages=[*ROOT.glob("*.html"),*ROOT.glob("guides/*.html"),*ROOT.glob("countries/*.html")]
for p in pages:
    s=p.read_text(encoding="utf-8",errors="ignore")
    if "<title>" not in s: errors.append(f"{p}: missing title")
    if 'meta name="description"' not in s: errors.append(f"{p}: missing description")
    if p.parent.name=="guides" and "../guides.html" not in s: warnings.append(f"{p}: guide hub link missing")
    for href in re.findall(r'href=["\']([^"\'#]+)',s,re.I):
        if href.startswith(("http:","https:","mailto:","javascript:")): continue
        if any(x in href for x in ("stocks.html","research.html","funds.html","etfs.html","status.html","what-changed.html","traffic.html")):
            warnings.append(f"{p}: legacy product reference {href}")
            continue
        clean=href.split("?",1)[0]
        target=(p.parent/clean).resolve()
        if not target.exists(): warnings.append(f"{p}: unresolved link {href}")
for p in [ROOT/"guides.html",ROOT/"countries.html",ROOT/"glossary.html",ROOT/"compare.html"]:
    if not p.exists(): errors.append(f"missing hub: {p}")
if errors:
    print("\n".join(errors));sys.exit(1)
if warnings:
    print(f"Guide QA passed with {len(warnings)} non-blocking warnings.")
else:
    print(f"Guide QA passed: {len(pages)} HTML pages checked.")
