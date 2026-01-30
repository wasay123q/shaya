import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export default function CartProvider({ children }) {
  // Initialize cart from localStorage
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (err) {
      console.error("Error loading cart from localStorage:", err);
      return [];
    }
  });

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (err) {
      console.error("Error saving cart to localStorage:", err);
    }
  }, [cart]);

  const addToCart = (item, requestedQuantity = 1) => {
    const exist = cart.find((x) => x._id === item._id);
    const currentCartQuantity = exist ? exist.quantity : 0;
    const newTotalQuantity = currentCartQuantity + requestedQuantity;

    // Check if requested quantity exceeds available stock
    if (newTotalQuantity > item.stock) {
      const available = item.stock - currentCartQuantity;
      if (available <= 0) {
        alert(`❌ Sorry! "${item.name}" is out of stock.`);
        return false;
      } else {
        alert(`⚠️ Only ${available} unit(s) available. Added ${available} to cart.`);
        if (exist) {
          setCart(
            cart.map((x) =>
              x._id === item._id ? { ...x, quantity: item.stock } : x
            )
          );
        } else {
          setCart([...cart, { ...item, quantity: available }]);
        }
        return true;
      }
    }

    // Add to cart normally
    if (exist) {
      setCart(
        cart.map((x) =>
          x._id === item._id ? { ...x, quantity: x.quantity + requestedQuantity } : x
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: requestedQuantity }]);
    }
    return true;
  };

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}
