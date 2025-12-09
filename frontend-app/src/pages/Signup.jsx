import { useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function Signup() {
      const [form, setForm] = useState({
            username: "",
            email: "",
            password: "",
            role: "Client"
      });
      const [loading, setLoading] = useState(false);

      const handleChange = (e) => {
            setForm({ ...form, [e.target.name]: e.target.value });
      };

      const handleSignup = async (e) => {
            e.preventDefault();
            setLoading(true);
            console.log("Sending:", form); 
            try {
                  const res = await api.post("/auth/signup", form);
                  console.log("Signup success:", res.data);
                  alert("Signup Successful!");
            } catch (err) {
                  console.error("Signup error:", err.response?.data);
                  alert(err.response?.data?.msg || "Signup failed");
            } finally {
                  setLoading(false);
            }
      };

      return (
            <div className="card auth-card">
                  <h2>Signup</h2>
                  <form className="form" onSubmit={handleSignup}>
                        <input
                              type="email"
                              name="username"
                              placeholder="Username (email)"
                              value={form.username}
                              onChange={handleChange}
                              required
                        />
                        <input
                              type="email"
                              name="email"
                              placeholder="Your email"
                              value={form.email}
                              onChange={handleChange}
                              required
                        />
                        <input
                              type="password"
                              name="password"
                              placeholder="Password"
                              value={form.password}
                              onChange={handleChange}
                              required
                        />
                        <select name="role" value={form.role} onChange={handleChange}>
                              <option value="Client">Client</option>
                              <option value="Admin">Admin</option>
                        </select>

                        <button className="btn" type="submit" disabled={loading}>
                              {loading ? "Creating..." : "Signup"}
                        </button>
                  </form>

                  <div style={{ marginTop: 12 }}>
                        Already have account? <Link to="/login">Login</Link>
                  </div>
            </div>
      );
}
