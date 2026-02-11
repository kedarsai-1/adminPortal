import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { AuthContext } from "../auth/AuthContext";
import React from "react";

const Navbar = () => {
  const { logout } = useContext(AuthContext);

  return (
    <AppBar
      position="static"
      elevation={1}
      sx={{
        backgroundColor: "#ffffff",
        color: "#1f2937",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo / Title */}
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: "#2563eb" }}
        >
          Admin Portal
        </Typography>

        {/* Right actions */}
        <Box>
          <Button
            variant="contained"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={logout}
            sx={{ textTransform: "none", fontWeight: 500 }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
