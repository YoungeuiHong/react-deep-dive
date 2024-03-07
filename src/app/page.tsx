"use client";
import { Button } from "@mui/material";

export default function Home() {
  const onClickVibrate = () => {
    navigator.vibrate(200);
  };

  return (
    <>
      <Button onClick={onClickVibrate}>Click!</Button>
    </>
  );
}
