import React from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="container">
      <h1>Admin</h1>
      <div className="grid2">
        <Link className="panel linkPanel" to="/admin/stats">Statistiques</Link>
        <Link className="panel linkPanel" to="/admin/orders">Suivi des ventes</Link>
        <Link className="panel linkPanel" to="/admin/products">Produits</Link>
        <Link className="panel linkPanel" to="/admin/categories">Catégories</Link>
      </div>
    </div>
  );
}