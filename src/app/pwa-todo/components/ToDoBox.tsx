import { Stack, Typography } from "@mui/material";
import ToDoCard from "@/app/pwa-todo/components/ToDoCard";
import { ToDo } from "@/app/pwa-todo/types";
import dayjs from "dayjs";
import NewToDo from "@/app/pwa-todo/components/NewToDo";

interface Props {
  toDos: ToDo[];
}

export default function ToDoBox({ toDos }: Props) {
  return (
    <Stack
      direction={"column"}
      spacing={1}
      sx={{ p: 2, borderRadius: 4, backgroundColor: "#ffffff" }}
    >
      <Typography variant={"h6"} color={"#eb7777"} fontWeight={700} py={1}>
        {dayjs().format("YYYY년 M월 D일 (ddd)")}
      </Typography>
      {toDos?.map((todo) => <ToDoCard key={todo.id} todo={todo} />)}
      <NewToDo />
    </Stack>
  );
}
