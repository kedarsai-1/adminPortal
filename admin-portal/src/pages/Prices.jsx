import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { priceService } from "../services/api";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { toast } from "sonner";

export default function Prices() {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    productId: "",
    marketId: "",
    price: "",
    date: "",
  });

  /* ---------------- FETCH PRICES ---------------- */

  const { data: prices = [], isLoading } = useQuery({
    queryKey: ["prices"],
    queryFn: async () => {
      const res = await priceService.getAll();
      return res.data?.data || [];
    },
  });

  /* ---------------- CREATE PRICE ---------------- */

  const createMutation = useMutation({
    mutationFn: priceService.create,
    onSuccess: () => {
      toast.success("Price added");
      queryClient.invalidateQueries(["prices"]);
      setForm({ productId: "", marketId: "", price: "", date: "" });
    },
    onError: (e) => toast.error(e.message || "Failed"),
  });

  /* ---------------- DELETE PRICE ---------------- */

  const deleteMutation = useMutation({
    mutationFn: priceService.remove, // ⭐ fixed
    onSuccess: () => {
      toast.success("Price deleted");
      queryClient.invalidateQueries(["prices"]);
    },
  });

  const submit = (e) => {
    e.preventDefault();
    createMutation.mutate(form);
  };

  /* ---------------- UI ---------------- */

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight={700} mb={1}>
        Market Prices
      </Typography>
      <Typography color="text.secondary" mb={4}>
        Daily price updates across markets
      </Typography>

      {/* ---------- ADD PRICE FORM ---------- */}

      <Card sx={{ borderRadius: 3, mb: 4 }}>
        <CardContent>
          <Box component="form" onSubmit={submit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Product ID"
                  value={form.productId}
                  onChange={(e) =>
                    setForm({ ...form, productId: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Market ID"
                  value={form.marketId}
                  onChange={(e) =>
                    setForm({ ...form, marketId: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  type="number"
                  label="Price ₹"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm({ ...form, date: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{ height: "56px", borderRadius: 2 }}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {/* ---------- TABLE ---------- */}

      <Paper sx={{ borderRadius: 3 }}>
        {isLoading ? (
          <Stack alignItems="center" p={5}>
            <CircularProgress />
          </Stack>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Market</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {prices.map((p) => (
                <TableRow key={p._id} hover>
                  <TableCell>{p.productId}</TableCell>
                  <TableCell>{p.marketId}</TableCell>

                  <TableCell sx={{ fontWeight: 600, color: "success.main" }}>
                    ₹{p.price}
                  </TableCell>

                  <TableCell>
                    {new Date(p.date).toLocaleDateString()}
                  </TableCell>

                  <TableCell align="right">
                    <IconButton
                      color="error"
                      onClick={() => deleteMutation.mutate(p._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {prices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No prices found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
}
