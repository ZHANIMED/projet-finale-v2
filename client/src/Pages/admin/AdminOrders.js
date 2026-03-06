import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders, updateOrderStatus } from "../../JS/redux/slices/orderSlice";

export default function AdminOrders() {
    const dispatch = useDispatch();
    const { list = [], loading } = useSelector((s) => s.orders);

    useEffect(() => {
        dispatch(fetchAllOrders());
    }, [dispatch]);

    const handleStatusChange = async (id, newStatus) => {
        if (!window.confirm(`Passer la commande en "${newStatus}" ?`)) return;
        await dispatch(updateOrderStatus({ id, status: newStatus })).unwrap();
    };

    return (
        <div className="container">
            <h1>Suivi des Ventes (Commandes)</h1>

            {loading ? (
                <p>Chargement des commandes...</p>
            ) : list.length === 0 ? (
                <p>Aucune commande trouvée.</p>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {list.map((order) => (
                        <div key={order._id} className="panel" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {/* Header Commande */}
                            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--line)", paddingBottom: 10 }}>
                                <div>
                                    <h3 style={{ margin: 0 }}>Commande #{order._id.slice(-6).toUpperCase()}</h3>
                                    <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
                                        Date : {new Date(order.createdAt).toLocaleString("fr-FR")}
                                    </div>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <div style={{ fontSize: 18, fontWeight: 900, color: "var(--accent)" }}>
                                        {order.total.toFixed(3)} TND
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6, justifyContent: "flex-end" }}>
                                        <span style={{ fontSize: 13, fontWeight: "bold", color: "#666" }}>Statut:</span>
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            style={{ padding: "4px 8px", borderRadius: 8, border: "1px solid var(--line)", background: "#fff", outline: "none", cursor: "pointer" }}
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

                            {/* Infos Client */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 14 }}>
                                <div>
                                    <strong style={{ color: "var(--muted)" }}>Client :</strong> {order.user?.name || "Inconnu"} ({order.user?.email || "N/A"})
                                </div>
                                <div>
                                    <strong style={{ color: "var(--muted)" }}>Tél :</strong> {order.phone || "Non renseigné"}
                                </div>
                                <div style={{ gridColumn: "1 / -1" }}>
                                    <strong style={{ color: "var(--muted)" }}>Livraison :</strong> {order.shippingAddress || "Adresse non renseignée"}
                                </div>
                            </div>

                            {/* Produits */}
                            <div style={{ background: "#fbfbfa", padding: 12, borderRadius: 12, border: "1px solid var(--line)" }}>
                                <strong style={{ display: "block", marginBottom: 8, fontSize: 13, textTransform: "uppercase", color: "var(--muted)" }}>
                                    Produits commandés ({order.items.length})
                                </strong>
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    {order.items.map((item, idx) => (
                                        <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                                            <span style={{ fontWeight: 500 }}>
                                                {item.qty}x {item.title || "Produit supprimé"}
                                            </span>
                                            <span>{(item.price * item.qty).toFixed(3)} TND</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
