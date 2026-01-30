import { useState, useContext } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const nav = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    try {
      const res = await axios.post("/auth/register", {
        name,
        email,
        password,
      });

      if (res.data.success) {
        alert("Signup successful! Logging you in...");
        
        // Auto-login after signup
        try {
          const loginRes = await axios.post("/auth/login", {
            email,
            password,
          });

          if (loginRes.data.success && loginRes.data.token) {
            // Use AuthContext login function
            const userData = {
              id: loginRes.data.user?.id || loginRes.data.user?._id,
              name: loginRes.data.user?.name,
              role: loginRes.data.user?.role || 'user'
            };
            
            login(loginRes.data.token, userData);
            nav("/");
          } else {
            nav("/login");
          }
        } catch (loginErr) {
          console.log("Auto-login failed:", loginErr);
          nav("/login");
        }
      } else {
        alert(res.data.message || "Signup failed!");
      }
    } catch (err) {
      alert("Signup failed!");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Create Account</h2>

      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />

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
          {loading ? "Creating account..." : "Signup"}
        </button>
      </form>
    </div>
  );
}
