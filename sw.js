/* EsserePet — service worker
   - mostra notificações no Android/desktop e no iPhone (app instalado na Tela de Início, iOS 16.4+)
   - tocar na notificação abre a caderneta certa; o botão "Dei a dose" registra a dose sem abrir o app
   - pronto para receber Web Push do servidor (evento "push"), quando houver backend */
self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) { e.waitUntil(self.clients.claim()); });

self.addEventListener("push", function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = { corpo: e.data ? e.data.text() : "" }; }
  var opts = {
    body: d.corpo || "", tag: d.chave || undefined, icon: "icon-192.png", badge: "icon-192.png",
    data: { pet: d.pet || null, aba: d.aba || null, med: d.med || null }
  };
  if (d.med) { opts.actions = [{ action: "dei", title: "Dei a dose" }]; opts.requireInteraction = true; }
  e.waitUntil(self.registration.showNotification(d.titulo || "EsserePet", opts));
});

self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  var d = e.notification.data || {};
  var dei = e.action === "dei" && d.med;
  var url = new URL(self.registration.scope);
  if (dei) { url.searchParams.set("dei", d.pet); url.searchParams.set("med", d.med); }
  else if (d.pet) { url.searchParams.set("pet", d.pet); if (d.aba) url.searchParams.set("aba", d.aba); }
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (lista) {
    for (var i = 0; i < lista.length; i++) {
      var c = lista[i];
      if (dei) { c.postMessage({ tipo: "esserepet:deiDose", pet: d.pet, med: d.med }); return; }
      if ("focus" in c) { c.postMessage({ tipo: "esserepet:abrir", pet: d.pet, aba: d.aba }); return c.focus(); }
    }
    return self.clients.openWindow(url.href);
  }));
});
