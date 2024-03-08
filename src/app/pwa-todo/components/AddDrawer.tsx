import { Stack, SwipeableDrawer, TextField } from "@mui/material";
import { Box, styled } from "@mui/system";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { TimePicker } from "@mui/x-date-pickers";
import GreyButton from "@/app/pwa-todo/components/GreyButton";
import { grey } from "@mui/material/colors";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { createToDo } from "@/app/pwa-todo/action";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateToDoInput } from "@/app/pwa-todo/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const Puller = styled("div")(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === "light" ? grey[300] : grey[900],
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
}));

export default function AddDrawer({ open, onOpen, onClose }: Props) {
  const [task, setTask] = useState<string>("");
  const [due, setDue] = useState<Dayjs | null>(dayjs());
  const queryClient = useQueryClient();

  const onClickAdd = async () => {
    mutation.mutate({ task, due: due?.toISOString() ?? "" });
    onClose();
  };

  const mutation = useMutation({
    mutationFn: (newToDo: CreateToDoInput) =>
      createToDo(newToDo.task, newToDo.due),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  return (
    <SwipeableDrawer
      anchor={"bottom"}
      open={open}
      onClose={onClose}
      onOpen={onOpen}
    >
      <Stack
        direction={"column"}
        justifyContent={"space-between"}
        sx={{
          width: "100%",
          height: "40vh",
          backgroundColor: "#FFFFFF",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          p: 4,
        }}
      >
        <Box>
          <Puller />
          <TextField
            label={"할 일"}
            sx={{ width: "100%", my: 1 }}
            onChange={(e) => setTask(e.target.value)}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["TimePicker"]}>
              <TimePicker
                label="알림 시간"
                sx={{ width: "100%" }}
                value={due}
                onChange={(newValue) => setDue(newValue)}
              />
            </DemoContainer>
          </LocalizationProvider>
        </Box>
        <GreyButton text={"추가하기"} onClick={onClickAdd} />
      </Stack>
    </SwipeableDrawer>
  );
}
