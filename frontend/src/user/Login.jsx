import { useState, useContext } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const nav = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    try {
      const res = await axios.post("/auth/login", {
        email,
        password,
      });

      console.log("🔍 Login Response:", res.data);

      if (res.data.success) {
        const token = res.data.token;
        
        if (!token) {
          console.error("❌ No token in response!");
          alert("Login error: Token not received from server");
          return;
        }

        // Use AuthContext login function
        const userData = {
          id: res.data.user?.id || res.data.user?._id,
          name: res.data.user?.name,
          role: res.data.user?.role || 'user'
        };
        
        login(token, userData);
        console.log("✅ Login successful");

        alert("Login successful!");
        nav("/");
      } else {
        alert("Invalid email or password");
      }
    } catch (err) {
      console.error("❌ Login Error:", err.response?.data || err.message);
      alert("Login failed. " + (err.response?.data?.message || "Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>User Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
