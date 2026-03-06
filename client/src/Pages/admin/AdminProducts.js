import React, { useEffect, useState } from "react";
import api from "../../JS/api/axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../JS/redux/slices/productSlice";
import { fetchCategories } from "../../JS/redux/slices/categorySlice";
import ProductFormModal from "./ProductFormModal";

export default function AdminProducts() {
  const dispatch = useDispatch();
  const products = useSelector((s) => s.products.list);
  const categories = useSelector((s) => s.categories.list);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const formatTND = (price) => {
    const tnd = Number(price) || 0;
    return `${tnd.toFixed(3)} TND`;
  };

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts({}));
  }, [dispatch]);

  const remove = async (id) => {
    if (!window.confirm("Supprimer ?")) return;
    await api.delete(`/products/${id}`);
    dispatch(fetchProducts({}));
  };

  return (
    <div className="container">
      <div className="rowBetween">
        <h1>Produits</h1>
        <button
          className="btnPrimary"
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          + Ajouter
        </button>
      </div>

      <div className="grid4">
        {products.map((p) => (
          <div key={p._id} className="card">
            <img
              className="cardImg"
              src={p.image || "https://via.placeholder.com/600x400"}
              alt={p.title}
            />
            <div className="cardBody">
              <div className="cardTitle">{p.title}</div>

              {/* ✅ 3 chiffres après virgule + conversion */}
              <div className="muted">{formatTND(p.price)}</div>

              <div className="adminActions">
                <button
                  className="btn"
                  onClick={() => {
                    setEditing(p);
                    setOpen(true);
                  }}
                >
                  ✏️
                </button>
                <button className="btn" onClick={() => remove(p._id)}>
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <ProductFormModal
          categories={categories}
          initial={editing}
          onClose={() => setOpen(false)}
          onSaved={() => dispatch(fetchProducts({}))}
        />
      )}
    </div>
  );
}