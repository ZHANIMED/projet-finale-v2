import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers, toggleUserAdmin } from "../../JS/redux/slices/userSlice";
import { toast } from "react-toastify";
import ConfirmModal from "../../Components/ConfirmModal";

export default function AdminUsers() {
    const dispatch = useDispatch();
    const { list: users = [], loading } = useSelector((s) => s.users);
    const currentUser = useSelector((s) => s.auth.user);

    const [confirmModal, setConfirmModal] = useState(null); // { user, action }

    useEffect(() => {
        dispatch(fetchAllUsers());
    }, [dispatch]);

    const handleConfirmToggle = async () => {
        if (!confirmModal) return;
        const { user } = confirmModal;

        try {
            await dispatch(toggleUserAdmin(user._id)).unwrap();
            toast.success(
                user.isAdmin
                    ? `✅ Droits admin retirés pour ${user.name}`
                    : `⭐ ${user.name} est maintenant administrateur`,
                { position: "top-right", autoClose: 3000 }
            );
            dispatch(fetchAllUsers()); // Refresh
        } catch (err) {
            toast.error(err || "Erreur lors de la modification", { position: "top-right" });
        } finally {
            setConfirmModal(null);
        }
    };

    const formatDate = (date) =>
        date ? new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) : "—";

    return (
        <div className="container">
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ margin: "0 0 6px", fontSize: 36, fontWeight: 900, letterSpacing: "-0.5px" }}>
                    👥 Gestion des Utilisateurs
                </h1>
                <p style={{ margin: 0, color: "var(--muted)", fontSize: 15 }}>
                    {users.length} utilisateur{users.length > 1 ? "s" : ""} inscrit{users.length > 1 ? "s" : ""}
                </p>
            </div>

            {loading ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted)" }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
                    <p>Chargement des utilisateurs...</p>
                </div>
            ) : users.length === 0 ? (
                <div className="panel" style={{ textAlign: "center", padding: 60 }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>👤</div>
                    <p style={{ color: "var(--muted)", margin: 0 }}>Aucun utilisateur trouvé.</p>
                </div>
            ) : (
                <div className="panel" style={{ padding: 0, overflow: "hidden" }}>
                    {/* Desktop Table */}
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
                            <thead>
                                <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                                    {["Utilisateur", "Email", "Téléphone", "Adresse", "Inscrit le", "Rôle", "Action"].map((h) => (
                                        <th
                                            key={h}
                                            style={{
                                                padding: "16px",
                                                color: "#475569",
                                                fontSize: 11,
                                                fontWeight: 900,
                                                textTransform: "uppercase",
                                                letterSpacing: ".08em",
                                                textAlign: "left",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, idx) => {
                                    const isMe = currentUser && user._id === currentUser.id;
                                    return (
                                        <tr
                                            key={user._id}
                                            style={{
                                                background: idx % 2 === 0 ? "#fff" : "#fafafa",
                                                borderBottom: "1px solid #f3f4f6",
                                                transition: "background .15s",
                                            }}
                                        >
                                            <td style={{ padding: "14px 16px" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                    <div
                                                        style={{
                                                            width: 38,
                                                            height: 38,
                                                            borderRadius: 12,
                                                            background: user.isAdmin
                                                                ? "linear-gradient(135deg,#f59e0b,#d97706)"
                                                                : "linear-gradient(135deg,#6366f1,#4f46e5)",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            color: "#fff",
                                                            fontWeight: 900,
                                                            fontSize: 15,
                                                            flexShrink: 0,
                                                            overflow: "hidden",
                                                        }}
                                                    >
                                                        {user.photo ? (
                                                            <img
                                                                src={user.photo}
                                                                alt={user.name}
                                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                            />
                                                        ) : (
                                                            user.name?.charAt(0).toUpperCase()
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 900, fontSize: 14, color: "#111" }}>
                                                            {user.name}
                                                            {isMe && (
                                                                <span
                                                                    style={{
                                                                        marginLeft: 6,
                                                                        fontSize: 10,
                                                                        background: "#e0f2fe",
                                                                        color: "#0369a1",
                                                                        padding: "2px 7px",
                                                                        borderRadius: 999,
                                                                        fontWeight: 800,
                                                                    }}
                                                                >
                                                                    Vous
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151" }}>
                                                {user.email}
                                            </td>
                                            <td style={{ padding: "14px 16px", fontSize: 13, color: "#6b7280" }}>
                                                {user.phone || <span style={{ opacity: 0.4 }}>—</span>}
                                            </td>
                                            <td style={{ padding: "14px 16px", fontSize: 13, color: "#6b7280", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {user.address || <span style={{ opacity: 0.4 }}>—</span>}
                                            </td>
                                            <td style={{ padding: "14px 16px", fontSize: 13, color: "#6b7280", whiteSpace: "nowrap" }}>
                                                {formatDate(user.createdAt)}
                                            </td>
                                            <td style={{ padding: "14px 16px" }}>
                                                {user.isAdmin ? (
                                                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "linear-gradient(135deg,#fef9c3,#fde68a)", color: "#92400e", padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 800, border: "1px solid #fcd34d" }}>⭐ Admin</span>
                                                ) : (
                                                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#f3f4f6", color: "#6b7280", padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>👤 Client</span>
                                                )}
                                            </td>
                                            <td style={{ padding: "14px 16px" }}>
                                                <button
                                                    disabled={isMe}
                                                    onClick={() => setConfirmModal({ user })}
                                                    style={{
                                                        padding: "8px 14px",
                                                        borderRadius: 10,
                                                        border: "none",
                                                        cursor: isMe ? "not-allowed" : "pointer",
                                                        fontWeight: 800,
                                                        fontSize: 12,
                                                        transition: ".2s",
                                                        background: isMe ? "#f3f4f6" : user.isAdmin ? "linear-gradient(135deg,#fee2e2,#fecaca)" : "linear-gradient(135deg,#d1fae5,#a7f3d0)",
                                                        color: isMe ? "#9ca3af" : user.isAdmin ? "#dc2626" : "#065f46",
                                                        whiteSpace: "nowrap",
                                                        opacity: isMe ? 0.5 : 1,
                                                    }}
                                                >
                                                    {isMe ? "🔒 Vous" : user.isAdmin ? "🔽 Retirer admin" : "⭐ Promouvoir admin"}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {confirmModal && (
                <ConfirmModal
                    title={confirmModal.user.isAdmin ? "Retirer les droits ?" : "Promouvoir l'utilisateur ?"}
                    message={
                        confirmModal.user.isAdmin
                            ? `Êtes-vous sûr de vouloir retirer les droits administrateur de ${confirmModal.user.name} ?`
                            : `Voulez-vous accorder les droits administrateur à ${confirmModal.user.name} ?`
                    }
                    onConfirm={handleConfirmToggle}
                    onCancel={() => setConfirmModal(null)}
                    confirmText={confirmModal.user.isAdmin ? "Retirer" : "Promouvoir"}
                    danger={confirmModal.user.isAdmin}
                />
            )}
        </div>
    );
}
