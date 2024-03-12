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

function periodicCheck() {
  const request = indexedDB.open("pwa-db");

  request.onerror = async function (event) {
    console.error("IndexedDB를 열 수 없습니다.");
  };

  request.onsuccess = function (event) {
    const db = event.target.result;

    try {
      // 트랜잭션 시작
      const transaction = db.transaction(["todo"], "readonly");
      const objectStore = transaction.objectStore("todo");

      // 현재 시간
      const currentTime = new Date();

      // 인덱스 생성
      const dueIndex = objectStore.index("due-index");

      // 인덱스를 사용하여 쿼리 실행 (현재 시간으로부터 1분 내의 범위)
      const range = IDBKeyRange.bound(
        new Date(currentTime.getTime() - 60 * 1000),
        currentTime,
      );

      const request = dueIndex.openCursor(range);

      request.onsuccess = function (event) {
        const cursor = event.target.result;
        if (cursor) {
          // 알림 시간에 해당되는 할 일이 있는 경우 알림을 보냄
          navigator.serviceWorker.ready
            .then(async (registration) => {
              const options = {
                body: cursor.value.task,
                icon: "/app-icon/ios/192.png",
              };
              registration.showNotification(
                "🔔 오늘의 할 일 잊지 마세요!",
                options,
              );
            })
            .catch((e) => console.error(e));
          cursor.continue();
        }
      };

      transaction.oncomplete = function (event) {
        db.close();
      };
    } catch (e) {
      console.error("periodic check 에러 발생");
    }
  };
}

// 1분마다 알려야 할 알림이 있는지 체크
setInterval(periodicCheck, 60 * 1000);

self.addEventListener("push", function (event) {
  console.log("[Service Worker] Push Received.");
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const title = "Push Codelab";
  const options = {
    body: "Yay it works.",
    icon: "/app-icon/ios/192.png",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

import { getMessaging } from "firebase/messaging/sw";
import { onBackgroundMessage } from "firebase/messaging/sw";

const messaging = getMessaging();
onBackgroundMessage(messaging, (payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload,
  );
  // Customize notification here
  const notificationTitle = "Background Message Title";
  const notificationOptions = {
    body: "Background Message body.",
    icon: "/app-icon/ios/192.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
