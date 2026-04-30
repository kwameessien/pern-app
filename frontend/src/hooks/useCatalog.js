import { useEffect, useState } from "react";

export default function useCatalog(api, onError) {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [products, setProducts] = useState([]);

  const loadCategories = async () => {
    setCategories(await api("/api/categories"));
  };

  const loadProducts = async () => {
    const q = categoryId ? `?category=${categoryId}` : "";
    setProducts(await api(`/api/products${q}`));
  };

  useEffect(() => {
    loadCategories().catch((err) => onError(err.message));
  }, []);

  useEffect(() => {
    loadProducts().catch((err) => onError(err.message));
  }, [categoryId]);

  return {
    categories,
    categoryId,
    setCategoryId,
    products,
    loadProducts,
  };
}
