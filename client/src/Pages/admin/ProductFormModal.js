import React, { useEffect, useMemo, useState } from "react";
import api from "../../JS/api/axios";

export default function ProductFormModal({ initial, categories = [], onClose, onSaved }) {
  const isEdit = !!initial?._id;

  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [price, setPrice] = useState(initial?.price ?? "");
  const [image, setImage] = useState(initial?.image || "");
  const [category, setCategory] = useState(initial?.category?._id || initial?.category || "");
  const [stock, setStock] = useState(initial?.stock ?? 0);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle(initial?.title || "");
    setDescription(initial?.description || "");
    setPrice(initial?.price ?? "");
    setImage(initial?.image || "");
    setCategory(initial?.category?._id || initial?.category || "");
    setStock(initial?.stock ?? 0);
    setFile(null);
    setPreview(initial?.image || "");
  }, [initial]);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const canSave = useMemo(() => {
    return title.trim() && String(price).trim() && category;
  }, [title, price, category]);

  const submit = async (e) => {
    e.preventDefault();
    if (!canSave) return;

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", title.trim());
      fd.append("description", description.trim());
      fd.append("price", Number(price));
      if (file) {
        fd.append("image", file);
      } else if (image) {
        fd.append("image", image.trim());
      }
      fd.append("category", category);
      fd.append("stock", Number(stock) || 0);

      const config = { headers: { "Content-Type": "multipart/form-data" } };

      if (isEdit) await api.put(`/products/${initial._id}`, fd, config);
      else await api.post(`/products`, fd, config);

      onSaved?.();
      onClose?.();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modalBackdrop" role="dialog" aria-modal="true">
      <div className="modal modalWide">
        <div className="modalHeader">
          <h2 className="modalTitle">{isEdit ? "Modifier produit" : "Ajouter produit"}</h2>
          <button className="iconClose" type="button" onClick={onClose} aria-label="Fermer">✕</button>
        </div>

        <form className="productForm" onSubmit={submit}>
          <div className="field">
            <label className="fieldLabel">Titre</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="field fieldSpan2">
            <label className="fieldLabel">Description</label>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="field">
            <label className="fieldLabel">Prix (TND)</label>
            <input
              type="number"
              step="0.001"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="field">
            <label className="fieldLabel">Stock</label>
            <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
          </div>

          <div className="field fieldSpan2">
            <label className="fieldLabel">Image (URL ou fichier)</label>
            <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="URL de l'image (optionnel)" />
            <div style={{ marginTop: 10 }}>
              <input
                type="file"
                accept="image/*"
                className="customFileInput"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
            {preview && (
              <div style={{ marginTop: 10 }}>
                <img src={preview} alt="preview" style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 8 }} />
              </div>
            )}
          </div>

          <div className="field fieldSpan2">
            <label className="fieldLabel">Catégorie</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">-- Choisir une catégorie --</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="formActions">
            <button className="ecoBtn ghost" type="button" onClick={onClose}>Annuler</button>
            <button className="ecoBtn" type="submit" disabled={!canSave || loading}>
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}