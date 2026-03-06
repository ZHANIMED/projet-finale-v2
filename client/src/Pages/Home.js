import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchCategories } from "../JS/redux/slices/categorySlice"; // ✅ bon chemin
import CategoryCard from "../Components/CategoryCard"; // ✅ C majuscule
import { Link } from "react-router-dom";

export default function Home() {
  const dispatch = useDispatch();
  const { list } = useSelector((s) => s.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="container">
      <section className="hero">
        <div className="heroLeft">
          <h1>Nouvelle Collection</h1>
          <p>Notre collection éco-déco: articles conçus et fabriqués dans le respect de normes et de process éco-responsables..</p>
          <Link className="btnPrimary" to="/products">
            Découvrir
          </Link>
        </div>
        <div className="heroRight" />
      </section>

      <h2 className="sectionTitle">Nos Catégories</h2>
      <p className="sectionSub">Explorez notre univers</p>

      <div className="grid4">
        {list.map((c) => (
          <CategoryCard key={c._id} c={c} />
        ))}
      </div>
    </div>
  );
}