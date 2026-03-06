import { createSlice } from "@reduxjs/toolkit";

const persisted = localStorage.getItem("cart");
const initialItems = persisted ? JSON.parse(persisted) : [];

const save = (items) => localStorage.setItem("cart", JSON.stringify(items));

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: initialItems },
  reducers: {
    addToCart(state, action) {
      // ✅ supporte les 2 formats :
      // 1) { product: {...}, qty }
      // 2) { id,title,price,image,slug, qty } (ancien)
      const payload = action.payload || {};

      const product = payload.product ?? payload; // si payload.product existe, sinon payload direct
      const qtyToAdd = Number(payload.qty ?? product.qty ?? 1) || 1;

      const id = product.id || product._id;
      if (!id) return;

      const found = state.items.find((x) => x.id === id);

      if (found) {
        found.qty = (found.qty || 0) + qtyToAdd;     // ✅ ajoute la quantité choisie
      } else {
        state.items.push({
          id,
          title: product.title,
          price: product.price,
          image: product.image,
          slug: product.slug,
          qty: qtyToAdd,                              // ✅ qty initial correct
        });
      }

      save(state.items);
    },

    removeFromCart(state, action) {
      state.items = state.items.filter((x) => x.id !== action.payload);
      save(state.items);
    },

    changeQty(state, action) {
      const { id, qty } = action.payload;
      const item = state.items.find((x) => x.id === id);
      if (!item) return;
      item.qty = Math.max(1, Number(qty) || 1);
      save(state.items);
    },

    clearCart(state) {
      state.items = [];
      save(state.items);
    },
  },
});

export const { addToCart, removeFromCart, changeQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;