from pathlib import Path
import shutil
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"_site"
OUT.mkdir(exist_ok=True)
if OUT.exists():
    for child in OUT.iterdir():
        if child.is_dir(): shutil.rmtree(child)
        else: child.unlink()

CONTACT='''<div class="pp-footer-contact"><span class="footer-label">Contact</span><a href="mailto:research.pirepoint@gmail.com">research.pirepoint@gmail.com</a><small>Questions, corrections, source issues or suggestions.</small></div>'''

def copy_html(src, dst):
    html=src.read_text(encoding="utf-8")
    if "pp-footer-contact" not in html and '<div class="footer-grid">' in html:
        html=html.replace('<div class="footer-grid">','<div class="footer-grid">',1)
        marker='</div></div><div class="wrap fine">'
        if marker in html:
            html=html.replace(marker, '</div>'+CONTACT+'</div><div class="wrap fine">', 1)
    dst.write_text(html, encoding="utf-8")

for p in ROOT.glob("*.html"):
    copy_html(p,OUT/p.name)
for folder in ("guides","countries"):
    target=OUT/folder
    shutil.copytree(ROOT/folder,target)
    for p in target.rglob("*.html"):
        copy_html(p,p)
for name in ("CNAME","robots.txt","sitemap.xml"):
    p=ROOT/name
    if p.exists(): shutil.copy2(p,OUT/p.name)
print(f"Built public site: {OUT}")
