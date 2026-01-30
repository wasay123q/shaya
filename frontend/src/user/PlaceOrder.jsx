import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import "./PlaceOrder.css";

export default function PlaceOrder() {
  const { cart, setCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    mobile: "",
    address: "",
    payment: "Cash on Delivery",
  });

  const [paymentProof, setPaymentProof] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const deliveryCharges = 200;
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const grandTotal = total + deliveryCharges;

  const validateForm = () => {
    const newErrors = {};

    if (!data.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!data.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^[0-9]{11}$/.test(data.mobile.trim())) {
      newErrors.mobile = "Please enter a valid 11-digit mobile number";
    }

    if (!data.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (data.payment !== "Cash on Delivery" && !paymentProof) {
      newErrors.paymentProof = "Please upload payment screenshot";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const placeOrder = async () => {
    if (loading) return;

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    /* 🔥 Check for authentication token */
    const token = localStorage.getItem("token");
    
    if (!token) {
      setLoading(false);
      alert("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    try {
      // Create order items array
      const orderItems = cart.map(item => ({
        productId: item._id || item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image
      }));

      // Validate cart items
      if (!orderItems || orderItems.length === 0) {
        throw new Error("Cart is empty");
      }

      // Use FormData for all requests (supports both with and without payment proof)
      const formData = new FormData();
      // ❌ DO NOT send userId - backend gets it from JWT token
      formData.append("name", data.name.trim());
      formData.append("mobile", data.mobile.trim());
      formData.append("address", data.address.trim());
      formData.append("payment", data.payment);
      formData.append("totalAmount", grandTotal);
      formData.append("items", JSON.stringify(orderItems));
      
      if (paymentProof) {
        formData.append("paymentProof", paymentProof);
      }

      // axios interceptor will automatically add Authorization header
      const response = await axios.post("/orders/place", formData, {
        headers: { 
          "Content-Type": "multipart/form-data"
        }
      });

      if (response.data.success) {
        alert("✅ Order Placed Successfully!");
        setCart([]);
        localStorage.removeItem("cart");
        navigate("/");
      } else {
        alert("❌ " + (response.data.message || "Failed to place order"));
      }
    } catch (err) {
      console.error("Order Error:", err.response?.data || err.message);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || "Failed to place order. Please try again.";
      alert("❌ " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Check if user is logged in
  const token = localStorage.getItem("token");
  
  if (!token) {
    return (
      <div className="place-order-container">
        <div className="empty-cart-message">
          <h2>🔒 Login Required</h2>
          <p>Please login or create an account to place your order</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
            <button onClick={() => navigate("/login")} className="shop-now-btn">
              Login
            </button>
            <button onClick={() => navigate("/signup")} className="shop-now-btn" style={{ background: 'var(--secondary-color)' }}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="place-order-container">
        <div className="empty-cart-message">
          <h2>Your cart is empty</h2>
          <p>Add some products to your cart before placing an order</p>
          <button onClick={() => navigate("/products")} className="shop-now-btn">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="place-order-container">
      <div className="place-order-wrapper">
        <div className="order-form-section">
          <h2 className="section-title">Delivery Information</h2>
          
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={data.name}
              onChange={(e) => {
                setData({ ...data, name: e.target.value });
                setErrors({ ...errors, name: "" });
              }}
              className={errors.name ? "input-error" : ""}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="mobile">Mobile Number *</label>
            <input
              id="mobile"
              type="tel"
              placeholder="03XXXXXXXXX"
              value={data.mobile}
              onChange={(e) => {
                setData({ ...data, mobile: e.target.value });
                setErrors({ ...errors, mobile: "" });
              }}
              className={errors.mobile ? "input-error" : ""}
              maxLength="11"
            />
            {errors.mobile && <span className="error-message">{errors.mobile}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="address">Delivery Address *</label>
            <textarea
              id="address"
              placeholder="Enter complete address with city and postal code"
              value={data.address}
              onChange={(e) => {
                setData({ ...data, address: e.target.value });
                setErrors({ ...errors, address: "" });
              }}
              className={errors.address ? "input-error" : ""}
              rows="4"
            />
            {errors.address && <span className="error-message">{errors.address}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="payment">Payment Method *</label>
            <select
              id="payment"
              value={data.payment}
              onChange={(e) => setData({ ...data, payment: e.target.value })}
              className="payment-select"
            >
              <option value="Cash on Delivery">Cash on Delivery</option>
              <option value="JazzCash">JazzCash</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>

          {data.payment !== "Cash on Delivery" && (
            <div className="form-group">
              <label htmlFor="paymentProof">Payment Screenshot *</label>
              <div className="file-input-wrapper">
                <input
                  id="paymentProof"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setPaymentProof(e.target.files[0]);
                    setErrors({ ...errors, paymentProof: "" });
                  }}
                  className="file-input"
                />
                {paymentProof && (
                  <span className="file-name">✓ {paymentProof.name}</span>
                )}
              </div>
              {errors.paymentProof && <span className="error-message">{errors.paymentProof}</span>}
            </div>
          )}
        </div>

        <div className="order-summary-section">
          <h2 className="section-title">Order Summary</h2>
          
          <div className="cart-items-list">
            {cart.map((item, index) => (
              <div key={index} className="cart-item-summary">
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-quantity">Qty: {item.quantity}</span>
                </div>
                <span className="item-price">PKR {item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="price-breakdown">
            <div className="price-row">
              <span>Subtotal:</span>
              <span>PKR {total}</span>
            </div>
            <div className="price-row">
              <span>Delivery Charges:</span>
              <span>PKR {deliveryCharges}</span>
            </div>
            <div className="price-row total-row">
              <span>Grand Total:</span>
              <span>PKR {grandTotal}</span>
            </div>
          </div>

          <button 
            onClick={placeOrder} 
            disabled={loading}
            className="confirm-order-btn"
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Processing...
              </>
            ) : (
              "Confirm Order"
            )}
          </button>

          <p className="order-note">
            By placing this order, you agree to our terms and conditions
          </p>
        </div>
      </div>
    </div>
  );
}
