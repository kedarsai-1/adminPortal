import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Avatar,
  Box
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useAuth } from "../contexts/AuthContext";

export default function Header({ drawerWidth }) {
  const { user, logout } = useAuth();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        bgcolor: "white",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <Toolbar sx={{ gap: 2 }}>
        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", bgcolor: "#f1f5f9", px: 2, borderRadius: 2 }}>
          <SearchIcon sx={{ color: "gray" }} />
          <InputBase placeholder="Search…" sx={{ ml: 1, flex: 1 }} />
        </Box>

        <IconButton>
          <NotificationsIcon />
        </IconButton>

        <Avatar onClick={logout} sx={{ bgcolor: "indigo" }}>
          {user?.name?.[0]}
        </Avatar>
      </Toolbar>
    </AppBar>
  );
}
