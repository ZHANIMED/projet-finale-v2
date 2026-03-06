import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../JS/redux/slices/authSlice";
import logo from "../assets/MYECODECO.png";

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);

  const cartCount = useSelector((s) =>
    (s.cart?.items || []).reduce((a, x) => a + (x.qty || 0), 0)
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="nav">
      <Link className="brand" to="/">
        <img src={logo} alt="MYECODECO" className="logo" />
      </Link>

      <nav className="links">
        <NavLink to="/" end>Accueil</NavLink>
        <NavLink to="/products">Produits</NavLink>
        {user?.isAdmin && <NavLink to="/admin">Admin</NavLink>}
      </nav>

      <div className="actions">
        {!user ? (
          <NavLink to="/login" className="iconBtn">👤</NavLink>
        ) : (
          <NavLink to="/profile" className="iconBtn" style={{ padding: 0, overflow: "hidden" }}>
            {user.photo ? (
              <img
                src={user.photo}
                alt={user.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              "👤"
            )}
          </NavLink>
        )}

        <NavLink to="/cart" className="iconBtn">
          🛒 <span className="badge">{cartCount}</span>
        </NavLink>

        {user && (
          <button className="linkBtn" onClick={onLogout}>Logout</button>
        )}
      </div>
    </header>
  );
}