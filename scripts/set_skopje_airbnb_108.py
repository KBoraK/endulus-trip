from pathlib import Path

p = Path('october/index.html')
s = p.read_text(encoding='utf-8')

repls = {
    '<div class="bcard"><b>—</b><span class="small">Airbnb · Miroslav Krleza 20</span></div>': '<div class="bcard"><b>€108</b><span class="small">Airbnb · Miroslav Krleza 20</span></div>',
    '<div class="bcard"><b>—</b><span class="small">booked toplam</span></div>': '<div class="bcard"><b>€108</b><span class="small">booked toplam</span></div>',
    '<div class="meta"><b>Airbnb:</b> BOOKED · Miroslav Krleza 20 · 30 Eki–2 Kas · toplam fiyat henüz siteye girilmedi.</div>': '<div class="meta"><b>Airbnb:</b> BOOKED · Miroslav Krleza 20 · 30 Eki–2 Kas · <b>108 € toplam</b>.</div>'
}

for old, new in repls.items():
    if old not in s:
        raise SystemExit(f'Missing expected text: {old}')
    s = s.replace(old, new, 1)

p.write_text(s, encoding='utf-8')
print('Airbnb budget set to 108 EUR')
