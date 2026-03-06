import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

// Thunks
export const fetchAllOrders = createAsyncThunk(
    "orders/fetchAll",
    async (_, thunkAPI) => {
        try {
            const { data } = await api.get("/orders");
            return data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e.response?.data?.message || "Erreur de chargement des commandes");
        }
    }
);

export const updateOrderStatus = createAsyncThunk(
    "orders/updateStatus",
    async ({ id, status }, thunkAPI) => {
        try {
            const { data } = await api.put(`/orders/${id}/status`, { status });
            return data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e.response?.data?.message || "Erreur de mise à jour du statut");
        }
    }
);

// Slice
const orderSlice = createSlice({
    name: "orders",
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Orders
            .addCase(fetchAllOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Status
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                // Mets à jour la commande concernée dans la liste
                const updatedOrder = action.payload.order;
                if (updatedOrder) {
                    const index = state.list.findIndex((o) => o._id === updatedOrder._id);
                    if (index !== -1) {
                        state.list[index] = updatedOrder;
                    }
                }
            });
    },
});

export default orderSlice.reducer;
