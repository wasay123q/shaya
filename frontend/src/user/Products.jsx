import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import "./Products.css";

export default function Products() {
  const { cat } = useParams(); // category in URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getProducts = async () => {
    try {
      const res = await axios.get("/products");
      
      // Handle standardized API response
      const productArray = res.data.success && res.data.data ? res.data.data : [];
      
      // Match category with flexible comparison (spaces vs dashes)
      const filtered = productArray.filter((item) => {
        if (!item || !item.category) return false;
        const itemCat = item.category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '');
        const searchCat = cat.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '');
        return itemCat === searchCat;
      });
      
      setProducts(filtered);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    getProducts();
  }, [cat]);

  const getStockBadge = (stock) => {
    if (stock === 0) {
      return <span className="stock-badge out-of-stock">Out of Stock</span>;
    } else if (stock <= 5) {
      return <span className="stock-badge low-stock">Only {stock} left</span>;
    } else {
      return <span className="stock-badge in-stock">In Stock</span>;
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

  if (loading) {
    return (
      <div className="products-container">
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-container">
      <div className="products-header">
        <h1>{cat.charAt(0).toUpperCase() + cat.slice(1)}</h1>
        <p className="products-count">
          {products.length} {products.length === 1 ? 'Product' : 'Products'} Available
        </p>
      </div>

      {products.length === 0 ? (
        <div className="no-products">
          <div className="no-products-icon">📦</div>
          <h2>No Products Found</h2>
          <p>We don't have any products in this category yet</p>
          <Link to="/category">
            <button className="back-to-categories-btn">Browse All Categories</button>
          </Link>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((p) => (
            <Link to={`/product/${p._id}`} key={p._id} className="product-card-link">
              <div className="product-card">
                <div className="product-image-wrapper">
                  <img
                    src={p.image ? `http://localhost:5000/uploads/products/${p.image}` : "https://via.placeholder.com/300x300?text=No+Image"}
                    alt={p.name}
                    className="product-image"
                    onError={e => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/300x300?text=No+Image"; }}
                  />
                  {isSaleActive(p) && (
                    <div className="sale-badge">
                      {p.sale.discountPercentage}% OFF
                    </div>
                  )}
                  {getStockBadge(p.stock)}
                </div>
                
                <div className="product-info">
                  <div className="product-category-badge">{p.category}</div>
                  <h3 className="product-name">{p.name}</h3>
                  <div className="product-price">
                    {isSaleActive(p) ? (
                      <>
                        <div className="price-original">
                          <span className="currency">PKR</span>
                          <span className="amount-strikethrough">{p.price.toLocaleString()}</span>
                        </div>
                        <div className="price-sale">
                          <span className="currency">PKR</span>
                          <span className="amount">{calculateDiscountedPrice(p.price, p.sale.discountPercentage).toLocaleString()}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="currency">PKR</span>
                        <span className="amount">{p.price.toLocaleString()}</span>
                      </>
                    )}
                  </div>
                  
                  {p.description && (
                    <p className="product-description-preview">
                      {p.description.substring(0, 80)}{p.description.length > 80 ? '...' : ''}
                    </p>
                  )}
                  
                  <button className="view-details-btn">
                    View Details <span className="arrow">→</span>
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
