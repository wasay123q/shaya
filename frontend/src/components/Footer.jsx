import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer-modern">
      <div className="footer-container">
        {/* Company Info */}
        <div className="footer-section">
          <div className="footer-logo">
            <span className="footer-logo-icon">🧕</span>
            <span className="footer-logo-text">Shaya Modestwear</span>
          </div>
          <p className="footer-description">
            Your premier destination for elegant and modest fashion. 
            Quality products with exceptional service.
          </p>
          <div className="footer-social">
            <a href="#" className="social-link">📘</a>
            <a href="#" className="social-link">📷</a>
            <a href="#" className="social-link">🐦</a>
            <a href="#" className="social-link">📧</a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/category">Shop Categories</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/my-orders">Track Order</Link></li>
            <li><Link to="/cart">Shopping Cart</Link></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div className="footer-section">
          <h3 className="footer-heading">Customer Service</h3>
          <ul className="footer-links">
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Shipping Policy</a></li>
            <li><a href="#">Return Policy</a></li>
            <li><a href="#">FAQs</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h3 className="footer-heading">Get in Touch</h3>
          <ul className="footer-contact">
            <li>📍 Muhallah Islamabad, Street No 7</li>
            <li style={{ marginLeft: '1.2rem' }}>Main Bazar Kabirwala, District Khanewal</li>
            <li>💳 Bank Account: 66010107365908</li>
            <li>📱 JazzCash: 03060977494</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>&copy; 2025 Shaya Modestwear. All Rights Reserved.</p>
        <div className="footer-bottom-links">
          <a href="#">Privacy Policy</a>
          <span>•</span>
          <a href="#">Terms of Service</a>
          <span>•</span>
          <a href="#">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
}
