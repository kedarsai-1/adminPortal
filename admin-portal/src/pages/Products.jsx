import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../services/api";
import { toast } from "sonner";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  CircularProgress,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Inventory2Icon from "@mui/icons-material/Inventory2";

/* ===================== MODAL ===================== */

function ProductModal({ open, product, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    localName: "",
    category: "vegetables",
    unit: "kg",
    pricing: { basePrice: 0, sellingPrice: 0 },
  });

  useEffect(() => {
    setFormData(
      product || {
        name: "",
        localName: "",
        category: "vegetables",
        unit: "kg",
        pricing: { basePrice: 0, sellingPrice: 0 },
      }
    );
  }, [product]);

  const handleSubmit = () => {
    if (!formData.name) {
      toast.error("Product name required");
      return;
    }

    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {product ? "Edit Product" : "Add Product"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Product Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />

          <TextField
            label="Local Name"
            value={formData.localName}
            onChange={(e) =>
              setFormData({ ...formData, localName: e.target.value })
            }
          />

          <Select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <MenuItem value="vegetables">Vegetables</MenuItem>
            <MenuItem value="fruits">Fruits</MenuItem>
            <MenuItem value="grains">Grains</MenuItem>
            <MenuItem value="pulses">Pulses</MenuItem>
            <MenuItem value="spices">Spices</MenuItem>
          </Select>

          <Select
            value={formData.unit}
            onChange={(e) =>
              setFormData({ ...formData, unit: e.target.value })
            }
          >
            <MenuItem value="kg">Kg</MenuItem>
            <MenuItem value="gram">Gram</MenuItem>
            <MenuItem value="liter">Liter</MenuItem>
            <MenuItem value="piece">Piece</MenuItem>
          </Select>

          <TextField
            label="Base Price"
            type="number"
            value={formData.pricing.basePrice}
            onChange={(e) =>
              setFormData({
                ...formData,
                pricing: {
                  ...formData.pricing,
                  basePrice: Number(e.target.value),
                },
              })
            }
          />

          <TextField
            label="Selling Price"
            type="number"
            value={formData.pricing.sellingPrice}
            onChange={(e) =>
              setFormData({
                ...formData,
                pricing: {
                  ...formData.pricing,
                  sellingPrice: Number(e.target.value),
                },
              })
            }
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* ===================== PAGE ===================== */

export default function Products() {
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  /* ---------- FETCH ---------- */

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await productService.getAll();
      return res.data?.data || [];
    },
  });

  /* ---------- CREATE ---------- */

  const createMutation = useMutation({
    mutationFn: productService.create,
    onSuccess: () => {
      toast.success("Product created");
      queryClient.invalidateQueries(["products"]);
      setShowModal(false);
    },
    onError: (err) => {
      console.log("CREATE ERROR", err.response?.data);
      toast.error(err.response?.data?.message || "Create failed");
    },
  });

  /* ---------- UPDATE ---------- */

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) =>
      productService.update(id, data),
    onSuccess: () => {
      toast.success("Product updated");
      queryClient.invalidateQueries(["products"]);
      setShowModal(false);
    },
  });

  /* ---------- DELETE ---------- */

  const deleteMutation = useMutation({
    mutationFn: (id) => productService.delete(id),
    onSuccess: () => {
      toast.success("Product deleted");
      queryClient.invalidateQueries(["products"]);
    },
  });

  const handleSave = (formData) => {
    if (selectedProduct) {
      updateMutation.mutate({
        id: selectedProduct._id,
        data: formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <Box p={3}>
      {/* HEADER */}
      <Stack direction="row" justifyContent="space-between" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Products
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedProduct(null);
            setShowModal(true);
          }}
        >
          Add Product
        </Button>
      </Stack>

      {/* GRID */}
      <Grid container spacing={3}>
        {isLoading ? (
          <CircularProgress />
        ) : products.length > 0 ? (
          products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Stack direction="row" spacing={2}>
                    <Inventory2Icon color="primary" />

                    <Box>
                      <Typography fontWeight={600}>
                        {product.name}
                      </Typography>
                      <Typography variant="body2">
                        {product.localName}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack mt={2} spacing={1}>
                    <Chip label={product.category} size="small" />
                    <Typography fontWeight={600}>
                      ₹{product.pricing?.sellingPrice || 0}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} mt={2}>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowModal(true);
                      }}
                    >
                      Edit
                    </Button>

                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() =>
                        deleteMutation.mutate(product._id)
                      }
                    >
                      Delete
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography>No products found</Typography>
        )}
      </Grid>

      {/* MODAL */}
      <ProductModal
        open={showModal}
        product={selectedProduct}
        onClose={() => {
          setShowModal(false);
          setSelectedProduct(null);
        }}
        onSave={handleSave}
      />
    </Box>
  );
}
