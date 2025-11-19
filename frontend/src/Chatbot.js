import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Chatbot.css";

const API = "http://localhost:5000/api/chat"; // replace after deployment

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hi! I’m CampusBot — your AI Helpdesk Assistant. How can I help you today?",
      time: new Date().toLocaleTimeString(),
      type: "text",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const sendMessage = async (retryText = null) => {
    const userMessage = retryText || input.trim();
    if (!userMessage) return;

    const newUserMsg = {
      sender: "user",
      text: userMessage,
      time: new Date().toLocaleTimeString(),
      type: "text",
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(API, { message: userMessage });

      const newBotMsg = {
        sender: "bot",
        text: res.data.reply,
        fileUrl: res.data.fileUrl || null,
        title: res.data.title || null,
        time: new Date().toLocaleTimeString(),
        type: res.data.type || "text", // text or file
      };

      setMessages((prev) => [...prev, newBotMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ CampusBot is not responding right now.",
          time: new Date().toLocaleTimeString(),
          type: "text",
        },
      ]);
    }

    setLoading(false);
  };

  // Copy text
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  // Share message
  const shareMessage = (text) => {
    if (navigator.share) {
      navigator.share({
        title: "CampusBot",
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text);
      alert("Copied (Share not supported)!");
    }
  };

  return (
    <div className="chat-container">
      <h2 className="chat-header">🎓 CampusBot – AI Helpdesk Assistant</h2>

      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.sender}`}>
            <div className="chat-bubble">

              {/* TEXT MESSAGE */}
              {msg.type === "text" && <p>{msg.text}</p>}

              {/* FILE MESSAGE */}
              {msg.type === "file" && (
                <div>
                  <p>{msg.text}</p>

                  <div className="file-card">
                    <strong>📄 {msg.title}</strong>
                    <br />
                    <a
                      href={msg.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="open-btn"
                    >
                      Open File
                    </a>

                    <a
                      href={msg.fileUrl}
                      download
                      className="download-btn"
                    >
                      Download
                    </a>
                  </div>
                </div>
              )}

              {/* Time + Copy + Share + Retry */}
              <div className="chat-meta">
                <span>{msg.time}</span>

                {msg.sender === "bot" && msg.type === "text" && (
                  <div className="chat-actions">
                    <button onClick={() => copyToClipboard(msg.text)}>📋</button>
                    <button onClick={() => shareMessage(msg.text)}>📤</button>
                    <button
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
        <div ref={chatEndRef}></div>
      </div>

      {/* INPUT */}
      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about exams, notices, timetable, PYQ..."
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
