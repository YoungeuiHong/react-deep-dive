import { Paper } from "@mui/material";
import { styled } from "@mui/system";

interface Props {
  isStandalone: boolean;
}

export const StyledNavigationPaper = styled(Paper)<Props>(
  ({ isStandalone }) => ({
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    pb: isStandalone ? 3 : 0,
  }),
);
