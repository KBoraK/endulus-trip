import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const firebaseConfig={
  apiKey:"AIzaSyDfz80hAy2H1Gny6MBbLYp9Ua94qJ-LDSc",
  authDomain:"endulus-trip.firebaseapp.com",
  projectId:"endulus-trip",
  storageBucket:"endulus-trip.firebasestorage.app",
  messagingSenderId:"132858428481",
  appId:"1:132858428481:web:d02633afcb09de18bf9ac0"
};
const app=initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app),provider=new GoogleAuthProvider();
const tripRef=doc(db,"sharedTrips","andalusia-2026");
const status=document.getElementById("cloudStatus"),login=document.getElementById("cloudLogin"),logout=document.getElementById("cloudLogout");
let unsub=null,ready=false,saving=false,timer=null;
function stat(t,k=""){if(status){status.textContent=t;status.dataset.kind=k}}
login?.addEventListener("click",async()=>{try{await signInWithPopup(auth,provider)}catch(e){stat(e.code==="auth/operation-not-allowed"?"☁ Firebase'de Google girişi henüz etkin değil":"☁ Bağlantı kurulamadı","error")}});
logout?.addEventListener("click",()=>signOut(auth));
window.endulusCloudSave=(state)=>{
 if(!ready||!auth.currentUser||saving)return;
 clearTimeout(timer);timer=setTimeout(async()=>{try{saving=true;await setDoc(tripRef,{state,updatedAt:serverTimestamp(),updatedBy:auth.currentUser.email||auth.currentUser.uid},{merge:true});stat("☁ Ortak plan senkronize","ok")}catch(e){stat(e.code==="permission-denied"?"☁ Firestore erişim kuralı gerekli":"☁ Senkronizasyon hatası","error")}finally{saving=false}},450);
};
onAuthStateChanged(auth,async user=>{
 ready=false;if(unsub){unsub();unsub=null}
 if(!user){stat("☁ Ortak plan bağlı değil");if(login)login.hidden=false;if(logout)logout.hidden=true;return}
 if(login)login.hidden=true;if(logout)logout.hidden=false;stat("☁ "+(user.email||"Google hesabı")+" bağlandı");
 try{
   const snap=await getDoc(tripRef);
   if(snap.exists()&&snap.data().state)window.EndulusApp?.applyCloudState(snap.data().state);
   else if(window.EndulusApp)await setDoc(tripRef,{state:window.EndulusApp.getState(),updatedAt:serverTimestamp(),updatedBy:user.email||user.uid});
   ready=true;stat("☁ Ortak plan senkronize","ok");
   unsub=onSnapshot(tripRef,s=>{if(s.exists()&&s.data().state&&!saving)window.EndulusApp?.applyCloudState(s.data().state)},e=>stat(e.code==="permission-denied"?"☁ Bu hesap için erişim izni yok":"☁ Canlı senkronizasyon kesildi","error"));
 }catch(e){stat(e.code==="permission-denied"?"☁ Bu hesap için Firestore erişim izni yok":e.code==="failed-precondition"?"☁ Firestore veritabanı henüz oluşturulmadı":"☁ Firebase kurulumu tamamlanmalı","error")}
});
