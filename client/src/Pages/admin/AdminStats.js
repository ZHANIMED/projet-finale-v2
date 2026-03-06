import React, { useEffect, useState } from "react";
import api from "../../JS/api/axios";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, PieChart, Pie, Legend
} from "recharts";

const COLORS = ["#667eea", "#f5576c", "#4facfe", "#43e97b", "#fa709a"];

const metricCards = (stats) => [
    {
        label: "Chiffre d'Affaires",
        value: `${stats.totalRevenue.toFixed(3)} TND`,
        icon: "💰",
        gradient: "linear-gradient(135deg,#667eea,#764ba2)",
        shadow: "rgba(102,126,234,0.30)",
    },
    {
        label: "Commandes",
        value: stats.totalOrders,
        icon: "📦",
        gradient: "linear-gradient(135deg,#f093fb,#f5576c)",
        shadow: "rgba(245,87,108,0.30)",
    },
    {
        label: "Clients",
        value: stats.totalUsers,
        icon: "👥",
        gradient: "linear-gradient(135deg,#4facfe,#00f2fe)",
        shadow: "rgba(79,172,254,0.30)",
    },
    {
        label: "Produits",
        value: stats.totalProducts,
        icon: "🛒",
        gradient: "linear-gradient(135deg,#43e97b,#38f9d7)",
        shadow: "rgba(67,233,123,0.30)",
    },
];

