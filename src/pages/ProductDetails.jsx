import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import NotFoundPage from "./NotFoundPage";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | notfound
  const { addToCart, cartItems } = useCart();

  useEffect(() => {
    let cancelled = false;
    api
      .get(`/products/${id}`)
      .then((data) => {
        if (cancelled) return;
        setProduct(data);
        setStatus("ready");
      })
      .catch(() => !cancelled && setStatus("notfound"));
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (status === "loading") return <div>Loading...</div>;
  if (status === "notfound") return <NotFoundPage />;

  const productInCart = cartItems.find((item) => item.id === product.id);
  const productQuantityLabel = productInCart ? `(${productInCart.quantity})` : "";

  return (
    <div className="page">
      <div className="container">
        <div className="product-detail">
          <div className="product-details-image">
            <img src={product.image} alt={product.name} />
          </div>
          <div className="product-detail-content">
            <h1 className="product-detail-name">{product.name}</h1>
            <p className="product-detail-price">${product.price.toFixed(2)}</p>
            <p className="product-detail-description">{product.description}</p>
            <button className="btn btn-primary" onClick={() => addToCart(product)}>
              Add To Cart {productQuantityLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
