import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios"; // ✅ corrigé

export const fetchCategories = createAsyncThunk(
  "categories/fetch",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/categories");
      return data.categories;
    } catch (e) {
      return thunkAPI.rejectWithValue("Categories error");
    }
  }
);

const slice = createSlice({
  name: "categories",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default slice.reducer;