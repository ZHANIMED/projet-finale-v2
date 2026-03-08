import React, { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../JS/redux/slices/cartSlice";
import { toast } from "react-toastify";

export default function ProductDetails() {
  const { slug } = useParams();
  const dispatch = useDispatch();

  const { list = [], loading } = useSelector((s) => s.products);

  const product = useMemo(
    () => list.find((x) => x.slug === slug),
    [list, slug]
  );

  const [qty, setQty] = useState(1);

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => q + 1);

  const add = () => {
    if (!product) return;
    if (qty > product.stock) {
      toast.error(`Stock insuffisant. Seulement ${product.stock} article(s) disponible(s).`);
      return;
    }
    dispatch(
      addToCart({
        product: {
          id: product._id,
          title: product.title,
          price: product.price, // ✅ TND
          image: product.image,
          slug: product.slug,
          stock: product.stock, // On passe le stock au slice pour validation cumulative
        },
        qty,
      })
    );
    setQty(1);
    toast.success("Produit ajouté au panier !");
  };

  if (loading) return <div className="container"><p>Chargement...</p></div>;

  if (!product) {
    return (
      <div className="container">
        <h1>Produit introuvable</h1>
        <Link className="btnPrimary" to="/products">Retour produits</Link>
      </div>
    );
  }

  const priceTND = Number(product.price) || 0;

  return (
    <div className="container">
      <div className="details">
        <img
          className="detailsImg"
          src={product.image || "https://via.placeholder.com/900x650"}
          alt={product.title || "Produit"}
        />

        <div className="panel">
          <h1 style={{ marginTop: 0 }}>{product.title}</h1>
          <p className="muted" style={{ marginTop: 6 }}>
            {product.description || "—"}
          </p>

          <div style={{ marginTop: 14, fontWeight: 900, fontSize: 22, color: "var(--accent)" }}>
            {priceTND.toFixed(3)} TND
          </div>

          <div style={{ marginTop: 10 }} className="muted">
            Stock : <b style={{ color: "#111" }}>{product.stock ?? 0}</b>
          </div>

          <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12 }}>
            {product.stock > 0 ? (
              <>
                <div className="qtyWrap">
                  <button className="qtyBtn" type="button" onClick={dec}>-</button>
                  <span className="qtyVal">{qty}</span>
                  <button className="qtyBtn" type="button" onClick={inc}>+</button>
                </div>

                <button className="btnPrimary" type="button" onClick={add} style={{ marginTop: 0 }}>
                  Ajouter au panier
                </button>
              </>
            ) : (
              <span style={{ color: '#e74c3c', fontWeight: 900, fontSize: 18 }}>Stock épuisé</span>
            )}
          </div>

          <div style={{ marginTop: 18 }}>
            <Link className="muted" to="/products">← Retour</Link>
          </div>
        </div>
      </div>
    </div>
  );
}