import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

// Thunks
export const fetchAllUsers = createAsyncThunk(
    "users/fetchAll",
    async (_, thunkAPI) => {
        try {
            const { data } = await api.get("/users");
            return data.users;
        } catch (e) {
            return thunkAPI.rejectWithValue(e.response?.data?.message || "Erreur chargement utilisateurs");
        }
    }
);

export const toggleUserAdmin = createAsyncThunk(
    "users/toggleAdmin",
    async (userId, thunkAPI) => {
        try {
            const { data } = await api.patch(`/users/${userId}/toggle-admin`);
            return data.user;
        } catch (e) {
            return thunkAPI.rejectWithValue(e.response?.data?.message || "Erreur modification rôle");
        }
    }
);

// Slice
const userSlice = createSlice({
    name: "users",
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(toggleUserAdmin.fulfilled, (state, action) => {
                const updated = action.payload;
                const idx = state.list.findIndex((u) => u._id === updated.id);
                if (idx !== -1) {
                    state.list[idx].isAdmin = updated.isAdmin;
                }
            });
    },
});

export default userSlice.reducer;
