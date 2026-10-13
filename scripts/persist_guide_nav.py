from pathlib import Path

# --- guide.html ---
p = Path('october/guide.html')
s = p.read_text(encoding='utf-8')

old_css = '''.mini{font-size:11px;color:var(--muted)}footer{text-align:center;color:#8b8175;padding:28px 14px 40px;font-size:11px}\n@media(max-width:600px){.hero h1{font-size:43px}.head{align-items:stretch;flex-direction:column}.grid{grid-template-columns:1fr}}'''
new_css = '''.mini{font-size:11px;color:var(--muted)}footer{text-align:center;color:#8b8175;padding:28px 14px 40px;font-size:11px}\n.tabs{position:sticky;top:0;z-index:50;display:flex;gap:6px;overflow-x:auto;padding:9px max(10px,calc((100vw - 1050px)/2));background:rgba(236,231,220,.94);backdrop-filter:blur(16px);border-block:1px solid var(--line);scrollbar-width:none}.tabs::-webkit-scrollbar{display:none}.tabs a{white-space:nowrap;border:1px solid var(--line);background:rgba(248,242,232,.85);color:var(--text);border-radius:11px;padding:9px 11px;text-decoration:none;font-size:12px;cursor:pointer}.tabs a.on{background:var(--olive);color:white;border-color:var(--olive)}\n@media(min-width:1100px){body{padding-left:180px}.tabs{position:fixed;left:16px;top:18px;bottom:18px;width:154px;flex-direction:column;align-items:stretch;padding:82px 9px 10px;border:1px solid var(--line);border-radius:20px}.tabs:before{content:"SKOPJE";position:absolute;top:28px;left:18px;font:700 20px Georgia;color:var(--accent)}.tabs a{text-align:left}.wrap{max-width:980px}}\n@media(max-width:650px){body{padding-bottom:82px}.tabs{position:fixed;top:auto;bottom:0;left:0;right:0;z-index:100;height:calc(66px + env(safe-area-inset-bottom));padding:6px 6px env(safe-area-inset-bottom);justify-content:flex-start;overflow-x:auto}.tabs a{flex:0 0 auto;min-width:78px;height:54px;display:flex;align-items:center;justify-content:center}.chips{top:0}}\n@media(max-width:600px){.hero h1{font-size:43px}.head{align-items:stretch;flex-direction:column}.grid{grid-template-columns:1fr}}'''
if old_css not in s:
    raise SystemExit('Guide CSS anchor not found')
s = s.replace(old_css, new_css, 1)

old_body = '''<body>\n<div class="wrap">'''
new_body = '''<body>\n<nav class="tabs" aria-label="Skopje ana navigasyon">\n <a href="./?view=home">⌂ Ana Sayfa</a>\n <a href="./?view=plan">📅 Plan</a>\n <a href="./?view=mapview">🗺️ Harita</a>\n <a href="./?view=stays">🛏️ Konaklama</a>\n <a href="./?view=food">🍴 Yemek</a>\n <a class="on" href="./guide.html">✨ Rehber</a>\n <a href="./?view=transport">🚌 Ulaşım</a>\n <a href="./?view=notes">💶 Bütçe</a>\n</nav>\n<div class="wrap">'''
if old_body not in s:
    raise SystemExit('Guide body anchor not found')
s = s.replace(old_body, new_body, 1)
p.write_text(s, encoding='utf-8')

# --- index.html: support direct navigation from guide via ?view=... ---
p = Path('october/index.html')
s = p.read_text(encoding='utf-8')
old_js = ''' document.querySelectorAll(".tabs button").forEach(b=>b.onclick=()=>go(b.dataset.v));document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));\n const pts=['''
new_js = ''' document.querySelectorAll(".tabs button").forEach(b=>b.onclick=()=>go(b.dataset.v));document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));\n const requestedView=new URLSearchParams(location.search).get("view");\n if(["home","plan","mapview","stays","food","transport","notes"].includes(requestedView)) go(requestedView);\n const pts=['''
if old_js not in s:
    raise SystemExit('Index JS navigation anchor not found')
s = s.replace(old_js, new_js, 1)
p.write_text(s, encoding='utf-8')

print('Persistent guide navigation applied')
