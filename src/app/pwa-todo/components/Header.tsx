"use client";
import { IconButton, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import NotificationsOffOutlinedIcon from "@mui/icons-material/NotificationsOffOutlined";
import { useEffect, useState } from "react";

export default function Header() {
  const [alertGranted, setAlertGranted] = useState<boolean>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAlertGranted(Notification.permission === "granted");
    }
  }, [Notification.permission]);

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
      <IconButton
        onClick={() => {
          Notification.requestPermission().then((result) => {
            if (result === "granted") {
              setAlertGranted(true);
            } else if (result === "denied") {
              setAlertGranted(false);
            }
          });
        }}
      >
        {alertGranted ? (
          <NotificationsNoneOutlinedIcon />
        ) : (
          <NotificationsOffOutlinedIcon />
        )}
      </IconButton>
    </Stack>
  );
}
