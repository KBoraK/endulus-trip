from pathlib import Path

p = Path('october/index.html')
s = p.read_text(encoding='utf-8')

needle = '''   <div class="item"><div class="time">11:45</div><div><div class="name">Tekne / Vrelo Cave opsiyonu</div><div class="desc">Hava ve işletme durumuna göre yerinde karar ver.</div><span class="tag">Opsiyonel</span></div></div>'''

block = '''   <div class="item"><div class="time">GYG</div><div><div class="name">🎟️ Matka için güvenilir GetYourGuide tur alternatifleri</div><div class="desc">Kendi başınıza otobüsle gitmek yerine rehberli tur isterseniz, yorum hacmi ve güncel puanları güçlü üç seçenek:</div>
    <div class="actions">
     <a class="action primary" target="_blank" href="https://www.getyourguide.com/skopje-l2398/skopje-matka-canyon-millennium-cross-village-tour-t465054/">⭐ 4,7 · 2.118 yorum · Matka + Vodno + köy</a>
     <a class="action" target="_blank" href="https://www.getyourguide.com/skopje-l2398/skopje-mt-vodno-st-pantelemon-matka-canyon-12-daytrip-t726482/">⭐ 4,9 · 348 yorum · Matka + brunch · 5 saat</a>
     <a class="action" target="_blank" href="https://www.getyourguide.com/skopje-l2398/adventure-canyon-matka-st-panteleimon-mt-vodno-lunch-t926499/">⭐ 4,9 · 286 yorum · küçük grup (max 9) + kahvaltı</a>
    </div>
    <div class="desc" style="margin-top:8px"><b>Not:</b> İlk tur sayfasında Millennium Cross teleferiğinin şu anda servis dışı olabileceği belirtiliyor. Rezervasyon öncesi 1 Kasım 2026 müsaitliğini ve teleferik durumunu GetYourGuide’da tekrar kontrol et. Vrelo Cave teknesi çoğu turda ayrıca ücretli.</div>
   </div></div>'''

if needle not in s:
    raise SystemExit('Matka boat item not found')

s = s.replace(needle, needle + '\n' + block, 1)
p.write_text(s, encoding='utf-8')
print('Added GetYourGuide Matka links')
