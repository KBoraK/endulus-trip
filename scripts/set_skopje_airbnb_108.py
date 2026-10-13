from pathlib import Path

p = Path('october/index.html')
s = p.read_text(encoding='utf-8')

repls = {
    '<div class="bcard"><b>—</b><span class="small">Airbnb · Miroslav Krleza 20</span></div>': '<div class="bcard"><b>€108,00</b><span class="small">Airbnb · Miroslav Krleza 20</span></div>',
    '<div class="bcard"><b>—</b><span class="small">uçuşlar</span></div>': '<div class="bcard"><b>€117,94</b><span class="small">uçuşlar · 2 kişi</span></div>',
    '<div class="bcard"><b>—</b><span class="small">booked toplam</span></div>': '<div class="bcard"><b>€225,94</b><span class="small">booked toplam</span></div>',
    '<div class="meta"><b>Airbnb:</b> BOOKED · Miroslav Krleza 20 · 30 Eki–2 Kas · toplam fiyat henüz siteye girilmedi.</div>': '<div class="meta"><b>Airbnb:</b> BOOKED · Miroslav Krleza 20 · 30 Eki–2 Kas · <b>108,00 € toplam</b>.</div><div class="meta" style="margin-top:6px"><b>Uçuşlar · 2 kişi:</b> İzmir → Skopje <b>76,00 €</b> · Skopje → Basel <b>41,94 €</b> · <b>117,94 € toplam</b>.</div>'
}

for old, new in repls.items():
    if old not in s:
        raise SystemExit(f'Missing expected text: {old}')
    s = s.replace(old, new, 1)

p.write_text(s, encoding='utf-8')
print('Skopje booked budget set: Airbnb 108.00 EUR, flights 117.94 EUR, total 225.94 EUR')
