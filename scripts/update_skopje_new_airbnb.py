from pathlib import Path

p = Path('october/index.html')
s = p.read_text(encoding='utf-8')

AIRBNB='https://www.airbnb.de/rooms/1121001921155599639?unique_share_id=37d4ef86-8928-485e-ba8c-9880222b6eb0&viralityEntryPoint=1&s=76'

repls = {
'''<div class="warn"><b>Konaklama merkezi:</b> Tüm günlük rotalar <b>Airbnb · Miroslav Krleza 20, 1000 Skopje</b> başlangıç/bitiş noktası olarak planlandı. Airbnb check-in <b>30 Ekim 14:00</b>, check-out <b>2 Kasım 11:00</b>. Dönüş uçuşu artık <b>2 Kasım 17:50–20:10</b>. Havalimanı transferinde ana plan <b>V2V / WTransporter airport shuttle</b>: gelişte 16:30 hedef (kaçarsa 17:45), dönüşte Holiday Inn durağından 15:20.</div>''':
'''<div class="warn"><b>Konaklama merkezi:</b> Yeni BOOKED Airbnb artık <b>Miroslav Krleza 20, Skopje 1000</b>. Tüm şehir içi yürüyüş rotaları, yemek rotaları, harita pini ve havaalanı shuttle yürüyüşleri bu adrese göre düzenlendi. Dönüş uçuşu <b>2 Kasım 17:50–20:10</b>; ana havalimanı planı <b>V2V / WTransporter airport shuttle</b>: gelişte 16:30 hedef (kaçarsa 17:45), dönüşte Holiday Inn durağından 15:20.</div>''',

'''<div class="item"><div class="time">~17:35</div><div><div class="name">🏠 Airbnb · Miroslav Krleza 20 · check-in</div><div class="desc">Check-in 14:00'ten itibaren. Kısa dinlenme ve ardından merkeze yürüyüş.</div><a class="maplink" target="_blank" href="https://www.google.com/maps/search/?api=1&query=Miroslav+Krleza+20+Skopje">⌖ Airbnb adresi</a></div></div>''':
'''<div class="item"><div class="time">~17:35</div><div><div class="name">🏠 Yeni Airbnb · Miroslav Krleza 20</div><div class="desc">Yeni rezervasyona giriş ve kısa dinlenme; ardından merkeze yürüyüş. Kesin check-in saatini yeni Airbnb rezervasyonundaki bilgiye göre takip et.</div><a class="maplink" target="_blank" href="https://www.google.com/maps/search/?api=1&query=Miroslav+Krleza+20+Skopje">⌖ Airbnb adresi</a> · <a class="maplink" target="_blank" href="'''+AIRBNB+'''">Airbnb ilanı ↗</a></div></div>''',

'''<div class="item"><div class="time">21:30</div><div><div class="name">🏠 Airbnb'ye dönüş + valiz</div><div class="desc">Valizi toparla; yarın 11:00 check-out sonrası valizleri mümkünse ev sahibine bırakıp son şehir turunu yap.</div><span class="tag">Önemli</span></div></div>''':
'''<div class="item"><div class="time">21:30</div><div><div class="name">🏠 Airbnb'ye dönüş + valiz</div><div class="desc">Valizi toparla; yeni rezervasyondaki kesin check-out saatine göre sabah planını uygula. Mümkünse valizleri öğleden sonraya kadar ev sahibine bırakmayı önceden sor.</div><span class="tag">Önemli</span></div></div>''',

'''<div class="item"><div class="time">10:30</div><div><div class="name">🏠 Airbnb'ye dönüş + hazırlık</div><div class="desc">Valizleri kapat ve check-out için hazırlan.</div></div></div>
   <div class="item"><div class="time">11:00</div><div><div class="name">Check-out + valizleri bırak</div><div class="desc">Mümkünse ev sahibinden valizleri yaklaşık 14:00'e kadar bırakmak için önceden izin iste.</div><span class="tag">Ev sahibine sor</span></div></div>
   <div class="item"><div class="time">11:15–13:45</div><div><div class="name">🚶 Son şehir turu / öğle yemeği</div>''':
'''<div class="item"><div class="time">10:30</div><div><div class="name">🏠 Airbnb'ye dönüş + hazırlık</div><div class="desc">Valizleri kapat ve yeni rezervasyondaki kesin check-out saatine göre çıkış yap.</div></div></div>
   <div class="item"><div class="time">Check-out</div><div><div class="name">Valizleri bırak</div><div class="desc">Mümkünse ev sahibinden valizleri yaklaşık 14:00'e kadar bırakmak için önceden izin iste.</div><span class="tag">Ev sahibine sor</span></div></div>
   <div class="item"><div class="time">Sonra</div><div><div class="name">🚶 Son şehir turu / öğle yemeği</div>''',

'''<div class="price">BOOKED <span class="small">· 30 Eki–2 Kas · 3 gece</span></div>
   <div class="meta"><b>🕑 Check-in:</b> 30 Ekim 14:00 · <b>Check-out:</b> 2 Kasım 11:00</div>''':
'''<div class="price">€126,00 <span class="small">· BOOKED · 30 Eki–2 Kas · 3 gece</span></div>
   <div class="meta"><b>🕑 Check-in / check-out:</b> yeni Airbnb rezervasyonundaki kesin saatleri baz al.</div>''',

'''<a class="action primary" target="_blank" href="https://www.google.com/maps/search/?api=1&query=Miroslav+Krleza+20+Skopje">⌖ Airbnb adresi</a>''':
'''<a class="action primary" target="_blank" href="'''+AIRBNB+'''">Airbnb ilanı ↗</a>
    <a class="action" target="_blank" href="https://www.google.com/maps/search/?api=1&query=Miroslav+Krleza+20+Skopje">⌖ Airbnb adresi</a>''',

'''<div class="bcard"><b>€108,00</b><span class="small">Airbnb · Miroslav Krleza 20</span></div>''':
'''<div class="bcard"><b>€126,00</b><span class="small">Airbnb · Miroslav Krleza 20</span></div>''',
'''<div class="bcard"><b>€225,94</b><span class="small">booked toplam</span></div>''':
'''<div class="bcard"><b>€243,94</b><span class="small">booked toplam</span></div>''',
'''<div class="meta"><b>Airbnb:</b> BOOKED · Miroslav Krleza 20 · 30 Eki–2 Kas · <b>108,00 € toplam</b>.</div>''':
'''<div class="meta"><b>Airbnb:</b> BOOKED · yeni ilan · Miroslav Krleza 20 · 30 Eki–2 Kas · <b>126,00 € toplam</b> · <a target="_blank" href="'''+AIRBNB+'''">ilanı aç ↗</a>.</div>'''
}

for old,new in repls.items():
    if old not in s:
        raise SystemExit('Missing expected block:\n'+old[:160])
    s=s.replace(old,new,1)

p.write_text(s,encoding='utf-8')

# Guide already uses Miroslav Krleza 20 as its route base. Add a concise note that this is the current booked Airbnb.
g=Path('october/guide.html')
t=g.read_text(encoding='utf-8')
old='Rotalar artık Airbnb adresi <b>Miroslav Krleza 20</b> baz alınarak düzenlendi.'
new='Rotalar güncel BOOKED Airbnb adresi <b>Miroslav Krleza 20, Skopje 1000</b> baz alınarak düzenlendi.'
if old not in t:
    raise SystemExit('Guide base text not found')
t=t.replace(old,new,1)
g.write_text(t,encoding='utf-8')
print('Updated new Airbnb, routes metadata and booked budget')