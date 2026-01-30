import React, { useState } from "react";
import axios from "../utils/axiosInstance";
import "./AddProduct.css";

function CategoryDropdown({ value, onChange }) {
  const [categories, setCategories] = useState([]);

  React.useEffect(() => {
    axios.get("/categories").then(res => {
      if (res.data.success) setCategories(res.data.data);
    });
  }, []);

  return (
    <select value={value} onChange={onChange} required>
      <option value="">Select Category</option>
      {categories.map(cat => (
        <option key={cat} value={cat}>{cat}</option>
      ))}
    </select>
  );
}

export default function AddProduct() {
  const [data, setData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    stock: "",
  });

  const [image, setImage] = useState(null);




  const addProduct = async () => {
    if (
      !data.name ||
      !data.price ||
      !data.category ||
      !data.description ||
      !data.stock ||
      !image
    ) {
      return alert("Please fill all fields");
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("category", data.category);
    formData.append("description", data.description);
    formData.append("stock", data.stock);
    formData.append("image", image);

    try {
      const res = await axios.post("/products/add", formData);

      if (res.data.success) {
        alert("Product Added Successfully!");
        setData({
          name: "",
          price: "",
          category: "",
          description: "",
          stock: "",
        });
        setImage(null);
      }
    } catch (error) {
      alert("Error adding product");
    }
  };

  return (
    <div className="add-product-container">
      <div className="add-product-card">
        <h2 className="add-product-title">Add New Product</h2>

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
            <label htmlFor="productImage">Product Image</label>
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
          </div>
        </div>

        <button onClick={addProduct} className="submit-btn-admin">
          ➕ Add Product
        </button>
      </div>
    </div>
  );
}
