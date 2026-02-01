import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "../utils/axiosInstance";
import { CartContext } from "../context/CartContext";
import "./ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, cart } = useContext(CartContext);
  const nav = useNavigate();

  const getProduct = async () => {
    const res = await axios.get("/products");
    const product = res.data.data.find((item) => item._id === id);
    setP(product);
  };

  useEffect(() => {
    getProduct();
  }, []);

  const handleAddToCart = () => {
    const cartItem = cart.find(item => item._id === p._id);
    const currentCartQty = cartItem ? cartItem.quantity : 0;
    const availableStock = p.stock - currentCartQty;

    if (availableStock <= 0) {
      alert(`❌ This item is already in your cart with maximum available quantity.`);
      return;
    }

    if (quantity > availableStock) {
      alert(`⚠️ Only ${availableStock} unit(s) available. Adding ${availableStock} to cart.`);
      if (addToCart(p, availableStock)) {
        nav("/cart");
      }
    } else {
      if (addToCart(p, quantity)) {
        nav("/cart");
      }
    }
  };

  const calculateDiscountedPrice = (price, discount) => {
    return (price - (price * discount / 100)).toFixed(0);
  };

  const isSaleActive = (product) => {
    if (!product.sale || !product.sale.isOnSale) return false;
    
    const now = new Date();
    const endDate = product.sale.saleEndDate ? new Date(product.sale.saleEndDate) : null;
    
    return !endDate || endDate >= now;
  };

  if (!p) return (
    <div className="product-details-container">
      <div className="loading-state">
        <div className="spinner-large"></div>
        <p>Loading product details...</p>
      </div>
    </div>
  );

  const getStockStatus = () => {
    if (p.stock === 0) {
      return <span className="stock-status out-of-stock">❌ Out of Stock</span>;
    } else if (p.stock <= 5) {
      return <span className="stock-status low-stock">⚠️ Only {p.stock} left in stock</span>;
    } else {
      return <span className="stock-status in-stock">✅ In Stock ({p.stock} available)</span>;
    }
  };

  return (
    <div className="product-details-container">
      <div className="product-details-wrapper">
        <div className="product-image-section">
          <img
            src={p.image || "https://via.placeholder.com/300x300?text=No+Image"}
            alt={p.name}
            className="product-detail-image"
            onError={e => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/300x300?text=No+Image"; }}
          />
        </div>

        <div className="product-info-section">
          <h1 className="product-title">{p.name}</h1>
          
          <div className="product-category-badge">
            {p.category}
          </div>

          {getStockStatus()}

          <div className="product-price-section">
            {isSaleActive(p) ? (
              <>
                <div className="sale-indicator">
                  <span className="sale-badge-large">{p.sale.discountPercentage}% OFF</span>
                  {p.sale.saleEndDate && (
                    <span className="sale-ends">Ends: {new Date(p.sale.saleEndDate).toLocaleDateString()}</span>
                  )}
                </div>
                <div className="price-original-line">
                  <span className="price-label">Original Price:</span>
                  <div className="price-amount strikethrough">
                    <span className="currency">PKR</span>
                    <span className="amount">{p.price.toLocaleString()}</span>
                  </div>
                </div>
                <div className="price-sale-line">
                  <span className="price-label">Sale Price:</span>
                  <div className="price-amount sale">
                    <span className="currency">PKR</span>
                    <span className="amount">{calculateDiscountedPrice(p.price, p.sale.discountPercentage).toLocaleString()}</span>
                  </div>
                </div>
                <div className="savings-info">
                  You save: PKR {(p.price - calculateDiscountedPrice(p.price, p.sale.discountPercentage)).toLocaleString()}
                </div>
              </>
            ) : (
              <>
                <span className="price-label">Price:</span>
                <div className="price-amount">
                  <span className="currency">PKR</span>
                  <span className="amount">{p.price.toLocaleString()}</span>
                </div>
              </>
            )}
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{p.description}</p>
          </div>

          {p.stock > 0 && (
            <div className="quantity-selector">
              <label htmlFor="quantity">Quantity:</label>
              <div className="quantity-controls">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="qty-btn"
                >
                  -
                </button>
                <input 
                  type="number" 
                  id="quantity"
                  value={quantity} 
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setQuantity(Math.min(p.stock, Math.max(1, val)));
                  }}
                  min="1"
                  max={p.stock}
                  className="qty-input"
                />
                <button 
                  onClick={() => setQuantity(Math.min(p.stock, quantity + 1))}
                  className="qty-btn"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <div className="action-buttons">
            <button 
              onClick={handleAddToCart}
              disabled={p.stock === 0}
              className="add-to-cart-btn"
            >
              {p.stock === 0 ? '❌ Out of Stock' : '🛒 Add to Cart'}
            </button>
            <button 
              onClick={() => nav('/cart')}
              className="view-cart-btn"
            >
              View Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
