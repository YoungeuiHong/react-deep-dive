import { Checkbox, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { ToDo } from "@/app/pwa-todo/types";

interface Props {
  todo: ToDo;
}

export default function ToDoCard({ todo }: Props) {
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
          {todo.due}
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
      />
    </Stack>
  );
}
