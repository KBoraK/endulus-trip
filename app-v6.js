(()=>{
"use strict";
window.ENDULUS_APP_BUILD="6.2.62";
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
Object.assign(reservationDefaults,{"train-cordoba-sevilla":{status:"booked",time:"08:12–09:05",total:"45",verified:"2026-10-29"}});
Object.assign(reservationDefaults,{"alcazar":{status:"booked",time:"10:00",total:"46.50",verified:"2026-11-09"}});
const alsaDefaults={
 "bus-malaga-granada":{status:"booked",time:"09:25–11:00",total:"42.36",verified:"2026-10-29"},
 "bus-granada-cordoba":{status:"booked",time:"08:30–11:15",total:"54.99",verified:"2026-10-29"}
};
Object.assign(reservationDefaults,alsaDefaults);
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
// Apply newly confirmed Alcázar booking once, also for visitors with older saved state.
if(localStorage.getItem("endulusAlcazarBooked20261230V1")!=="1"){
 if(state.reservations?.alcazar) Object.assign(state.reservations.alcazar,{status:"booked",time:"10:00",total:"46.50",verified:"2026-11-09"});
 localStorage.setItem("endulusAlcazarBooked20261230V1","1");
 localStorage.setItem(KEY,JSON.stringify(state));
}

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
if(localStorage.getItem("endulusCordobaSevillaBookedV1")!=="1"){
 Object.assign(state.reservations["train-cordoba-sevilla"],reservationDefaults["train-cordoba-sevilla"]);
 localStorage.setItem("endulusCordobaSevillaBookedV1","1");
 localStorage.setItem(KEY,JSON.stringify(state));
}
if(localStorage.getItem("endulusAlsaBookedV1")!=="1"){
 Object.entries(alsaDefaults).forEach(([id,v])=>{const existing=state.reservations[id]?.total;state.reservations[id]={...v,total:existing||""}});
 localStorage.setItem("endulusAlsaBookedV1","1");
 localStorage.setItem(KEY,JSON.stringify(state));
}
if(localStorage.getItem("endulusAlsaPaidV1")!=="1"){
 Object.entries(alsaDefaults).forEach(([id,v])=>{state.reservations[id]={...state.reservations[id],...v}});
 localStorage.setItem("endulusAlsaPaidV1","1");
 localStorage.setItem(KEY,JSON.stringify(state));
}
const save=()=>{
 localStorage.setItem(KEY,JSON.stringify(state));
 const checks={};Object.entries(state.reservations).forEach(([k,v])=>checks[k]=v.status==="booked");localStorage.setItem("endulusChecks",JSON.stringify(checks));
 localStorage.setItem("endulusBudgetV5",JSON.stringify({...state.expenses,stays:stayTotal(),attractions:String(bookedActivityTotal()),trains:String(bookedTransportTotal())}));
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
const isTransportBooking=id=>{
 const b=getBooking(id);if(!b)return false;
 return /^(bus-|train)/i.test(id)||/(tren|otobüs)/i.test(String(b[1]||""));
};
const bookedTransportTotal=()=>Object.keys(state.reservations).reduce((s,id)=>{
 const v=state.reservations[id];
 return s+(isTransportBooking(id)&&v?.status==="booked"?num(v.total):0);
},0);
const bookedTransportRows=()=>Object.keys(state.reservations).filter(id=>isTransportBooking(id)&&state.reservations[id]?.status==="booked").map(id=>{
 const b=getBooking(id),v=state.reservations[id];
 return {name:b?.[1]||id,date:b?.[2]||"",time:v?.time||"",total:String(v?.total??"").trim()?num(v.total):null};
});
const mainRouteTotal=()=>mainRouteStay()+bookedActivityTotal()+bookedTransportTotal()+outbound3Flight()+mainRouteExtras();
const montpellierTotal=()=>montpellierStay()+return2Flight()+montpellierExtra();
const mainRoutePP=()=>mainRouteTotal()/3;
const montpellierPP=()=>montpellierTotal()/2;
const getBooking=id=>D.bookings.find(b=>b[0]===id);
function bookingEstimatedTotal(id){
 const b=getBooking(id),v=state.reservations[id];if(!b||!v||v.status!=="booked")return 0;
 return num(v.total)||(b[3]!=null?num(b[3])*3:0);
}
function bookedActivityTotal(){return Object.keys(state.reservations).filter(id=>!isTransportBooking(id)).reduce((s,id)=>s+bookingEstimatedTotal(id),0)}
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
 const trainRows=bookedTransportRows();
 const trainBreakdown=trainRows.length?trainRows.map(x=>escapeHtml(x.date+" · "+x.name+(x.time?" · "+x.time:""))+" — <b>"+(x.total===null?"Tutar bekleniyor · toplama dahil değil":money(x.total))+"</b>").join("<br>"):"Henüz BOOKED şehirlerarası bilet yok.";
 sec.innerHTML='<div class="head"><div><div class="ey">KARIŞIK GRUP · AYRI HESAP</div><h2>Trip budget</h2></div><span class="pill">otomatik</span></div>'+
 '<section class="v6budgetgroup v6budgetgroup-main">'+
   '<div class="v6budgetgrouphead"><div><div class="ey">🇪🇸 ANA ROTA · 3 KİŞİ</div><h3>İspanya ana bütçesi</h3></div><span class="v6budgettag">Montpellier hariç</span></div>'+
   '<div class="v6budgethero"><strong>'+money(mainRouteTotal())+'</strong><span>bilinen ödemeler toplamı</span><small>'+money(mainRoutePP())+' / kişi</small></div>'+
   '<div class="v6budgetcards">'+
     '<div class="v6bcard"><b>'+money(mainRouteStay())+'</b><small>ana rota konaklama</small></div>'+
     '<div class="v6bcard"><b>'+money(bookedActivityTotal())+'</b><small>rezerve müze / biletler</small><div class="v6auto">yalnız BOOKED</div></div>'+
     '<div class="v6bcard"><b>'+money(bookedTransportTotal())+'</b><small>rezerve tren + otobüs</small><div class="v6auto">BOOKED + toplam ödeme</div></div>'+
     '<div class="v6bcard"><b>'+money(outbound3Flight())+'</b><small>3 kişilik gidiş uçuşları</small><div class="v6auto">STR → TLS → AGP</div></div>'+
   '</div>'+
   '<div class="v5warn"><b>✈️ Gidiş uçuşları · 3 kişi:</b><br>Strasbourg → Toulouse: <b>€111</b><br>Toulouse → Málaga: <b>€105</b><br><b>Gidiş uçuşları toplamı: '+money(outbound3Flight())+'</b>.</div>'+
   '<div class="v5warn"><b>🚆 Rezerve tren + otobüs · otomatik bütçe:</b><br>'+trainBreakdown+'<br><b>Toplam: '+money(bookedTransportTotal())+'</b>. Bir tren/otobüs BOOKED yapılıp “Toplam ödeme” girildiğinde bu tutar otomatik olarak ana bütçeye eklenir. Tutarı beklenen biletler yukarıda ayrıca işaretlenir ve ödenen toplam girilene kadar hesaba katılmaz.</div>'+
   '<div class="v5warn"><b>🇪🇸 Ana rota hesabı:</b><br>Konaklama + BOOKED müze/biletler + BOOKED tren/otobüsler + 3 kişilik gidiş uçuşları + şehirlerarası/yerel ulaşım + yemek + diğer harcamalar. <b>Montpellier ve 2 kişilik dönüş uçuşları bu toplama dahil değildir.</b></div>'+
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

// Replace export/import with v6 single-state backup.
const ex=document.getElementById("v5export");if(ex)ex.onclick=()=>{save();const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:"application/json"}));a.download="endulus-roadbook-v6-backup.json";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)};
const im=document.getElementById("v5import");if(im)im.onchange=e=>{const file=e.target.files[0];if(!file)return;const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);if(!d||Number(d.version)<6)throw new Error();localStorage.setItem(KEY,JSON.stringify(d));location.reload()}catch(_){alert("Bu dosya v6 Roadbook yedeği değil.")}};r.readAsText(file)};
const reset=document.getElementById("v5reset");if(reset)reset.onclick=()=>{if(confirm("Bu cihazdaki v6 rezervasyon, konaklama, bütçe ve not verileri sıfırlansın mı?")){[KEY,"endulusChecks","endulusBudgetV5","endulusNotesV5"].forEach(k=>localStorage.removeItem(k));location.reload()}};

