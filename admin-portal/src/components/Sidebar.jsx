import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider
} from "@mui/material";
import { NavLink } from "react-router-dom";

import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CategoryIcon from "@mui/icons-material/Category";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";

export default function Sidebar({ drawerWidth = 260 }) {
  const menuItems = [
    { text: "Dashboard", path: "/", icon: <DashboardIcon /> },
    { text: "Inventory", path: "/inventory", icon: <InventoryIcon /> },
    { text: "Invoices", path: "/invoices", icon: <ReceiptIcon /> },
    { text: "Ledgers", path: "/ledgers", icon: <AccountBalanceIcon /> },
    { text: "Lots", path: "/lots", icon: <LocalOfferIcon /> },
    { text: "Products", path: "/products", icon: <CategoryIcon /> },
    { text: "Services", path: "/services", icon: <MiscellaneousServicesIcon /> },
    { text: "Prices", path: "/prices", icon: <LocalOfferIcon /> },
    { text: "Users", path: "/users", icon: <PeopleIcon /> },
    { text: "Settings", path: "/settings", icon: <SettingsIcon /> },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: "1px solid #e5e7eb",
        },
      }}
    >
      <Toolbar>
        <Typography fontWeight={700} fontSize={20}>
          Reco
        </Typography>
      </Toolbar>

      <Divider />

      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            component={NavLink}
            to={item.path}
            sx={{
              "&.active": {
                bgcolor: "#eef2ff",
                color: "#4f46e5",
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
