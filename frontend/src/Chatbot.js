import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Chatbot.css";

const API = "http://localhost:5000/api/chat"; // later replace with Render backend URL

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hi! I’m CampusBot — your AI Helpdesk Assistant. How can I help you today?",
      time: new Date().toLocaleTimeString(),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // ✅ Auto scroll to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Send message to backend / AI
  const sendMessage = async (retryText = null) => {
    const userMessage = retryText || input.trim();
    if (!userMessage) return;

    const newUserMsg = {
      sender: "user",
      text: userMessage,
      time: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, newUserMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(API, { message: userMessage });
      const reply = res.data.reply || "✅ Connected to CampusBot backend successfully!";

      const newBotMsg = {
        sender: "bot",
        text: reply,
        time: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, newBotMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ CampusBot is not responding right now. Please try again later.",
          time: new Date().toLocaleTimeString(),
        },
      ]);
    }

    setLoading(false);
  };

  // ✅ Copy response to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("✅ Message copied to clipboard!");
  };

  // ✅ Share response via mobile/share API
  const shareMessage = (text) => {
    if (navigator.share) {
      navigator.share({
        title: "CampusBot – AI Helpdesk Assistant",
        text,
      });
    } else {
      navigator.clipboard.writeText(text);
      alert("📋 Copied message to share manually!");
    }
  };

  return (
    <div className="chat-container">
      <h2 className="chat-header">🎓 CampusBot – AI Helpdesk Assistant</h2>

      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.sender}`}>
            <div className="chat-bubble">
              <p>{msg.text}</p>

              <div className="chat-meta">
                <span>{msg.time}</span>

                {msg.sender === "bot" && (
                  <div className="chat-actions">
                    <button title="Copy" onClick={() => copyToClipboard(msg.text)}>📋</button>
                    <button title="Share" onClick={() => shareMessage(msg.text)}>📤</button>
                    <button
                      title="Try Again"
                      onClick={() =>
                        sendMessage(messages[messages.length - 2]?.text)
                      }
                    >
                      🔁
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about exams, syllabus, timetable..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={() => sendMessage()} disabled={loading}>
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