/* v6.1 Daily Travel Mode */
const TRIP_DATES=["2026-12-22","2026-12-23","2026-12-24","2026-12-25","2026-12-26","2026-12-27","2026-12-28","2026-12-29","2026-12-30","2026-12-31","2027-01-01","2027-01-02","2027-01-03"];
/* Daily routes. Each walking link starts at the booked address for that part of the day. */
const DAY_HOTELS=[
 null,"Toulouse","Málaga","Málaga","Granada","Granada","Córdoba","Córdoba",
 "Sevilla","Sevilla","Madrid","Montpellier","Montpellier","Montpellier"
];
const DAY_WALKS={
 2:["Málaga","Alcazaba → Picasso → liman","Muelle Uno Málaga",["Alcazaba Málaga","Museo Picasso Málaga","Catedral de Málaga"]],
 4:["Granada","Darro → San Nicolás","Mirador de San Nicolás Granada",["Carrera del Darro Granada","Paseo de los Tristes Granada"]],
 5:["Granada","Alhambra girişi","Alhambra Generalife ticket office Granada",["Plaza Nueva Granada"]],
 6:["Córdoba","Judería → Roma Köprüsü","Puente Romano Córdoba",["Puerta de Almodóvar Córdoba","Calle Judíos Córdoba"]],
 7:["Córdoba","Mezquita → Judería","Calle Judíos Córdoba",["Mezquita-Catedral Córdoba","Puente Romano Córdoba"]],
 8:["Sevilla","Plaza de España → María Luisa","Parque de María Luisa Sevilla",["Plaza de España Sevilla"]],
 9:["Sevilla","Alcázar → Santa Cruz → Las Setas","Setas de Sevilla",["Puerta del León Sevilla","Puerta del Lagarto Catedral Sevilla","Jardines de Murillo Sevilla"]],
 10:["Madrid","Prado → Plaza Mayor","Plaza Mayor Madrid",["Museo del Prado Madrid","Plaza de Santa Ana Madrid","Puerta del Sol Madrid"]],
 11:["Madrid","Callao → La Latina","Plaza de la Cebada Madrid",["Plaza del Callao Madrid","Plaza de Oriente Madrid"]],
 12:["Montpellier","Comédie → Fabre → Peyrou","Promenade du Peyrou Montpellier",["Place de la Comédie Montpellier","Musée Fabre Montpellier","Cathédrale Saint-Pierre Montpellier"]],
 13:["Montpellier","Comédie (vakit varsa)","Place de la Comédie Montpellier"]
};
const stayMap=city=>D.hotels[city].map;
const DAY_TRANSFERS={
 1:[["Toulouse havalimanı → otel","Toulouse-Blagnac Airport",stayMap("Toulouse"),"driving"]],
 2:[
  ["Toulouse oteli → havalimanı",stayMap("Toulouse"),"Toulouse-Blagnac Airport","driving"],
  ["Málaga havalimanı → konaklama","Málaga Airport",stayMap("Málaga"),"transit"]
 ],
 3:[
  ["Málaga konaklama → otogar",stayMap("Málaga"),"Estación de Autobuses de Málaga","walking"],
  ["Ronda otogarı → eski şehir","Estación de Autobuses de Ronda","Baños Árabes Ronda","walking",["Alameda del Tajo Ronda","Puente Nuevo Ronda","Puente Viejo Ronda"]]
 ],
 4:[
  ["Málaga konaklama → otogar",stayMap("Málaga"),"Estación de Autobuses de Málaga","walking"],
  ["Granada otogarı → konaklama","Granada Estación de Autobuses",stayMap("Granada"),"transit"]
 ],
 5:[["Alhambra → Realejo","Puerta de la Justicia Alhambra Granada","Campo del Príncipe Granada","walking"]],
 6:[
  ["Granada konaklama → otogar",stayMap("Granada"),"Granada Estación de Autobuses","driving"],
  ["Córdoba otogarı → konaklama","Estación de Autobuses de Córdoba",stayMap("Córdoba"),"walking"],
  ["Córdoba otogarı → Medina ziyaretçi merkezi","Estación de Autobuses de Córdoba","Centro de Visitantes Medina Azahara Córdoba","driving"]
 ],
 8:[
  ["Córdoba konaklama → istasyon",stayMap("Córdoba"),"Estación Córdoba Julio Anguita","walking"],
  ["Santa Justa → Sevilla Airbnb","Sevilla Santa Justa",stayMap("Sevilla"),"walking"],
  ["Airbnb → Triana → Torre del Oro",stayMap("Sevilla"),"Torre del Oro Sevilla","walking",["Mercado de Triana Sevilla","Puente de Isabel II Sevilla","Plaza de Toros de la Maestranza Sevilla"]]
 ],
 10:[
  ["Sevilla Airbnb → Santa Justa",stayMap("Sevilla"),"Sevilla Santa Justa","driving"],
  ["Atocha → Madrid konaklama","Madrid Puerta de Atocha",stayMap("Madrid"),"transit"]
 ],
 11:[
  ["Madrid konaklama → Barajas",stayMap("Madrid"),"Aeropuerto Adolfo Suárez Madrid-Barajas","transit"],
  ["Montpellier havalimanı → otel (taksi)","Aéroport Montpellier Méditerranée",stayMap("Montpellier"),"driving"]
 ],
 12:[["Saint-Pierre → botanik bahçesi → Peyrou","Cathédrale Saint-Pierre Montpellier","Promenade du Peyrou Montpellier","walking",["Jardin des Plantes Montpellier"]]],
 13:[
  ["Montpellier oteli → 620 durağı",stayMap("Montpellier"),"Place de l'Europe Montpellier","transit"],
  ["Montpellier oteli → havalimanı (taksi)",stayMap("Montpellier"),"Aéroport Montpellier Méditerranée","driving"]
 ]
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
const travelKey="endulusTravelV61";
let travelDone={};
try{travelDone=JSON.parse(localStorage.getItem(travelKey)||"{}")||{}}catch(e){}
// The service worker can load this script alongside an older cached itinerary.
D.days.forEach(day=>day[4].forEach((item,index)=>{item[7]??={id:index}}));

const externalLink=(url,label,classes="ticketlink")=>
  '<a class="'+classes+'" href="'+escapeHtml(url)+'" target="_blank" rel="noopener">'+escapeHtml(label)+' ↗</a>';

function travelDir(origin,destination,mode,waypoints){
 const params=new URLSearchParams({api:"1",origin,destination,travelmode:mode});
 if(waypoints?.length)params.set("waypoints",waypoints.join("|"));
 return "https://www.google.com/maps/dir/?"+params;
}

function dayRoutes(day){
 const walk=DAY_WALKS[day];
 const primary=walk?externalLink(travelDir(stayMap(walk[0]),walk[2],"walking",walk[3]),"Yürü · "+walk[1],"primary"):"";
 const transfers=(DAY_TRANSFERS[day]||[]).map(([label,from,to,mode,via])=>
  externalLink(travelDir(from,to,mode,via),label,""));
 return '<div class="v61travelactions">'+primary+transfers.join("")+'</div>';
}

function dayLodging(day){
 const hotel=D.hotels[DAY_HOTELS[day]];
 const label=day===3?"Ronda çıkış noktası":day===11?"Gece varışındaki konaklama":"Konaklama";
 return '<div class="day-lodging"><strong>'+label+'</strong><span>'+escapeHtml(hotel.location)+'</span>'+
  externalLink(maps(hotel.map),hotel.name)+'</div>';
}

function itemDetails(day,item){
 const options=item[7];
 const name=(options.storyName||item[1]).replace(/ · BOOKED$/,"");
 const videoName=day===6&&name==="Judería + Puente Romano"?"Judería düşünce & tarih yürüyüşü":name;
 const legacy=sevillaStory(day,name)+sevillaVideoFood(day,name)+tourVideoNotes(day,videoName);
 const detail=options.detail?'<p>'+escapeHtml(options.detail)+'</p>':"";
 const story=options.story?'<p>'+escapeHtml(options.story)+'</p>':"";
 const references=(options.references||[]).map(([label,url])=>externalLink(url,label));
 if(options.source&&options.source!==item[6])references.unshift(externalLink(options.source,"Resmî kaynak"));
 if(!legacy&&!detail&&!story&&!references.length)return "";
 return '<details class="item-details"><summary>Detaylar ve notlar</summary><div class="detail-content">'+
  detail+story+legacy+(references.length?'<div class="item-links">'+references.join("")+'</div>':"")+'</div></details>';
}

function renderDayItem(day,item,done,isTravel){
 const [time,fullName,brief,tag,price,,link,options]=item;
 const name=fullName.replace(/ · BOOKED$/,"");
 const mapLink=options.map?externalLink(maps(options.map),"Harita"):"";
 const officialLink=link?externalLink(link,tag==="Tur alternatifi"?"Tur bağlantısı":"Ziyaret bağlantısı"):"";
 const meta=[tag.includes("BOOKED")?"Rezerveli":"",price!=null?money(price)+" / kişi":""].filter(Boolean);
 const details=itemDetails(day,item);
 const links=mapLink||officialLink?'<div class="item-links">'+mapLink+officialLink+'</div>':"";
 const badge=meta.length?'<div class="item-meta">'+escapeHtml(meta.join(" · "))+'</div>':"";
 const body='<div class="item-body"><h4>'+escapeHtml(name)+'</h4><p class="note">'+escapeHtml(brief)+'</p>'+badge+links+details+'</div>';
 const isDone=Boolean(done?.[options.id]);
 const check=isTravel?'<button type="button" class="v61check" data-ti="'+escapeHtml(options.id)+
  '" aria-label="'+escapeHtml(name)+' tamamlandı" aria-pressed="'+isDone+'">'+(isDone?"✓":"")+'</button>':"";
 return '<article class="agenda-item'+(isTravel?' v61item'+(isDone?' done':''):'')+'"><div class="time">'+
  escapeHtml(time)+'</div>'+check+body+'</article>';
}

function renderAgenda(day,done){
 const isTravel=done!==undefined;
 const items=day[4];
 const main=items.filter(x=>!x[7].optional);
 const optional=items.filter(x=>x[7].optional);
 const renderItems=rows=>rows.map(item=>renderDayItem(day[0],item,done,isTravel)).join("");
 const food=DAY_FOOD[day[0]];
 const foodDetails=food?'<div class="day-food">'+food.map(([name,description])=>
  '<p>'+externalLink(maps(name+" "+(day[0]===3&&name==="La Telera 1860"?"Setenil":day[2].split(" → ").pop())),name)+
  ' · '+escapeHtml(description)+'</p>').join("")+'</div>':"";
 return renderItems(main)+
  (optional.length?'<details class="agenda-options"><summary>İsteğe bağlı duraklar · '+optional.length+'</summary>'+renderItems(optional)+'</details>':"")+
  (foodDetails?'<details class="agenda-options"><summary>Yemek ve kahve seçenekleri</summary>'+foodDetails+'</details>':"");
}

function renderPlan(){
 const filters=document.querySelector("#filters");
 const days=document.querySelector("#days");
 const cityNames=["Tümü",...new Set(D.days.flatMap(d=>d[2].split(" → ")))];
 filters.replaceChildren();
 cityNames.forEach((city,i)=>{
  const button=document.createElement("button");
  button.type="button";
  button.className="plan-filter"+(i===0?" on":"");
  button.setAttribute("aria-pressed",String(i===0));
  button.textContent=city;
  button.onclick=()=>{
   filters.querySelectorAll("button").forEach(b=>{
    b.classList.toggle("on",b===button);
    b.setAttribute("aria-pressed",String(b===button));
   });
   days.querySelectorAll(".day").forEach(d=>d.hidden=city!=="Tümü"&&!d.dataset.city.split(" → ").includes(city));
  };
  filters.appendChild(button);
 });
 days.innerHTML=D.days.map((day,i)=>'<details class="day" data-city="'+escapeHtml(day[2])+'"'+(i===0?" open":"")+
  '><summary><div class="dt"><div class="num">'+day[0]+'</div><div><h3>'+escapeHtml(day[2])+
  '</h3><div class="date">'+escapeHtml(day[1])+' · '+escapeHtml(day[3])+'</div></div></div><b aria-hidden="true">⌄</b></summary>'+
  '<div class="timeline">'+dayLodging(day[0])+dayRoutes(day[0])+renderAgenda(day)+'</div></details>').join("");
 const expand=document.querySelector("#expand");
 expand.onclick=()=>{
  const visible=[...days.querySelectorAll(".day:not([hidden])")];
  const open=visible.some(d=>!d.open);
  visible.forEach(d=>d.open=open);
  expand.textContent=open?"Tümünü kapat":"Tümünü aç";
 };
}

function renderNotes(){
 const notes=document.querySelector("#v5noteslist");
 notes.innerHTML=D.days.map(d=>'<div class="v5panel"><b>Gün '+d[0]+' · '+escapeHtml(d[2])+'</b>'+
  dayRoutes(d[0])+'<textarea data-d="'+d[0]+'" aria-label="Gün '+d[0]+' notu" placeholder="Not ekle…"></textarea></div>').join("");
 notes.querySelectorAll("textarea").forEach(t=>{
  t.value=state.notes?.[t.dataset.d]||"";
  t.oninput=()=>{
   state.notes=state.notes||{};
   state.notes[t.dataset.d]=t.value;
   save();
  };
 });
}

const daySelect=document.getElementById("v61dayselect");
const dayHero=document.getElementById("v61dayhero");
const dayTimeline=document.getElementById("v61timeline");
const dayActions=document.getElementById("v61travelactions");
const previousDay=document.getElementById("v61prev");
const nextDay=document.getElementById("v61next");
const today=new Intl.DateTimeFormat("sv-SE",{timeZone:"Europe/Madrid"}).format(new Date());
const todayIndex=TRIP_DATES.indexOf(today);
let activeDay=todayIndex>=0?todayIndex:today<TRIP_DATES[0]?0:TRIP_DATES.length-1;

function travelProgress(day,done){
 const items=day[4].filter(x=>!x[7].optional);
 const count=items.filter(x=>done[x[7].id]).length;
 dayHero.querySelector(".day-progress-text").textContent=count+"/"+items.length+" tamamlandı";
 dayHero.querySelector(".v61progress i").style.width=Math.round(count/items.length*100)+"%";
}

function renderTravel(){
 const day=D.days[activeDay];
 const done=travelDone[day[0]]||{};
 daySelect.value=String(activeDay);
 dayHero.innerHTML='<div class="v61dayhero"><div class="ey">'+escapeHtml(day[1])+'</div><h3>'+escapeHtml(day[2])+
  '</h3><p>'+escapeHtml(day[3])+'</p><div class="v61progress" aria-hidden="true"><i></i></div>'+
  '<p class="day-progress-text" aria-live="polite"></p></div>';
 dayActions.innerHTML=dayLodging(day[0])+dayRoutes(day[0]);
 dayTimeline.innerHTML=renderAgenda(day,done);
 travelProgress(day,done);
 previousDay.disabled=activeDay===0;
 nextDay.disabled=activeDay===D.days.length-1;
}

function renderToday(){
 const box=document.getElementById("v5travel");
 if(!box||todayIndex<0)return;
 const day=D.days[todayIndex];
 box.innerHTML='<div class="v5travel"><div class="ey">BUGÜN · '+escapeHtml(day[1])+
  '</div><h3>'+escapeHtml(day[2])+'</h3><p>'+escapeHtml(day[3])+'</p>'+dayRoutes(day[0])+'</div>';
}

dayTimeline.addEventListener("click",event=>{
 const button=event.target.closest("[data-ti]");
 if(!button)return;
 const day=D.days[activeDay];
 const done=travelDone[day[0]]||={};
 const id=button.dataset.ti;
 done[id]=!done[id];
 localStorage.setItem(travelKey,JSON.stringify(travelDone));
 button.setAttribute("aria-pressed",String(done[id]));
 button.textContent=done[id]?"✓":"";
 button.closest(".agenda-item").classList.toggle("done",done[id]);
 travelProgress(day,done);
});

daySelect.innerHTML=D.days.map((d,i)=>'<option value="'+i+'">'+escapeHtml(d[1].split(" · ")[0]+" · "+d[2])+'</option>').join("");
daySelect.onchange=()=>{activeDay=Number(daySelect.value);renderTravel()};
previousDay.onclick=()=>{activeDay--;renderTravel()};
nextDay.onclick=()=>{activeDay++;renderTravel()};
document.querySelector('#v5home [data-v5go="v61travel"]').addEventListener("click",()=>{
 activeDay=todayIndex>=0?todayIndex:0;
 renderTravel();
 document.querySelector(".v61daynav").scrollIntoView({block:"nearest"});
});
renderPlan();
renderNotes();
renderTravel();
renderToday();
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
