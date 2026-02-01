import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart, setCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const deliveryCharges = 200;

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!userId);
  }, []);

  const increase = (id) => {
    const item = cart.find((item) => item._id === id);
    
    // Check if increasing would exceed stock
    if (item && item.quantity >= item.stock) {
      alert(`⚠️ Maximum available stock: ${item.stock} units`);
      return;
    }
    
    setCart(
      cart.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrease = (id) => {
    setCart(
      cart
        .map((item) =>
          item._id === id && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const grandTotal = total + deliveryCharges;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Your Cart</h2>
        {isLoggedIn && (
          <button 
            onClick={() => navigate('/my-orders')} 
            style={{ 
              background: 'var(--secondary-color)', 
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.background = 'var(--accent-color)'}
            onMouseOut={(e) => e.target.style.background = 'var(--secondary-color)'}
          >
            📦 My Orders
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        cart.map((item) => (
          <div className="card" key={item._id}>
            <img
              src={item.image || "https://via.placeholder.com/200x200?text=No+Image"}
              style={{ width: "100px", borderRadius: "10px" }}
              onError={e => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/200x200?text=No+Image"; }}
            />

            <h3>{item.name}</h3>
            <p>PKR {item.price}</p>

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => decrease(item._id)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => increase(item._id)}>+</button>
            </div>

            <button
              style={{ background: "red", marginTop: "10px" }}
              onClick={() => removeItem(item._id)}
            >
              Remove
            </button>
          </div>
        ))
      )}

      {cart.length > 0 && (
        <div className="card">
          <h3>Total Items Price: PKR {total}</h3>
          <h3>Delivery Charges: PKR {deliveryCharges}</h3>
          <h2>Grand Total: PKR {grandTotal}</h2>

          <button
            onClick={() => {
              if (isLoggedIn) {
                navigate('/place-order');
              } else {
                alert('Please login or register to place an order.');
                navigate('/login');
              }
            }}
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
