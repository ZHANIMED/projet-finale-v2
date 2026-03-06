import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ p, onAdd }) {
  const [qty, setQty] = useState(1);

  // ✅ Prix déjà stocké en TND
  const priceTND = Number(p?.price) || 0;

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => q + 1);

  const handleAdd = () => {
    onAdd?.(p, qty);
    setQty(1);
  };

  return (
    <div className="card">
      <Link to={`/products/${p?.slug}`} className="cardImgWrap">
        <img
          className="cardImg"
          src={p?.image || "https://via.placeholder.com/600x400"}
          alt={p?.title || "produit"}
        />
      </Link>

      <div className="cardBody">
        <Link to={`/products/${p?.slug}`} className="cardTitle" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
          {p?.title}
        </Link>

        <div className="cardDesc">
          {(p?.description || "").slice(0, 60)}
          {(p?.description || "").length > 60 ? "..." : ""}
        </div>

        <div className="cardRow">
          {/* ✅ Prix TND direct */}
          <div>
            <div className="cardPrice">{priceTND.toFixed(3)} TND</div>
            {p?.stock > 0 && (
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4, fontWeight: 700 }}>
                Stock: <span style={{ color: "#111" }}>{p.stock}</span>
              </div>
            )}
          </div>

          {p?.stock > 0 ? (
            <>
              {/* quantité */}
              <div className="qtyWrap">
                <button className="qtyBtn" onClick={dec} type="button" aria-label="Diminuer">-</button>
                <span className="qtyVal">{qty}</span>
                <button className="qtyBtn" onClick={inc} type="button" aria-label="Augmenter">+</button>
              </div>

              {/* bouton panier */}
              <button
                className="cartBtn"
                onClick={handleAdd}
                type="button"
                aria-label="Ajouter au panier"
                title="Ajouter au panier"
              >
                🛒
              </button>
            </>
          ) : (
            <span style={{ color: '#e74c3c', fontWeight: 900, fontSize: 14 }}>Stock épuisé</span>
          )}
        </div>
      </div>
    </div>
  );
}