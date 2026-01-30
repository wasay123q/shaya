import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TopBanner from "./components/TopBanner";
import ErrorBoundary from "./components/ErrorBoundary";

// User Pages
import Home from "./user/Home";
import Category from "./user/Category";
import Products from "./user/Products";
import ProductDetails from "./user/ProductDetails";
import Cart from "./user/Cart";
import PlaceOrder from "./user/PlaceOrder";
import Signup from "./user/Signup";
import Login from "./user/Login";
import AboutUs from "./user/AboutUs";
import MyOrders from "./user/MyOrders";

// Admin Pages
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import AddProduct from "./admin/AddProduct";
import ManageProducts from "./admin/ManageProducts";
import EditProduct from "./admin/EditProduct";
import Orders from "./admin/Orders";
import ManageSales from "./admin/ManageSales";

// Context
import CartProvider from "./context/CartContext";
import AuthProvider from "./context/AuthContext";

// Protected Admin Route
function AdminProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  
  // Check if user is authenticated AND is admin
  const isAdmin = token && userRole === "admin";
  
  return isAdmin ? children : <AdminLogin />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
          <TopBanner />
          <Navbar />

          <div style={{ padding: "20px" }}>
            <Routes>
            
            {/* User Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/category" element={<Category />} />
            <Route path="/products/:cat" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/place-order" element={<PlaceOrder />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<AboutUs />} />

            {/* Admin Login */}
            <Route path="/admin" element={<AdminLogin />} />

            {/* Protected Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/admin/add-product"
              element={
                <AdminProtectedRoute>
                  <AddProduct />
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/admin/products"
              element={
                <AdminProtectedRoute>
                  <ManageProducts />
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/admin/edit/:id"
              element={
                <AdminProtectedRoute>
                  <EditProduct />
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/admin/orders"
              element={
                <AdminProtectedRoute>
                  <Orders />
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/admin/sales"
              element={
                <AdminProtectedRoute>
                  <ManageSales />
                </AdminProtectedRoute>
              }
            />

          </Routes>
        </div>

        <Footer />
      </BrowserRouter>
    </CartProvider>
    </AuthProvider>
    </ErrorBoundary>
  );
}
