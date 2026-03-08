import React, { useState } from "react";

export default function GuestOrderModal({ isOpen, onClose, onConfirm }) {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(formData);
    };

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            backdropFilter: "blur(5px)"
        }}>
            <div style={{
                background: "white",
                padding: "30px",
                borderRadius: "24px",
                width: "90%",
                maxWidth: "450px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                animation: "slideUp 0.3s ease-out"
            }}>
                <h2 style={{ margin: "0 0 10px", fontSize: "24px", fontWeight: "900", color: "#111" }}>Détails de livraison</h2>
                <p style={{ margin: "0 0 25px", color: "#666", fontSize: "14px" }}>Veuillez saisir vos informations pour finaliser votre commande en tant qu'invité.</p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "15px" }}>
                        <label style={{ display: "block", marginBottom: "5px", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", color: "#999" }}>Nom complet</label>
                        <input
                            required
                            type="text"
                            placeholder="Ex: Jean Dupont"
                            style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "2px solid #eee", outline: "none", fontSize: "15px" }}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                        <label style={{ display: "block", marginBottom: "5px", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", color: "#999" }}>Téléphone</label>
                        <input
                            required
                            type="tel"
                            placeholder="Ex: 55 123 456"
                            style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "2px solid #eee", outline: "none", fontSize: "15px" }}
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    <div style={{ marginBottom: "25px" }}>
                        <label style={{ display: "block", marginBottom: "5px", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", color: "#999" }}>Adresse de livraison</label>
                        <textarea
                            required
                            placeholder="Ex: 12 Rue des Lilas, Tunis"
                            rows="3"
                            style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "2px solid #eee", outline: "none", fontSize: "15px", resize: "none" }}
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{ flex: 1, padding: "14px", borderRadius: "14px", border: "none", background: "#f5f5f5", color: "#666", fontWeight: "700", cursor: "pointer" }}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            style={{ flex: 2, padding: "14px", borderRadius: "14px", border: "none", background: "#111", color: "white", fontWeight: "800", cursor: "pointer" }}
                        >
                            Confirmer la commande
                        </button>
                    </div>
                </form>
            </div>
            <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
