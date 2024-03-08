import { Checkbox, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { ToDo, UpdateToDoInput } from "@/app/pwa-todo/types";
import dayjs from "dayjs";
import { ChangeEvent } from "react";
import { updateToDoStatus } from "@/app/pwa-todo/action";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Props {
  todo: ToDo;
}

export default function ToDoCard({ todo }: Props) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newToDo: UpdateToDoInput) =>
      updateToDoStatus(newToDo.id, newToDo.done),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  const onChangeDone = async (e: ChangeEvent<HTMLInputElement>) => {
    mutation.mutate({ id: todo.id, done: e.target.checked });
  };

  return (
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      sx={{
        borderRadius: 2,
        backgroundColor: "#fdebf3",
        borderLeft: "10px solid #fcdbe6",
        p: 1,
      }}
    >
      <Stack direction={"column"}>
        <Typography variant={"caption"} color={grey["600"]}>
          {dayjs(todo.due).format("A h:mm")}
        </Typography>
        <Typography variant={"body1"}>{todo.task}</Typography>
      </Stack>
      <Checkbox
        checked={todo.done}
        sx={{
          "&.Mui-checked": {
            color: "#eb8291",
          },
        }}
        onChange={onChangeDone}
      />
    </Stack>
  );
}
