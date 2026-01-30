import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { Link } from "react-router-dom";
import "./ManageProducts.css";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const loadProducts = async () => {
    try {
      const res = await axios.get("/products");
      const productData = res.data.success && res.data.data ? res.data.data : [];
      setProducts(productData);
    } catch (err) {
      console.error("Error loading products:", err);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await axios.delete(`/products/${id}`);
      alert("Product deleted successfully!");
      loadProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const getFilteredProducts = () => {
    if (filter === "all") return products;
    if (filter === "low-stock") return products.filter(p => p.stock <= 5 && p.stock > 0);
    if (filter === "out-of-stock") return products.filter(p => p.stock === 0);
    return products.filter(p => p.category.toLowerCase() === filter.toLowerCase());
  };

  const filteredProducts = getFilteredProducts();
  const categories = [...new Set(products.map(p => p.category))];

  if (loading) {
    return (
      <div className="manage-products-container">
        <h2>Manage Products</h2>
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="manage-products-container">
      <div className="products-header">
        <h2>📦 Manage Products</h2>
        <Link to="/admin/add-product">
          <button className="btn-add-product">➕ Add New Product</button>
        </Link>
      </div>

      <div className="filter-section">
        <label>Filter by:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
          <option value="all">All Products ({products.length})</option>
          <option value="low-stock">Low Stock ({products.filter(p => p.stock <= 5 && p.stock > 0).length})</option>
          <option value="out-of-stock">Out of Stock ({products.filter(p => p.stock === 0).length})</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat} ({products.filter(p => p.category === cat).length})</option>
          ))}
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <p>No products found</p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((p) => (
            <div className="product-card-admin" key={p._id}>
              <div className="product-image-container">
                <img
                  src={p.image ? `http://localhost:5000/uploads/products/${p.image}` : "https://via.placeholder.com/200x200?text=No+Image"}
                  alt={p.name}
                  className="product-image-admin"
                  onError={e => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/200x200?text=No+Image"; }}
                />
                {p.stock === 0 && <div className="out-of-stock-overlay">OUT OF STOCK</div>}
                {p.stock > 0 && p.stock <= 5 && <div className="low-stock-badge">Only {p.stock} left</div>}
              </div>

              <div className="product-info-admin">
                <h3 className="product-name-admin">{p.name}</h3>
                <p className="product-category">
                  <span className="category-badge">{p.category}</span>
                </p>
                <p className="product-price-admin">PKR {p.price.toLocaleString()}</p>
                <p className="product-stock">
                  <strong>Stock:</strong> 
                  <span className={`stock-value ${p.stock === 0 ? 'zero' : p.stock <= 5 ? 'low' : 'good'}`}>
                    {p.stock} units
                  </span>
                </p>
                {p.description && (
                  <p className="product-desc-preview">{p.description.substring(0, 80)}...</p>
                )}
              </div>

              <div className="product-actions">
                <Link to={`/admin/edit/${p._id}`}>
                  <button className="btn-edit">✏️ Edit</button>
                </Link>
                <button
                  onClick={() => deleteProduct(p._id, p.name)}
                  className="btn-delete"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
