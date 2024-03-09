"use client";
import { Button, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Container } from "@mui/system";
import ToDoBox from "@/app/pwa-todo/components/ToDoBox";
import { getAllToDo } from "@/app/pwa-todo/action";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default function PwaToDoPage() {
  const { data: toDos } = useQuery({
    queryKey: ["todos"],
    queryFn: () => getAllToDo(),
  });

  // useEffect(() => {
  //   console.log("알람 허용 여부: ", Notification.permission);
  //
  //   navigator.serviceWorker
  //     .register("/pwa-todo/sw.js")
  //     .then((registration) =>
  //       console.log(
  //         "🔥 Service Worker registration successful with scope: ",
  //         registration.scope,
  //       ),
  //     )
  //     .catch((err) => console.log("Service Worker registration failed: ", err));
  // }, []);

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
            console.log("허락됐나?", result);
          });
        }}
      >
        Permission
      </Button>
      <Button
        onClick={() => {
          navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification("Vibration Sample", {
              body: "Buzz! Buzz!",
              icon: "../images/touch/chrome-touch-icon-192x192.png",
              vibrate: [200, 100, 200, 100, 200, 100, 200],
              tag: "vibration-sample",
            });
          });
        }}
      >
        Notification
      </Button>
      {toDos && <ToDoBox toDos={toDos} />}
    </Container>
  );
}
