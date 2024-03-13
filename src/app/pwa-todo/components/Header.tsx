"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { IconButton, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import NotificationsOffOutlinedIcon from "@mui/icons-material/NotificationsOffOutlined";
import ForwardToInboxOutlinedIcon from "@mui/icons-material/ForwardToInboxOutlined";
import { SubscriptionInfo } from "@/app/pwa-todo/types";

export default function Header() {
  const [alertGranted, setAlertGranted] = useState<boolean>();

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setAlertGranted(Notification.permission === "granted");
    }
  }, []);

  // PushSubscription을 가져오는 함수
  async function getPushSubscription(): Promise<PushSubscription | null> {
    try {
      const registration = await navigator.serviceWorker.getRegistration();

      if (!registration) {
        console.error("ServiceWorkerRegistration을 찾을 수 없습니다.");
        return null;
      }

      if (!process.env.VAPID_PUBLIC_KEY) {
        console.error("VAPID Puplic key가 존재하지 않습니다.");
        return null;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.VAPID_PUBLIC_KEY,
      });

      return subscription;
    } catch (e) {
      console.error(
        "PushSubscription을 가져오는 동안 오류가 발생했습니다: ",
        e,
      );
      return null;
    }
  }

  // 서버에 PushSubscription을 저장하는 함수
  async function savePushSubscription(subscription: PushSubscription | null) {
    if (!subscription) {
      console.error("PushSubscription이 존재하지 않습니다.");
      return;
    }

    axios
      .post("/api/subscribe", {
        subscription,
      })
      .catch((e) => console.error(e));
  }

  // Notification 허용 버튼 클릭 시
  async function onClickAlert() {
    if (
      "serviceWorker" in navigator &&
      "Notification" in window &&
      "PushManager" in window
    ) {
      Notification.requestPermission().then(async (result) => {
        if (result === "granted") {
          const subscription = await getPushSubscription();
          await savePushSubscription(subscription);
          setAlertGranted(true);
        } else if (result === "denied") {
          setAlertGranted(false);
        }
      });
    }
  }

  // 구독하고 있는 클라이언트들에게 Push 알림을 보내는 함수
  async function pushNotification() {
    const subscriptions = await axios
      .get("/api/subscribe")
      .then((response) => response.data);

    let promiseChain = Promise.resolve();

    for (let i = 0; i < subscriptions.length; i++) {
      const subscription = subscriptions[i];
      promiseChain = promiseChain.then(() => {
        return triggerPushMsg(
          subscription,
          "🔔 TODO",
          "오늘의 할 일 잊지 마세요!",
        );
      });
    }

    return promiseChain;
  }

  async function triggerPushMsg(
    pushSubscription: SubscriptionInfo,
    title: string,
    message: string,
  ) {
    await axios
      .post("/api/send-message", {
        pushSubscription: pushSubscription.subscription,
        title,
        message,
      })
      .catch((e) => console.error(e));
  }

  return (
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      sx={{ ml: 1, mb: 3 }}
    >
      <Typography variant={"h5"} color={grey["800"]} sx={{ fontWeight: "800" }}>
        TODO
      </Typography>
      <div>
        <IconButton onClick={pushNotification}>
          <ForwardToInboxOutlinedIcon />
        </IconButton>
        <IconButton onClick={onClickAlert}>
          {alertGranted ? (
            <NotificationsNoneOutlinedIcon />
          ) : (
            <NotificationsOffOutlinedIcon />
          )}
        </IconButton>
      </div>
    </Stack>
  );
}
