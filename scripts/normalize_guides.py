from pathlib import Path
import re
ROOT=Path(__file__).resolve().parents[1]
NAV='<nav><a class="active" href="../guides.html">Learn</a><a href="../countries.html">Countries</a><a href="../glossary.html">Glossary</a><a href="../compare.html">Compare</a><a href="../tools.html">Tools</a></nav>'
for p in sorted((ROOT/"guides").glob("*.html")):
    s=p.read_text(encoding="utf-8")
    s=re.sub(r"<nav>.*?</nav>",NAV,s,count=1,flags=re.S|re.I)
    if 'src="../assets/guide.js"' not in s:
        s=s.replace("</body>",'<script src="../assets/guide.js"></script></body>',1)
    for old in ("stocks.html","research.html","funds.html","etfs.html","what-changed.html"):
        s=s.replace(f'href="../{old}"','href="../guides.html"')
    p.write_text(s,encoding="utf-8")
print("Normalized guide navigation and reading shell.")
