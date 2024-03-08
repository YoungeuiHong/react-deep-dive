"use client";
import { useState } from "react";
import { Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { ToDo } from "@/app/pwa-todo/types";
import { Container } from "@mui/system";
import ToDoBox from "@/app/pwa-todo/components/ToDoBox";

export default function PwaToDoPage() {
  const [toDos, setToDos] = useState<ToDo[]>([
    { id: 1, task: "기술 블로그 글 쓰기", done: false, due: "PM 05:30" },
    { id: 2, task: "밥 맛있게 먹기", done: true, due: "PM 05:30" },
  ]);

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
      <ToDoBox toDos={toDos} />
    </Container>
  );
}
