import React from "react";
import { useLocation, Link, Navigate } from "react-router-dom";
import logo from "../assets/MYECODECO.png";

export default function Invoice() {
    const location = useLocation();
    const order = location.state?.order;

    if (!order) {
        return <Navigate to="/products" />;
    }

    const printInvoice = () => {
        window.print();
    };

    return (
        <div className="container" style={{ maxWidth: 800 }}>
            {/* Boutons d'action cachés à l'impression */}
            <div className="invoiceActions" style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                <Link to="/products" className="ecoBtn ghost no-print">
                    ← Retour
                </Link>
                <button className="ecoBtn no-print" onClick={printInvoice}>
                    🖨️ Imprimer la facture
                </button>
            </div>

            {/* Contenu de la facture */}
            <div className="invoicePaper panel" style={{ padding: 40, background: "#fff" }}>
                {/* Entête avec logo */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #eee", paddingBottom: 20, marginBottom: 30 }}>
                    <div>
                        <img src={logo} alt="My eco-deco logo" style={{ height: 50, marginBottom: 10 }} />
                        <h2 style={{ margin: 0, fontSize: 28, letterSpacing: -0.5, color: "#111" }}>
                            My eco-deco
                        </h2>
                        <p style={{ margin: "5px 0 0", color: "#666", fontSize: 14 }}>
                            Décoration durable & responsable
                        </p>
                    </div>
                    <div style={{ textAlign: "right", color: "#666" }}>
                        <h3 style={{ margin: "0 0 10px", color: "#111" }}>FACTURE</h3>
                        <p style={{ margin: 2 }}>N° Commande : {order._id.slice(-6).toUpperCase()}</p>
                        <p style={{ margin: 2 }}>Date : {new Date(order.createdAt).toLocaleDateString("fr-FR")}</p>
                    </div>
                </div>

                {/* Détails du client */}
                <div style={{ marginBottom: 40, display: "flex", justifyContent: "space-between" }}>
                    <div>
                        <h4 style={{ margin: "0 0 10px", color: "#888", textTransform: "uppercase", fontSize: 12 }}>Facturé à :</h4>
                        <p style={{ margin: "4px 0", fontWeight: "bold", fontSize: 18 }}>{location.state?.userName || "Client"}</p>
                        <p style={{ margin: "4px 0", color: "#444" }}>{order.shippingAddress || "Adresse non renseignée"}</p>
                        <p style={{ margin: "4px 0", color: "#444" }}>Tél : {order.phone || "Non renseigné"}</p>
                    </div>
                </div>

                {/* Tableau des articles */}
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 30 }}>
                    <thead>
                        <tr style={{ background: "#f9f9f9", borderBottom: "1px solid #ddd" }}>
                            <th style={{ padding: 12, textAlign: "left", color: "#666" }}>Produit</th>
                            <th style={{ padding: 12, textAlign: "center", color: "#666" }}>Qté</th>
                            <th style={{ padding: 12, textAlign: "right", color: "#666" }}>Prix Unitaire</th>
                            <th style={{ padding: 12, textAlign: "right", color: "#666" }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map((item, idx) => (
                            <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
                                <td style={{ padding: 12, fontWeight: 500 }}>{item.title}</td>
                                <td style={{ padding: 12, textAlign: "center" }}>{item.qty}</td>
                                <td style={{ padding: 12, textAlign: "right" }}>{Number(item.price).toFixed(3)} TND</td>
                                <td style={{ padding: 12, textAlign: "right", fontWeight: "bold" }}>
                                    {(item.price * item.qty).toFixed(3)} TND
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Total */}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div style={{ minWidth: 250 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "2px solid #111" }}>
                            <strong style={{ fontSize: 18 }}>Total TTC</strong>
                            <strong style={{ fontSize: 20, color: "var(--accent)" }}>{order.total.toFixed(3)} TND</strong>
                        </div>
                        <p style={{ textAlign: "right", color: "#888", fontSize: 13, marginTop: 5 }}>Status : {order.status}</p>
                    </div>
                </div>

                {/* Footer */}
                <div style={{ marginTop: 60, textAlign: "center", color: "#999", fontSize: 12, borderTop: "1px solid #eee", paddingTop: 20 }}>
                    <p>Merci pour votre achat !</p>
                    <p>My eco-deco - Adresse Tunis - Contact: contact@myecodeco.tn</p>
                </div>
            </div>

            {/* CSS pour cacher les boutons à l'impression */}
            <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .invoicePaper, .invoicePaper * {
            visibility: visible;
          }
          .invoicePaper {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            box-shadow: none;
            border: none;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
        </div>
    );
}
