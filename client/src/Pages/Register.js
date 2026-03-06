import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../JS/redux/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const res = await dispatch(register({ name, email, password }));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("🎉 Compte créé avec succès ! Bienvenue !", { autoClose: 2500 });
      navigate("/");
    } else {
      toast.error(`❌ ${res.payload || "Erreur lors de l'inscription"}`);
    }
  };

  return (
    <div className="container auth">
      <h1>Inscription</h1>
      <form onSubmit={submit} className="authForm">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" type="password" />
        {error && <p className="error">{error}</p>}
        <button className="btnPrimary" disabled={loading}>
          {loading ? "..." : "Créer"}
        </button>
      </form>

      <p className="muted">
        Déjà un compte ? <Link to="/login">Se connecter</Link>
      </p>
    </div>
  );
}