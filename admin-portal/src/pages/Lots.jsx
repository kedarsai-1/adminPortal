import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { lotService } from "../services/api";

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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import GavelIcon from "@mui/icons-material/Gavel";

/* ---------------- CREATE LOT MODAL ---------------- */

function CreateLotModal({ open, onClose, onCreate }) {
  const [form, setForm] = useState({
    productId: "",
    productName: "",
    sellerId: "",
    sellerName: "",
    quantityValue: "",
    quantityUnit: "kg",
    startingPrice: "",
  });

  const handleSubmit = () => {
    const body = {
      lotNumber: "LOT-" + Date.now(),
      productId: form.productId,
      productName: form.productName,
      sellerId: form.sellerId,
      sellerName: form.sellerName,
      quantity: {
        value: Number(form.quantityValue),
        unit: form.quantityUnit,
      },
      startingPrice: Number(form.startingPrice),
      auctionDate: new Date().toISOString(),
      status: "active",
    };

    onCreate(body);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Lot</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField label="Product ID"
            value={form.productId}
            onChange={(e)=>setForm({...form,productId:e.target.value})}
          />

          <TextField label="Product Name"
            value={form.productName}
            onChange={(e)=>setForm({...form,productName:e.target.value})}
          />

          <TextField label="Seller ID"
            value={form.sellerId}
            onChange={(e)=>setForm({...form,sellerId:e.target.value})}
          />

          <TextField label="Seller Name"
            value={form.sellerName}
            onChange={(e)=>setForm({...form,sellerName:e.target.value})}
          />

          <TextField label="Quantity"
            type="number"
            value={form.quantityValue}
            onChange={(e)=>setForm({...form,quantityValue:e.target.value})}
          />

          <TextField label="Starting Price"
            type="number"
            value={form.startingPrice}
            onChange={(e)=>setForm({...form,startingPrice:e.target.value})}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* ---------------- PAGE ---------------- */

export default function Lots() {
  const queryClient = useQueryClient();

  const [searchTerm,setSearchTerm] = useState("");
  const [openCreate,setOpenCreate] = useState(false);

  /* -------- FETCH LOTS -------- */

  const { data: lots = [] } = useQuery({
    queryKey:["lots"],
    queryFn: async ()=>{
      const res = await lotService.getAll();
      console.log("LOTS RESPONSE:", res.data);
      return res.data?.data || [];
    }
  });

  /* -------- CREATE -------- */

  const createMutation = useMutation({
    mutationFn: lotService.create,
    onSuccess:()=>{
      queryClient.invalidateQueries(["lots"]);
      setOpenCreate(false);
    }
  });

  const filteredLots = lots.filter(l =>
    l.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box p={3}>
      <Stack direction="row" justifyContent="space-between" mb={4}>
        <Typography variant="h4" fontWeight={700}>
          Auction Lots
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon/>}
          onClick={()=>setOpenCreate(true)}
        >
          Create Lot
        </Button>
      </Stack>

      <Paper sx={{p:3,borderRadius:3}}>
        <TextField
          fullWidth
          placeholder="Search lots..."
          value={searchTerm}
          onChange={(e)=>setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment:<SearchIcon sx={{mr:1}}/>
          }}
        />

        <Grid container spacing={3} mt={1}>
          {filteredLots.map(lot=>(
            <Grid item xs={12} md={6} key={lot._id}>
              <Card sx={{borderRadius:3}}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between">
                    <Box>
                      <Typography fontWeight={600}>
                        {lot.productName}
                      </Typography>

                      <Typography variant="body2">
                        Qty: {lot.quantity?.value} {lot.quantity?.unit}
                      </Typography>

                      <Typography variant="body2">
                        ₹{lot.startingPrice}
                      </Typography>
                    </Box>

                    <Chip
                      icon={<GavelIcon/>}
                      label={lot.status}
                      color="primary"
                      size="small"
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <CreateLotModal
        open={openCreate}
        onClose={()=>setOpenCreate(false)}
        onCreate={(data)=>createMutation.mutate(data)}
      />
    </Box>
  );
}
