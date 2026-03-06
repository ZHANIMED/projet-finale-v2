import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders, updateOrderStatus } from "../../JS/redux/slices/orderSlice";
import { toast } from "react-toastify";

export default function AdminOrders() {
    const dispatch = useDispatch();
    const { list = [], loading } = useSelector((s) => s.orders);

    useEffect(() => {
        dispatch(fetchAllOrders());
    }, [dispatch]);

    const handleStatusChange = async (id, newStatus, currentStatus) => {
        if (newStatus === currentStatus) return;
        try {
            await dispatch(updateOrderStatus({ id, status: newStatus })).unwrap();
            toast.success(`✅ Statut mis à jour : "${newStatus}"`, {
                position: "top-right",
                autoClose: 2500,
            });
        } catch (err) {
            toast.error(`❌ Erreur : ${err || "Impossible de mettre à jour le statut"}`, {
                position: "top-right",
            });
        }
    };

    const statusColor = (status) => {
        const map = {
            "Validée": { bg: "#d1fae5", color: "#065f46" },
            "En Préparation": { bg: "#fef9c3", color: "#92400e" },
            "Expédiée": { bg: "#dbeafe", color: "#1e40af" },
            "Livrée": { bg: "#f0fdf4", color: "#166534", border: "#86efac" },
            "Annulée": { bg: "#fee2e2", color: "#dc2626" },
        };
        return map[status] || { bg: "#f3f4f6", color: "#374151" };
    };

    return (
        <div className="container">
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ margin: "0 0 6px", fontSize: 36, fontWeight: 900, letterSpacing: "-0.5px" }}>
                    📦 Suivi des Ventes
                </h1>
                <p style={{ margin: 0, color: "var(--muted)", fontSize: 14 }}>
                    {list.length} commande{list.length > 1 ? "s" : ""} au total
                </p>
            </div>

            {loading ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted)" }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
                    <p>Chargement des commandes...</p>
                </div>
            ) : list.length === 0 ? (
                <div className="panel" style={{ textAlign: "center", padding: 60 }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
                    <p style={{ color: "var(--muted)", margin: 0 }}>Aucune commande trouvée.</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {list.map((order) => {
                        const sc = statusColor(order.status);
                        return (
                            <div
                                key={order._id}
                                className="panel"
                                style={{ display: "flex", flexDirection: "column", gap: 12 }}
                            >
                                {/* Header */}
                                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--line)", paddingBottom: 12 }}>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900 }}>
                                            Commande #{order._id.slice(-6).toUpperCase()}
                                        </h3>
                                        <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
                                            {new Date(order.createdAt).toLocaleString("fr-FR")}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <div style={{ fontSize: 20, fontWeight: 900, color: "var(--accent)" }}>
                                            {order.total.toFixed(3)} TND
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, justifyContent: "flex-end" }}>
                                            <span
                                                style={{
                                                    display: "inline-block",
                                                    padding: "3px 10px",
                                                    borderRadius: 999,
                                                    background: sc.bg,
                                                    color: sc.color,
                                                    fontSize: 12,
                                                    fontWeight: 800,
                                                    marginRight: 6,
                                                }}
                                            >
                                                {order.status}
                                            </span>
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value, order.status)}
                                                style={{
                                                    padding: "6px 10px",
                                                    borderRadius: 10,
                                                    border: "1px solid var(--line)",
                                                    background: "#fff",
                                                    outline: "none",
                                                    cursor: "pointer",
                                                    fontSize: 13,
                                                    fontWeight: 700,
                                                }}
                                            >
                                                <option value="Validée">Validée</option>
                                                <option value="En Préparation">En Préparation</option>
                                                <option value="Expédiée">Expédiée</option>
                                                <option value="Livrée">Livrée</option>
                                                <option value="Annulée">Annulée</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Client info */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 14 }}>
                                    <div>
                                        <strong style={{ color: "var(--muted)" }}>Client :</strong>{" "}
                                        {order.user?.name || "Inconnu"} ({order.user?.email || "N/A"})
                                    </div>
                                    <div>
                                        <strong style={{ color: "var(--muted)" }}>Tél :</strong>{" "}
                                        {order.phone || "Non renseigné"}
                                    </div>
                                    <div style={{ gridColumn: "1 / -1" }}>
                                        <strong style={{ color: "var(--muted)" }}>Livraison :</strong>{" "}
                                        {order.shippingAddress || "Adresse non renseignée"}
                                    </div>
                                </div>

                                {/* Produits */}
                                <div style={{ background: "#fbfbfa", padding: 12, borderRadius: 12, border: "1px solid var(--line)" }}>
                                    <strong style={{ display: "block", marginBottom: 8, fontSize: 12, textTransform: "uppercase", color: "var(--muted)" }}>
                                        Produits commandés ({order.items.length})
                                    </strong>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                        {order.items.map((item, idx) => (
                                            <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                                                <span style={{ fontWeight: 600 }}>
                                                    {item.qty}× {item.title || "Produit supprimé"}
                                                </span>
                                                <span style={{ fontWeight: 800, color: "var(--accent)" }}>
                                                    {(item.price * item.qty).toFixed(3)} TND
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
