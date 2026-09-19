(()=>{
"use strict";
if(typeof D==="undefined") return;
const KEY="endulusStateV6";
const STATUS={
 required:["Rezervasyon gerekli","required"],
 waiting:["Satış / saat bekleniyor","waiting"],
 later:["Tarih yaklaşınca kontrol","later"],
 booked:["Booked","booked"]
};
const stayDefaults={};
D.stays.forEach(s=>stayDefaults[s[0]]={status:"todo",name:"",price:"",checkin:s[1].split("–")[0]||"",checkout:s[1].split("–")[1]||"",area:s[3]});
const reservationDefaults={};
D.bookings.forEach(b=>reservationDefaults[b[0]]={status:["train"].includes(b[0])?"waiting":"required",time:"",total:"",verified:""});
function load(){
 let s={version:6,stays:stayDefaults,reservations:reservationDefaults,expenses:{flights:"",intercity:"",local:"",food:"",other:""}};
 try{const old=JSON.parse(localStorage.getItem(KEY)||"null");if(old)s=merge(s,old)}catch(e){}
 try{const checks=JSON.parse(localStorage.getItem("endulusChecks")||"{}");Object.keys(checks).forEach(k=>{if(checks[k]&&s.reservations[k])s.reservations[k].status="booked"})}catch(e){}
 try{const b=JSON.parse(localStorage.getItem("endulusBudgetV5")||"{}");["flights","intercity","local","food","other"].forEach(k=>{if(b[k]!==undefined&&s.expenses[k]==="")s.expenses[k]=b[k]})}catch(e){}
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
const save=()=>{
 localStorage.setItem(KEY,JSON.stringify(state));
 const checks={};Object.entries(state.reservations).forEach(([k,v])=>checks[k]=v.status==="booked");localStorage.setItem("endulusChecks",JSON.stringify(checks));
 localStorage.setItem("endulusBudgetV5",JSON.stringify({...state.expenses,stays:stayTotal(),attractions:"323.31"}));
 if(state.notes)localStorage.setItem("endulusNotesV5",JSON.stringify(state.notes));
};
const money=n=>new Intl.NumberFormat("tr-TR",{style:"currency",currency:"EUR"}).format(Number(n)||0);
const num=v=>parseFloat(String(v||"").replace(",","."))||0;
const stayTotal=()=>Object.values(state.stays).reduce((s,x)=>s+num(x.price),0);
const attractionPlan=()=>D.budget.reduce((s,x)=>s+num(x[1]),0);
const expenseTotal=()=>Object.values(state.expenses).reduce((s,x)=>s+num(x),0);
const grand=()=>stayTotal()+attractionPlan()+expenseTotal();
const pp=()=>grand()/3;
const getBooking=id=>D.bookings.find(b=>b[0]===id);
function bookingEstimatedTotal(id){
 const b=getBooking(id),v=state.reservations[id];if(!b||!v)return 0;
 return num(v.total)||(v.status==="booked"&&b[3]!=null?num(b[3])*3:0);
}
function bookedActivityTotal(){return Object.keys(state.reservations).reduce((s,id)=>s+bookingEstimatedTotal(id),0)}
function escapeHtml(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
const stayAlternatives={
 "Málaga":[
  {name:"VARELA 30 Apartamentos",price:212.52,rating:"8,6 · 921 yorum",type:"Apartman",area:"Málaga Centro",center:"~1,3 km",url:"https://www.booking.com/hotel/es/varela-30-apartamentos.html?aid=2438770&checkin=2026-12-23&checkout=2026-12-25&no_rooms=1&group_adults=3&selected_currency=EUR"},
  {name:"Coeo Hernan Ruiz Rooftop Pool Hostel",price:238.72,rating:"",type:"Hostel / özel oda",area:"Málaga Centro",center:"~0,2 km",url:"https://www.booking.com/hotel/es/coeo-hernan.html?aid=2438770&checkin=2026-12-23&checkout=2026-12-25&no_rooms=1&group_adults=3&selected_currency=EUR"},
  {name:"Apartamentos Pinar Málaga Centro - Carretería",price:282,rating:"8,8 · 7.367 yorum",type:"Apartman",area:"Centro · Carretería",center:"~0,3 km",url:"https://www.booking.com/hotel/es/apartamento-marmoles-m1-centro.html?aid=2438770&checkin=2026-12-23&checkout=2026-12-25&no_rooms=1&group_adults=3&selected_currency=EUR"},
  {name:"Apartamentos Málaga Premium - Calle Granada",price:234.09,rating:"8,7 · 1.722 yorum",type:"Apartman",area:"Centro · Calle Granada",center:"~0,25 km",url:"https://www.booking.com/hotel/es/apartamentos-malaga-premium.html?aid=2438770&checkin=2026-12-23&checkout=2026-12-25&no_rooms=1&group_adults=3&selected_currency=EUR"}
 ]
};
let stayCity="Málaga";
function renderStays(){
 const box=document.querySelector("#staygrid");if(!box)return;
 box.className="";
 const cities=D.stays.map(x=>x[0]);
 if(!cities.includes(stayCity))stayCity=cities[0];
 const s=D.stays.find(x=>x[0]===stayCity),v=state.stays[s[0]]||stayDefaults[s[0]],booked=v.status==="booked",alts=stayAlternatives[stayCity]||[];
 box.innerHTML='<div class="filters v6staycities">'+cities.map(c=>'<button class="filter '+(c===stayCity?"on":"")+'" data-staycity="'+escapeHtml(c)+'">'+escapeHtml(c)+'</button>').join("")+'</div>'+
 '<article class="v6stay" data-city="'+escapeHtml(s[0])+'"><div class="v6staytop"><div><div class="ey">'+escapeHtml(s[1])+' · '+s[2]+' gece</div><h3>'+escapeHtml(s[0])+'</h3></div><span class="v6badge '+(booked?"booked":"todo")+'">'+(booked?"✓ Rezerve":"Bekliyor")+'</span></div><div class="v6summary">'+(v.name?'<b>'+escapeHtml(v.name)+'</b><br>':"")+escapeHtml(v.area)+(v.price?'<br><b>'+money(v.price)+'</b> · toplam konaklama':"")+'</div><div class="actions"><a class="action" target="_blank" rel="noopener" href="'+maps(v.area.split(";")[0]+" "+s[0])+'">⌖ Bölge</a></div><div class="v6fields"><label>Durum<select data-stay="'+escapeHtml(s[0])+'" data-field="status"><option value="todo" '+(v.status==="todo"?"selected":"")+'>Bekliyor</option><option value="booked" '+(v.status==="booked"?"selected":"")+'>Rezerve</option></select></label><label>Toplam fiyat (€)<input inputmode="decimal" data-stay="'+escapeHtml(s[0])+'" data-field="price" value="'+escapeHtml(v.price)+'" placeholder="0"></label><label class="wide">Otel / apartman adı<input data-stay="'+escapeHtml(s[0])+'" data-field="name" value="'+escapeHtml(v.name)+'" placeholder="Henüz seçilmedi"></label><label class="wide">Bölge<input data-stay="'+escapeHtml(s[0])+'" data-field="area" value="'+escapeHtml(v.area)+'"></label></div></article>'+
 (alts.length?'<div class="head" style="margin-top:22px"><div><div class="ey">KARAR LİSTESİ · 3 YETİŞKİN</div><h2>'+escapeHtml(stayCity)+' alternatifleri</h2></div><span class="pill">23–25 Ara · 2 gece</span></div><p class="muted">Fiyatlar Booking.com üzerinde 19.09.2026 tarihinde 3 yetişkin / 1 oda veya apartman için görülen toplam fiyatlardır; rezervasyona kadar değişebilir.</p><div class="v6staygrid">'+alts.map(a=>'<article class="v6stay"><div class="v6staytop"><div><div class="ey">'+escapeHtml(a.type)+' · '+escapeHtml(a.area)+'</div><h3>'+escapeHtml(a.name)+'</h3></div></div><div class="v6summary">'+(a.rating?'<b>'+escapeHtml(a.rating)+'</b><br>':"")+'2 gece · 3 kişi<br><b>📍 Merkez: '+escapeHtml(a.center||'—')+'</b> · Plaza de la Constitución<br><b>'+money(a.price)+'</b> · güncel toplam</div><div class="actions"><a class="action primary" target="_blank" rel="noopener" href="'+a.url+'">Booking.com ↗</a><a class="action" target="_blank" rel="noopener" href="'+maps(a.name+" Málaga")+'">⌖ Harita</a></div></article>').join("")+'</div>':'<div class="v5warn" style="margin-top:18px">Bu şehir için karar verdiğimiz alternatifler henüz eklenmedi.</div>');
 box.querySelectorAll("[data-staycity]").forEach(b=>b.onclick=()=>{stayCity=b.dataset.staycity;renderStays();renderEditBar()});
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
 const labels={flights:"Uçuşlar",intercity:"Şehirlerarası ulaşım",local:"Yerel ulaşım",food:"Yemek",other:"Diğer"};
 sec.innerHTML='<div class="head"><div><div class="ey">TEK KAYNAK · 3 KİŞİ</div><h2>Trip budget</h2></div><span class="pill">otomatik</span></div><div class="v6budgetcards"><div class="v6bcard"><b>'+money(grand())+'</b><small>planlanan toplam</small></div><div class="v6bcard"><b>'+money(pp())+'</b><small>kişi başı</small></div><div class="v6bcard"><b>'+money(stayTotal())+'</b><small>konaklama</small></div><div class="v6bcard"><b>'+money(attractionPlan())+'</b><small>aktiviteler</small><div class="v6auto">baz plan</div></div><div class="v6bcard"><b>'+money(num(state.expenses.food))+'</b><small>yemek</small><div class="v6auto">girilen toplam</div></div></div><div class="v5warn">Aktivite baz planı mevcut listedeki '+money(attractionPlan())+' üzerinden otomatik geliyor. Konaklama ve diğer kategoriler Edit Mode’da girildikçe toplam güncellenir. Booked aktivitelerde kaydedilen/hesaplanan tutar: '+money(bookedActivityTotal())+'.</div><div class="v5budget v6expense">'+Object.keys(labels).map(k=>'<label><span>'+labels[k]+'</span><input inputmode="decimal" data-exp="'+k+'" value="'+escapeHtml(state.expenses[k])+'" placeholder="€"></label>').join("")+'</div>';
 sec.querySelectorAll("[data-exp]").forEach(el=>el.oninput=()=>{state.expenses[el.dataset.exp]=el.value;save();const cards=sec.querySelectorAll(".v6bcard b");cards[0].textContent=money(grand());cards[1].textContent=money(pp())});
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
const DAY_ROUTES={
  1:["Toulouse-Blagnac Airport","Toulouse-Blagnac Airport hotels"],
  2:["Alcazaba Malaga","Muelle Uno Malaga",["Teatro Romano Malaga","Catedral de Malaga","Soho Malaga"]],
  3:["Puente Nuevo Ronda","Baños Arabes Ronda",["Old Town Ronda"]],
  4:["Carrera del Darro Granada","Sacromonte Granada",["Albaicin Granada","Mirador San Nicolas Granada"]],
  5:["Alhambra Granada","Realejo Granada",["Generalife Granada"]],
  6:["Medina Azahara Cordoba","Puente Romano Cordoba",["Judería Cordoba"]],
  7:["Mezquita Catedral Cordoba","Triana Sevilla"],
  8:["Real Alcazar Sevilla","Las Setas Sevilla",["Catedral Sevilla","Santa Cruz Sevilla"]],
  9:["Plaza de España Sevilla","Puerta del Sol Madrid"],
  10:["Museo del Prado Madrid","Puerta del Sol Madrid",["Barrio de las Letras Madrid","Retiro Madrid"]],
  11:["Plaza Mayor Madrid","Madrid Barajas Airport"],
  12:["Place de la Comedie Montpellier","Aqueduc Saint Clement Montpellier",["Cathedrale Saint Pierre Montpellier","Promenade du Peyrou Montpellier"]],
  13:["Place de la Comedie Montpellier","Montpellier Airport"]
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
 dayTimeline.innerHTML=items.map((x,i)=>'<article class="v61item '+(done[i]?"done":"")+'"><div class="tm">'+escapeHtml(x[0])+'</div><button class="v61check" data-ti="'+i+'" aria-label="'+(done[i]?"Tamamlanmadı olarak işaretle":"Tamamlandı olarak işaretle")+'">'+(done[i]?"✓":"")+'</button><div><h4>'+escapeHtml(x[1])+'</h4><p>'+escapeHtml(x[2])+'</p></div></article>').join("");
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
})();