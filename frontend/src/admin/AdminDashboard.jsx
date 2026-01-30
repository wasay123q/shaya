import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../utils/axiosInstance";

// Recharts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AdminDashboard() {
  const nav = useNavigate();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Admin auth check
    if (localStorage.getItem("admin") !== "true") {
      nav("/admin");
    } else {
      loadStats();
    }
  }, []);

  // Correct API route (baseURL already has /api)
  const loadStats = async () => {
    try {
      const res = await axios.get("/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.log("Stats Error:", err);
      setError("Unable to load dashboard stats");
    }
  };

  if (error) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Admin Dashboard</h2>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  if (!stats) return <p>Loading Dashboard...</p>;

  // Safe values
  const totalSales = stats.totalSales || 0;
  const lowStockList = stats.lowStock || [];

  // Graph data
  const orderData = [
    { name: "Pending", value: stats.pendingOrders },
    { name: "Confirmed", value: stats.confirmedOrders },
  ];

  const COLORS = ["#ffb300", "#00c853"];

  const salesData = [{ name: "Total Sales", amount: totalSales }];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard — Analytics & Graphs</h2>
      <br />

      {/* ------- STATS GRID ------- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: "20px",
        }}
      >
        <div className="card">
          <h3>Total Products</h3>
          <h1>{stats.productsCount}</h1>
        </div>

        <div className="card">
          <h3>Total Orders</h3>
          <h1>{stats.ordersCount}</h1>
        </div>

        <div className="card">
          <h3>Pending Orders</h3>
          <h1>{stats.pendingOrders}</h1>
        </div>

        <div className="card">
          <h3>Confirmed Orders</h3>
          <h1>{stats.confirmedOrders}</h1>
        </div>

        <div className="card">
          <h3>Total Sales (PKR)</h3>
          <h1>{totalSales}</h1>
        </div>
      </div>

      <br />
      <br />

      {/* ------- GRAPH SECTION ------- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "30px",
        }}
      >
        {/* PIE CHART */}
        <div className="card">
          <h3>Order Status Overview</h3>
          <PieChart width={300} height={250}>
            <Pie
              data={orderData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label
            >
              {orderData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        {/* BAR CHART */}
        <div className="card">
          <h3>Total Sales Chart</h3>
          <BarChart width={350} height={250} data={salesData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#4b1bff" />
          </BarChart>
        </div>
      </div>

      <br />
      <br />

      {/* ------- LOW STOCK ALERT ------- */}
      <h3>Low Stock Alerts</h3>
      {lowStockList.length === 0 ? (
        <p>All stock levels are good.</p>
      ) : (
        lowStockList.map((p) => (
          <div className="card" key={p._id}>
            <p>
              {p.name} — Stock: {p.stock}
            </p>
          </div>
        ))
      )}

      <br />
      <br />

      {/* ------- ACTION BUTTONS ------- */}
      <Link to="/admin/products">
        <button>Manage All Products</button>
      </Link>

      <Link to="/admin/add-product" style={{ marginLeft: "10px" }}>
        <button>Add New Product</button>
      </Link>

      <Link to="/admin/sales" style={{ marginLeft: "10px" }}>
        <button>Manage Sales</button>
      </Link>

      <Link to="/admin/orders" style={{ marginLeft: "10px" }}>
        <button>View Orders</button>
      </Link>
    </div>
  );
}
