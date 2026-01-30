import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import "./AdminOrders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responseText, setResponseText] = useState({});

  const loadOrders = async () => {
    try {
      const res = await axios.get("/orders/all");
      setOrders(res.data.data || []);
    } catch (err) {
      console.error("Error loading orders:", err);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status, response = "") => {
    try {
      console.log("Updating order:", orderId, "to status:", status);
      const res = await axios.put(`/orders/status/${orderId}`, { 
        status, 
        adminResponse: response 
      });
      console.log("Update response:", res.data);
      
      if (res.data.success) {
        alert(`Order ${status} successfully!`);
        loadOrders();
        setResponseText({ ...responseText, [orderId]: "" });
      } else {
        alert(res.data.message || "Failed to update order status");
      }
    } catch (err) {
      console.error("Error updating order:", err);
      console.error("Error response:", err.response?.data);
      alert(err.response?.data?.message || "Failed to update order status");
    }
  };

  const verifyPayment = async (id) => {
    try {
      const res = await axios.put(`/orders/verify-payment/${id}`);
      if (res.data.success) {
        alert("Payment Verified!");
        loadOrders();
      }
    } catch (err) {
      console.error("Error verifying payment:", err);
      alert("Failed to verify payment");
    }
  };

  const rejectPayment = async (id) => {
    try {
      const res = await axios.put(`/orders/reject-payment/${id}`);
      if (res.data.success) {
        alert("Payment Rejected!");
        loadOrders();
      }
    } catch (err) {
      console.error("Error rejecting payment:", err);
      alert("Failed to reject payment");
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: "badge-pending", label: "⏳ Pending" },
      approved: { class: "badge-approved", label: "✅ Approved" },
      "in progress": { class: "badge-progress", label: "🚚 In Progress" },
      rejected: { class: "badge-rejected", label: "❌ Rejected" },
      delivered: { class: "badge-delivered", label: "✅ Delivered" },
    };
    const badge = badges[status?.toLowerCase()] || badges.pending;
    return <span className={`status-badge ${badge.class}`}>{badge.label}</span>;
  };

  if (loading) {
    return (
      <div className="admin-orders-container">
        <h2>All Orders</h2>
        <div className="loading">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="admin-orders-container">
      <div className="orders-header">
        <h2>📦 All Orders</h2>
        <p className="orders-count">{orders.length} Total Orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <p>No orders found</p>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map((o) => (
            <div className="admin-order-card" key={o._id}>
              <div className="order-header">
                <div className="order-id">
                  <strong>Order ID:</strong> #{o._id?.slice(-8).toUpperCase()}
                </div>
                {getStatusBadge(o.status)}
              </div>

              <div className="customer-info">
                <h3>👤 {o.name}</h3>
                <p><strong>📱 Mobile:</strong> {o.mobile}</p>
                <p><strong>📍 Address:</strong> {o.address}</p>
                <p><strong>💳 Payment:</strong> {o.payment}</p>
                <p><strong>📅 Date:</strong> {new Date(o.createdAt).toLocaleString()}</p>
              </div>

              {/* Payment Screenshot */}
              {(o.payment === "JazzCash" || o.payment === "Bank Transfer") && (
                <div className="payment-section">
                  <p><strong>Payment Status:</strong> <span className={`payment-status ${o.paymentStatus?.toLowerCase()}`}>{o.paymentStatus}</span></p>

                  {o.paymentProof ? (
                    <div className="payment-proof">
                      <img
                        src={`http://localhost:5000/uploads/payments/${o.paymentProof}`}
                        alt="Payment Screenshot"
                        className="payment-image"
                      />
                    </div>
                  ) : (
                    <p className="no-screenshot">No screenshot uploaded</p>
                  )}

                  {/* Payment Action Buttons */}
                  {o.paymentStatus === "Pending" && (
                    <div className="payment-actions">
                      <button
                        className="btn-verify"
                        onClick={() => verifyPayment(o._id)}
                      >
                        ✅ Verify Payment
                      </button>
                      <button
                        className="btn-reject"
                        onClick={() => rejectPayment(o._id)}
                      >
                        ❌ Reject Payment
                      </button>
                    </div>
                  )}

                  {o.paymentStatus === "Verified" && (
                    <p className="payment-verified">✅ Payment Verified</p>
                  )}

                  {o.paymentStatus === "Rejected" && (
                    <p className="payment-rejected">❌ Payment Rejected</p>
                  )}
                </div>
              )}

              {o.payment === "Cash on Delivery" && (
                <p className="cod-notice">💵 COD Order — No payment verification required</p>
              )}

              <div className="order-items">
                <h4>📦 Ordered Items:</h4>
                {o.items?.map((item, i) => (
                  <div key={i} className="item-row">
                    <img 
                      src={item.image ? `http://localhost:5000/uploads/products/${item.image}` : "https://via.placeholder.com/200x200?text=No+Image"}
                      alt={item.name}
                      className="item-image"
                      onError={e => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/200x200?text=No+Image"; }}
                    />
                    <div className="item-details">
                      <span className="item-name">{item.name}</span>
                      <span className="item-quantity">{item.quantity} × PKR {item.price.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-total">
                <strong>Total Amount:</strong>
                <span className="total-amount">PKR {o.totalAmount || o.grandTotal}</span>
              </div>

              {/* Admin Response Section */}
              <div className="admin-response-section">
                <label>📝 Admin Response/Note:</label>
                <textarea
                  value={responseText[o._id] || ""}
                  onChange={(e) => setResponseText({ ...responseText, [o._id]: e.target.value })}
                  placeholder="Enter message for customer..."
                  rows="2"
                  className="response-textarea"
                />
              </div>

              {/* Order Status Actions */}
              <div className="order-actions">
                {o.status?.toLowerCase() !== "approved" && (
                  <button
                    className="btn-approve"
                    onClick={() => updateOrderStatus(o._id, "approved", responseText[o._id] || "Your order has been approved and will be processed soon.")}
                    disabled={o.payment !== "Cash on Delivery" && o.paymentStatus !== "Verified"}
                  >
                    ✅ Approve Order
                  </button>
                )}

                {o.status?.toLowerCase() !== "in progress" && o.status?.toLowerCase() !== "rejected" && (
                  <button
                    className="btn-progress"
                    onClick={() => updateOrderStatus(o._id, "in progress", responseText[o._id] || "Your order is being processed and will be shipped soon.")}
                  >
                    🚚 Mark In Progress
                  </button>
                )}

                {o.status?.toLowerCase() !== "delivered" && o.status?.toLowerCase() !== "rejected" && (
                  <button
                    className="btn-delivered"
                    onClick={() => updateOrderStatus(o._id, "delivered", responseText[o._id] || "Your order has been delivered successfully.")}
                  >
                    ✅ Mark Delivered
                  </button>
                )}

                {o.status?.toLowerCase() !== "rejected" && (
                  <button
                    className="btn-reject-order"
                    onClick={() => {
                      const reason = responseText[o._id] || prompt("Enter rejection reason:");
                      if (reason) {
                        updateOrderStatus(o._id, "rejected", reason);
                      }
                    }}
                  >
                    ❌ Reject Order
                  </button>
                )}
              </div>

              {o.adminResponse && (
                <div className="previous-response">
                  <strong>Previous Response:</strong> {o.adminResponse}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
