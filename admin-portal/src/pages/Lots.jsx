import { useState } from "react";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Stack,
  Paper,
  Chip,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import GavelIcon from "@mui/icons-material/Gavel";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";
import Inventory2Icon from "@mui/icons-material/Inventory2";

export default function Lots() {
  const [searchTerm, setSearchTerm] = useState("");

  const mockLots = [1, 2, 3, 4, 5];

  const getStatus = (i) =>
    i % 3 === 0 ? "Sold" : i % 3 === 1 ? "Active" : "Pending";

  const getStatusColor = (status) =>
    status === "Sold"
      ? "success"
      : status === "Active"
      ? "warning"
      : "primary";

  return (
    <Box p={3}>
      {/* HEADER */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Auction Lots
          </Typography>
          <Typography color="text.secondary">
            Manage auction lots and bidding
          </Typography>
        </Box>

        <Button variant="contained" startIcon={<AddIcon />}>
          Create Lot
        </Button>
      </Stack>

      {/* STATS */}
      <Grid container spacing={3} mb={4}>
        {["Total Lots", "Active", "Sold", "Pending"].map((stat, i) => (
          <Grid item xs={12} sm={6} md={3} key={stat}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {stat}
                    </Typography>
                    <Typography variant="h5" fontWeight={700}>
                      {i * 23 + 45}
                    </Typography>
                  </Box>

                  <GavelIcon color="primary" />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* SEARCH + LOTS LIST */}
      <Paper sx={{ borderRadius: 3, p: 3 }}>
        <Box mb={3}>
          <TextField
            fullWidth
            placeholder="Search lots..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1 }} />,
            }}
          />
        </Box>

        <Stack spacing={2}>
          {mockLots.map((i) => {
            const status = getStatus(i);

            return (
              <Card
                key={i}
                sx={{
                  borderRadius: 3,
                  transition: "0.2s",
                  "&:hover": {
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent>
                  {/* TOP ROW */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    mb={2}
                  >
                    <Box>
                      <Typography fontWeight={600}>
                        LOT-{1000 + i}
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={3}
                        mt={1}
                        flexWrap="wrap"
                      >
                        <Stack direction="row" spacing={1}>
                          <Inventory2Icon fontSize="small" />
                          <Typography variant="body2">
                            Tomatoes Grade A
                          </Typography>
                        </Stack>

                        <Stack direction="row" spacing={1}>
                          <PersonIcon fontSize="small" />
                          <Typography variant="body2">
                            Farmer: Raj Kumar
                          </Typography>
                        </Stack>

                        <Stack direction="row" spacing={1}>
                          <CalendarMonthIcon fontSize="small" />
                          <Typography variant="body2">
                            {new Date().toLocaleDateString()}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Box>

                    <Chip
                      label={status}
                      color={getStatusColor(status)}
                      size="small"
                    />
                  </Stack>

                  {/* DETAILS GRID */}
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                      <Typography variant="body2" color="text.secondary">
                        Quantity
                      </Typography>
                      <Typography fontWeight={600}>
                        {100 + i * 50} kg
                      </Typography>
                    </Grid>

                    <Grid item xs={6} md={3}>
                      <Typography variant="body2" color="text.secondary">
                        Starting Price
                      </Typography>
                      <Typography fontWeight={600}>
                        ₹{20 + i * 5}/kg
                      </Typography>
                    </Grid>

                    <Grid item xs={6} md={3}>
                      <Typography variant="body2" color="text.secondary">
                        Current Bid
                      </Typography>
                      <Typography fontWeight={600} color="primary.main">
                        ₹{25 + i * 5}/kg
                      </Typography>
                    </Grid>

                    <Grid item xs={6} md={3}>
                      <Typography variant="body2" color="text.secondary">
                        Commission
                      </Typography>
                      <Typography fontWeight={600}>2.5%</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      </Paper>
    </Box>
  );
}
