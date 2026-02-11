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
  IconButton,
  Chip,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import DescriptionIcon from "@mui/icons-material/Description";

export default function Invoices() {
  const [searchTerm, setSearchTerm] = useState("");

  const mockInvoices = [1, 2, 3, 4, 5, 6, 7, 8];

  const getStatus = (i) =>
    i % 3 === 0 ? "Paid" : i % 3 === 1 ? "Pending" : "Overdue";

  const getStatusColor = (status) =>
    status === "Paid"
      ? "success"
      : status === "Pending"
      ? "warning"
      : "error";

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
            Invoices
          </Typography>
          <Typography color="text.secondary">
            Manage billing and invoices
          </Typography>
        </Box>

        <Button variant="contained" startIcon={<AddIcon />}>
          New Invoice
        </Button>
      </Stack>

      {/* STATS CARDS */}
      <Grid container spacing={3} mb={4}>
        {[
          { label: "Total Revenue", value: "₹2.4L", color: "primary" },
          { label: "Paid", value: "₹1.8L", color: "success" },
          { label: "Pending", value: "₹0.5L", color: "warning" },
          { label: "Overdue", value: "₹0.1L", color: "error" },
        ].map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.label}>
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

                  <DescriptionIcon color={item.color} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* SEARCH + TABLE */}
      <Paper sx={{ borderRadius: 3, p: 3 }}>
        <Box mb={3}>
          <TextField
            fullWidth
            placeholder="Search invoices..."
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
              <TableCell>Invoice #</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {mockInvoices.map((i) => {
              const status = getStatus(i);

              return (
                <TableRow key={i} hover>
                  <TableCell sx={{ fontWeight: 600 }}>
                    INV-{2024000 + i}
                  </TableCell>

                  <TableCell>Customer {i}</TableCell>

                  <TableCell>
                    {new Date().toLocaleDateString()}
                  </TableCell>

                  <TableCell sx={{ fontWeight: 600 }}>
                    ₹{(Math.random() * 50000).toFixed(2)}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={status}
                      color={getStatusColor(status)}
                      size="small"
                    />
                  </TableCell>

                  <TableCell align="right">
                    <IconButton>
                      <VisibilityIcon />
                    </IconButton>

                    <IconButton>
                      <DownloadIcon />
                    </IconButton>

                    <IconButton>
                      <PrintIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
