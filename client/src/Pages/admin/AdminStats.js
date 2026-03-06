import React, { useEffect, useState } from "react";
import api from "../../JS/api/axios";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar
} from "recharts";

const AdminStats = () => {
    const [stats, setStats] = useState(null);
    const [productStats, setProductStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resStats, resProducts] = await Promise.all([
                    api.get("/orders/admin/dashboard-stats"),
                    api.get("/orders/stats/sales")
                ]);
                setStats(resStats.data);
                setProductStats(resProducts.data);
            } catch (err) {
                console.error("Error fetching stats:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="container">Chargement des statistiques...</div>;
    if (!stats) return <div className="container">Erreur de chargement.</div>;

    return (
        <div className="container">
            <h1>Statistiques</h1>

            {/* Cartes de métriques */}
            <div className="grid4" style={{ marginBottom: 30 }}>
                <div className="panel" style={{ textAlign: "center", padding: "24px 14px" }}>
                    <h3 style={{ color: "var(--muted)", fontSize: 13, textTransform: "uppercase", margin: "0 0 10px", letterSpacing: "0.05em" }}>Chiffre d'Affaire</h3>
                    <p style={{ fontSize: 24, fontWeight: 900, color: "var(--accent)", margin: 0 }}>{stats.totalRevenue.toFixed(3)} TND</p>
                </div>
                <div className="panel" style={{ textAlign: "center", padding: "24px 14px" }}>
                    <h3 style={{ color: "var(--muted)", fontSize: 13, textTransform: "uppercase", margin: "0 0 10px", letterSpacing: "0.05em" }}>Commandes</h3>
                    <p style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>{stats.totalOrders}</p>
                </div>
                <div className="panel" style={{ textAlign: "center", padding: "24px 14px" }}>
                    <h3 style={{ color: "var(--muted)", fontSize: 13, textTransform: "uppercase", margin: "0 0 10px", letterSpacing: "0.05em" }}>Clients</h3>
                    <p style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>{stats.totalUsers}</p>
                </div>
                <div className="panel" style={{ textAlign: "center", padding: "24px 14px" }}>
                    <h3 style={{ color: "var(--muted)", fontSize: 13, textTransform: "uppercase", margin: "0 0 10px", letterSpacing: "0.05em" }}>Produits</h3>
                    <p style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>{stats.totalProducts}</p>
                </div>
            </div>

            <div className="grid2" style={{ marginBottom: 30, gap: 20 }}>
                {/* Graphique des ventes dans le temps */}
                <div className="panel" style={{ height: 400, padding: 20 }}>
                    <h3 style={{ marginBottom: 25, fontSize: 18, fontWeight: 900 }}>Évolution du Revenue (Mensuel)</h3>
                    <ResponsiveContainer width="100%" height="80%">
                        <LineChart data={stats.salesOverTime}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#888" }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#888" }} />
                            <Tooltip
                                contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", padding: 12 }}
                                itemStyle={{ fontWeight: "bold" }}
                            />
                            <Line
                                type="monotone"
                                dataKey="sales"
                                name="Ventes"
                                stroke="var(--accent)"
                                strokeWidth={4}
                                dot={{ r: 6, fill: "var(--accent)", strokeWidth: 2, stroke: "#fff" }}
                                activeDot={{ r: 8, strokeWidth: 0 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Graphique des ventes par produit */}
                <div className="panel" style={{ height: 400, padding: 20 }}>
                    <h3 style={{ marginBottom: 25, fontSize: 18, fontWeight: 900 }}>Top 5 Produits Vendus</h3>
                    <ResponsiveContainer width="100%" height="80%">
                        <BarChart data={productStats.slice(0, 5)}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                            <XAxis dataKey="title" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#888" }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#888" }} />
                            <Tooltip
                                cursor={{ fill: "rgba(0,0,0,0.02)" }}
                                contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", padding: 12 }}
                            />
                            <Bar dataKey="totalSold" name="Quantité vendue" fill="#2b2b2b" radius={[6, 6, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Dernières commandes */}
            <div className="panel" style={{ padding: 20 }}>
                <h3 style={{ marginBottom: 20, fontSize: 18, fontWeight: 900 }}>Dernières Commandes</h3>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid var(--line)", textAlign: "left" }}>
                                <th style={{ padding: "12px 10px", color: "var(--muted)", fontSize: 12, textTransform: "uppercase" }}>ID</th>
                                <th style={{ padding: "12px 10px", color: "var(--muted)", fontSize: 12, textTransform: "uppercase" }}>Client</th>
                                <th style={{ padding: "12px 10px", color: "var(--muted)", fontSize: 12, textTransform: "uppercase" }}>Date</th>
                                <th style={{ padding: "12px 10px", color: "var(--muted)", fontSize: 12, textTransform: "uppercase", textAlign: "right" }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentOrders.map(order => (
                                <tr key={order._id} style={{ borderBottom: "1px solid #f9f9f9" }}>
                                    <td style={{ padding: "16px 10px", fontSize: 13, color: "var(--muted)" }}>#{order._id.slice(-6).toUpperCase()}</td>
                                    <td style={{ padding: "16px 10px", fontSize: 14, fontWeight: 800 }}>{order.user?.name || "Client"}</td>
                                    <td style={{ padding: "16px 10px", fontSize: 13, color: "#666" }}>{new Date(order.createdAt).toLocaleDateString("fr-FR")}</td>
                                    <td style={{ padding: "16px 10px", fontSize: 14, fontWeight: 900, color: "var(--accent)", textAlign: "right" }}>{order.total.toFixed(3)} TND</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminStats;
