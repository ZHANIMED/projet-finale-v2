import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeQty, removeFromCart, clearCart } from "../JS/redux/slices/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import api from "../JS/api/axios";
import { toast } from "react-toastify";


export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((s) => s.cart.items);
  const user = useSelector((s) => s.auth.user);

  // ✅ helper pour afficher en TND
  const toTND = (price) => {
    const v = Number(price) || 0;
    return `${v.toFixed(3)} TND`;
  };

  const totalTND = items.reduce((sum, x) => sum + x.price * x.qty, 0);

  const handleCheckout = async () => {
    if (!user) {
      toast.warning("🔒 Veuillez vous connecter pour valider votre commande.");
      navigate("/login");
      return;
    }

    try {
      const { data } = await api.post("/orders", {
        items,
        total: totalTND,
        phone: user.phone,
        shippingAddress: user.address,
      });

      dispatch(clearCart());

      // ✅ Redirection vers la facture avec les données
      navigate("/invoice", {
        state: {
          order: data.order || data,
          userName: user.name
        }
      });
    } catch (error) {
      console.error(error);
      toast.error(`❌ ${error.response?.data?.message || "Erreur lors de la validation de la commande"}`, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="container">
      <h1>Panier</h1>

      {items.length === 0 ? (
        <p>
          Votre panier est vide. <Link to="/products">Voir les produits</Link>
        </p>
      ) : (
        <>
          <div className="cartList">
            {items.map((x) => (
              <div key={x.id} className="cartRow">
                <img
                  className="cartImg"
                  src={x.image || "https://via.placeholder.com/100"}
                  alt={x.title}
                />

                <div className="cartInfo">
                  <Link to={`/products/${x.slug}`} className="cartTitle">
                    {x.title}
                  </Link>

                  {/* ✅ prix unitaire en TND */}
                  <div className="muted">{toTND(x.price)}</div>
                </div>

                <div className="cartQty">
                  <button
                    onClick={() =>
                      dispatch(changeQty({ id: x.id, qty: Math.max(1, x.qty - 1) }))
                    }
                  >
                    -
                  </button>
                  <span>{x.qty}</span>
                  <button
                    onClick={() => dispatch(changeQty({ id: x.id, qty: x.qty + 1 }))}
                  >
                    +
                  </button>
                </div>

                {/* ✅ sous-total ligne en TND */}
                <div className="cartSum">{toTND(x.price * x.qty)}</div>

                <button className="trash" onClick={() => dispatch(removeFromCart(x.id))}>
                  🗑️
                </button>
              </div>
            ))}
          </div>

          <div className="cartFooter">
            {/* ✅ total en TND */}
            <div className="total">
              Total : <strong>{toTND(totalTND)}</strong>
            </div>

            <button className="btn" onClick={() => dispatch(clearCart())}>
              Vider
            </button>

            <button
              className="btnPrimary"
              onClick={handleCheckout}
            >
              Valider la commande
            </button>
          </div>
        </>
      )}
    </div>
  );
}