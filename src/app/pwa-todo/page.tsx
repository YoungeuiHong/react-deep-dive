"use client";
import { Button, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Container } from "@mui/system";
import ToDoBox from "@/app/pwa-todo/components/ToDoBox";
import { getAllToDo } from "@/app/pwa-todo/action";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ToDo } from "@/app/pwa-todo/types";
import NavigationBar from "@/app/pwa-todo/components/NavigationBar";

export default function PwaToDoPage() {
  const [swReg, setSwReg] = useState<ServiceWorkerRegistration>();

  const { data: toDos } = useQuery({
    queryKey: ["todos"],
    queryFn: () => getAllToDo(),
  });

  useEffect(() => {
    saveDB();
  }, [toDos]);

  function saveDB() {
    const dbName = "pwa-db";
    const request = indexedDB.open(dbName);

    // 데이터베이스가 열릴 때 실행되는 이벤트 핸들러
    request.onupgradeneeded = function (event) {
      // @ts-ignore
      const db = event.target.result;

      // 객체 저장소 (Object Store) 생성
      const objectStore = db.createObjectStore("todo", {
        keyPath: "id",
        autoIncrement: true,
      });

      objectStore.createIndex("due-index", "due_date");

      objectStore.transaction.oncomplete = function (event) {
        // Store values in the newly created objectStore.
        var customerObjectStore = db
          .transaction("todo", "readwrite")
          .objectStore("todo");
      };
    };

    request.onsuccess = function (event) {
      // @ts-ignore
      const db = event.target.result;
      const transaction = db.transaction(["todo"], "readwrite");
      const objectStore = transaction.objectStore("todo");

      toDos?.forEach((todo: ToDo) => {
        objectStore.put({
          ...todo,
          due_date: new Date(todo.due),
        });
      });
    };
  }

  useEffect(() => {
    console.log("알람 허용 여부: ", Notification.permission);

    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        setSwReg(registration);

        console.log(
          "🔥 Service Worker registration successful with scope: ",
          registration.scope,
        );
      })
      .catch((err) => console.log("Service Worker registration failed: ", err));
  }, []);

  function notification() {
    if (swReg) {
      const options = {
        body: "Testing Our Notification",
        icon: "/app-icon/ios/192.png",
      };
      swReg.showNotification("PWA Notification!", options);
    }
  }
  return (
    <Container
      maxWidth={"sm"}
      sx={{ backgroundColor: grey["100"], height: "100vh", pt: 4 }}
    >
      <Typography
        variant={"h5"}
        color={grey["800"]}
        sx={{ width: "100%", fontWeight: "800", ml: 1, mb: 3 }}
      >
        TODO
      </Typography>
      <Button
        onClick={() => {
          Notification.requestPermission().then((result) => {
            if (result === "granted") {
              console.log("알림 승인됨");
            }
          });
        }}
      >
        Permission
      </Button>
      <Button
        onClick={async () => {
          notification();
          // const registration = await navigator.serviceWorker.getRegistration();

          // if (registration && "showNotification" in registration) {
          //   registration.showNotification("TODO 알림", {
          //     body: "오늘의 할 일 까먹지 마세요",
          //     icon: "/app-icon/ios/192.png",
          //   });
          // } else {
          //   const n = new Notification("TODO 알림", {
          //     body: "오늘의 할 일 까먹지 마세요",
          //     icon: "/app-icon/ios/192.png",
          //   });
          // }
        }}
      >
        Notification
      </Button>
      {toDos && <ToDoBox toDos={toDos} />}
      <NavigationBar />
    </Container>
  );
}
