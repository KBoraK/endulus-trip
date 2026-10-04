(()=>{
"use strict";
window.ENDULUS_APP_BUILD="6.2.51";
document.documentElement.dataset.appBuild=window.ENDULUS_APP_BUILD;
if(typeof D==="undefined") return;
const KEY="endulusStateV6";
const STATUS={
 required:["Rezervasyon gerekli","required"],
 waiting:["Satış / saat bekleniyor","waiting"],
 later:["Tarih yaklaşınca kontrol","later"],
 booked:["Booked","booked"]
};
const bookedStayData={
 "Toulouse":{
  name:"Première Classe Toulouse - Blagnac Aéroport",price:56,provider:"Booking.com",
  area:"Blagnac · Toulouse-Blagnac Havalimanı çevresi",
  url:"https://www.booking.com/hotel/fr/hotelpremiereclassedetoulouseblagnac.de.html",
  mapQuery:"Première Classe Toulouse Blagnac Aéroport",
  note:"22–23 Aralık · 1 gece · €56 toplam."
 },
 "Málaga":{
  name:"Malaga Vibes Apartment",price:214,provider:"Booking.com",
  area:"Málaga Centro · Calle de San Quintín 52",
  url:"https://www.booking.com/Share-TxihQt",
  mapQuery:"Calle de San Quintín 52, Málaga, Spain",
  note:"23–25 Aralık · 2 gece · 3 kişi · €214 toplam · rezervasyon ekranında ücretsiz iptal."
 },
 "Granada":{
  name:"Aljibe de San Miguel Bajo",price:227.70,provider:"Booking.com",
  area:"Albaicín · C. Cascajal 2",
  url:"https://www.booking.com/hotel/es/aljibe-de-san-miguel-bajo.html?aid=2438770&checkin=2026-12-25&checkout=2026-12-27&no_rooms=1&group_adults=3&selected_currency=EUR",
  mapQuery:"Calle Cascajal 2, Granada, Spain",
  note:"25–27 Aralık · 2 gece · 3 kişi · €227,70 toplam · rezervasyon ekranında ücretsiz iptal."
 },
 "Córdoba":{
  name:"Limehome Cordoba Calle Pozanco",price:166.75,provider:"Booking.com",
  area:"Centro · C. Pozanco 9",
  url:"https://www.booking.com/hotel/es/los-patios-de-san-agustin.html?aid=2438770&checkin=2026-12-27&checkout=2026-12-29&no_rooms=1&group_adults=3&selected_currency=EUR",
  mapQuery:"Calle Pozanco 9, Córdoba, Spain",
  note:"27–29 Aralık · 2 gece · 3 kişi · €166,75 ödenen rezervasyon fiyatı · rezervasyon ekranında ücretsiz iptal."
 },
 "Sevilla":{
  name:"Airbnb · Calle Atanasio Barrón 8",price:265,provider:"Airbnb",
  area:"Calle Atanasio Barrón 8 · Sevilla",
  url:"https://www.airbnb.de/rooms/649130724648390816?unique_share_id=7e37299c-c575-4fe5-81a7-5cd3117f247f&viralityEntryPoint=1&s=76",
  mapQuery:"Calle Atanasio Barrón 8, Sevilla, Spain",
  note:"29–31 Aralık · 2 gece · €265 toplam. Check-in 29 Aralık 15:00, check-out 31 Aralık 11:00."
 },
 "Madrid":{
  name:"Capsule Inn Madrid",price:164.40,provider:"Booking.com",
  area:"Centro · Travesía de las Beatas 3",
  url:"https://www.booking.com/hotel/es/urban-inn-madrid.html?aid=2438770&checkin=2026-12-31&checkout=2027-01-01&no_rooms=1&group_adults=3&selected_currency=EUR",
  mapQuery:"Travesía de las Beatas 3, Madrid, Spain",
  note:"31 Aralık–1 Ocak · 1 gece · 3 kişi · €164,40 ödenen rezervasyon fiyatı · rezervasyon ekranında ücretsiz iptal."
 },
 "Montpellier":{
  name:"Campanile PRIME - Montpellier Centre St Roch",price:167,provider:"Booking.com",
  area:"Centre · Gare Saint-Roch · 11 rue Pagezy",
  url:"https://www.booking.com/hotel/fr/campanile-montpellier-centre-gare-saint-roch.html?aid=2438770&checkin=2027-01-01&checkout=2027-01-03&no_rooms=1&group_adults=2&selected_currency=EUR",
  mapQuery:"Campanile PRIME Montpellier Centre St Roch",
  note:"1–3 Ocak · 2 gece · 2 kişi · €167 toplam · kahvaltı dahil."
 }
};
const stayDefaults={};
D.stays.forEach(s=>{
 const b=bookedStayData[s[0]];
 stayDefaults[s[0]]={
  status:b?"booked":"todo",
  name:b?.name||"",
  price:b?String(b.price):"",
  checkin:s[1].split("–")[0]||"",
  checkout:s[1].split("–")[1]||"",
  area:b?.area||s[3]
 };
});
const reservationDefaults={};
D.bookings.forEach(b=>reservationDefaults[b[0]]={status:["alhambra","train"].includes(b[0])?"booked":"required",time:b[0]==="alhambra"?"14:00":(b[0]==="train"?"07:13–09:52":""),total:b[0]==="train"?"51":"",verified:b[0]==="alhambra"?"2026-09-29":(b[0]==="train"?"2026-10-03":"")});
function load(){
 let s={version:6,stays:stayDefaults,reservations:reservationDefaults,expenses:{flights:"",intercity:"",local:"",food:"",other:"",montpellier:""}};
 try{const old=JSON.parse(localStorage.getItem(KEY)||"null");if(old)s=merge(s,old)}catch(e){}
 try{const checks=JSON.parse(localStorage.getItem("endulusChecks")||"{}");Object.keys(checks).forEach(k=>{if(checks[k]&&s.reservations[k])s.reservations[k].status="booked"})}catch(e){}
 try{const b=JSON.parse(localStorage.getItem("endulusBudgetV5")||"{}");["flights","intercity","local","food","other","montpellier"].forEach(k=>{if(b[k]!==undefined&&s.expenses[k]==="")s.expenses[k]=b[k]})}catch(e){}
 try{const n=JSON.parse(localStorage.getItem("endulusNotesV5")||"{}");if(n)s.notes=n}catch(e){}
 return s;
}
function merge(base,extra){
 const out=(typeof structuredClone!=="undefined")?structuredClone(base):JSON.parse(JSON.stringify(base));
 Object.keys(extra||{}).forEach(k=>{
   if(extra[k]&&typeof extra[k]==="object"&&!Array.isArray(extra[k])&&out[k]&&typeof out[k]==="object") out[k]=merge(out[k],extra[k]);
   else out[k]=extra[k];
 });return out;
}
let state=load(),edit=false;
if(localStorage.getItem("endulusMplCampanileBookedV1")!=="1"&&state.stays?.Montpellier){Object.assign(state.stays.Montpellier,{status:"booked",name:"Campanile PRIME - Montpellier Centre St Roch",area:"Centre · Gare Saint-Roch · 11 rue Pagezy"});localStorage.setItem("endulusMplCampanileBookedV1","1")}
if(localStorage.getItem("endulusMplCampanileBookedV2")!=="1"&&state.stays?.Montpellier){Object.assign(state.stays.Montpellier,{status:"booked",name:"Campanile PRIME - Montpellier Centre St Roch",price:"167",area:"Centre · Gare Saint-Roch · 11 rue Pagezy"});localStorage.setItem("endulusMplCampanileBookedV2","1")}
if(localStorage.getItem("endulusCordoba2Madrid1V1")!=="1"){
 if(state.stays?.["Córdoba"])Object.assign(state.stays["Córdoba"],{checkin:"27",checkout:"29"});
 if(state.stays?.Sevilla)Object.assign(state.stays.Sevilla,{checkin:"29",checkout:"31"});
 if(state.stays?.Madrid)Object.assign(state.stays.Madrid,{checkin:"31",checkout:"1"});
 localStorage.setItem("endulusCordoba2Madrid1V1","1");
 localStorage.setItem(KEY,JSON.stringify(state));
}
if(localStorage.getItem("endulusFinalBookedStaysV1")!=="1"){
 Object.entries(bookedStayData).forEach(([city,b])=>{
  if(state.stays?.[city])Object.assign(state.stays[city],{status:"booked",name:b.name,price:String(b.price),area:b.area});
 });
 localStorage.setItem("endulusFinalBookedStaysV1","1");
 localStorage.setItem(KEY,JSON.stringify(state));
}
if(localStorage.getItem("endulusAlhambraBooked1400V1")!=="1"&&state.reservations?.alhambra){
 Object.assign(state.reservations.alhambra,{status:"booked",time:"14:00",verified:"2026-09-29"});
 localStorage.setItem("endulusAlhambraBooked1400V1","1");
 localStorage.setItem(KEY,JSON.stringify(state));
}
if(localStorage.getItem("endulusOuigoMadridBookedV1")!=="1"&&state.reservations?.train){
 Object.assign(state.reservations.train,{status:"booked",time:"07:13–09:52",total:"51",verified:"2026-10-03"});
 localStorage.setItem("endulusOuigoMadridBookedV1","1");
 localStorage.setItem(KEY,JSON.stringify(state));
}
if(localStorage.getItem("endulusAutoTrainBudgetV1")!=="1"){
 const intercityNow=parseFloat(String(state.expenses?.intercity||"").replace(",", "."))||0;
 if(state.expenses&&intercityNow===51)state.expenses.intercity="";
 localStorage.setItem("endulusAutoTrainBudgetV1","1");
 localStorage.setItem(KEY,JSON.stringify(state));
}
const save=()=>{
 localStorage.setItem(KEY,JSON.stringify(state));
 const checks={};Object.entries(state.reservations).forEach(([k,v])=>checks[k]=v.status==="booked");localStorage.setItem("endulusChecks",JSON.stringify(checks));
 localStorage.setItem("endulusBudgetV5",JSON.stringify({...state.expenses,stays:stayTotal(),attractions:String(bookedActivityTotal()),trains:String(bookedTrainTotal())}));
 if(state.notes)localStorage.setItem("endulusNotesV5",JSON.stringify(state.notes));
};
if(localStorage.getItem("endulusFlightBudgetV2")!=="1"){
 const currentFlightTotal=parseFloat(String(state.expenses?.flights||"").replace(",", "."))||0;
 if(state.expenses&&(currentFlightTotal===0||currentFlightTotal===216))state.expenses.flights="336";
 localStorage.setItem("endulusFlightBudgetV2","1");
 localStorage.setItem(KEY,JSON.stringify(state));
}
const money=n=>new Intl.NumberFormat("tr-TR",{style:"currency",currency:"EUR"}).format(Number(n)||0);
const num=v=>parseFloat(String(v||"").replace(",","."))||0;
const stayTotal=()=>Object.values(state.stays).reduce((s,x)=>s+num(x.price),0);
const montpellierStay=()=>num(state.stays?.Montpellier?.price);
const mainRouteStay=()=>Math.max(0,stayTotal()-montpellierStay());
const attractionPlan=()=>D.budget.reduce((s,x)=>s+num(x[1]),0);
const expenseTotal=()=>Object.values(state.expenses).reduce((s,x)=>s+num(x),0);
const grand=()=>mainRouteTotal();
const flightTotal=()=>num(state.expenses?.flights);
const outbound3Flight=()=>Math.min(flightTotal(),216);
const return2Flight=()=>Math.max(0,flightTotal()-outbound3Flight());
const montpellierExtra=()=>num(state.expenses?.montpellier);
const mainRouteExtras=()=>["intercity","local","food","other"].reduce((s,k)=>s+num(state.expenses?.[k]),0);
const isTrainBooking=id=>{
 const b=getBooking(id);if(!b)return false;
 return /(^|\s)(tren|train)(\s|$)/i.test(String(b[1]||""))||/tren|train/i.test(String(id||""));
};
const bookedTrainTotal=()=>Object.keys(state.reservations).reduce((s,id)=>{
 const v=state.reservations[id];
 return s+(isTrainBooking(id)&&v?.status==="booked"?num(v.total):0);
},0);
const bookedTrainRows=()=>Object.keys(state.reservations).filter(id=>isTrainBooking(id)&&state.reservations[id]?.status==="booked").map(id=>{
 const b=getBooking(id),v=state.reservations[id];
 return {name:b?.[1]||id,date:b?.[2]||"",time:v?.time||"",total:num(v?.total)};
});
const mainRouteTotal=()=>mainRouteStay()+bookedActivityTotal()+bookedTrainTotal()+outbound3Flight()+mainRouteExtras();
const montpellierTotal=()=>montpellierStay()+return2Flight()+montpellierExtra();
const mainRoutePP=()=>mainRouteTotal()/3;
const montpellierPP=()=>montpellierTotal()/2;
const getBooking=id=>D.bookings.find(b=>b[0]===id);
function bookingEstimatedTotal(id){
 const b=getBooking(id),v=state.reservations[id];if(!b||!v||v.status!=="booked")return 0;
 return num(v.total)||(b[3]!=null?num(b[3])*3:0);
}
function bookedActivityTotal(){return Object.keys(state.reservations).filter(id=>!isTrainBooking(id)).reduce((s,id)=>s+bookingEstimatedTotal(id),0)}
function escapeHtml(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
let stayCity="Málaga";
function renderStays(){
 const box=document.querySelector("#staygrid");if(!box)return;
 box.className="";
 const cities=D.stays.map(x=>x[0]);
 if(!cities.includes(stayCity))stayCity=cities[0];
 const s=D.stays.find(x=>x[0]===stayCity),b=bookedStayData[stayCity],v=state.stays[stayCity]||stayDefaults[stayCity];
 box.innerHTML='<div class="filters v6staycities">'+cities.map(c=>'<button class="filter '+(c===stayCity?"on":"")+'" data-staycity="'+escapeHtml(c)+'">'+escapeHtml(c)+'</button>').join("")+'</div>'+
 '<article class="v6stay"><div class="v6staytop"><div><div class="ey">'+escapeHtml(s[1])+' · '+s[2]+' gece</div><h3>'+escapeHtml(b.name)+'</h3></div><span class="v6badge booked">✓ Rezerve</span></div>'+
 '<div class="v6summary"><b>'+escapeHtml(stayCity)+'</b><br>'+escapeHtml(b.area)+'<br><b>'+money(v.price||b.price)+'</b> · toplam konaklama</div>'+
 '<div class="actions"><a class="action primary" target="_blank" rel="noopener" href="'+b.url+'">'+escapeHtml(b.provider)+' ↗</a><a class="action" target="_blank" rel="noopener" href="'+maps(b.mapQuery||b.area+" "+stayCity)+'">⌖ Harita</a></div>'+
 '<div class="v5warn" style="margin-top:12px"><b>Rezervasyon:</b> '+escapeHtml(b.note)+'</div>'+
 '<div class="v6fields"><label>Durum<select data-stay="'+escapeHtml(stayCity)+'" data-field="status"><option value="booked" selected>Rezerve</option><option value="todo">Bekliyor</option></select></label><label>Toplam fiyat (€)<input inputmode="decimal" data-stay="'+escapeHtml(stayCity)+'" data-field="price" value="'+escapeHtml(v.price||String(b.price))+'"></label><label class="wide">Konaklama adı<input data-stay="'+escapeHtml(stayCity)+'" data-field="name" value="'+escapeHtml(v.name||b.name)+'"></label><label class="wide">Adres / bölge<input data-stay="'+escapeHtml(stayCity)+'" data-field="area" value="'+escapeHtml(v.area||b.area)+'"></label></div></article>';
 box.querySelectorAll("[data-staycity]").forEach(btn=>btn.onclick=()=>{stayCity=btn.dataset.staycity;renderStays();renderEditBar()});
 box.querySelectorAll("[data-stay]").forEach(el=>el.onchange=()=>{state.stays[el.dataset.stay][el.dataset.field]=el.value;save();renderStays();renderBudget();renderActions();renderEditBar()});
}
function renderBookings(){
 const box=document.querySelector("#books");if(!box)return;
 box.innerHTML=D.bookings.map(b=>{
  const v=state.reservations[b[0]],st=STATUS[v.status]||STATUS.required,link=official[b[1]];
  return '<article class="v6book"><div class="v6bookhead"><div><div class="ey">'+escapeHtml(b[2])+'</div><h3>'+escapeHtml(b[1])+'</h3><div class="v6bookmeta">'+(b[3]!=null?money(b[3])+' pp · 3 kişi plan: '+money(b[3]*3):'Fiyat henüz girilmedi')+(v.time?' · '+escapeHtml(v.time):'')+(v.verified?' · son kontrol '+escapeHtml(v.verified):'')+'</div>'+(link?'<a class="ticketlink" target="_blank" rel="noopener" href="'+link+'">Resmî sayfa ↗</a>':"")+'</div><span class="v6bookstate '+st[1]+'">'+st[0]+'</span></div><div class="v6bookfields"><label>Durum<select data-res="'+b[0]+'" data-field="status">'+Object.entries(STATUS).map(([k,x])=>'<option value="'+k+'" '+(v.status===k?"selected":"")+'>'+x[0]+'</option>').join("")+'</select></label><label>Saat<input data-res="'+b[0]+'" data-field="time" value="'+escapeHtml(v.time)+'" placeholder="örn. 09:30"></label><label>Toplam ödeme (€)<input inputmode="decimal" data-res="'+b[0]+'" data-field="total" value="'+escapeHtml(v.total)+'" placeholder="'+(b[3]!=null?(b[3]*3).toFixed(2):"0")+'"></label><label>Son kontrol<input type="date" data-res="'+b[0]+'" data-field="verified" value="'+escapeHtml(v.verified)+'"></label></div></article>';
 }).join("");
 box.querySelectorAll("[data-res]").forEach(el=>el.onchange=()=>{state.reservations[el.dataset.res][el.dataset.field]=el.value;save();renderBookings();renderBudget();renderActions()});
 const n=Object.values(state.reservations).filter(x=>x.status==="booked").length,p=Math.round(n/D.bookings.length*100);
 const bar=document.querySelector("#prog"),txt=document.querySelector("#progtext");if(bar)bar.style.width=p+"%";if(txt)txt.textContent=n+"/"+D.bookings.length+" booked";
}
function renderBudget(){
 const sec=document.querySelector("#v5realbudget");if(!sec)return;
 const mainLabels={flights:"Uçuşlar · toplam",intercity:"Şehirlerarası ulaşım · diğer / manuel",local:"Yerel ulaşım",food:"Yemek",other:"Diğer"};
 const trainRows=bookedTrainRows();
 const trainBreakdown=trainRows.length?trainRows.map(x=>escapeHtml(x.date+" · "+x.name+(x.time?" · "+x.time:""))+" — <b>"+money(x.total)+"</b>").join("<br>"):"Henüz BOOKED tren bileti yok.";
 sec.innerHTML='<div class="head"><div><div class="ey">KARIŞIK GRUP · AYRI HESAP</div><h2>Trip budget</h2></div><span class="pill">otomatik</span></div>'+
 '<section class="v6budgetgroup v6budgetgroup-main">'+
   '<div class="v6budgetgrouphead"><div><div class="ey">🇪🇸 ANA ROTA · 3 KİŞİ</div><h3>İspanya ana bütçesi</h3></div><span class="v6budgettag">Montpellier hariç</span></div>'+
   '<div class="v6budgethero"><strong>'+money(mainRouteTotal())+'</strong><span>ana rota toplamı</span><small>'+money(mainRoutePP())+' / kişi</small></div>'+
   '<div class="v6budgetcards">'+
     '<div class="v6bcard"><b>'+money(mainRouteStay())+'</b><small>ana rota konaklama</small></div>'+
     '<div class="v6bcard"><b>'+money(bookedActivityTotal())+'</b><small>rezerve müze / biletler</small><div class="v6auto">yalnız BOOKED</div></div>'+
     '<div class="v6bcard"><b>'+money(bookedTrainTotal())+'</b><small>rezerve trenler</small><div class="v6auto">BOOKED + toplam ödeme</div></div>'+
     '<div class="v6bcard"><b>'+money(outbound3Flight())+'</b><small>3 kişilik gidiş uçuşları</small><div class="v6auto">STR → TLS → AGP</div></div>'+
   '</div>'+
   '<div class="v5warn"><b>✈️ Gidiş uçuşları · 3 kişi:</b><br>Strasbourg → Toulouse: <b>€111</b><br>Toulouse → Málaga: <b>€105</b><br><b>Gidiş uçuşları toplamı: '+money(outbound3Flight())+'</b>.</div>'+
   '<div class="v5warn"><b>🚆 Rezerve trenler · otomatik bütçe:</b><br>'+trainBreakdown+'<br><b>Toplam: '+money(bookedTrainTotal())+'</b>. Bir tren BOOKED yapılıp “Toplam ödeme” girildiğinde bu tutar otomatik olarak ana bütçeye eklenir.</div>'+
   '<div class="v5warn"><b>🇪🇸 Ana rota hesabı:</b><br>Konaklama + BOOKED müze/biletler + BOOKED trenler + 3 kişilik gidiş uçuşları + şehirlerarası/yerel ulaşım + yemek + diğer harcamalar. <b>Montpellier ve 2 kişilik dönüş uçuşları bu toplama dahil değildir.</b></div>'+
   '<div class="v5budget v6expense">'+Object.keys(mainLabels).map(k=>'<label><span>'+mainLabels[k]+'</span><input inputmode="decimal" data-exp="'+k+'" value="'+escapeHtml(state.expenses[k])+'" placeholder="€"></label>').join("")+'</div>'+
 '</section>'+
 '<div class="v6budgetseparator"><span>AYRI HESAP</span></div>'+
 '<section class="v6budgetgroup v6budgetgroup-mpl">'+
   '<div class="v6budgetgrouphead"><div><div class="ey">🇫🇷 MONTPELLIER + DÖNÜŞ · 2 KİŞİ</div><h3>Montpellier bütçesi</h3></div><span class="v6budgettag v6budgettag-mpl">Ana toplama dahil değil</span></div>'+
   '<div class="v6budgethero v6budgethero-mpl"><strong>'+money(montpellierTotal())+'</strong><span>Montpellier + dönüş toplamı</span><small>'+money(montpellierPP())+' / kişi</small></div>'+
   '<div class="v6budgetcards v6budgetcards-mpl">'+
     '<div class="v6bcard"><b>'+money(montpellierStay())+'</b><small>Campanile PRIME</small><div class="v6auto">1–3 Ocak · 2 kişi</div></div>'+
     '<div class="v6bcard"><b>'+money(return2Flight())+'</b><small>2 kişilik dönüş uçuşları</small><div class="v6auto">MAD → MPL → SXB</div></div>'+
     '<div class="v6bcard"><b>'+money(montpellierExtra())+'</b><small>Montpellier ek harcama</small><div class="v6auto">şehir içi / yemek / diğer</div></div>'+
   '</div>'+
   '<div class="v6mplbreakdown"><div><span>Madrid → Montpellier</span><b>€54</b></div><div><span>Montpellier → Strasbourg</span><b>€66</b></div><div class="total"><span>Dönüş uçuşları toplamı</span><b>'+money(return2Flight())+'</b></div></div>'+
   '<div class="v5budget v6expense v6mplexpense"><label><span>Montpellier · ek harcama</span><input inputmode="decimal" data-exp="montpellier" value="'+escapeHtml(state.expenses.montpellier)+'" placeholder="€"></label></div>'+
 '</section>';
 sec.querySelectorAll("[data-exp]").forEach(el=>el.oninput=()=>{state.expenses[el.dataset.exp]=el.value;save();renderBudget()});
}
function renderActions(){
 const box=document.querySelector("#v6actions");if(!box)return;
 const required=D.bookings.filter(b=>state.reservations[b[0]].status!=="booked");
 const missingStays=D.stays.filter(s=>state.stays[s[0]].status!=="booked").length;
 let html="";
 if(required.length){const b=required[0],st=STATUS[state.reservations[b[0]].status]||STATUS.required;html+='<div class="v6action"><b>🔴 '+escapeHtml(b[1])+'</b><span>'+escapeHtml(b[2])+' · '+st[0]+'</span></div>'}
 if(required.length>1){const b=required[1];html+='<div class="v6action"><b>🟠 Sonra: '+escapeHtml(b[1])+'</b><span>'+escapeHtml(b[2])+'</span></div>'}
 if(missingStays)html+='<div class="v6action"><b>🏨 '+missingStays+' konaklama bekliyor</b><span>Konaklama sekmesinde seçtikçe Booked yap.</span></div>';
 if(!required.length&&!missingStays)html='<div class="v6action v6done"><b>✓ Ana rezervasyonlar tamam</b><span>Yalnız tarih yaklaşınca tatil saatlerini tekrar doğrula.</span></div>';
 box.innerHTML=html;
}
function renderEditBar(){
 ["stays","book","v5realbudget"].forEach(id=>{const s=document.getElementById(id);if(!s)return;let old=s.querySelector(".v6bar");if(old)old.remove();let bar=document.createElement("div");bar.className="v6bar";bar.innerHTML='<b>'+(edit?"✎ Edit Mode açık":"Görüntüleme modu")+'</b><span>'+(edit?"Değişiklikler otomatik kaydedilir.":"Sağ üstteki ✎ Düzenle ile alanları aç.")+'</span>';s.insertBefore(bar,s.firstChild.nextSibling)});
}
const btn=document.getElementById("editToggle");
function setEdit(v){edit=v;document.body.classList.toggle("edit-on",edit);btn?.classList.toggle("on",edit);if(btn){btn.querySelector(".edit-label").textContent=edit?"Bitti":"Düzenle";btn.setAttribute("aria-label",edit?"Düzenlemeyi bitir":"Düzenleme modunu aç")}renderEditBar()}
if(btn)btn.onclick=()=>setEdit(!edit);
renderStays();renderBookings();renderBudget();renderActions();setEdit(false);
const mapNav=document.querySelector('.tabs button[data-v="v5mapview"]');if(mapNav)mapNav.addEventListener("click",()=>{const q=document.querySelector('[data-v5go="v5mapview"]');if(q)setTimeout(()=>q.click(),0)});

// Keep notes in the central state as they change.
document.querySelectorAll("#v5noteslist textarea").forEach(t=>t.addEventListener("input",()=>{state.notes=state.notes||{};state.notes[t.dataset.d]=t.value;save()}));
// Replace export/import with v6 single-state backup.
const ex=document.getElementById("v5export");if(ex)ex.onclick=()=>{save();const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:"application/json"}));a.download="endulus-roadbook-v6-backup.json";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)};
const im=document.getElementById("v5import");if(im)im.onchange=e=>{const file=e.target.files[0];if(!file)return;const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);if(!d||Number(d.version)<6)throw new Error();localStorage.setItem(KEY,JSON.stringify(d));location.reload()}catch(_){alert("Bu dosya v6 Roadbook yedeği değil.")}};r.readAsText(file)};
const reset=document.getElementById("v5reset");if(reset)reset.onclick=()=>{if(confirm("Bu cihazdaki v6 rezervasyon, konaklama, bütçe ve not verileri sıfırlansın mı?")){[KEY,"endulusChecks","endulusBudgetV5","endulusNotesV5"].forEach(k=>localStorage.removeItem(k));location.reload()}};

