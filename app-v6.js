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
 "Toulouse":[
  {name:"Première Classe Toulouse - Blagnac Aéroport",price:56,rating:"",type:"Otel · Budget",area:"Blagnac · Toulouse-Blagnac Havalimanı çevresi",center:"Havalimanı yakınında",note:"22–23 Aralık transit gecesi için havaalanı odaklı seçenek. Première Classe bu tesisi Blagnac'ta Toulouse-Blagnac Havalimanı yakınında listeliyor.",pros:"Ertesi sabah erken Málaga uçuşu için pratik; merkez gezisi gerektirmeyen transit gece planına uygun.",cons:"Toulouse şehir merkezinde değil; fiyat henüz dashboard'a girilmedi.",url:"https://www.booking.com/hotel/fr/hotelpremiereclassedetoulouseblagnac.de.html"}
 ],
 "Málaga":[
  {name:"VARELA 30 Apartamentos",price:212.52,rating:"8,6 · 921 yorum",type:"Apartman",area:"Málaga Centro",center:"~1,3 km",note:"Centro içinde ama tarihi merkezin tam göbeğinde değil; merkeze yürüyerek ulaşılabilir.",pros:"Listedeki daha uygun fiyatlı apartmanlardan; apartman tipi; merkez erişimi iyi.",cons:"Calle Granada ve Carretería seçeneklerine göre ana tarihi noktalara daha fazla yürüyüş.",url:"https://www.booking.com/hotel/es/varela-30-apartamentos.html?aid=2438770&checkin=2026-12-23&checkout=2026-12-25&no_rooms=1&group_adults=3&selected_currency=EUR"},
  {name:"Coeo Hernan Ruiz Rooftop Pool Hostel",price:238.72,rating:"",type:"Hostel / özel oda",area:"Málaga Centro",center:"~0,2 km",note:"Tarihi merkezin çok merkezi bir noktasında; şehir içi program için konum odaklı seçenek.",pros:"Merkeze çok kısa yürüme; Alcazaba, katedral çevresi ve restoranlara erişim pratik.",cons:"Hostel konsepti; oda ve yatak düzeni apartman seçenekleri kadar net değil, rezervasyon öncesi kontrol edilmeli.",url:"https://www.booking.com/hotel/es/coeo-hernan.html?aid=2438770&checkin=2026-12-23&checkout=2026-12-25&no_rooms=1&group_adults=3&selected_currency=EUR"},
  {name:"Apartamentos Pinar Málaga Centro - Carretería",price:282,rating:"8,8 · 7.367 yorum",type:"Apartman",area:"Centro · Carretería",center:"~0,3 km",note:"Carretería tarafında, Centro Histórico'ya çok yakın ve yürüyüş programına uygun.",pros:"Apartman; güçlü yorum sayısı; tarihi merkeze çok kısa yürüme.",cons:"Málaga listesindeki daha pahalı seçeneklerden.",url:"https://www.booking.com/hotel/es/apartamento-marmoles-m1-centro.html?aid=2438770&checkin=2026-12-23&checkout=2026-12-25&no_rooms=1&group_adults=3&selected_currency=EUR"},
  {name:"Apartamentos Málaga Premium - Calle Granada",price:234.09,rating:"8,7 · 1.722 yorum",type:"Apartman",area:"Centro · Calle Granada",center:"~0,25 km",note:"Calle Granada üzerinde/çevresinde; tarihi merkez ve ana gezi aksına çok yakın.",pros:"Apartman + merkezi konum; fiyat/konum dengesi güçlü; Alcazaba ve katedral tarafına yürümek kolay.",cons:"Çok merkezi konum nedeniyle çevre daha hareketli olabilir.",url:"https://www.booking.com/hotel/es/apartamentos-malaga-premium.html?aid=2438770&checkin=2026-12-23&checkout=2026-12-25&no_rooms=1&group_adults=3&selected_currency=EUR"},
  {name:"Airbnb · 1715238413556590874",price:231,rating:"",type:"Airbnb",area:"Málaga Centro · Calle Madre de Dios / Teatro Cervantes civarı (Airbnb harita pini, yaklaşık)",center:"~0,5–0,6 km · Málaga Katedrali",note:"Gönderilen Airbnb harita pini Teatro Cervantes’in hemen batısında, Plaza de la Merced’in kuzeybatısında görünüyor. En iyi eşleşme Calle Madre de Dios 39 civarı; Airbnb kesin bina numarasını paylaşmadığı için yaklaşık konum olarak tutuluyor.",pros:"23–25 Aralık için doğrudan paylaşılan Airbnb alternatifi; toplam fiyat 231 €. Teatro Cervantes, Plaza de la Merced ve tarihi merkeze çok yakın; yürüyüş programı için güçlü konum.",cons:"Kesin bina numarası ve puan Airbnb tarafından doğrulanmadı.",url:"https://www.airbnb.de/properties/1715238413556590874?unique_share_id=57229741-23f2-40d2-b7fc-5e980ed66fb8&viralityEntryPoint=1&s=76&anchor_room_id=26437687",mapQuery:"Calle Madre de Dios, Teatro Cervantes, Málaga, Spain"},
  {name:"Airbnb · 1715253353160267450",price:259,rating:"",type:"Airbnb",area:"Málaga Centro · Calle Mariblanca / Calle Peña civarı (Airbnb harita pini, yaklaşık)",center:"~0,6 km · Málaga Katedrali",note:"Airbnb harita pini El Mesón de Cervantes (Calle Álamos 11) ile Parking Atlántida (Calle Refino 16) arasındaki Mariblanca–Peña çevresini gösteriyor; kesin bina/adres Airbnb tarafından paylaşılmıyor.",pros:"23–25 Aralık için doğrudan paylaşılan Airbnb alternatifi; toplam fiyat 259 €. Centro Histórico’ya çok yakın, yürüyüş programı için avantajlı.",cons:"Kesin bina numarası ve puan henüz doğrulanmadı.",url:"https://www.airbnb.de/properties/1715253353160267450?unique_share_id=3de1e05b-ca24-4830-a491-cd329fa7dc42&viralityEntryPoint=1&s=76&anchor_room_id=48579718",mapQuery:"Calle Mariblanca, Calle Peña, Málaga, Spain"}
 ],
 "Sevilla":[
  {name:"Airbnb · 635203765526746475",price:196,rating:"",type:"Airbnb · Apartman",area:"Los Remedios · Plaza de Cuba / Av. República Argentina civarı (Airbnb harita pini, yaklaşık)",center:"~1,2 km · Sevilla Katedrali",note:"Harita pini Plaza de Cuba metrosu ve República Argentina çevresini gösteriyor; Triana'nın güney ucuna ve nehre yakın.",pros:"En ucuz Sevilla seçeneği; Plaza de Cuba metro erişimi çok iyi; Triana ve nehir yürüyüşleri için avantajlı; bölge düz.",cons:"Katedral/Alcázar Casco Antiguo seçenekleri kadar kapının önünde değil; tarihi merkeze nehri geçerek yürümek gerekiyor.",url:"https://www.airbnb.de/rooms/635203765526746475?unique_share_id=a90c93e3-e12b-4fa8-ae27-2548de6960f8&viralityEntryPoint=1&s=76"},
  {name:"Airbnb · 23970555",price:244,rating:"",type:"Airbnb · Apartman",area:"Sevilla · konum teyit edilecek",center:"—",note:"Bu ilan için henüz güvenilir harita pini veya mahalle bilgisi yok.",pros:"Apartman tipi; fiyat diğer Sevilla alternatifleriyle aynı bantta.",cons:"Konum doğrulanmadığı için yürünebilirlik ve toplu taşıma avantajı henüz karşılaştırılamıyor.",url:"https://www.airbnb.de/rooms/23970555?unique_share_id=0e42d997-0416-4914-baa7-36e2fb58f20a&viralityEntryPoint=1&s=76"},
  {name:"Airbnb · 1006965952595172368",price:238,rating:"",type:"Airbnb · Apartman",area:"Casco Antiguo · Calle Feria / Plaza de los Maldonados civarı (Airbnb harita pini, yaklaşık)",center:"~1,5 km · Sevilla Katedrali",note:"Gönderilen harita pini Calle Feria, Plaza de los Maldonados ve Cruz Verde çevresini gösteriyor; Casco Antiguo içinde.",pros:"Tarihi merkez dokusunun içinde; Alameda/Feria çevresine çok yakın; akşam yürüyerek dönmek pratik.",cons:"Katedral ve Alcázar'a Plaza de Cuba seçeneğinden kilometre olarak çok farklı olmasa da eski şehrin kuzeyinden daha uzun yürüyüş var.",url:"https://www.airbnb.de/rooms/1006965952595172368?unique_share_id=5bd88d85-6036-4530-a7fd-c889306eb258&viralityEntryPoint=1&s=76"}
 ],
 "Madrid":[
  {name:"Capsule Inn Madrid",price:189.69,rating:"7,9 · ~2.800 yorum",type:"Kapsül otel",area:"Centro · Travesía de las Beatas / Plaza de España",center:"~1,0 km · Puerta del Sol",note:"Madrid merkezinde, Plaza de España ve Gran Vía'ya çok yakın. Booking canlı aramasında 30 Ara–1 Oca, 3 yetişkin için toplam €189,69.",pros:"Çok merkezi; Gran Vía, Plaza de España, Palacio Real ve Sol programı için yürüyüş avantajı; listedeki fiyat çok düşük.",cons:"Kapsül konsepti ve ortak alan/banyo düzeni apartman konforundan farklı; 3 kişi için oda/kapsül dağılımını rezervasyon ekranında ayrıca kontrol etmek gerekir.",url:"https://www.booking.com/hotel/es/urban-inn-madrid.html?aid=2438770&checkin=2026-12-30&checkout=2027-01-01&no_rooms=1&group_adults=3&selected_currency=EUR",geniusNote:"💡 Genius kontrolü: Booking.com hesabınla giriş yapınca bu tesiste Genius veya üyeye özel ek indirim olup olmadığını rezervasyon öncesi tekrar kontrol et."},
  {name:"Vértice Roomspace",price:270,rating:"8,1 · 12.418 yorum",type:"Otel · 3★",area:"Villaverde · San Cristóbal Industrial",center:"~8–9 km · Puerta del Sol",note:"Madrid'in güneyindeki Villaverde'de. San Cristóbal Industrial tren istasyonuna yaklaşık 200 m; merkez için Cercanías kullanmak gerekir. Senin Booking hesabında gördüğün fiyat: 30 Ara–1 Oca, 3 yetişkin için toplam €270.",pros:"İyi fiyat/puan dengesi; çok yüksek yorum sayısı; tren istasyonuna çok yakın; bazı oda tiplerinde mutfak/kitchenette bulunuyor.",cons:"Tarihi merkezin dışında; her gün tren bağlantısına bağımlı ve yılbaşı gecesi geç dönüşte merkezdeki seçenek kadar pratik değil.",url:"https://www.booking.com/hotel/es/vertice-rooms.html?aid=2438770&checkin=2026-12-30&checkout=2027-01-01&no_rooms=1&group_adults=3&selected_currency=EUR",geniusNote:"💡 Genius kontrolü: Booking.com hesabınla giriş yapınca bu tesiste Genius veya üyeye özel ek indirim olup olmadığını rezervasyon öncesi tekrar kontrol et."},
  
  {name:"Exe Madrid Norte",price:278.99,rating:"8,4 · 3.606 yorum",type:"Otel · 4★",area:"Hortaleza · Las Tablas / Madrid Norte",center:"~11 km · Puerta del Sol",note:"Calle Martina Díaz 4'te, Madrid'in kuzeyinde Hortaleza tarafında. Booking canlı aramasında 30 Ara–1 Oca, 3 yetişkin için toplam €278,99.",pros:"4 yıldızlı otel; iyi puan; 3.600+ yorum; The Hat ve Vértice'e yakın fiyat bandında daha klasik otel konforu.",cons:"Merkezden oldukça uzak; Sol, Prado ve yılbaşı programı için toplu taşımaya bağımlı. Gece geç dönüşte merkezi seçenekler kadar pratik değil.",geniusNote:"💡 Genius kontrolü: Booking.com hesabınla giriş yapınca bu tesiste Genius veya üyeye özel ek indirim olup olmadığını rezervasyon öncesi tekrar kontrol et.",url:"https://www.booking.com/hotel/es/exe-madrid-norte.html?aid=2438770&checkin=2026-12-30&checkout=2027-01-01&no_rooms=1&group_adults=3&selected_currency=EUR"},
  {name:"Airbnb · Puente de Vallecas / San Diego",price:225,rating:"",type:"Airbnb",area:"Puente de Vallecas · San Diego · Av. del Monte Igueldo / C. del Hachero çevresi",center:"~4 km · Puerta del Sol",note:"Airbnb harita pinine göre Calle del Hachero / Avenida del Monte Igueldo / Calle Puerto Alto çevresi. Boulder Madrid ve PITXITO yakınında. Exact kapı numarası Airbnb tarafından rezervasyon öncesi gizleniyor. Senin gördüğün fiyat: 30 Ara–1 Oca, 3 yetişkin için toplam €225.",pros:"€225 toplamla güçlü fiyat; B&B San Fermín'den €117 daha ucuz. Nueva Numancia (L1) tarafına yürüyerek erişim sayesinde Sol, Gran Vía, Antón Martín, Estación del Arte ve Atocha hattına direkt metro bağlantısı var.",cons:"Sol/Gran Vía kadar merkezi değil; yılbaşı gecesi dönüşte metro saatleri önemli. Airbnb olduğu için check-in düzeni, yatak dağılımı, temizlik ücreti ve iptal şartlarını ilandaki son ekranda ayrıca kontrol etmek gerekir.",url:"https://www.airbnb.de/properties/1715253925518825023?unique_share_id=f354c66b-14f2-4fac-b070-5f514e48ee63&viralityEntryPoint=1&s=76&anchor_room_id=1699295353742964582",mapQuery:"Calle del Hachero Madrid"},
  {name:"B&B HOTEL Madrid San Fermín",price:342,rating:"9,1 · 334 yorum",type:"Otel · 3★",area:"Usera · San Fermín",center:"~5,6 km · Puerta del Sol",note:"Calle Magacela 6, Usera. San Fermín-Orcasur metro (L3) yaklaşık 0,5 km / 6 dk yürüyüşte. L3 ile Sol'a aktarmasız gidilebildiği için Vallecas La Gavia seçeneğine göre şehir merkezine ulaşım belirgin şekilde daha pratik. Senin gördüğün fiyat: 30 Ara–1 Oca, 3 yetişkin için toplam €342.",pros:"Yeni ve yüksek puanlı 3★ otel; metroya kısa yürüyüş; L3 ile Sol'a direkt bağlantı; 24 saat resepsiyon, özel banyo, ücretsiz Wi-Fi ve ortak alanda 24 saat ücretsiz kahve/çay.",cons:"Yine de tarihi merkezde değil; 31 Aralık gecesi dönüş için metro saatleri ve özel yılbaşı düzenlemeleri tarih yaklaşınca kontrol edilmeli.",geniusNote:"💡 Fiyat referansı: €342 senin gördüğün toplam fiyat. Booking.com hesabınla giriş yapınca Genius/üyelik indirimi ve iptal koşullarını rezervasyon öncesi tekrar kontrol et.",url:"https://www.booking.com/hotel/es/b-amp-b-madrid-san-fermin.html?aid=2438770&checkin=2026-12-30&checkout=2027-01-01&no_rooms=1&group_adults=3&selected_currency=EUR"}
 ],
 "Montpellier":[
  {name:"Eklo Hotels Montpellier Centre Gare Saint-Roch",price:145.22,rating:"",type:"Otel",area:"Centre · Gare Saint-Roch",center:"~0,6 km · Place de la Comédie",note:"4 Rue Jules Ferry. 1–3 Oca, 2 yetişkin için Booking canlı toplam €145,22. Saint-Roch istasyonunun yanında ve tarihi merkeze yürüyerek çok yakın.",pros:"Listedeki en ucuz merkezi seçeneklerden; istasyon ve tram bağlantıları çok güçlü; Écusson/Comédie yürünebilir.",cons:"Écusson'un tarihi atmosferinin tam içinde değil; Booking aramasında puan bilgisi dönmedi.",geniusNote:"💡 Genius kontrolü: Booking.com hesabınla giriş yapınca Genius veya üyeye özel ek indirim olup olmadığını kontrol et.",url:"https://www.booking.com/hotel/fr/eklo-montepellier-centre-gare.html?aid=2438770&checkin=2027-01-01&checkout=2027-01-03&no_rooms=1&group_adults=2&selected_currency=EUR"},
  {name:"Campanile PRIME - Montpellier Centre St Roch",price:161.80,rating:"8,4 · 3.720 yorum",type:"Otel · 3★",area:"Centre · Gare Saint-Roch",center:"~0,6 km · Place de la Comédie",note:"11 Rue Pagezy. 1–3 Oca, 2 yetişkin için Booking canlı toplam €161,80. İstasyona ve tram hatlarına çok yakın.",pros:"Fiyat/konum dengesi güçlü; 8,4 puan ve yüksek yorum sayısı; Comédie ve Écusson'a yürüyüş kolay.",cons:"Tarihi Écusson'un içinde değil; istasyon çevresi daha işlevsel ve daha az karakterli.",geniusNote:"💡 Genius kontrolü: Booking.com hesabınla giriş yapınca Genius veya üyeye özel ek indirim olup olmadığını kontrol et.",url:"https://www.booking.com/hotel/fr/campanile-montpellier-centre-gare-saint-roch.html?aid=2438770&checkin=2027-01-01&checkout=2027-01-03&no_rooms=1&group_adults=2&selected_currency=EUR"},
  
  {name:"Hôtel Royal - Centre Comédie",price:229.80,rating:"8,7 · 2.257 yorum",type:"Otel · 3★",area:"Centre · Comédie / Rue Maguelone",center:"~0,2 km · Place de la Comédie",note:"8 Rue Maguelone. 1–3 Oca, 2 yetişkin için Booking canlı toplam €229,80. Saint-Roch ile Place de la Comédie arasındaki en pratik aks üzerinde.",pros:"Çok merkezi; 8,7 puan; hem istasyona hem Écusson'a birkaç dakikada yürünebilir. Kısa Montpellier konaklaması için ulaşım ihtiyacını minimuma indirir.",cons:"Eklo ve Campanile'e göre belirgin daha pahalı.",geniusNote:"💡 Genius kontrolü: Booking.com hesabınla giriş yapınca Genius veya üyeye özel ek indirim olup olmadığını kontrol et.",url:"https://www.booking.com/hotel/fr/royalhotel1.html?aid=2438770&checkin=2027-01-01&checkout=2027-01-03&no_rooms=1&group_adults=2&selected_currency=EUR"}
],
 "Córdoba":[
  {name:"Apartamentos Ruz",price:70,rating:"8,5 · 318 yorum",type:"Apartman",area:"Judería · Puerta de Sevilla",center:"~0,8 km · Mezquita-Catedral",note:"Judería'nın Puerta de Sevilla tarafında; Córdoba'nın tarihi yürüyüş rotasına uygun.",pros:"Açık ara en ucuz seçenek; Judería konumu; Mezquita'ya yürünebilir.",cons:"Puanı diğer Córdoba alternatiflerinden biraz daha düşük.",url:"https://www.booking.com/hotel/es/apartamentos-ruz.html?aid=2438770&checkin=2026-12-27&checkout=2026-12-28&no_rooms=1&group_adults=3&selected_currency=EUR"},
  {name:"La Corte de Isabel",price:79,rating:"8,9 · 108 yorum",type:"Apartman",area:"Centro · Calle Isabel II",center:"~1,2 km · Mezquita-Catedral",note:"Merkez tarafında; tek gecelik Córdoba programında fiyatı düşük tutan bir alternatif.",pros:"Yüksek puan; €79 toplam; fiyat/puan dengesi güçlü.",cons:"Mezquita'ya Apartamentos Ruz'dan daha uzak; yorum sayısı daha sınırlı.",url:"https://www.booking.com/hotel/es/la-corte-de-isabel.html?aid=2438770&checkin=2026-12-27&checkout=2026-12-28&no_rooms=1&group_adults=3&selected_currency=EUR"},
  {name:"Califa SuitesGP",price:103,rating:"8,8 · 405 yorum",type:"Apartman",area:"Centro · Campo Madre de Dios",center:"~1,1 km · Mezquita-Catedral",note:"Campo Madre de Dios tarafında; tarihi merkeze yürünebilir ama Judería'nın içinde değil.",pros:"İyi puan ve daha fazla yorum; apartman; merkeze makul yürüyüş.",cons:"Ruz ve La Corte'den pahalı; ana tarihi aksa göre doğuda kalıyor.",url:"https://www.booking.com/hotel/es/mezquitasuitesgp.html?aid=2438770&checkin=2026-12-27&checkout=2026-12-28&no_rooms=1&group_adults=3&selected_currency=EUR"},
  {name:"Vial Suites GP",price:104,rating:"8,7 · 260 yorum",type:"Apartman",area:"Vial Norte · Antonio de la Torre y del Cerro",center:"~2,0 km · Mezquita-Catedral",note:"Vial Norte tarafında; tren istasyonu erişimi açısından daha pratik, tarihi çekirdeğe ise daha uzak.",pros:"İstasyon bağlantısı için avantajlı; iyi puan; apartman.",cons:"Mezquita ve Judería'ya listedeki en uzak Córdoba seçeneği.",url:"https://www.booking.com/hotel/es/vial-suites-gp.html?aid=2438770&checkin=2026-12-27&checkout=2026-12-28&no_rooms=1&group_adults=3&selected_currency=EUR"}
 ],
 "Granada":[
  {name:"Aljibe de San Miguel Bajo",price:215.50,rating:"9,1 · 101 yorum",type:"Apartman",area:"Albaicín · San Miguel Bajo",center:"~0,8 km",note:"San Miguel Bajo, Albaicín'in tarihi dokusu içinde; çevrede Endülüs/İslam mirası güçlü. Konum atmosfer açısından özel.",pros:"Daha karakterli ve tarihî çevre; yüksek puan; Wekey'den daha ucuz.",cons:"Albaicín eğimli ve taş döşeli sokaklara sahip; valizle Centro seçeneğine göre daha zahmetli olabilir.",url:"https://www.booking.com/hotel/es/aljibe-de-san-miguel-bajo.html?aid=2438770&checkin=2026-12-25&checkout=2026-12-27&no_rooms=1&group_adults=3&selected_currency=EUR"},
  {name:"Wekey Homes – Apartamento con 2 camas V",price:259,rating:"4,66 · 352 yorum",type:"Airbnb · Apartman",area:"Centro · Placeta de Santo Cristo / Cerrajeros civarı (Airbnb harita pini, yaklaşık)",center:"~0,3 km · Granada Katedrali",note:"Harita pini Centro-Sagrario'da Placeta de Santo Cristo / Cerrajeros çevresini gösteriyor; katedral ve merkez aksına çok yakın.",pros:"Daha düz ve valizle daha pratik Centro konumu; katedrale çok yakın; restoran ve şehir merkezi erişimi kolay.",cons:"Aljibe'ye göre €43,50 daha pahalı; Albaicín'in tarihî mahalle atmosferi kapının önünde değil.",url:"https://www.airbnb.de/properties/1715260200657483940?unique_share_id=20d6aeef-ea46-4f4b-9923-e8628d53a164&viralityEntryPoint=1&s=76&anchor_room_id=1394087409052626820"}
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
 (alts.length?'<div class="head" style="margin-top:22px"><div><div class="ey">KARAR LİSTESİ · '+(stayCity==="Montpellier"?"2":"3")+' YETİŞKİN</div><h2>'+escapeHtml(stayCity)+' alternatifleri</h2></div><span class="pill">'+escapeHtml(s[1])+' · '+s[2]+' gece</span></div><p class="muted">Fiyatlar 19.09.2026 tarihinde '+(stayCity==="Montpellier"?"2":"3")+' yetişkin için görülen toplam fiyatlardır; rezervasyona kadar değişebilir.</p><div class="v5warn" style="margin:10px 0 14px"><b>Booking Genius:</b> Booking.com hesabınla giriş yapınca listedeki tesislerde Genius veya üyeye özel ek indirim olup olmadığını rezervasyon öncesi kontrol et.</div><div class="v6staygrid">'+alts.map(a=>'<article class="v6stay"><div class="v6staytop"><div><div class="ey">'+escapeHtml(a.type)+' · '+escapeHtml(a.area)+'</div><h3>'+escapeHtml(a.name)+'</h3></div></div><div class="v6summary">'+(a.rating?'<b>'+escapeHtml(a.rating)+'</b><br>':"")+s[2]+' gece · '+(stayCity==="Montpellier"?"2":"3")+' kişi<br><b>📍 Merkez: '+escapeHtml(a.center||'—')+'</b><br>'+(a.price!=null?'<b>'+money(a.price)+'</b> · güncel toplam':'<b>Fiyatı Airbnb’de kontrol et</b>')+'</div><div class="actions">'+(a.url?'<a class="action primary" target="_blank" rel="noopener" href="'+a.url+'">'+(a.type.startsWith("Airbnb")?"Airbnb":"Booking.com")+' ↗</a>':"")+(a.map===false?"":'<a class="action" target="_blank" rel="noopener" href="'+maps(a.mapQuery||a.name+" "+stayCity)+'">⌖ Harita</a>')+'</div>'+(a.note?'<div class="v5warn" style="margin-top:12px"><b>Konum notu:</b> '+escapeHtml(a.note)+'</div>':'')+(a.pros?'<div class="v6summary" style="margin-top:10px"><b>✓ Avantajlar</b><br>'+escapeHtml(a.pros)+'</div>':'')+(a.cons?'<div class="v6summary" style="margin-top:8px"><b>− Dezavantajlar</b><br>'+escapeHtml(a.cons)+'</div>':'')+'</article>').join("")+'</div>':'<div class="v5warn" style="margin-top:18px">Bu şehir için karar verdiğimiz alternatifler henüz eklenmedi.</div>');
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
const DAY_FOOD={
  2:[["Mesón Mariano","Chivo malagueño · alcachofas · balık"],["La Plancha Taberna","Izgara · tapas · İspanyol mutfağı"],["El Gastronauta","Tapas · Akdeniz · çağdaş İspanyol"],["Next Level Specialty Coffee","Kahvaltı · specialty coffee"]],
  3:[["El Lechuguita","Geleneksel küçük tapas"],["Casa María","Ev yapımı İspanyol · balık · et"],["Restaurante Tropicana","Çağdaş İspanyol · Akdeniz"],["Cafetería Churrería Alba","Kahvaltı · churros · café con leche"],["La Telera 1860","Setenil opsiyonel · yerel ürünler"]],
  4:[["Rosario Varela","Realejo · gastrobar"],["Bar FM","Balık · deniz ürünleri"],["Bar Oliver","Deniz ürünü · geleneksel tapas"],["Despiertoo Specialty Coffee","Kahvaltı · specialty coffee"]],
  5:[["Bar Ávila","Jamón asado · tapas"],["Rosario Varela","Realejo · gastrobar"],["Alhambra Churrería","Churros con chocolate"],["Despiertoo Specialty Coffee","Kahvaltı · specialty coffee"]],
  6:[["Taberna San Cristóbal","Salmorejo · berenjenas"],["Taberna Góngora","Geleneksel Córdoba mutfağı"],["Sociedad Plateros María Auxiliadora","Geleneksel · Montilla-Moriles"],["The Coffee Club","Kahvaltı · specialty coffee"]],
  7:[["Taberna Salinas","Salmorejo · flamenquín · rabo de toro"],["The Coffee Club","Kahvaltı · specialty coffee"],["Las Golondrinas","Triana · solomillo · chipirones"],["Blanca Paloma","Triana · balık/deniz ürünü · tapas"]],
  8:[["Casa Moreno","Pringá · mojama · vermut/sherry"],["Blanca Paloma","Triana · deniz ürünü · tapas"],["Paradas 7","Kahvaltı · specialty coffee"]],
  9:[["Paradas 7","Kahvaltı · specialty coffee"],["Bodega de la Ardosa","Madrid · tortilla · vermut"],["HanSo Café","Madrid · specialty coffee"]],
  10:[["La Sanabresa","Old-school local öğle yemeği"],["Casa Dani","Tortilla de patatas · menú del día"],["Bodega de la Ardosa","Tortilla · vermut · kroket"],["HanSo Café","Kahvaltı · specialty coffee"]],
  11:[["HanSo Café","Kahvaltı · specialty coffee"],["Bodega de la Ardosa","Tortilla · vermut · kroket"],["Bodegas Alfaro","Lavapiés · vermut/tapas"]],
  12:[["Ripailles","Fransız bistro"],["Bistrot Sainte Anne","Écusson · bistro"],["Bonobo","Brunch · pancakes · yumurta · kahve"]],
  13:[["Bonobo","Brunch · kahve"]]
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
 dayTimeline.innerHTML=items.map((x,i)=>'<article class="v61item '+(done[i]?"done":"")+'"><div class="tm">'+escapeHtml(x[0])+'</div><button class="v61check" data-ti="'+i+'" aria-label="'+(done[i]?"Tamamlanmadı olarak işaretle":"Tamamlandı olarak işaretle")+'">'+(done[i]?"✓":"")+'</button><div><h4>'+escapeHtml(x[1])+'</h4><p>'+escapeHtml(x[2])+'</p></div></article>').join("")+(DAY_FOOD[d[0]]?'<article class="v61item"><div class="tm">🍴</div><div></div><div><h4>Rota üzerindeki yemek alternatifleri</h4><p>'+DAY_FOOD[d[0]].map(x=>'<a target="_blank" rel="noopener" href="'+travelSearch(x[0]+" "+d[2].split(" → ").pop())+'"><b>'+escapeHtml(x[0])+'</b></a> · '+escapeHtml(x[1])).join("<br>")+'</p></div></article>':"");
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