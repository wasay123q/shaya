
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";


export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [availableCategories, setAvailableCategories] = useState([]);
  const { cart } = useContext(CartContext);
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAvailableCategories();
  }, []);

  const fetchAvailableCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const response = await res.json();
      
      // Handle new API response format
      const products = response.success && response.data ? response.data : (Array.isArray(response) ? response : []);
      
      // Get unique categories from products
      const categoriesMap = new Map();
      products.forEach(product => {
        if (product && product.category) {
          const cat = product.category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '');
          if (!categoriesMap.has(cat)) {
            categoriesMap.set(cat, {
              name: product.category,
              slug: cat,
              count: 1
            });
          } else {
            categoriesMap.get(cat).count++;
          }
        }
      });
      
      setAvailableCategories(Array.from(categoriesMap.values()));
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="navbar-modern">
      <div className="navbar-container">
        {/* Hamburger Menu Button removed as requested */}

        {/* Logo Section */}
        <Link to="/" className="navbar-logo">
          <img src="/src/assets/shaya_logo.jpeg" alt="Shaya Logo" className="logo-icon" style={{ width: 120, height: 80, objectFit: 'contain' }} />
        </Link>

        {/* Navigation Links */}
        <div className="navbar-menu">
          <Link to="/" className="nav-link">
            <span className="nav-icon">🏠</span> Home
          </Link>
          <Link to="/category" className="nav-link">
            <span className="nav-icon">📦</span> Categories
          </Link>
          <Link to="/about" className="nav-link">
            <span className="nav-icon">ℹ️</span> About Us
          </Link>
          
          {isLoggedIn && (
            <Link to="/my-orders" className="nav-link nav-orders">
              <span className="nav-icon">📋</span> My Orders
            </Link>
          )}
        </div>

        {/* Right Section */}
        <div className="navbar-actions">
          {/* Cart */}
          <Link to="/cart" className="nav-cart-btn">
            <span className="cart-icon">🛒</span>
            {cartItemsCount > 0 && (
              <span className="cart-badge">{cartItemsCount}</span>
            )}
            <span className="cart-text">Cart</span>
          </Link>

          {/* Account Section */}
          {isLoggedIn ? (
            <div className="account-menu">
              <button className="account-btn">
                <span className="account-icon">👤</span>
                <span>Account</span>
              </button>
              <div className="account-dropdown">
                <Link to="/my-orders" className="dropdown-item">
                  📋 My Orders
                </Link>
                <button onClick={handleLogout} className="dropdown-item logout-btn">
                  🚪 Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/signup" className="btn-signup">Sign Up</Link>
            </div>
          )}

          {/* Admin Link */}
          <Link to="/admin" className="admin-link">
            <span className="admin-icon">⚙️</span>
            Admin
          </Link>
        </div>
      </div>

      {/* Mobile menu removed as requested */}
    </nav>
  );
}
