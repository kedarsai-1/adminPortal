import { useState } from "react";
import { toast } from "sonner";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  TextField,
  Select,
  MenuItem,
  List,
  ListItemButton,
  ListItemText,
  Switch,
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import PublicIcon from "@mui/icons-material/Public";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PrintIcon from "@mui/icons-material/Print";
import BoltIcon from "@mui/icons-material/Bolt";
import SecurityIcon from "@mui/icons-material/Security";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");

  const [settings, setSettings] = useState({
    businessName: "Reco Ecosystem",
    businessEmail: "admin@reco.com",
    businessPhone: "+91 98765 43210",
    currency: "INR",
    invoicePrefix: "INV-",
    defaultTaxRate: 18,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    paperSize: "A4",
    printCopies: 1,
    tallyExport: true,
    tallyPath: "C:\\Tally\\",
    sessionTimeout: 30,
    loginAttempts: 5,
  });

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  const tabs = [
    { id: "general", name: "General", icon: <PublicIcon /> },
    { id: "billing", name: "Billing", icon: <CurrencyRupeeIcon /> },
    { id: "notifications", name: "Notifications", icon: <NotificationsIcon /> },
    { id: "printing", name: "Printing", icon: <PrintIcon /> },
    { id: "integrations", name: "Integrations", icon: <BoltIcon /> },
    { id: "security", name: "Security", icon: <SecurityIcon /> },
  ];

  return (
    <Box p={3}>
      {/* HEADER */}
      <Stack direction="row" justifyContent="space-between" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Settings
          </Typography>
          <Typography color="text.secondary">
            Manage your application preferences
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {/* LEFT MENU */}
        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <List>
                {tabs.map((tab) => (
                  <ListItemButton
                    key={tab.id}
                    selected={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.icon}
                    <ListItemText sx={{ ml: 1 }} primary={tab.name} />
                  </ListItemButton>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* RIGHT CONTENT */}
        <Grid item xs={12} md={9}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              {/* GENERAL */}
              {activeTab === "general" && (
                <Stack spacing={2}>
                  <Typography variant="h6">Business Information</Typography>

                  <TextField
                    label="Business Name"
                    value={settings.businessName}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        businessName: e.target.value,
                      })
                    }
                  />

                  <TextField
                    label="Business Email"
                    value={settings.businessEmail}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        businessEmail: e.target.value,
                      })
                    }
                  />

                  <TextField
                    label="Business Phone"
                    value={settings.businessPhone}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        businessPhone: e.target.value,
                      })
                    }
                  />

                  <Select
                    value={settings.currency}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        currency: e.target.value,
                      })
                    }
                  >
                    <MenuItem value="INR">INR ₹</MenuItem>
                    <MenuItem value="USD">USD $</MenuItem>
                  </Select>
                </Stack>
              )}

              {/* BILLING */}
              {activeTab === "billing" && (
                <Stack spacing={2}>
                  <Typography variant="h6">Billing</Typography>

                  <TextField
                    label="Invoice Prefix"
                    value={settings.invoicePrefix}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        invoicePrefix: e.target.value,
                      })
                    }
                  />

                  <TextField
                    type="number"
                    label="Default Tax Rate"
                    value={settings.defaultTaxRate}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        defaultTaxRate: Number(e.target.value),
                      })
                    }
                  />
                </Stack>
              )}

              {/* NOTIFICATIONS */}
              {activeTab === "notifications" && (
                <Stack spacing={2}>
                  <Typography variant="h6">Notifications</Typography>

                  {[
                    "emailNotifications",
                    "smsNotifications",
                    "pushNotifications",
                  ].map((key) => (
                    <Stack
                      key={key}
                      direction="row"
                      justifyContent="space-between"
                    >
                      <Typography>{key}</Typography>

                      <Switch
                        checked={settings[key]}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            [key]: e.target.checked,
                          })
                        }
                      />
                    </Stack>
                  ))}
                </Stack>
              )}

              {/* PRINTING */}
              {activeTab === "printing" && (
                <Stack spacing={2}>
                  <Typography variant="h6">Printing</Typography>

                  <Select
                    value={settings.paperSize}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        paperSize: e.target.value,
                      })
                    }
                  >
                    <MenuItem value="A4">A4</MenuItem>
                    <MenuItem value="A5">A5</MenuItem>
                  </Select>

                  <TextField
                    type="number"
                    label="Copies"
                    value={settings.printCopies}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        printCopies: Number(e.target.value),
                      })
                    }
                  />
                </Stack>
              )}

              {/* INTEGRATIONS */}
              {activeTab === "integrations" && (
                <Stack spacing={2}>
                  <Typography variant="h6">Tally Integration</Typography>

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                  >
                    <Typography>Enable Tally Export</Typography>

                    <Switch
                      checked={settings.tallyExport}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          tallyExport: e.target.checked,
                        })
                      }
                    />
                  </Stack>

                  <TextField
                    label="Tally Path"
                    value={settings.tallyPath}
                    disabled={!settings.tallyExport}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        tallyPath: e.target.value,
                      })
                    }
                  />
                </Stack>
              )}

              {/* SECURITY */}
              {activeTab === "security" && (
                <Stack spacing={2}>
                  <Typography variant="h6">Security</Typography>

                  <TextField
                    type="number"
                    label="Session Timeout"
                    value={settings.sessionTimeout}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        sessionTimeout: Number(e.target.value),
                      })
                    }
                  />

                  <TextField
                    type="number"
                    label="Login Attempts"
                    value={settings.loginAttempts}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        loginAttempts: Number(e.target.value),
                      })
                    }
                  />
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
