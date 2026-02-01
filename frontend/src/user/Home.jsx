import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";
import "./Home.css";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadFeaturedProducts();
    loadSaleProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const res = await axios.get("/products");
      // Get random 8 products for featured section
      const products = res.data.success && res.data.data ? res.data.data : [];
      const shuffled = products.sort(() => 0.5 - Math.random());
      setFeaturedProducts(shuffled.slice(0, 8));
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadSaleProducts = async () => {
    try {
      const res = await axios.get("/products/sale");
      if (res.data.success) {
        setSaleProducts(res.data.products);
      }
    } catch (err) {
      console.error("Error loading sale products:", err);
    }
  };

  const calculateDiscountedPrice = (price, discount) => {
    return (price - (price * discount / 100)).toFixed(0);
  };

  const categories = [
    { name: "Abayas", icon: "👗", slug: "abaya", color: "#FFE5E5" },
    { name: "Hijabs", icon: "🧕", slug: "hijab", color: "#E5F3FF" },
    { name: "Stoles", icon: "🧣", slug: "stole", color: "#FFF5E5" },
    { name: "Accessories", icon: "✨", slug: "accessories", color: "#F0FFE5" },
    { name: "Dresses", icon: "👗", slug: "dress", color: "#FFE5F5" },
    { name: "Jewelry", icon: "💍", slug: "jewelry", color: "#E5FFFF" },
  ];

  return (
    <div className="home-container">
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <span className="hero-badge">✨ New Arrivals</span>
          <h1 className="hero-title">Discover Modest Fashion</h1>
          <p className="hero-subtitle">
            Elevate your style with our premium collection of abayas, hijabs, and modest wear
          </p>
          <div className="hero-buttons">
            <button onClick={() => navigate("/category")} className="btn-primary-hero">
              Shop Now
            </button>
            <button onClick={() => navigate("/about")} className="btn-secondary-hero">
              Learn More
            </button>
          </div>
        </div>
        <div className="hero-image">
          <div className="floating-card card-1">
            <span className="discount-badge">-30%</span>
            <div className="product-mini">New Collection</div>
          </div>
          <div className="floating-card card-2">
            <span className="trend-badge">🔥 Trending</span>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="section-header">
          <h2>Shop by Category</h2>
          <Link to="/category" className="view-all-link">
            View All <span>→</span>
          </Link>
        </div>
        <div className="categories-quick-grid">
          {categories.map((cat, idx) => (
            <Link 
              to={`/products/${cat.slug}`} 
              key={idx} 
              className="category-quick-card"
              style={{ background: cat.color }}
            >
              <div className="category-icon-large">{cat.icon}</div>
              <h3>{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Deals Banner */}
      <section className="deals-banner">
        <div className="deal-content">
          <span className="deal-badge">🎉 Limited Time Offer</span>
          <h2>Special Deals & Offers</h2>
          <p>Get up to 40% off on selected items</p>
          <button onClick={() => navigate("/category")} className="btn-deal">
            Shop Deals
          </button>
        </div>
        <div className="deal-timer">
          <div className="timer-box">
            <span className="timer-value">12</span>
            <span className="timer-label">Hours</span>
          </div>
          <div className="timer-box">
            <span className="timer-value">34</span>
            <span className="timer-label">Mins</span>
          </div>
          <div className="timer-box">
            <span className="timer-value">56</span>
            <span className="timer-label">Secs</span>
          </div>
        </div>
      </section>

      {/* Sale Products Section */}
      {saleProducts.length > 0 && (
        <section className="sale-products-section">
          <div className="section-header">
            <h2>🔥 Special Offers & Sales</h2>
            <div className="sale-subtitle">Limited time deals - Don't miss out!</div>
          </div>
          
          <div className="sale-products-grid">
            {saleProducts.map((product) => (
              <Link to={`/product/${product._id}`} key={product._id} className="sale-product-card">
                <div className="sale-image-wrapper">
                  <img 
                    src={product.image || "https://via.placeholder.com/300x300?text=No+Image"}
                    alt={product.name}
                    onError={e => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/300x300?text=No+Image"; }}
                  />
                  <div className="sale-discount-badge">
                    {product.sale.discountPercentage}% OFF
                  </div>
                </div>
                <div className="sale-product-info">
                  <h3>{product.name}</h3>
                  <div className="sale-pricing">
                    <span className="original-price">PKR {product.price.toLocaleString()}</span>
                    <span className="sale-price">PKR {calculateDiscountedPrice(product.price, product.sale.discountPercentage).toLocaleString()}</span>
                  </div>
                  {product.sale.saleEndDate && (
                    <div className="sale-timer-info">
                      ⏰ Ends: {new Date(product.sale.saleEndDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="featured-section">
        <div className="section-header">
          <h2>Featured Products</h2>
          <Link to="/category" className="view-all-link">
            View All <span>→</span>
          </Link>
        </div>

        {loading ? (
          <div className="loading-products">
            <div className="spinner-large"></div>
            <p>Loading products...</p>
          </div>
        ) : (
          <div className="products-home-grid">
            {featuredProducts.map((product) => (
              <Link 
                to={`/product/${product._id}`} 
                key={product._id} 
                className="product-home-card"
              >
                <div className="product-image-wrapper-home">
                  {product.stock <= 5 && product.stock > 0 && (
                    <span className="badge-stock-low">Only {product.stock} left</span>
                  )}
                  {product.stock === 0 && (
                    <span className="badge-out-stock">Sold Out</span>
                  )}
                  <img 
                    src={product.image || "https://via.placeholder.com/300x300?text=No+Image"}
                    alt={product.name}
                    className="product-image-home"
                    onError={e => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/300x300?text=No+Image"; }}
                  />
                </div>
                <div className="product-details-home">
                  <span className="product-category-home">{product.category}</span>
                  <h3 className="product-name-home">{product.name}</h3>
                  <div className="product-price-home">
                    <span className="price">PKR {product.price.toLocaleString()}</span>
                  </div>
                  <button className="btn-add-cart-home">Add to Cart</button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="feature-card">
          <div className="feature-icon">🚚</div>
          <h3>Fast Delivery</h3>
          <p>Nationwide shipping</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">💯</div>
          <h3>Quality Products</h3>
          <p>Premium materials</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3>Secure Payment</h3>
          <p>Safe & encrypted</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">↩️</div>
          <h3>Easy Returns</h3>
          <p>Hassle-free process</p>
        </div>
      </section>
    </div>
  );
}
