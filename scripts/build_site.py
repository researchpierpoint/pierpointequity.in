from pathlib import Path
import shutil
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"_site"
if OUT.exists(): shutil.rmtree(OUT)
OUT.mkdir()
for p in ROOT.glob("*.html"):
    shutil.copy2(p,OUT/p.name)
for name in ("CNAME","robots.txt","sitemap.xml"):
    p=ROOT/name
    if p.exists(): shutil.copy2(p,OUT/p.name)
for folder in ("assets","guides","countries"):
    shutil.copytree(ROOT/folder,OUT/folder)
print(f"Built public site: {OUT}")
