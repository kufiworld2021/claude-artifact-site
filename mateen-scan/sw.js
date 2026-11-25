/* Mateen Scan app · keeps the page and its scan libraries on the phone so it opens fast and even without signal.
   The page itself is always fetched fresh when there is signal (so updates arrive at once); scans are never cached. */
var C='mateen-scan-v1';
var SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./mark-64.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(C).then(function(c){return c.addAll(SHELL)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==C}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){var r=e.request;if(r.method!=='GET')return;var u=new URL(r.url);
  if(u.hostname.indexOf('script.google')>=0||u.hostname.indexOf('googleusercontent')>=0)return;          /* the sheet bridge: always live */
  if(r.mode==='navigate'||(u.origin===location.origin&&/\/(index\.html)?$/.test(u.pathname))){              /* the page: fresh first, saved copy without signal */
    e.respondWith(fetch(r).then(function(res){var c=res.clone();caches.open(C).then(function(x){x.put('./',c)});return res}).catch(function(){return caches.match('./')}));return}
  e.respondWith(caches.match(r).then(function(hit){return hit||fetch(r).then(function(res){if(res&&(res.ok||res.type==='opaque')){var c=res.clone();caches.open(C).then(function(x){x.put(r,c)})}return res})}))});
