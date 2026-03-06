import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import categorySlice from "./slices/categorySlice";
import productSlice from "./slices/productSlice";
import cartSlice from "./slices/cartSlice";
import orderSlice from "./slices/orderSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    categories: categorySlice,
    products: productSlice,
    cart: cartSlice,
    orders: orderSlice,
  },
});

export default store;