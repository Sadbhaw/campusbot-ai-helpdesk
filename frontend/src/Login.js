// Login.js
import React, { useState } from "react";
import axios from "axios";
import API_BASE from "./api";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e?.preventDefault();
    if (!username || !password) return alert("Fill both fields");
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { username, password });
      const { token, role } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      onLogin(role);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "20px auto", padding: 20, border: "1px solid #ddd", borderRadius: 8 }}>
      <h3>Login (Admin / Faculty / Student)</h3>
      <form onSubmit={submit}>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" style={{ width: "100%", marginBottom: 8 }} />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" style={{ width: "100%", marginBottom: 12 }} />
        <button type="submit" disabled={loading} style={{ padding: "8px 12px" }}>{loading ? "Logging..." : "Login"}</button>
      </form>
    </div>
  );
}
