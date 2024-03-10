"use client";
import { SyntheticEvent, useState } from "react";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { useRouter } from "next/navigation";
import { grey, red } from "@mui/material/colors";

export default function NavigationBar() {
  const router = useRouter();
  const [value, setValue] = useState("home");

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Paper
      sx={{
        // backgroundColor: "transparent",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        width: "100%",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        pb: 3,
      }}
    >
      <BottomNavigation
        value={value}
        onChange={handleChange}
        showLabels={false}
        sx={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderTop: "1px solid #eeeeee",
          borderLeft: "1px solid #eeeeee",
          borderRight: "1px solid #eeeeee",
          px: 4,
          pt: 0.5,
          "& .MuiBottomNavigationAction-root, svg": {
            fontSize: 28,
            color: grey[500],
          },
          ".Mui-selected svg": {
            fontSize: 28,
            color: red[300],
          },
        }}
      >
        <BottomNavigationAction
          value="home"
          icon={<HomeOutlinedIcon />}
          onClick={() => router.push("/")}
        />
        <BottomNavigationAction
          value="feeds"
          icon={<PeopleAltOutlinedIcon />}
          onClick={() => router.push("/feeds")}
        />
        <BottomNavigationAction
          value="new"
          icon={<AddCircleOutlineOutlinedIcon />}
          onClick={() => router.push("/fundings/creation")}
        />
        <BottomNavigationAction
          value="profile"
          icon={<AccountCircleOutlinedIcon />}
          // TODO: example-id를 로그인된 아이디로 수정 필요
          onClick={() => router.push("/profile/example-id")}
        />
        <BottomNavigationAction
          value="setting"
          icon={<SettingsOutlinedIcon />}
          onClick={() => router.push("/setting")}
        />
      </BottomNavigation>
    </Paper>
  );
}
