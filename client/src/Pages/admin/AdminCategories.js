import React, { useEffect, useState } from "react";
import api from "../../JS/api/axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../JS/redux/slices/categorySlice";
import CategoryFormModal from "./CategoryFormModal"; // ✅ PAS ProductFormModal

export default function AdminCategories() {
  const dispatch = useDispatch();
  const categories = useSelector((s) => s.categories.list) || [];

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const remove = async (id) => {
    if (!window.confirm("Supprimer ?")) return;
    await api.delete(`/categories/${id}`);
    dispatch(fetchCategories());
  };

  return (
    <div className="container">
      <div className="rowBetween">
        <h1>Catégories</h1>
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
        {categories.map((c) => (
          <div key={c._id} className="card">
            <img
              className="cardImg"
              src={c.image || "https://via.placeholder.com/600x400"}
              alt={c.name}
            />
            <div className="cardBody">
              <div className="cardTitle">{c.name}</div>

              <div className="adminActions">
                <button
                  className="btn"
                  onClick={() => {
                    setEditing(c);
                    setOpen(true);
                  }}
                >
                  ✏️
                </button>
                <button className="btn" onClick={() => remove(c._id)}>
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <CategoryFormModal
          initial={editing}
          onClose={() => setOpen(false)}
          onSaved={() => dispatch(fetchCategories())}
        />
      )}
    </div>
  );
}