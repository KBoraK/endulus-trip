from pathlib import Path
import re

p = Path('october/index.html')
s = p.read_text(encoding='utf-8')

old = '''<section id="notes" class="view">
 <div class="head"><div><div class="ey">LOCAL STORAGE · SKOPJE ONLY</div><h2>Notlar ve bütçe</h2></div></div>
 <div class="budget">
  <div class="bcard"><b id="hotelBudget">€0</b><span class="small">konaklama</span></div>
  <div class="bcard"><b id="flightBudget">€0</b><span class="small">uçuşlar</span></div>
  <div class="bcard"><b id="transportBudget">€0</b><span class="small">ekstra transport</span></div>
  <div class="bcard"><b id="otherBudget">€0</b><span class="small">diğer harcamalar</span></div>
  <div class="bcard"><b id="totalBudget">€0</b><span class="small">girilen toplam</span></div>
 </div>
 <div class="note"><label>Konaklama toplamı (€) · Airbnb · Miroslav Krleza 20 (BOOKED)<input id="hotelInput" inputmode="decimal" placeholder="Airbnb toplam fiyatı"></label></div>
 <div class="note"><label>Uçuş toplamı (€)<input id="flightInput" inputmode="decimal" placeholder="İzmir → Skopje + Skopje → Basel"></label></div>
 <div class="note"><label>Ekstra transport (€)<input id="transportInput" inputmode="decimal" placeholder="airport shuttle, Matka otobüs, şehir içi toplu taşıma..."></label></div>
 <div class="note"><label>Diğer harcamalar (€)<input id="otherInput" inputmode="decimal" placeholder="yemek, alışveriş, aktiviteler..."></label></div>
 <div class="note"><label>Notlar<textarea id="notesText" placeholder="Rezervasyon numarası, yapılacaklar, restoran rezervasyonu..."></textarea></label></div>
 <div class="warn">Bu bölüm yalnızca <b>skopjeTripTempV1</b> anahtarında saklanır. Endülüs dashboard verilerine dokunmaz.</div>
</section>'''

new = '''<section id="notes" class="view">
 <div class="head"><div><div class="ey">BOOKED COSTS · CHATGPT GÜNCELLER</div><h2>Notlar ve bütçe</h2></div></div>
 <div class="budget">
  <div class="bcard"><b>—</b><span class="small">Airbnb · Miroslav Krleza 20</span></div>
  <div class="bcard"><b>—</b><span class="small">uçuşlar</span></div>
  <div class="bcard"><b>—</b><span class="small">ulaşım / transfer</span></div>
  <div class="bcard"><b>—</b><span class="small">aktiviteler</span></div>
  <div class="bcard"><b>—</b><span class="small">booked toplam</span></div>
 </div>
 <div class="note"><div class="ey">NASIL GÜNCELLENİR?</div><h3 style="margin:7px 0 5px">Fiyatları buradan yazmana gerek yok</h3><div class="meta">Bir rezervasyon yaptığında veya kesin bir fiyat ödediğinde sohbetten bana tutarı söyle. Ben bu sayfadaki ilgili kalemi ve booked toplamı doğrudan güncellerim.</div></div>
 <div class="note"><div class="ey">MEVCUT DURUM</div><div class="meta"><b>Airbnb:</b> BOOKED · Miroslav Krleza 20 · 30 Eki–2 Kas · toplam fiyat henüz siteye girilmedi.</div><div class="meta" style="margin-top:6px"><b>Airport shuttle:</b> 199 MKD/kişi/tek yön tarifesi plan bilgisidir; bilet alınana kadar booked bütçeye eklenmez.</div></div>
</section>'''

if old not in s:
    raise SystemExit('Notes/budget section did not match expected content')
s = s.replace(old, new, 1)

# Remove the old editable localStorage budget logic so missing inputs cannot break page JavaScript.
pattern = r''' const KEY="skopjeTripTempV1";.*? paint\(\);\n function go\(id\)'''
replacement = ''' function go(id)'''
s, n = re.subn(pattern, replacement, s, count=1, flags=re.S)
if n != 1:
    raise SystemExit('Could not remove old editable budget JavaScript')

p.write_text(s, encoding='utf-8')
print('Static budget section applied')
