const cacheName = "v1";

// const urlsToCache = ["/next.svg", "/pwa-todo"];
// self.addEventListener("install", (event) => {
//   console.log("service worker installed");
//   event.waitUntil(
//     caches.open("pwa-assets").then((cache) => {
//       return cache.addAll(urlsToCache);
//     }),
//   );
// });

self.addEventListener("activate", () => {
  console.log("service worker activated");
});

// const cacheClone = async (e) => {
//   const res = await fetch(e.request);
//   const resClone = res.clone();
//
//   const cache = await caches.open(cacheName);
//   await cache.put(e.request, resClone);
//   return res;
// };
//
// /**
//  * ServiceWorkerGlobalScope: fetch event
//  * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/fetch_event)
//  * The fetch event is fired in the service worker's global scope when the main app thread makes a network request.
//  * It enables the service worker to intercept network requests and send customized responses (for example, from a local cache).
//  */
// const fetchEvent = () => {
//   self.addEventListener("fetch", (e) => {
//     console.log("💚 fetchEvent 발생!");
//     e.respondWith(
//       cacheClone(e)
//         .catch(() => caches.match(e.request))
//         .then((res) => res),
//     );
//   });
// };
//
// fetchEvent();

// main.js

// service-worker.js
function sendMessage() {
  const dbName = "myDatabase";
  const dbVersion = 1;
  const request = indexedDB.open(dbName, dbVersion);
  request.onsuccess = function (event) {
    // @ts-ignore
    const db = event.target.result;
    const transaction = db.transaction(["people"], "readwrite");
    const objectStore = transaction.objectStore("people");
    const request = objectStore.get(1);
    request.onerror = function (event) {
      // Handle errors!
    };
    request.onsuccess = function (event) {
      // Do something with the request.result!
      console.log("🙀 오 된다!!", event.target.result.name);
    };
  };
  // console.log("🤖", localStorage.getItem("message"));
}

self.addEventListener("sync", (event) => {
  if (event.tag === "send-message") {
    event.waitUntil(sendMessage());
  }
});

function periodicCheck() {
  navigator.serviceWorker.ready
    .then(async (registration) => {
      const options = {
        body: "오늘의 할 일 잊지 마세요.",
        icon: "/app-icon/ios/192.png",
      };
      registration.showNotification("🔔 PWA TODO", options);
    })
    .catch((e) => console.error(e));
}

// 1분마다 알려야 할 알림이 있는지 체크
setInterval(periodicCheck, 60 * 1000);
