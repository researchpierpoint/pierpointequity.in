from pathlib import Path
import shutil
import json, re

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"_site"
OUT.mkdir(exist_ok=True)
if OUT.exists():
    for child in OUT.iterdir():
        if child.is_dir(): shutil.rmtree(child)
        else: child.unlink()

CONTACT='''<div class="pp-footer-contact"><span class="footer-label">Contact</span><a href="mailto:research.pirepoint@gmail.com">research.pirepoint@gmail.com</a><small>Questions, corrections, source issues or suggestions.</small></div>'''
ASSET_VERSION="20261009"

def copy_html(src, dst):
    html=src.read_text(encoding="utf-8")
    html=re.sub(r'(assets/style\\.css)(?:\\?v=[^"]*)?', rf"\\1?v={ASSET_VERSION}", html)
    html=re.sub(r'(assets/app\\.js)(?:\\?v=[^"]*)?', rf"\\1?v={ASSET_VERSION}", html)
    html=re.sub(r'(assets/market-curriculum\\.js)(?:\\?v=[^"]*)?', rf"\\1?v={ASSET_VERSION}", html)
    # Normalize shared asset paths so nested pages cannot deploy with broken relative URLs.
    html=html.replace('src="../app.js"', 'src="../assets/app.js"').replace('src="./app.js"', 'src="assets/app.js"')
    rel=(src.relative_to(ROOT).as_posix() if not str(src).startswith(str(OUT)) else dst.relative_to(OUT).as_posix())
    asset_root="../assets/" if rel.startswith(("countries/","guides/")) else "assets/"
    if 'world-class.css' not in html:
        html=html.replace("</head>", f'<link rel="stylesheet" href="{asset_root}world-class.css?v={ASSET_VERSION}">\\n</head>', 1)
    if rel.startswith("countries/") and 'market-curriculum.js' not in html:
        html=html.replace("</body>", f'<script src="{asset_root}market-curriculum.js?v={ASSET_VERSION}"></script>\\n</body>', 1)

    if "pp-footer-contact" not in html and '<div class="footer-grid">' in html:
        marker='</div></div><div class="wrap fine">'
        if marker in html:
            html=html.replace(marker, '</div>'+CONTACT+'</div><div class="wrap fine">', 1)
    from html import unescape
    title_match=re.search(r"<title>(.*?)</title>", html, re.I|re.S)
    desc_match=re.search(r'<meta[^>]+name=["\']description["\'][^>]+content=["\'](.*?)["\']', html, re.I|re.S)
    title=unescape(title_match.group(1).strip()) if title_match else "PirePoint Equity"
    desc=unescape(desc_match.group(1).strip()) if desc_match else "Educational resources for understanding markets and researching investments."
    rel=src.relative_to(ROOT).as_posix()
    url="https://pierpointequity.in/" if rel=="index.html" else "https://pierpointequity.in/"+rel

    if '<link rel="canonical"' not in html:
        html=html.replace("</head>", f'<link rel="canonical" href="{url}">\n</head>', 1)
    if 'property="og:title"' not in html:
        social=f'''<meta property="og:type" content="website">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{url}">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{desc}">'''
        html=html.replace("</head>", social+"\n</head>", 1)

    if 'application/ld+json' not in html:
        schema_type="Article" if rel.startswith("guides/") else "WebPage"
        data={"@context":"https://schema.org","@type":schema_type,"name":title,"headline":title,"description":desc,"url":url,"inLanguage":"en","publisher":{"@type":"Organization","name":"PirePoint Equity","url":"https://pierpointequity.in/"}}
        html=html.replace("</head>", '<script type="application/ld+json">'+json.dumps(data,ensure_ascii=False,separators=(",",":"))+'</script>\n</head>', 1)
    dst.write_text(html, encoding="utf-8")

for p in ROOT.glob("*.html"):
    copy_html(p,OUT/p.name)
for folder in ("guides","countries"):
    target=OUT/folder
    shutil.copytree(ROOT/folder,target)
    for p in target.rglob("*.html"):
        copy_html(p,p)

ASSETS=ROOT/"assets"
if ASSETS.exists():
    shutil.copytree(ASSETS, OUT/"assets")
else:
    raise SystemExit("Build failed: required assets/ directory is missing")

for name in ("CNAME","robots.txt","sitemap.xml"):
    p=ROOT/name
    if p.exists(): shutil.copy2(p,OUT/p.name)

for page in OUT.rglob("*.html"):
    page_text=page.read_text(encoding="utf-8")
    refs=re.findall(r'(?:href|src)=[\'"]([^\'"]+)[\'"]', page_text, flags=re.I)
    for ref in refs:
        clean=ref.split("#",1)[0].split("?",1)[0]
        if not clean or clean.startswith(("#","/","http://","https://","mailto:","tel:","javascript:","data:")):
            continue
        if not clean.lower().endswith(".css"):
            continue
        target=(page.parent/clean).resolve()
        if not target.exists():
            raise SystemExit(f"Build failed: missing CSS asset {clean} referenced by {page.relative_to(OUT)}")

print(f"Built public site: {OUT}")