// Custom Tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div
                style={{
                    background: "#fff",
                    border: "1px solid #f3f4f6",
                    borderRadius: 14,
                    padding: "12px 16px",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                }}
            >
                <p style={{ margin: "0 0 4px", fontSize: 12, color: "#6b7280", fontWeight: 700, textTransform: "uppercase" }}>
                    {label}
                </p>
                {payload.map((p, i) => (
                    <p key={i} style={{ margin: 0, fontWeight: 900, color: p.color || "#111", fontSize: 16 }}>
                        {p.name === "Ventes" ? `${Number(p.value).toFixed(3)} TND` : p.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const AdminStats = () => {
    const [stats, setStats] = useState(null);
    const [productStats, setProductStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resStats, resProducts] = await Promise.all([
                    api.get("/orders/admin/dashboard-stats"),
                    api.get("/orders/stats/sales"),
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

    if (loading)
        return (
            <div className="container" style={{ textAlign: "center", paddingTop: 80 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
                <p style={{ color: "var(--muted)", fontSize: 16 }}>Chargement des statistiques...</p>
            </div>
        );
    if (!stats)
        return <div className="container" style={{ color: "var(--muted)" }}>Erreur de chargement.</div>;

    const cards = metricCards(stats);
    const top5 = productStats.slice(0, 5);

    return (
        <div className="container">
            {/* Title */}
            <div style={{ marginBottom: 28 }}>
                <h1
                    style={{
                        margin: "0 0 6px",
                        fontSize: 36,
                        fontWeight: 900,
                        letterSpacing: "-0.5px",
                        background: "linear-gradient(135deg,#667eea,#f5576c)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    📊 Statistiques
                </h1>
                <p style={{ margin: 0, color: "var(--muted)", fontSize: 14 }}>Vue d'ensemble de votre activité</p>
            </div>

            {/* Metric Cards */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
                    gap: 18,
                    marginBottom: 28,
                }}
            >
                {cards.map((card) => (
                    <div
                        key={card.label}
                        style={{
                            background: card.gradient,
                            borderRadius: 20,
                            padding: "24px 22px",
                            boxShadow: `0 16px 36px ${card.shadow}`,
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                top: -16,
                                right: -16,
                                width: 70,
                                height: 70,
                                borderRadius: "50%",
                                background: "rgba(255,255,255,.15)",
                            }}
                        />
                        <div style={{ fontSize: 28, marginBottom: 10 }}>{card.icon}</div>
                        <p
                            style={{
                                margin: "0 0 4px",
                                color: "rgba(255,255,255,.80)",
                                fontSize: 11,
                                fontWeight: 900,
                                textTransform: "uppercase",
                                letterSpacing: ".08em",
                            }}
                        >
                            {card.label}
                        </p>
                        <p style={{ margin: 0, color: "#fff", fontSize: 22, fontWeight: 900 }}>{card.value}</p>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
                {/* Area Chart - Évolution revenue */}
                <div
                    className="panel"
                    style={{
                        padding: "24px 20px",
                        background: "linear-gradient(135deg,#fff,#f8f6ff)",
                        border: "1px solid rgba(102,126,234,0.15)",
                    }}
                >
                    <h3
                        style={{
                            margin: "0 0 6px",
                            fontSize: 16,
                            fontWeight: 900,
                            color: "#111",
                        }}
                    >
                        📈 Évolution du Revenue
                    </h3>
                    <p style={{ margin: "0 0 20px", fontSize: 12, color: "var(--muted)" }}>6 derniers mois</p>
                    <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={stats.salesOverTime} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#667eea" stopOpacity={0.35} />
                                    <stop offset="95%" stopColor="#667eea" stopOpacity={0.02} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,.05)" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: "#94a3b8" }}
                                dy={8}
                            />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="sales"
                                name="Ventes"
                                stroke="#667eea"
                                strokeWidth={3}
                                fill="url(#colorSales)"
                                dot={{ r: 5, fill: "#667eea", strokeWidth: 2, stroke: "#fff" }}
                                activeDot={{ r: 7, strokeWidth: 0 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Bar Chart - Top 5 Produits */}
                <div
                    className="panel"
                    style={{
                        padding: "24px 20px",
                        background: "linear-gradient(135deg,#fff,#fff8f0)",
                        border: "1px solid rgba(245,87,108,0.15)",
                    }}
                >
                    <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 900, color: "#111" }}>
                        🏆 Top 5 Produits
                    </h3>
                    <p style={{ margin: "0 0 20px", fontSize: 12, color: "var(--muted)" }}>Par quantité vendue</p>
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={top5} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,.05)" />
                            <XAxis
                                dataKey="title"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: "#94a3b8" }}
                                dy={8}
                            />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="totalSold" name="Qté vendue" radius={[8, 8, 0, 0]} barSize={32}>
                                {top5.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Pie Chart + Recent Orders */}
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 20 }}>
                {/* Pie Chart */}
                {top5.length > 0 && (
                    <div
                        className="panel"
                        style={{
                            padding: "24px 20px",
                            minWidth: 280,
                            background: "linear-gradient(135deg,#fff,#f0fff8)",
                            border: "1px solid rgba(67,233,123,0.15)",
                        }}
                    >
                        <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 900, color: "#111" }}>
                            🥧 Répartition
                        </h3>
                        <p style={{ margin: "0 0 12px", fontSize: 12, color: "var(--muted)" }}>Top produits</p>
                        <PieChart width={240} height={220}>
                            <Pie
                                data={top5}
                                dataKey="totalSold"
                                nameKey="title"
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={90}
                                paddingAngle={4}
                            >
                                {top5.map((_, index) => (
                                    <Cell key={`pie-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                iconType="circle"
                                iconSize={8}
                                formatter={(value) => (
                                    <span style={{ fontSize: 11, color: "#6b7280" }}>
                                        {value.length > 14 ? value.slice(0, 14) + "…" : value}
                                    </span>
                                )}
                            />
                        </PieChart>
                    </div>
                )}

                {/* Dernières Commandes */}
                <div
                    className="panel"
                    style={{
                        padding: "24px 20px",
                        background: "linear-gradient(135deg,#fff,#fdf8ff)",
                        border: "1px solid rgba(102,126,234,0.10)",
                    }}
                >
                    <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 900, color: "#111" }}>
                        🕐 Dernières Commandes
                    </h3>
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ borderBottom: "2px solid #f3f4f6" }}>
                                    {["ID", "Client", "Date", "Total"].map((h) => (
                                        <th
                                            key={h}
                                            style={{
                                                padding: "8px 12px",
                                                color: "#94a3b8",
                                                fontSize: 11,
                                                fontWeight: 900,
                                                textTransform: "uppercase",
                                                letterSpacing: ".06em",
                                                textAlign: h === "Total" ? "right" : "left",
                                            }}
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentOrders.map((order, idx) => (
                                    <tr
                                        key={order._id}
                                        style={{
                                            borderBottom: "1px solid #f9fafb",
                                            background: idx % 2 === 0 ? "transparent" : "rgba(102,126,234,0.03)",
                                        }}
                                    >
                                        <td style={{ padding: "14px 12px", fontSize: 12, color: "#94a3b8", fontWeight: 700 }}>
                                            #{order._id.slice(-6).toUpperCase()}
                                        </td>
                                        <td style={{ padding: "14px 12px", fontSize: 14, fontWeight: 900, color: "#111" }}>
                                            {order.user?.name || "Client"}
                                        </td>
                                        <td style={{ padding: "14px 12px", fontSize: 13, color: "#6b7280" }}>
                                            {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                                        </td>
                                        <td
                                            style={{
                                                padding: "14px 12px",
                                                textAlign: "right",
                                                fontWeight: 900,
                                                fontSize: 14,
                                                color: "#667eea",
                                            }}
                                        >
                                            {order.total.toFixed(3)} TND
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminStats;
