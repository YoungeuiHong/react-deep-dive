"use client";
import { grey } from "@mui/material/colors";
import { Container } from "@mui/system";
import ToDoBox from "@/app/pwa-todo/components/ToDoBox";
import { getAllToDo } from "@/app/pwa-todo/action";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { PushSubscription, ToDo } from "@/app/pwa-todo/types";
import NavigationBar from "@/app/pwa-todo/components/NavigationBar";
import Header from "@/app/pwa-todo/components/Header";
import axios from "axios";
import { Button } from "@mui/material";
import webpush from "web-push";

export default function PwaToDoPage() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log(
            "Service Worker registration successful with scope: ",
            registration.scope,
          );
        })
        .catch((err) =>
          console.error("Service Worker registration failed: ", err),
        );
    }
  }, []);

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

  const pushNotification = async () => {
    const subscriptions: PushSubscription[] = await axios
      .get("/api/subscribe")
      .then((response) => response.data);

    let promiseChain = Promise.resolve();

    for (let i = 0; i < subscriptions.length; i++) {
      const subscription = subscriptions[i];
      promiseChain = promiseChain.then(() => {
        return triggerPushMsg(subscription, "알림 테스트!!!");
      });
    }

    return promiseChain;
  };

  const triggerPushMsg = function (subscription, dataToSend) {
    webpush.setVapidDetails(
      process.env.VAPID_SUBJECT ?? "mailto:dev.yehong@gmail.com",
      process.env.VAPID_PUBLIC_KEY ??
        "BCwcX6sPcH0vuFZ97UAvziamP9qMo0qV2c5uns_YwHTp6XQKXdFDTgH9fD3hBr9oQVmO4kh7oS7HZyg-czft0Pc",
      process.env.VAPID_PRIVATE_KEY ??
        "YFZJr1aOS3OjGhY1a_7bxaRUIvw5azZCd2VcgEKNwOM",
    );

    return webpush.sendNotification(subscription, dataToSend);
  };

  return (
    <Container
      maxWidth={"sm"}
      sx={{ backgroundColor: grey["100"], height: "100vh", pt: 4 }}
    >
      <Header />
      <Button onClick={pushNotification}>Push!</Button>
      {toDos && <ToDoBox toDos={toDos} />}
      <NavigationBar />
    </Container>
  );
}
