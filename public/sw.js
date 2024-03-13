self.addEventListener("activate", () => {
  console.log("service worker activated");
});

self.addEventListener("push", function (event) {
  const { title, message } = event.data.json();
  const options = {
    body: message,
    icon: "/app-icon/ios/192.png",
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

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
