import React from "react";
import { Link } from "react-router-dom";

export default function CategoryCard({ c }) {
  return (
    <Link to={`/categories/${c.slug}`} className="catCard">
      <img
        src={c.image || "https://via.placeholder.com/600x400"}
        alt={c.name}
      />

      <div className="catOverlay">
        <div className="catName">{c.name}</div>
      </div>
    </Link>
  );
}