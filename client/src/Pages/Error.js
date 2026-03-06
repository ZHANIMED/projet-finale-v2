import React from "react";
import { Link } from "react-router-dom";

export default function Error() {
  return (
    <div className="container">
      <h1>404</h1>
      <p>Page introuvable.</p>
      <Link to="/" className="btnPrimary">Retour accueil</Link>
    </div>
  );
}