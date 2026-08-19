/* Alyon Vault L2 - guardiano dell'app installata.
   Tiene una copia locale di tutto, cosi' l'app parte anche senza rete,
   e va comunque a chiedere la versione nuova quando la rete c'e'. */

var VERSIONE = "v3";
var CACHE = "alyon-vault-" + VERSIONE;

var RISORSE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icona-192.png",
  "./icona-512.png",
  "./icona-maskable.png"
];

self.addEventListener("install", function(ev){
  ev.waitUntil(
    caches.open(CACHE)
      .then(function(c){ return c.addAll(RISORSE); })
      .then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function(ev){
  ev.waitUntil(
    caches.keys().then(function(nomi){
      return Promise.all(nomi.map(function(n){
        return n === CACHE ? null : caches.delete(n);
      }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function(ev){
  var req = ev.request;
  if(req.method !== "GET") return;
  if(new URL(req.url).origin !== self.location.origin) return;

  /* La pagina: prima la rete, cosi' le versioni nuove arrivano da sole.
     Se la rete non c'e', si usa la copia tenuta da parte. */
  if(req.mode === "navigate"){
    ev.respondWith(
      fetch(req).then(function(r){
        var copia = r.clone();
        caches.open(CACHE).then(function(c){ c.put("./index.html", copia); });
        return r;
      })["catch"](function(){
        return caches.match("./index.html").then(function(r){
          return r || caches.match("./");
        });
      })
    );
    return;
  }

  /* Icone e manifest: prima la copia locale, che tanto cambiano di rado.
     L'aggiornamento avviene in sottofondo, senza far aspettare nessuno. */
  ev.respondWith(
    caches.match(req).then(function(salvata){
      if(salvata){
        fetch(req).then(function(r){
          if(r && r.status === 200){
            caches.open(CACHE).then(function(c){ c.put(req, r); });
          }
        })["catch"](function(){});
        return salvata;
      }
      return fetch(req);
    })
  );
});
