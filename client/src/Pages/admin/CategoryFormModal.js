import React, { useEffect, useMemo, useState } from "react";
import api from "../../JS/api/axios";

export default function CategoryFormModal({ initial, onClose, onSaved }) {
  const isEdit = !!initial?._id;

  const [name, setName] = useState("");
  const [file, setFile] = useState(null);          // ✅ fichier upload
  const [preview, setPreview] = useState("");      // ✅ preview image
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(initial?.name || "");
    setFile(null);
    setPreview(initial?.image || ""); // preview = image existante en edit
  }, [initial]);

  // créer un preview quand on choisit un fichier
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const canSave = useMemo(() => name.trim().length > 0, [name]);

  const submit = async (e) => {
    e.preventDefault();
    if (!canSave) return;

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", name.trim());
      if (file) fd.append("image", file); // ✅ nom du champ = "image"

      if (isEdit) {
        await api.put(`/categories/${initial._id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post(`/categories`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

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
      <div className="modal">
        <div className="modalHeader">
          <h2 className="modalTitle">
            {isEdit ? "Modifier catégorie" : "Ajouter catégorie"}
          </h2>
          <button className="iconClose" type="button" onClick={onClose} aria-label="Fermer">
            ✕
          </button>
        </div>

        <form className="productForm" onSubmit={submit}>
          <div className="field">
            <label className="fieldLabel">Nom</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nom catégorie"
            />
          </div>

          <div className="field">
            <label className="fieldLabel">Image (upload)</label>
            <input
              type="file"
              accept="image/*"
              className="customFileInput"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {preview && (
              <div style={{ marginTop: 10 }}>
                <img
                  src={preview}
                  alt="preview"
                  style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 12 }}
                />
              </div>
            )}
            {isEdit && initial?.image && (
              <button
                type="button"
                className="ecoBtn ghost"
                style={{ marginTop: 10 }}
                onClick={() => {
                  setFile(null);
                  setPreview(""); // optionnel : enlever image côté UI (à toi de gérer côté backend)
                }}
              >
                Retirer l'image (UI)
              </button>
            )}
          </div>

          <div className="formActions">
            <button className="ecoBtn ghost" type="button" onClick={onClose}>
              Annuler
            </button>

            <button className="ecoBtn" type="submit" disabled={!canSave || loading}>
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}