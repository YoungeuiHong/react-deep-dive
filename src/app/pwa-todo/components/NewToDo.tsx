"use client";
import { useState } from "react";
import AddDrawer from "@/app/pwa-todo/components/AddDrawer";
import GreyButton from "@/app/pwa-todo/components/GreyButton";

export default function NewToDo() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <GreyButton text={"+ 할 일을 추가하세요"} onClick={() => setOpen(true)} />
      <AddDrawer
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      />
    </>
  );
}
