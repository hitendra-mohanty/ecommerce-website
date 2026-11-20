import { useEffect, useState } from "react";
import { api } from "../api";
import ProductCard from "../components/ProductCard";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/products")
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page">
        <div className="home-hero">
          <h1 className="home-title">Welcome To One Shop</h1>
          <p className="home-subtitle">Your one-stop shop for all your needs.</p>
        </div>

        <div className="container">
          <h2 className="page-title">Our Products</h2>
          {loading && <p>Loading products...</p>}
          {error && <div className="error-message">{error}</div>}
          {!loading && !error && products.length === 0 && <p>No products yet.</p>}
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
