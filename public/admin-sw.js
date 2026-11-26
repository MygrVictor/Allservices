// Service worker minimal : rend le back-office installable comme application.
// Aucune mise en cache : les commandes et les prix sont toujours lus en direct.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});
