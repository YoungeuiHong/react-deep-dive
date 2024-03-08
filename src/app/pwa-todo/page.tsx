"use client";
import { Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Container } from "@mui/system";
import ToDoBox from "@/app/pwa-todo/components/ToDoBox";
import { getAllToDo } from "@/app/pwa-todo/action";
import { useQuery } from "@tanstack/react-query";

export default function PwaToDoPage() {
  const { data: toDos } = useQuery({
    queryKey: ["todos"],
    queryFn: () => getAllToDo(),
  });

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
      {toDos && <ToDoBox toDos={toDos} />}
    </Container>
  );
}
