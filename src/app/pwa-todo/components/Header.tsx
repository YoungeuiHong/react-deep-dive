"use client";
import { IconButton, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import NotificationsOffOutlinedIcon from "@mui/icons-material/NotificationsOffOutlined";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Header() {
  const [alertGranted, setAlertGranted] = useState<boolean>();

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setAlertGranted(Notification.permission === "granted");
    }
  }, []);

  const urlB64ToUint8Array = (base64String: string) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  // Notification 허용 버튼 클릭 시
  const onClickAlert = async () => {
    if ("Notification" in window) {
      Notification.requestPermission().then(async (result) => {
        if (result === "granted") {
          const registration = await navigator.serviceWorker.getRegistration();

          const subscription = await registration?.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlB64ToUint8Array(
              process.env.VAPID_PUBLIC_KEY ?? "",
            ),
          });
          axios
            .post("/api/subscribe", {
              subscription,
            })
            .then(() => {})
            .catch((e) => console.error(e));

          setAlertGranted(true);
        } else if (result === "denied") {
          setAlertGranted(false);
        }
      });
    }
  };

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
      <IconButton onClick={onClickAlert}>
        {alertGranted ? (
          <NotificationsNoneOutlinedIcon />
        ) : (
          <NotificationsOffOutlinedIcon />
        )}
      </IconButton>
    </Stack>
  );
}
