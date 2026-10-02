from pathlib import Path
import re, sys, json

ROOT=Path(__file__).resolve().parents[1]
PUBLIC=ROOT/"_site" if (ROOT/"_site").exists() else ROOT
errors=[]

html_files=list(PUBLIC.glob("*.html"))+list((PUBLIC/"countries").glob("*.html"))+list((PUBLIC/"guides").glob("*.html"))
required_countries=["australia","canada","china","germany","hong-kong","india","japan","singapore","south-korea","uae","united-kingdom","united-states"]

def clean(ref):
    return ref.split("#",1)[0].split("?",1)[0]

for page in html_files:
    text=page.read_text(encoding="utf-8")
    if "<title>" not in text: errors.append(f"{page}: missing title")
    if 'name="viewport"' not in text: errors.append(f"{page}: missing viewport")
    if "assets/style.css" not in text: errors.append(f"{page}: missing shared stylesheet")
    if "world-class.css" not in text: errors.append(f"{page}: missing world-class stylesheet")
    for ref in re.findall(r'(?:href|src)=[\'"]([^\'"]+)[\'"]',text,re.I):
        c=clean(ref)
        if not c or c.startswith(("#","/","http://","https://","mailto:","tel:","javascript:","data:")): continue
        target=(page.parent/c).resolve()
        if c.lower().endswith((".html",".css",".js",".json",".xml",".txt")) and not target.exists():
            errors.append(f"{page}: missing local asset {c}")

for slug in required_countries:
    p=PUBLIC/"countries"/f"{slug}.html"
    if not p.exists(): errors.append(f"missing country page: {slug}")
    else:
        t=p.read_text(encoding="utf-8")
        for needle in ("data-market=","market-curriculum.js","Learn "):
            if needle not in t: errors.append(f"{p}: missing curriculum hook {needle}")

js=(ROOT/"data"/"learn-before-invest.js").read_text(encoding="utf-8")
for required in ("makeTargetNodes","makeHomeNodes","stateKey"):
    if required not in js: errors.append(f"learning engine: missing {required}")
data=json.loads((ROOT/"data"/"learn-before-invest.json").read_text(encoding="utf-8"))
contract=data.get("contract",{})
if (contract.get("total"),contract.get("targetLessons"),contract.get("homeLessons"))!=(300,240,60):
    errors.append("learning contract is not 240 + 60 = 300")
if not (PUBLIC/"data"/"learn-before-invest.js").exists():
    errors.append("public build is missing data/learn-before-invest.js")
if not (PUBLIC/"data"/"market-catalog.json").exists():
    errors.append("public build is missing data/market-catalog.json")

if errors:
    print("\n".join("ERROR: "+e for e in errors))
    sys.exit(1)
print(f"QA passed: {len(html_files)} HTML pages checked, {len(required_countries)} country routes checked, data assets present, and 300-node learning contract verified.")
