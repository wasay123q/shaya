
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import "./Category.css";

export default function Category() {
  const [availableCategories, setAvailableCategories] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Inline fetch for available categories (products)
    (async () => {
      try {
        const res = await axios.get("/products");
        const products = res.data.success && res.data.data ? res.data.data : [];
        setProductsData(products);
        // Get unique categories with their slugs
        const categoryMap = new Map();
        const productArray = products;
        productArray.forEach(product => {
          if (product && product.category) {
            const slug = product.category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '');
            categoryMap.set(slug, {
              name: product.category,
              slug: slug,
              count: (categoryMap.get(slug)?.count || 0) + 1
            });
          }
        });
        setAvailableCategories(Array.from(categoryMap.values()));
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    })();
    fetchCategoriesFromBackend();
  }, []);


  // Fetch categories from backend
  const fetchCategoriesFromBackend = async () => {
    try {
      const res = await axios.get("/categories");
      if (res.data.success && Array.isArray(res.data.data)) {
        // Icon and description map for categories
        const iconDescMap = {
          "Abayas": { icon: "👗", description: "Elegant and modest abayas for every occasion" },
          "Dresses": { icon: "👗", description: "Beautiful modest dresses for all occasions" },
          "Traditional Wear": { icon: "🥻", description: "Classic Pakistani & Asian fashion" },
          "Modest Wear": { icon: "👚", description: "Comfortable modest clothing" },
          "Hijabs & Scarves": { icon: "🧕", description: "Premium quality hijabs and scarves" },
          "Stoles": { icon: "🧣", description: "Luxurious stoles for elegant styling" },
          "Accessories": { icon: "✨", description: "Complete your modest look" },
          "Fashion Bags": { icon: "👜", description: "Stylish handbags and accessories" },
          "Footwear": { icon: "👠", description: "Comfortable and stylish shoes" },
          "Jewelry": { icon: "💍", description: "Beautiful artificial jewelry" },
          "Beauty & Care": { icon: "🧴", description: "Perfumes and personal care" },
          "Winter Collection": { icon: "🧥", description: "Stay warm and stylish" },
          "Gift Items": { icon: "🎁", description: "Perfect gifts for loved ones" }
        };
        setCategories(res.data.data.map((cat, idx) => {
          const { icon, description } = iconDescMap[cat] || { icon: '', description: '' };
          return {
            id: idx + 1,
            name: cat,
            slug: cat.toLowerCase().replace(/\s+/g, '-').replace(/&/g, ''),
            icon,
            description,
            subcategories: []
          };
        }));
      }
    } catch (err) {
      setCategories([]);
    }
  };

  return (
    <div className="category-container">
      <div className="category-hero">
        <h1>Shop by Category</h1>
        <p className="hero-subtitle">Discover our curated collection of modest fashion essentials</p>
      </div>

      <div className="categories-grid">
        {categories.map((category) => {
          // Fix: Match slugs in a case-insensitive way
          const hasProducts = availableCategories.some(cat => cat.slug.toLowerCase() === category.slug.toLowerCase());
          const productCount = availableCategories.find(cat => cat.slug.toLowerCase() === category.slug.toLowerCase())?.count || 0;
          return (
            <div className={`category-card ${!hasProducts ? 'coming-soon' : ''}`} key={category.id}>
              {!hasProducts && (
                <div className="coming-soon-badge">Coming Soon</div>
              )}
              {hasProducts && (
                <div className="products-count-badge">{productCount} item{productCount !== 1 ? 's' : ''}</div>
              )}
              <Link 
                to={hasProducts ? `/products/${category.slug}` : '#'} 
                className="category-link"
                onClick={(e) => {
                  if (!hasProducts) {
                    e.preventDefault();
                    alert('🎉 This category is coming soon! Stay tuned for exciting new products.');
                  }
                }}
              >
                <div className="category-icon">{category.icon}</div>
                <h3 className="category-name">{category.name}</h3>
                <p className="category-description">{category.description}</p>
                
                <div className="subcategories-preview">
                  {category.subcategories.slice(0, 3).map((sub, idx) => (
                    <span key={idx} className="subcategory-tag">{sub}</span>
                  ))}
                  {category.subcategories.length > 3 && (
                    <span className="subcategory-tag more">+{category.subcategories.length - 3} more</span>
                  )}
                </div>
                
                <button className="shop-category-btn">
                  {hasProducts ? (
                    <>Shop Now <span className="arrow">→</span></>
                  ) : (
                    <>Coming Soon <span className="arrow">🔜</span></>
                  )}
                </button>
              </Link>
            </div>
          );
        })}
      </div>

      <div className="category-benefits">
        <div className="benefit-item">
          <div className="benefit-icon">🚚</div>
          <h4>Fast Delivery</h4>
          <p>Nationwide shipping</p>
        </div>
        <div className="benefit-item">
          <div className="benefit-icon">💯</div>
          <h4>Quality Assured</h4>
          <p>Premium materials</p>
        </div>
        <div className="benefit-item">
          <div className="benefit-icon">🔒</div>
          <h4>Secure Payment</h4>
          <p>Safe transactions</p>
        </div>
        <div className="benefit-item">
          <div className="benefit-icon">↩️</div>
          <h4>Easy Returns</h4>
          <p>Hassle-free process</p>
        </div>
      </div>
    </div>
  );
}
