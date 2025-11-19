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
// 🤖 IMPROVED SMART CHAT ROUTE
// =============================

// detect if user is asking for files/notices/timetables
function isFileQuery(text) {
  return /(notice|pdf|file|pyq|timetable|question paper|exam paper|document)/i.test(
    text
  );
}

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message?.trim();
  if (!userMessage) {
    return res.status(400).json({ reply: "Please enter a message first." });
  }

  try {
    // ---------------------------------------
    // 1️⃣ CHECK FAQ DATABASE
    // ---------------------------------------
    const foundFAQ = await FAQ.findOne({
      question: { $regex: new RegExp(userMessage, "i") },
    });

    if (foundFAQ) {
      console.log("💾 FAQ match found");
      return res.json({
        reply: foundFAQ.answer,
        type: "text",
      });
    }

    // ---------------------------------------
    // 2️⃣ IF ASKING FOR NOTICE / TIMETABLE / PDF
    // ---------------------------------------
    if (isFileQuery(userMessage)) {
      // check notices
      const notice = await Notice.findOne({
        title: { $regex: new RegExp(userMessage, "i") },
      });

      if (notice) {
        return res.json({
          reply: `📄 Here is the file you requested: ${notice.title}`,
          fileUrl: `http://localhost:5000${notice.fileUrl}`,
          type: "file",
        });
      }

      // check timetables
      const timetable = await Timetable.findOne({
        title: { $regex: new RegExp(userMessage, "i") },
      });

      if (timetable) {
        return res.json({
          reply: `📄 Here is the timetable you requested: ${timetable.title}`,
          fileUrl: `http://localhost:5000${timetable.fileUrl}`,
          type: "file",
        });
      }

      // file requested but not found
      return res.json({
        reply: "⚠️ No related file found in the database.",
        type: "text",
      });
    }

    // ---------------------------------------
    // 3️⃣ AI FALLBACK — CLEAN, SHORT, SAFE
    // ---------------------------------------
    const systemPrompt = `
You are CampusBot, a polite, minimal college helpdesk assistant.

RULES:
- NEVER invent links.
- NEVER mention date/time.
- NEVER create fake notices or files.
- Keep answers SHORT and SIMPLE.
- ONLY answer questions related to college, exams, syllabus, academics.
- If asked for a file and not found in DB → say: "No related file found in the database."
`;

    const body = {
      model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.2,
    };

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    const reply =
      data?.choices?.[0]?.message?.content ||
      "⚠️ AI is not responding right now.";

    return res.json({
      reply,
      type: "text",
    });
  } catch (error) {
    console.error("🤖 Chat Error:", error.message);
    return res
      .status(500)
      .json({ reply: "⚠️ Something went wrong. Please try again." });
  }
});

// =============================
// 🚀 Start Server
// =============================
const PORT = process.env.PORT || 5000;
app.get("/", (req, res) =>
  res.send("🚀 Smart College Chatbot Backend Running")
);
app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);
