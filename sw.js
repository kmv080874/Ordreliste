const V='ordreliste-v4';
const SHELL=['./ordreliste.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
const CDN=['https://cdnjs.cloudflare.com/ajax/libs/tesseract.js/5.1.1/tesseract.min.js','https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js','https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(async c=>{
 await Promise.all(SHELL.map(u=>c.add(u).catch(()=>{})));
 await Promise.all(CDN.map(u=>c.add(new Request(u,{mode:'no-cors'})).catch(()=>{})))}).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET')return;
 const u=new URL(r.url),same=u.origin===location.origin,cdn=/cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|tessdata\.projectnaptha\.com/.test(u.host);
 if(!same&&!cdn)return;
 e.respondWith(caches.open(V).then(async c=>{
  let hit=await c.match(r,{ignoreSearch:true});
  if(!hit&&r.mode==='navigate')hit=await c.match('./ordreliste.html');
  const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque'))c.put(r,res.clone());return res}).catch(()=>null);
  if(hit){e.waitUntil(net);return hit}
  return (await net)||new Response('Offline',{status:503})}))});
