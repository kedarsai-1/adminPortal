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

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/services")
      .then((res) => {
        const list = res.data?.data || [];
        setServices(Array.isArray(list) ? list : []);
      })
      .catch((err) => {
        console.error("Failed to load services:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box p={3}>
      {/* Header */}
      <Typography variant="h4" fontWeight={700} mb={1}>
        Services
      </Typography>
      <Typography color="text.secondary" mb={4}>
        Available marketplace services
      </Typography>

      {/* Loading */}
      {loading ? (
        <Stack alignItems="center" mt={6}>
          <CircularProgress />
        </Stack>
      ) : (
        <Grid container spacing={3}>
          {services.map((service) => (
            <Grid item xs={12} sm={6} md={4} key={service._id}>
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
                    {service.serviceName}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textTransform: "capitalize", mt: 0.5 }}
                  >
                    {service.serviceType}
                  </Typography>

                  <Typography mt={1} fontWeight={500}>
                    ₹ {service.pricing?.rate} / {service.pricing?.type}
                  </Typography>

                  <Box mt={2}>
                    <Chip
                      label={service.status}
                      size="small"
                      color={
                        service.status === "active" ? "success" : "error"
                      }
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}

          {services.length === 0 && (
            <Grid item xs={12}>
              <Typography align="center" color="text.secondary">
                No services available
              </Typography>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
}
