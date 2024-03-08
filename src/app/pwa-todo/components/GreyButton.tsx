import { grey } from "@mui/material/colors";
import { Button, Typography } from "@mui/material";

interface Props {
  text: string;
  onClick: () => void;
}

export default function GreyButton({ text, onClick }: Props) {
  return (
    <Button
      fullWidth
      sx={{
        backgroundColor: grey[200],
        color: "#000000",
        p: 2,
        borderRadius: 2,
      }}
      onClick={onClick}
    >
      <Typography variant={"body1"}>{text}</Typography>
    </Button>
  );
}
