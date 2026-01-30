
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";
import "./AddProduct.css";

function CategoryDropdown({ value, onChange }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get("/categories").then(res => {
      if (res.data.success) setCategories(res.data.data);
    });
  }, []);

  return (
    <select value={value} onChange={onChange} required className="select-field">
      <option value="">Select Category</option>
      {categories.map(cat => (
        <option key={cat} value={cat}>{cat}</option>
      ))}
    </select>
  );
}

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    stock: ""
  });

  const [image, setImage] = useState(null);



  const loadProduct = async () => {
    const res = await axios.get("/products");
    const products = res.data.success && res.data.data ? res.data.data : [];
    const product = products.find((p) => p._id === id);

    if (product) {
      setData({
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description,
        stock: product.stock,
      });
    }
  };

  const updateProduct = async () => {
    if (!data.name || !data.price || !data.category || !data.description || !data.stock) {
      return alert("Please fill all fields");
    }

    try {
      // If image is updated, send formData
      if (image) {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("price", data.price);
        formData.append("category", data.category);
        formData.append("description", data.description);
        formData.append("stock", data.stock);
        formData.append("image", image);

        await axios.put(`/products/${id}`, formData);
        alert("✅ Product updated with new image!");
      } else {
        // If image is not changed
        await axios.put(`/products/${id}`, data);
        alert("✅ Product updated successfully!");
      }
      
      navigate("/admin/manage-products");
    } catch (error) {
      alert("❌ Error updating product");
      console.error(error);
    }
  };

  useEffect(() => {
    loadProduct();
  }, []);

  return (
    <div className="add-product-container">
      <div className="add-product-card">
        <h2 className="add-product-title">Edit Product</h2>

        <div className="form-grid">
          <div className="form-group-admin">
            <label htmlFor="productName">Product Name</label>
            <input
              id="productName"
              type="text"
              placeholder="Enter product name"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className="input-field"
            />
          </div>

          <div className="form-group-admin">
            <label htmlFor="price">Price (PKR)</label>
            <input
              id="price"
              type="number"
              placeholder="Enter price"
              value={data.price}
              onChange={(e) => setData({ ...data, price: e.target.value })}
              className="input-field"
            />
          </div>

          <div className="form-group-admin">
            <label htmlFor="category">Category</label>
            <CategoryDropdown
              value={data.category}
              onChange={e => setData({ ...data, category: e.target.value })}
            />
          </div>

          <div className="form-group-admin">
            <label htmlFor="stock">Stock Quantity</label>
            <input
              id="stock"
              type="number"
              placeholder="Enter stock quantity"
              value={data.stock}
              onChange={(e) => setData({ ...data, stock: e.target.value })}
              className="input-field"
            />
          </div>

          <div className="form-group-admin full-width">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Enter product description"
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              className="textarea-field"
              rows="4"
            />
          </div>

          <div className="form-group-admin full-width">
            <label htmlFor="productImage">Update Product Image (Optional)</label>
            <div className="file-upload-wrapper">
              <input
                id="productImage"
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="file-input-field"
              />
              {image && (
                <div className="file-preview">
                  <span className="file-icon">📷</span>
                  <span className="file-name-display">{image.name}</span>
                </div>
              )}
            </div>
            <p style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
              Leave empty to keep current image
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={updateProduct} className="submit-btn-admin">
            ✅ Update Product
          </button>
          <button 
            onClick={() => navigate("/admin/manage-products")} 
            className="submit-btn-admin"
            style={{ background: "#666" }}
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}
