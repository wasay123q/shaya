import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";
import "./MyOrders.css";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      navigate("/login");
      return;
    }

    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      // axios interceptor will automatically add Authorization header
      // Backend extracts userId from JWT token
      const res = await axios.get('/orders/user');
      
      if (res.data.success) {
        setOrders(res.data.orders || []);
      } else {
        alert(res.data.message || "Failed to load orders");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      const errorMsg = err.response?.data?.message || "Failed to load orders";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: "Pending", class: "status-pending" },
      approved: { label: "✓ Approved", class: "status-approved" },
      "in progress": { label: "🚚 In Progress", class: "status-progress" },
      rejected: { label: "✗ Rejected", class: "status-rejected" },
      delivered: { label: "✓ Delivered", class: "status-delivered" },
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-PK", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="my-orders-container">
        <div className="loading-spinner">
          <div className="spinner-large"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-container">
      <div className="orders-header">
        <h1>My Orders</h1>
        <p className="orders-subtitle">Track and manage your orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <div className="no-orders-icon">📦</div>
          <h2>No Orders Yet</h2>
          <p>You haven't placed any orders yet</p>
          <button onClick={() => navigate("/category")} className="shop-now-btn">
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-id-section">
                  <span className="order-label">Order ID:</span>
                  <span className="order-id">#{order._id?.slice(-8).toUpperCase()}</span>
                </div>
                {getStatusBadge(order.status)}
              </div>

              <div className="order-date">
                <span className="order-label">Placed on:</span>
                <span>{formatDate(order.createdAt)}</span>
              </div>

              <div className="order-delivery-info">
                <div className="delivery-detail">
                  <strong>Name:</strong> {order.name}
                </div>
                <div className="delivery-detail">
                  <strong>Mobile:</strong> {order.mobile}
                </div>
                <div className="delivery-detail">
                  <strong>Address:</strong> {order.address}
                </div>
                <div className="delivery-detail">
                  <strong>Payment:</strong> {order.payment}
                </div>
              </div>

              <div className="order-items">
                <h4>Ordered Items:</h4>
                <div className="items-list">
                  {order.items?.map((item, index) => (
                    <div key={index} className="order-item">
                      <span className="item-name">{item.name}</span>
                      <span className="item-details">
                        Qty: {item.quantity} × PKR {item.price}
                      </span>
                      <span className="item-total">
                        PKR {item.quantity * item.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <span className="total-label">Total Amount:</span>
                  <span className="total-amount">PKR {order.totalAmount}</span>
                </div>
                
                {order.adminResponse && (
                  <div className={`admin-response ${order.status?.toLowerCase()}`}>
                    <div className="response-header">
                      <strong>Admin Response:</strong>
                    </div>
                    <p>{order.adminResponse}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
