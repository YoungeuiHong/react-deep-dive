"use client";
import { useState } from "react";
import { Button } from "@mui/material";

export default function PwaToDoPage() {
  const [toDos, setToDos] = useState([]);

  const onClickVibrate = () => {
    navigator.vibrate(200);
  };

  return (
    <>
      <Button onClick={onClickVibrate}>Click!</Button>
    </>
  );
}
