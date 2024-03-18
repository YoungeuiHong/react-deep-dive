import { Box } from "@mui/system";
import { useEffect } from "react";

export default function ErrorObject() {
  useEffect(() => {
    throw new Error("에러가 발생했습니다!");
  }, []);

  return <Box width={200} height={200} sx={{ backgroundColor: "#00FF00" }} />;
}
