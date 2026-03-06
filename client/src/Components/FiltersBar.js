import React from "react";

export default function FiltersBar({ q, setQ, minPrice, setMinPrice, maxPrice, setMaxPrice }) {
  return (
    <div className="filters">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher..." />
      <input value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min TND" />
      <input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max TND" />
    </div>
  );
}