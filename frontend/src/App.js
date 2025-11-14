// src/App.js
import React, { useEffect, useState } from "react";
import Chatbot from "./Chatbot";
import AdminPanel from "./AdminPanel";
import FacultyPanel from "./FacultyPanel";
import Login from "./Login";

function App() {
  const [view, setView] = useState("chat"); // "chat" | "admin"
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  // ✅ On load, restore login from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    if (token && savedRole) {
      setIsLoggedIn(true);
      setRole(savedRole);
    }
  }, []);

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setRole(null);
    setView("chat");
  };

  return (
    <div>
      {/* ---------- HEADER ---------- */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 16px",
          backgroundColor: "#4b7bec",
          color: "white",
        }}
      >
        <div>
          <button
            onClick={() => setView("chat")}
            style={{
              backgroundColor: view === "chat" ? "#3867d6" : "#4b7bec",
              color: "white",
              border: "none",
              padding: "8px 14px",
              borderRadius: "6px",
              cursor: "pointer",
              marginRight: "8px",
            }}
          >
            Student Chat
          </button>
          <button
            onClick={() => setView("admin")}
            style={{
              backgroundColor: view === "admin" ? "#3867d6" : "#4b7bec",
              color: "white",
              border: "none",
              padding: "8px 14px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            {isLoggedIn ? `${role?.toUpperCase()} Panel` : "Admin / Faculty Login"}
          </button>
        </div>

        {isLoggedIn && (
          <div>
            <span style={{ marginRight: "12px" }}>Role: {role}</span>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "#e74c3c",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "6px 12px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        )}
      </header>

      {/* ---------- MAIN VIEW ---------- */}
      <main style={{ padding: "16px" }}>
        {view === "chat" && <Chatbot />}

        {view === "admin" && (
          isLoggedIn ? (
            role === "admin" ? (
              <AdminPanel />
            ) : role === "faculty" ? (
              <FacultyPanel />
            ) : (
              <div>Students can’t access this area. Switch to Chatbot.</div>
            )
          ) : (
            <Login
              onLogin={(userRole) => {
                setIsLoggedIn(true);
                setRole(userRole);
                setView("admin");
              }}
            />
          )
        )}
      </main>
    </div>
  );
}

export default App;
