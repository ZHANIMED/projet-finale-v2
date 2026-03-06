import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { fetchCategories } from "../JS/redux/slices/categorySlice";
import { fetchProducts } from "../JS/redux/slices/productSlice";
import { addToCart } from "../JS/redux/slices/cartSlice";

import ProductCard from "../Components/ProductCard";

export default function CategoryPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();

  const categories = useSelector((s) => s.categories.list);
  const products = useSelector((s) => s.products.list);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const cat = categories.find((c) => c.slug === slug);
    if (cat?._id) dispatch(fetchProducts({ category: cat._id }));
  }, [dispatch, categories, slug]);

  const cat = categories.find((c) => c.slug === slug);

  const onAdd = (p) =>
    dispatch(
      addToCart({
        id: p._id,
        title: p.title,
        price: p.price,
        image: p.image,
        slug: p.slug,
      })
    );

  return (
    <div className="container">
      <h1>{cat?.name || "Catégorie"}</h1>

      <div className="grid4">
        {products.map((p) => (
          <ProductCard key={p._id} p={p} onAdd={onAdd} />
        ))}
      </div>
    </div>
  );
}