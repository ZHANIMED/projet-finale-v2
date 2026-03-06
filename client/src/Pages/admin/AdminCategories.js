import React, { useEffect, useState } from "react";
import api from "../../JS/api/axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../JS/redux/slices/categorySlice";
import CategoryFormModal from "./CategoryFormModal";
import ConfirmModal from "../../Components/ConfirmModal";
import { toast } from "react-toastify";

export default function AdminCategories() {
  const dispatch = useDispatch();
  const categories = useSelector((s) => s.categories.list) || [];

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // ID de la catégorie à supprimer

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleRemove = async () => {
    if (!confirmDelete) return;
    try {
      await api.delete(`/categories/${confirmDelete}`);
      dispatch(fetchCategories());
      toast.success("🗑️ Catégorie supprimée");
    } catch (err) {
      toast.error("❌ Erreur lors de la suppression");
    } finally {
      setConfirmDelete(null);
    }
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
                <button className="btn" onClick={() => setConfirmDelete(c._id)}>
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

      {confirmDelete && (
        <ConfirmModal
          title="Supprimer la catégorie ?"
          message="Cette action est irréversible. Toutes les données associées seront perdues."
          onConfirm={handleRemove}
          onCancel={() => setConfirmDelete(null)}
          confirmText="Supprimer"
          danger={true}
        />
      )}
    </div>
  );
}