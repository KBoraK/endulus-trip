from pathlib import Path
p=Path('october/index.html')
s=p.read_text(encoding='utf-8')
repls={
'<div class="meta">− Airport shuttle durağına da en uzak; 06:45 uçuşta taksi neredeyse şart.</div>':'<div class="meta">− Airport shuttle durağına da en uzak; mevcut 17:50 dönüş uçuşunda shuttle seçeneği daha uygulanabilir.</div>',
'<div class="warn"><b>Rezervasyon tamamlandı:</b> <b>Airbnb · Miroslav Krleza 20</b>. Check-in 30 Ekim 14:00, check-out 2 Kasım 11:00. Macedonia Square yaklaşık 1 km yürüyüşte. 02.11’deki 06:45 uçuş için bu adresten doğrudan, önceden ayarlanmış taksi ana plan; Holiday Inn shuttle yalnızca sefer saati uygunsa yedek seçenek.</div>':'<div class="warn"><b>Rezervasyon tamamlandı:</b> yeni Airbnb · <b>Miroslav Krleza 20, Skopje 1000</b> · <b>126 € toplam</b>. Macedonia Square yaklaşık 1 km yürüyüşte. 2 Kasım 17:50 dönüş uçuşunda ana plan Holiday Inn durağına yürüyüp <b>15:20 V2V / WTransporter shuttle</b> ile havalimanına gitmek. Kesin check-in / check-out saatleri yeni Airbnb rezervasyonundaki bilgiye göre takip edilecek.</div>'
}
for old,new in repls.items():
    if old not in s:
        raise SystemExit('Missing stale block: '+old[:120])
    s=s.replace(old,new,1)
p.write_text(s,encoding='utf-8')
print('Removed stale early-flight/taxi lodging text')