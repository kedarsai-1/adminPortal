import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Stack,
} from "@mui/material";

import {
  People,
  Inventory2,
  CurrencyRupee,
  Gavel,
  ArrowUpward,
  ArrowDownward,
  ShoppingCart,
} from "@mui/icons-material";

import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* -------------------- DATA -------------------- */

const stats = [
  {
    title: "Total Revenue",
    value: "₹2.4L",
    change: "+12.5%",
    up: true,
    icon: <CurrencyRupee />,
    color: "#6366f1",
  },
  {
    title: "Active Lots",
    value: "156",
    change: "+8.2%",
    up: true,
    icon: <Gavel />,
    color: "#10b981",
  },
  {
    title: "Users",
    value: "892",
    change: "+23.1%",
    up: true,
    icon: <People />,
    color: "#0ea5e9",
  },
  {
    title: "Products",
    value: "342",
    change: "-2.4%",
    up: false,
    icon: <Inventory2 />,
    color: "#f97316",
  },
];

const salesData = [
  { month: "Jan", sales: 4000 },
  { month: "Feb", sales: 3000 },
  { month: "Mar", sales: 2000 },
  { month: "Apr", sales: 2780 },
  { month: "May", sales: 1890 },
  { month: "Jun", sales: 2390 },
];

const categoryData = [
  { name: "Vegetables", value: 400, color: "#22c55e" },
  { name: "Fruits", value: 300, color: "#f59e0b" },
  { name: "Grains", value: 200, color: "#0ea5e9" },
  { name: "Others", value: 100, color: "#a855f7" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const total = categoryData.reduce((a, b) => a + b.value, 0);

  return (
    <Box p={3}>
      {/* HEADER */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight={700}>
          Dashboard
        </Typography>
        <Typography color="text.secondary">
          Marketplace performance overview
        </Typography>
      </Box>

      {/* STATS */}
      <Grid container spacing={3}>
        {stats.map((s) => (
          <Grid item xs={12} sm={6} md={3} key={s.title}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" fontSize={14}>
                      {s.title}
                    </Typography>

                    <Typography variant="h5" fontWeight={700}>
                      {s.value}
                    </Typography>

                    <Stack direction="row" spacing={0.5}>
                      {s.up ? (
                        <ArrowUpward sx={{ color: "success.main" }} />
                      ) : (
                        <ArrowDownward sx={{ color: "error.main" }} />
                      )}

                      <Typography
                        fontSize={13}
                        color={s.up ? "success.main" : "error.main"}
                      >
                        {s.change}
                      </Typography>
                    </Stack>
                  </Box>

                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: s.color,
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {s.icon}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* CHARTS FIXED */}
      <Grid container spacing={3} mt={1}>
        {/* LINE CHART */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography fontWeight={600} mb={2}>
                Sales Trend
              </Typography>

              <Box sx={{ width: "100%", height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#6366f1"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* PIE CHART FIXED */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography fontWeight={600} mb={2}>
                Category Distribution
              </Typography>

              <Box sx={{ position: "relative", height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={3}
                    >
                      {categoryData.map((c, i) => (
                        <Cell key={i} fill={c.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                {/* CENTER LABEL */}
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                  }}
                >
                  <Typography fontWeight={700} fontSize={22}>
                    {total}
                  </Typography>
                  <Typography fontSize={13} color="text.secondary">
                    Total Items
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* QUICK ACTIONS */}
      <Grid container spacing={3} mt={1}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography fontWeight={600} mb={2}>
                Quick Actions
              </Typography>

              <Stack spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<Gavel />}
                  onClick={() => navigate("/lots")}
                >
                  Create Lot
                </Button>

                <Button
                  variant="contained"
                  color="success"
                  startIcon={<ShoppingCart />}
                  onClick={() => navigate("/invoices")}
                >
                  Generate Invoice
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
