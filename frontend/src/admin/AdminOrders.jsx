import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const res = await axios.get("/admin/orders");
    setOrders(res.data);
  };

  const updateStatus = async (id, status) => {
    await axios.put(`/admin/orders/${id}`, { status });
    loadOrders();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Orders — Payment Verification</h2>

      {orders.map((o) => (
        <div className="card" key={o._id}>
          <p><b>Name:</b> {o.name}</p>
          <p><b>Mobile:</b> {o.mobile}</p>
          <p><b>Payment:</b> {o.payment}</p>
          <p><b>Total:</b> PKR {o.totalAmount}</p>
          <p><b>Status:</b> {o.status}</p>

          {/* 🔴 SHOW SCREENSHOT ONLY FOR ONLINE PAYMENT */}
          {o.payment !== "Cash on Delivery" && o.paymentProof && (
            <div>
              <p><b>Payment Proof:</b></p>
              <img
                src={`http://localhost:5000/uploads/paymentProofs/${o.paymentProof}`}
                alt="payment proof"
                style={{ width: "200px", borderRadius: "6px" }}
              />
            </div>
          )}

          <br />

          {o.status === "Pending Verification" && (
            <>
              <button onClick={() => updateStatus(o._id, "Confirmed")}>
                ✅ Verify
              </button>

              <button
                style={{ marginLeft: "10px" }}
                onClick={() => updateStatus(o._id, "Rejected")}
              >
                ❌ Reject
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