/* v6.1 Daily Travel Mode */
const TRIP_DATES=["2026-12-22","2026-12-23","2026-12-24","2026-12-25","2026-12-26","2026-12-27","2026-12-28","2026-12-29","2026-12-30","2026-12-31","2027-01-01","2027-01-02","2027-01-03"];
const DAY_HOTEL_CITY={1:"Toulouse",2:"Málaga",3:"Málaga",4:"Granada",5:"Granada",6:"Córdoba",7:"Córdoba",8:"Sevilla",9:"Sevilla",10:"Madrid",11:"Montpellier",12:"Montpellier",13:"Montpellier"};
const DAY_ROUTES={
  1:["Toulouse-Blagnac Airport","Toulouse-Blagnac Airport hotels"],
  2:["Alcazaba Malaga","Muelle Uno Malaga",["Teatro Romano Malaga","Catedral de Malaga","Soho Malaga"]],
  3:["Puente Nuevo Ronda","Baños Arabes Ronda",["Old Town Ronda"]],
  4:["Carrera del Darro Granada","Sacromonte Granada",["Albaicin Granada","Mirador San Nicolas Granada"]],
  5:["Alhambra Granada","Realejo Granada",["Generalife Granada"]],
  6:["Medina Azahara Cordoba","Puente Romano Cordoba",["Judería Cordoba"]],
  7:["Mezquita Catedral Cordoba","Puente Romano Cordoba",["Torre Campanario Cordoba","Judería Cordoba"]],
  8:["Plaza de España Sevilla","Triana Sevilla",["Parque Maria Luisa Sevilla","Torre del Oro Sevilla"]],
  9:["Real Alcazar Sevilla","Las Setas Sevilla",["Catedral Sevilla","Santa Cruz Sevilla"]],
  10:["Puerta del Sol Madrid","Retiro Madrid",["Plaza Mayor Madrid","Barrio de las Letras Madrid","Paseo del Prado Madrid","Cibeles Madrid"]],
  11:["Gran Via Madrid","Madrid Barajas Airport",["Callao Madrid","La Latina Madrid","Lavapies Madrid"]],
  12:["Campanile PRIME Montpellier Centre St Roch","Campanile PRIME Montpellier Centre St Roch",["Place de la Comedie Montpellier","Esplanade Charles de Gaulle Montpellier","Musee Fabre Montpellier","Place Jean Jaures Montpellier","Cathedrale Saint Pierre Montpellier","Jardin des Plantes Montpellier","Arc de Triomphe Montpellier","Promenade du Peyrou Montpellier","Aqueduc Saint Clement Montpellier"]],
  13:["Campanile PRIME Montpellier Centre St Roch","Place de l Europe Montpellier",["Gare Saint Roch Montpellier"]]
};
const DAY_FOOD={
  2:[["Mesón Mariano","Chivo malagueño · alcachofas · balık"],["La Plancha Taberna","Izgara · tapas · İspanyol mutfağı"],["El Gastronauta","Tapas · Akdeniz · çağdaş İspanyol"],["Next Level Specialty Coffee","Kahvaltı · specialty coffee"]],
  3:[["El Lechuguita","Geleneksel küçük tapas"],["Casa María","Ev yapımı İspanyol · balık · et"],["Restaurante Tropicana","Çağdaş İspanyol · Akdeniz"],["Cafetería Churrería Alba","Kahvaltı · churros · café con leche"],["La Telera 1860","Setenil opsiyonel · yerel ürünler"]],
  4:[["Rosario Varela","Realejo · gastrobar"],["Bar FM","Balık · deniz ürünleri"],["Bar Oliver","Deniz ürünü · geleneksel tapas"],["Despiertoo Specialty Coffee","Kahvaltı · specialty coffee"]],
  5:[["Bar Ávila","Jamón asado · tapas"],["Rosario Varela","Realejo · gastrobar"],["Alhambra Churrería","Churros con chocolate"],["Despiertoo Specialty Coffee","Kahvaltı · specialty coffee"]],
  6:[["Taberna San Cristóbal","Salmorejo · berenjenas"],["Taberna Góngora","Geleneksel Córdoba mutfağı"],["Sociedad Plateros María Auxiliadora","Geleneksel · Montilla-Moriles"],["The Coffee Club","Kahvaltı · specialty coffee"]],
  7:[["Taberna Salinas","Salmorejo · flamenquín · rabo de toro"],["The Coffee Club","Kahvaltı · specialty coffee"],["Taberna San Cristóbal","Córdoba · geleneksel"],["Taberna Góngora","Córdoba · geleneksel"]],
  8:[["Las Golondrinas","Triana · solomillo · chipirones"],["Blanca Paloma","Triana · balık/deniz ürünü · tapas"],["Paradas 7","Kahvaltı · specialty coffee"]],
  9:[["Casa Moreno","Pringá · mojama · vermut/sherry"],["Blanca Paloma","Triana · deniz ürünü · tapas"],["Paradas 7","Kahvaltı · specialty coffee"]],
  10:[["La Sanabresa","Old-school local öğle yemeği"],["Casa Dani","Tortilla de patatas · menú del día"],["Bodega de la Ardosa","Tortilla · vermut · kroket"],["HanSo Café","Kahvaltı · specialty coffee"]],
  11:[["HanSo Café","Kahvaltı · specialty coffee"],["Bodega de la Ardosa","Tortilla · vermut · kroket"],["Bodegas Alfaro","Lavapiés · vermut/tapas"]],
  12:[["Campanile kahvaltısı","Rezervasyona dahil · güne otelde başla"],["Bonobo","İstersen sonradan kahve/brunch alternatifi"],["Ripailles","Öğle/akşam · Fransız bistro"],["Bistrot Sainte Anne","Écusson · bistro"]],
  13:[["Campanile kahvaltısı","Rezervasyona dahil · check-out öncesi"],["Bonobo","Yalnız ekstra kahve istersen"]]
};
const travelKey="endulusTravelV61";let travelDone={};try{travelDone=JSON.parse(localStorage.getItem(travelKey)||"{}")}catch(e){}
const travelDir=r=>"https://www.google.com/maps/dir/?api=1&travelmode=walking&origin="+encodeURIComponent(r[0])+"&destination="+encodeURIComponent(r[1])+(r[2]?.length?"&waypoints="+encodeURIComponent(r[2].join("|")):"");
const travelSearch=q=>"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(q);
const daySelect=document.getElementById("v61dayselect"),dayHero=document.getElementById("v61dayhero"),dayTimeline=document.getElementById("v61timeline"),dayActions=document.getElementById("v61travelactions");
let activeDay=0;
function localISO(){const d=new Date(),off=d.getTimezoneOffset();return new Date(d.getTime()-off*60000).toISOString().slice(0,10)}
function defaultDay(){const iso=localISO(),n=TRIP_DATES.indexOf(iso);return n>=0?n:(iso<TRIP_DATES[0]?0:TRIP_DATES.length-1)}
function renderTravel(){
 if(!daySelect||!dayHero||!dayTimeline)return;
 const d=D.days[activeDay],items=d[4],done=travelDone[d[0]]||{},count=items.filter((_,i)=>done[i]).length,p=Math.round(count/items.length*100);
 daySelect.value=String(activeDay);
 dayHero.innerHTML='<div class="ey">GÜN '+d[0]+' · '+d[1]+'</div><h3>'+escapeHtml(d[2])+'</h3><p>'+escapeHtml(d[3])+' · '+count+'/'+items.length+' tamamlandı</p><div class="v61progress"><i style="width:'+p+'%"></i></div>';
 const hotelCity=DAY_HOTEL_CITY[d[0]],hotel=D.hotels?.[hotelCity],hotelCard=hotel?'<article class="v61item"><div class="tm">🏨</div><div></div><div><h4>Konaklama · '+escapeHtml(hotel.name)+'</h4><p>'+escapeHtml(hotel.location)+(d[0]===11?' · Bu gecenin oteli; gün Madrid’de başlıyor.':'')+'</p><a class="ticketlink" target="_blank" rel="noopener" href="'+travelSearch(hotel.map)+'">⌖ Oteli haritada aç ↗</a></div></article>':"";
 dayTimeline.innerHTML=hotelCard+items.map((x,i)=>'<article class="v61item '+(done[i]?"done":"")+'"><div class="tm">'+escapeHtml(x[0])+'</div><button class="v61check" data-ti="'+i+'" aria-label="'+(done[i]?"Tamamlanmadı olarak işaretle":"Tamamlandı olarak işaretle")+'">'+(done[i]?"✓":"")+'</button><div><h4>'+(x[6]?'<a class="ticketlink" target="_blank" rel="noopener" href="'+x[6]+'">'+escapeHtml(x[1])+' ↗</a>':escapeHtml(x[1]))+'</h4><p>'+escapeHtml(x[2])+'</p>'+sevillaStory(d[0],x[1])+'</div></article>').join("")+(DAY_FOOD[d[0]]?'<article class="v61item"><div class="tm">🍴</div><div></div><div><h4>Rota üzerindeki yemek alternatifleri</h4><p>'+DAY_FOOD[d[0]].map(x=>'<a target="_blank" rel="noopener" href="'+travelSearch(x[0]+" "+d[2].split(" → ").pop())+'"><b>'+escapeHtml(x[0])+'</b></a> · '+escapeHtml(x[1])).join("<br>")+'</p></div></article>':"");
 dayTimeline.querySelectorAll("[data-ti]").forEach(b=>b.onclick=()=>{travelDone[d[0]]=travelDone[d[0]]||{};travelDone[d[0]][b.dataset.ti]=!travelDone[d[0]][b.dataset.ti];localStorage.setItem(travelKey,JSON.stringify(travelDone));renderTravel()});
 const route=DAY_ROUTES[d[0]],city=d[2].split(" → ")[0];
 dayActions.innerHTML=(route?'<a class="primary" target="_blank" rel="noopener" href="'+travelDir(route)+'">🚶 Günlük rotayı aç</a>':"")+'<a target="_blank" rel="noopener" href="'+travelSearch(city)+'">⌖ '+escapeHtml(city)+' haritası</a>';
 document.getElementById("v61prev").disabled=activeDay===0;document.getElementById("v61next").disabled=activeDay===D.days.length-1;
}
if(daySelect){
 daySelect.innerHTML=D.days.map((d,i)=>'<option value="'+i+'">Gün '+d[0]+' · '+escapeHtml(d[2])+'</option>').join("");
 activeDay=defaultDay();daySelect.onchange=()=>{activeDay=+daySelect.value;renderTravel()};
 document.getElementById("v61prev").onclick=()=>{if(activeDay>0){activeDay--;renderTravel()}};
 document.getElementById("v61next").onclick=()=>{if(activeDay<D.days.length-1){activeDay++;renderTravel()}};
 renderTravel();
}
function onlineState(){
 const on=navigator.onLine,label=on?"● Online":"● Offline";
 ["v61online"].forEach(id=>{const el=document.getElementById(id);if(el){el.textContent=label;el.classList.toggle("v61online",on);el.classList.toggle("v61offline",!on)}});
}
window.addEventListener("online",onlineState);window.addEventListener("offline",onlineState);onlineState();
if(window.matchMedia("(display-mode: standalone)").matches||navigator.standalone===true)document.body.classList.add("pwa-standalone");
const deepLink={travel:"v61travel",book:"book",map:"v5mapview"}[location.hash.replace("#","")];if(deepLink){const b=document.querySelector('.tabs button[data-v="'+deepLink+'"]');if(b)setTimeout(()=>b.click(),50)}

save();
window.ENDULUS_APP_READY=true;
})();
