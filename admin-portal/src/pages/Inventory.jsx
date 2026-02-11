import { useEffect, useState } from "react";
import api from "../services/api";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  CircularProgress,
} from "@mui/material";

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/inventory")
      .then((res) => {
        const list = res.data?.data || [];
        setInventory(Array.isArray(list) ? list : []);
      })
      .catch((err) => {
        console.error("Inventory fetch failed:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box p={3}>
      {/* Header */}
      <Typography variant="h4" fontWeight={700} mb={1}>
        Inventory
      </Typography>
      <Typography color="text.secondary" mb={4}>
        Current stock overview
      </Typography>

      {/* Loading */}
      {loading ? (
        <Stack alignItems="center" mt={6}>
          <CircularProgress />
        </Stack>
      ) : (
        <Grid container spacing={3}>
          {inventory.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <Card
                sx={{
                  borderRadius: 3,
                  transition: "0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight={600}>
                    {item.productName}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mt={0.5}
                  >
                    Stock:{" "}
                    <b>
                      {item.currentStock} {item.unit}
                    </b>
                  </Typography>

                  <Box mt={2}>
                    <Chip
                      label={item.status.replace("_", " ")}
                      size="small"
                      color={
                        item.status === "in_stock"
                          ? "success"
                          : item.status === "low_stock"
                          ? "warning"
                          : "error"
                      }
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}

          {inventory.length === 0 && (
            <Grid item xs={12}>
              <Typography align="center" color="text.secondary">
                No inventory found
              </Typography>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
}
