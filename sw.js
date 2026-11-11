/* Hira service worker: app shell offline, curriculum data cached for offline reading */
const VERSION = "hira-v33";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];
// only public curriculum tables are cached (never student data, resources or results)
const CURRICULUM = /\/rest\/v1\/(units|lessons|learning_outcomes|lesson_outcomes|fw_domains|fw_axes|fw_standards|evidences|identity_tags|lesson_identity_links|success_criteria)\b/;

self.addEventListener("install", (e) => {
  // cache each shell file on its own: one missing file (icon, manifest) must never block the update
  e.waitUntil(caches.open(VERSION).then((c) => Promise.allSettled(SHELL.map((u) => c.add(u)))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

const networkFirst = async (req, key) => {
  const cache = await caches.open(VERSION);
  try {
    const res = await fetch(req, { cache: "no-cache" });
    if (res.ok) cache.put(key || req, res.clone());
    return res;
  } catch (err) {
    const hit = await cache.match(key || req);
    if (hit) return hit;
    throw err;
  }
};
const cacheFirst = async (req) => {
  const cache = await caches.open(VERSION);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok || res.type === "opaque") cache.put(req, res.clone());
  return res;
};

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // only app-shell navigations use the cached index; files (resources/*.pdf) go straight to the network
  if (url.origin === location.origin && url.pathname.includes("/resources/")) return;
  if (req.mode === "navigate") { e.respondWith(networkFirst(req, "./index.html")); return; }
  if (url.origin === location.origin) { e.respondWith(networkFirst(req)); return; }
  if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname) || url.hostname === "cdnjs.cloudflare.com" || url.hostname === "cdn.jsdelivr.net") {
    e.respondWith(cacheFirst(req)); return;
  }
  if (url.hostname.endsWith(".supabase.co") && CURRICULUM.test(url.pathname)) { e.respondWith(networkFirst(req)); return; }
});
