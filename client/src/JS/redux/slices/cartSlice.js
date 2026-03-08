import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const persisted = localStorage.getItem("cart");
const initialItems = persisted ? JSON.parse(persisted) : [];

const save = (items) => localStorage.setItem("cart", JSON.stringify(items));

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: initialItems },
  reducers: {
    addToCart(state, action) {
      const payload = action.payload || {};
      const product = payload.product ?? payload;
      const qtyToAdd = Number(payload.qty ?? product.qty ?? 1) || 1;
      const id = product.id || product._id;
      if (!id) return;

      const stock = product.stock ?? 999;
      const found = state.items.find((x) => x.id === id);

      if (found) {
        const newTotalQty = (found.qty || 0) + qtyToAdd;
        if (newTotalQty > stock) {
          toast.error(`Impossible d'ajouter plus d'articles. Stock total disponible: ${stock}`);
          return;
        }
        found.qty = newTotalQty;
      } else {
        if (qtyToAdd > stock) {
          toast.error(`Stock insuffisant. Max disponible: ${stock}`);
          return;
        }
        state.items.push({
          id,
          title: product.title,
          price: product.price,
          image: product.image,
          slug: product.slug,
          qty: qtyToAdd,
          stock: stock, // On garde trace du stock si possible
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

      const newQty = Math.max(1, Number(qty) || 1);
      if (item.stock && newQty > item.stock) {
        toast.error(`Stock insuffisant. Max disponible: ${item.stock}`);
        return;
      }

      item.qty = newQty;
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