import { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import "./ManageSales.css";

export default function ManageSales() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [saleData, setSaleData] = useState({
    isOnSale: false,
    discountPercentage: 0,
    saleStartDate: "",
    saleEndDate: ""
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products");
      const productData = res.data.success && res.data.data ? res.data.data : [];
      setProducts(productData);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSetSale = async (productId) => {
    try {
      const res = await axios.put(`/api/products/sale/${productId}`, saleData);
      if (res.data.success) {
        alert("Sale updated successfully!");
        fetchProducts();
        setSelectedProduct(null);
        setSaleData({
          isOnSale: false,
          discountPercentage: 0,
          saleStartDate: "",
          saleEndDate: ""
        });
      }
    } catch (error) {
      console.error("Error setting sale:", error);
      alert("Failed to update sale");
    }
  };

  const handleRemoveSale = async (productId) => {
    try {
      const res = await axios.delete(`/api/products/sale/${productId}`);
      if (res.data.success) {
        alert("Sale removed successfully!");
        fetchProducts();
      }
    } catch (error) {
      console.error("Error removing sale:", error);
      alert("Failed to remove sale");
    }
  };

  const openSaleModal = (product) => {
    setSelectedProduct(product);
    if (product.sale && product.sale.isOnSale) {
      setSaleData({
        isOnSale: product.sale.isOnSale,
        discountPercentage: product.sale.discountPercentage,
        saleStartDate: product.sale.saleStartDate ? new Date(product.sale.saleStartDate).toISOString().split('T')[0] : "",
        saleEndDate: product.sale.saleEndDate ? new Date(product.sale.saleEndDate).toISOString().split('T')[0] : ""
      });
    } else {
      setSaleData({
        isOnSale: true,
        discountPercentage: 10,
        saleStartDate: new Date().toISOString().split('T')[0],
        saleEndDate: ""
      });
    }
  };

  const calculateDiscountedPrice = (price, discount) => {
    return (price - (price * discount / 100)).toFixed(2);
  };

  return (
    <div className="manage-sales">
      <h1>Manage Product Sales</h1>

      <div className="products-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <img 
              src={`http://localhost:5000/uploads/${product.image}`} 
              alt={product.name}
            />
            <h3>{product.name}</h3>
            <div className="price-info">
              <p className="original-price">₹{product.price}</p>
              {product.sale?.isOnSale && (
                <>
                  <p className="discount-badge">{product.sale.discountPercentage}% OFF</p>
                  <p className="sale-price">₹{calculateDiscountedPrice(product.price, product.sale.discountPercentage)}</p>
                </>
              )}
            </div>

            {product.sale?.isOnSale && (
              <div className="sale-info">
                <p>Sale Active</p>
                {product.sale.saleEndDate && (
                  <p className="end-date">Ends: {new Date(product.sale.saleEndDate).toLocaleDateString()}</p>
                )}
              </div>
            )}

            <div className="action-buttons">
              <button 
                className="btn-set-sale"
                onClick={() => openSaleModal(product)}
              >
                {product.sale?.isOnSale ? "Edit Sale" : "Set Sale"}
              </button>
              {product.sale?.isOnSale && (
                <button 
                  className="btn-remove-sale"
                  onClick={() => handleRemoveSale(product._id)}
                >
                  Remove Sale
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Set Sale for {selectedProduct.name}</h2>
            
            <div className="form-group">
              <label>
                <input 
                  type="checkbox"
                  checked={saleData.isOnSale}
                  onChange={(e) => setSaleData({...saleData, isOnSale: e.target.checked})}
                />
                Enable Sale
              </label>
            </div>

            <div className="form-group">
              <label>Discount Percentage (%)</label>
              <input 
                type="number"
                min="0"
                max="100"
                value={saleData.discountPercentage}
                onChange={(e) => setSaleData({...saleData, discountPercentage: Number(e.target.value)})}
              />
            </div>

            <div className="price-preview">
              <p>Original Price: ₹{selectedProduct.price}</p>
              <p className="discounted">Discounted Price: ₹{calculateDiscountedPrice(selectedProduct.price, saleData.discountPercentage)}</p>
            </div>

            <div className="form-group">
              <label>Sale Start Date (Optional)</label>
              <input 
                type="date"
                value={saleData.saleStartDate}
                onChange={(e) => setSaleData({...saleData, saleStartDate: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Sale End Date (Optional)</label>
              <input 
                type="date"
                value={saleData.saleEndDate}
                onChange={(e) => setSaleData({...saleData, saleEndDate: e.target.value})}
              />
            </div>

            <div className="modal-actions">
              <button 
                className="btn-save"
                onClick={() => handleSetSale(selectedProduct._id)}
              >
                Save Sale
              </button>
              <button 
                className="btn-cancel"
                onClick={() => setSelectedProduct(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
