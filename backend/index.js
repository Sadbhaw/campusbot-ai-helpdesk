import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import faqRoutes from "./routes/faqRoutes.js";
import noticeRoutes from "./routes/noticeRoutes.js";
import timetableRoutes from "./routes/timetableRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import FAQ from "./models/faq.js";
import Notice from "./models/Notice.js";
import Timetable from "./models/Timetable.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// =============================
// 📁 Static Uploads Folder
// =============================
const __dirname = path.resolve();
if (!fs.existsSync(path.join(__dirname, "uploads"))) {
  fs.mkdirSync(path.join(__dirname, "uploads"));
}
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =============================
// 🧩 API ROUTES
// =============================
app.use("/api/auth", authRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/timetables", timetableRoutes);

// =============================
// 🧠 MongoDB Connection
// =============================
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
  }
};
connectDB();

// =============================
// 🤖 Chat Route — Enhanced Smart AI
// =============================
app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message?.trim();
  if (!userMessage) {
    return res.status(400).json({ reply: "Please enter a message first." });
  }

  try {
    // 1️⃣ Try to find relevant FAQ first
    const foundFAQ = await FAQ.findOne({
      question: { $regex: new RegExp(userMessage, "i") },
    });

    if (foundFAQ) {
      console.log("💾 Answer served from FAQ database");
      return res.json({ reply: foundFAQ.answer });
    }

    // 2️⃣ Build AI Context using all DB collections
    const faqs = await FAQ.find().limit(20);
    const notices = await Notice.find().sort({ createdAt: -1 }).limit(10);
    const timetables = await Timetable.find().sort({ createdAt: -1 }).limit(10);

    const systemPrompt = `
You are a smart, polite college helpdesk assistant.
You have access to the following information:

📘 FAQs:
${faqs.map(f => `[${f.type || "General"}] ${f.question} → ${f.answer}`).join("\n")}

📢 Notices:
${notices.map(n => `[${n.type || "General"}] ${n.title}: ${n.description}`).join("\n")}

📆 Timetables:
${timetables.map(t => `[${t.branch || "Unknown"}] ${t.title} (${t.semester || ""}) -> ${t.fileUrl}`).join("\n")}

When answering:
- First check if the query matches any of the above.
- If yes, provide a helpful summary.
- If related to a timetable or notice, include a short link (file URL).
- If unrelated to college, politely refuse.
- Always mention the current date/time in a friendly way.
`;

    // 3️⃣ Ask Groq AI for the final reply
    const body = {
      model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
    };

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Groq API Error ${response.status}: ${text}`);
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "⚠️ AI did not respond.";

    res.json({ reply });
  } catch (error) {
    console.error("🤖 Chat Error:", error.message);
    res.status(500).json({ reply: "⚠️ Something went wrong. Please try again later." });
  }
});

// =============================
// 🚀 Start Server
// =============================
const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => res.send("🚀 Smart College Chatbot Backend Running"));
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
