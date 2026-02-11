import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import MuiHeader from "../Header";
import MuiSidebar from "../Sidebar";

const drawerWidth = 260;

export default function MainLayout() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f9fafb" }}>
      
      {/* Sidebar */}
      <MuiSidebar drawerWidth={drawerWidth} />

      {/* Main content */}
      <Box sx={{ flexGrow: 1 }}>
        <MuiHeader drawerWidth={drawerWidth} />

        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
