import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { api } from "../api";

export default function CheckoutPage() {
  const { getCartItemsWithProducts, updateQuantity, removeFromCart, getCartTotal, clearCart } =
    useCart();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [placing, setPlacing] = useState(false);

  const cartItems = getCartItemsWithProducts();
  const total = getCartTotal();

  async function placeOrder() {
    setError(null);
    if (!user) {
      navigate("/auth");
      return;
    }
    if (user.role !== "buyer") {
      setError("Please log in with a buyer account to place orders.");
      return;
    }
    setPlacing(true);
    try {
      await api.post("/orders", {
        items: cartItems.map((i) => ({ productId: i.id, quantity: i.quantity })),
      });
      clearCart();
      alert("Order placed successfully!");
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Checkout</h1>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="checkout-container">
            <div className="checkout-items">
              <h2 className="checkout-section-title">Order Summary</h2>
              {cartItems.map((item) => (
                <div className="checkout-item" key={item.id}>
                  <img src={item.product.image} alt={item.product.name} className="checkout-item-image" />

                  <div className="checkout-item-details">
                    <h3 className="checkout-item-name">{item.product.name}</h3>
                    <p className="checkout-item-price">${item.product.price.toFixed(2)} each</p>
                  </div>

                  <div className="checkout-items-controls">
                    <div className="quantity-controls">
                      <button className="quantity-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button className="quantity-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </div>

                  <p className="checkout-item-total">${(item.product.price * item.quantity).toFixed(2)}</p>

                  <button className="btn btn-secondary btn-small" onClick={() => removeFromCart(item.id)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="checkout-summary">
              <h2 className="checkout-section-title">Total</h2>
              <div className="checkout-total">
                <p className="checkout-total-label">Subtotal:</p>
                <p className="checkout-total-value">${total.toFixed(2)}</p>
              </div>
              <div className="checkout-total">
                <p className="checkout-total-label">Total:</p>
                <p className="checkout-total-value checkout-total-final">${total.toFixed(2)}</p>
              </div>
              {error && <div className="error-message">{error}</div>}
              <button className="btn btn-primary btn-large btn-block" onClick={placeOrder} disabled={placing}>
                {placing ? "Placing order..." : "Place Order"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
