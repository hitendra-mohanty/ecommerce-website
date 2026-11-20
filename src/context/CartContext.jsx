import { createContext, useState, useEffect, useContext } from "react";
import { api } from "../api";

const CartContext = createContext(null);

// Cart items look like: { id, quantity, product: {id, name, price, image} }
function loadCart() {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch {
    return [];
  }
}

export default function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Accepts a product object (preferred) or a product id
  async function addToCart(productOrId) {
    let product = productOrId;
    if (typeof productOrId !== "object") {
      try {
        product = await api.get(`/products/${productOrId}`);
      } catch {
        return;
      }
    }
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: product.id, quantity: 1, product }];
    });
  }

  // Kept for compatibility with existing pages; products are stored in the cart now
  function getCartItemsWithProducts() {
    return cartItems.filter((item) => item.product);
  }

  function removeFromCart(productId) {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  }

  function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  }

  function getCartTotal() {
    return cartItems.reduce(
      (total, item) => total + (item.product ? item.product.price * item.quantity : 0),
      0
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        getCartItemsWithProducts,
        removeFromCart,
        updateQuantity,
        getCartTotal,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  return useContext(CartContext);
}
