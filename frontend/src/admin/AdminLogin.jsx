import { useState, useContext } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function AdminLogin() {
  const [data, setData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (loading) return;
    
    if (!data.email || !data.password) {
      alert("Please enter both email and password");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("/admin/login", data);

      if (res.data.success && res.data.token) {
        // Use AuthContext login function
        const userData = {
          id: res.data.user.id,
          name: res.data.user.name,
          role: res.data.user.role
        };
        
        authLogin(res.data.token, userData);
        localStorage.setItem("admin", "true"); // Keep for backward compatibility
        
        alert("Admin login successful!");
        navigate("/admin/dashboard");
      } else {
        alert(res.data.message || "Invalid admin credentials");
      }
    } catch (err) {
      console.error("Admin login error:", err);
      const errorMsg = err.response?.data?.message || "Admin login failed. Please try again.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="card">
      <h2>Admin Login</h2>

      <input
        type="email"
        placeholder="Admin Email"
        value={data.email}
        onChange={(e) => setData({ ...data, email: e.target.value })}
        onKeyPress={handleKeyPress}
        disabled={loading}
      />

      <input
        type="password"
        placeholder="Admin Password"
        value={data.password}
        onChange={(e) => setData({ ...data, password: e.target.value })}
        onKeyPress={handleKeyPress}
        disabled={loading}
      />

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}
