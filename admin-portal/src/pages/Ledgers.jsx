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
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import MenuBookIcon from "@mui/icons-material/MenuBook";

export default function Ledgers() {
  const [searchTerm, setSearchTerm] = useState("");

  const mockData = [1, 2, 3, 4, 5, 6, 7];

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
            Ledgers
          </Typography>
          <Typography color="text.secondary">
            Track financial ledgers and party balances
          </Typography>
        </Box>

        <Button variant="contained" startIcon={<AddIcon />}>
          Add Entry
        </Button>
      </Stack>

      {/* STATS */}
      <Grid container spacing={3} mb={4}>
        {[
          {
            label: "Total Receivables",
            value: "₹3.2L",
            icon: <TrendingUpIcon color="success" />,
          },
          {
            label: "Total Payables",
            value: "₹1.8L",
            icon: <TrendingDownIcon color="error" />,
          },
          {
            label: "Net Balance",
            value: "₹1.4L",
            icon: <MenuBookIcon color="primary" />,
          },
        ].map((item) => (
          <Grid item xs={12} md={4} key={item.label}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {item.label}
                    </Typography>
                    <Typography variant="h5" fontWeight={700}>
                      {item.value}
                    </Typography>
                  </Box>
                  {item.icon}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* TABLE */}
      <Paper sx={{ borderRadius: 3, p: 3 }}>
        <Box mb={3}>
          <TextField
            fullWidth
            placeholder="Search parties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1 }} />,
            }}
          />
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Party Name</TableCell>
              <TableCell>Party Type</TableCell>
              <TableCell>Opening Balance</TableCell>
              <TableCell>Debit</TableCell>
              <TableCell>Credit</TableCell>
              <TableCell>Closing Balance</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {mockData.map((i) => (
              <TableRow key={i} hover>
                <TableCell sx={{ fontWeight: 600 }}>
                  Party {i}
                </TableCell>

                <TableCell>
                  <Chip
                    label={i % 2 === 0 ? "Buyer" : "Seller"}
                    color="primary"
                    size="small"
                  />
                </TableCell>

                <TableCell>
                  ₹{(Math.random() * 10000).toFixed(2)}
                </TableCell>

                <TableCell sx={{ color: "success.main", fontWeight: 600 }}>
                  ₹{(Math.random() * 50000).toFixed(2)}
                </TableCell>

                <TableCell sx={{ color: "error.main", fontWeight: 600 }}>
                  ₹{(Math.random() * 40000).toFixed(2)}
                </TableCell>

                <TableCell sx={{ fontWeight: 700 }}>
                  ₹{(Math.random() * 20000).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
