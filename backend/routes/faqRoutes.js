import express from "express";
import FAQ from "../models/faq.js";
import { verifyToken, authorizeRoles } from "./authRoutes.js";

const router = express.Router();

// =============================================
// 🟢 Public Route: Get all FAQs (for chatbot / student)
// =============================================
router.get("/", async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ createdAt: -1 });
    res.json(faqs);
  } catch (err) {
    console.error("Error fetching FAQs:", err.message);
    res.status(500).json({ message: "Error fetching FAQs" });
  }
});

// =============================================
// 🔒 Admin Only: Add new FAQ
// =============================================
router.post("/", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const { question, answer, type } = req.body;
    if (!question || !answer)
      return res.status(400).json({ message: "Both question and answer required" });

    const newFAQ = new FAQ({ question, answer, type });
    await newFAQ.save();
    res.json({ message: "FAQ added successfully!" });
  } catch (err) {
    console.error("Error adding FAQ:", err.message);
    res.status(500).json({ message: "Error adding FAQ" });
  }
});

// =============================================
// ✏️ Admin Only: Edit existing FAQ
// =============================================
router.put("/:id", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const { question, answer, type } = req.body;
    await FAQ.findByIdAndUpdate(req.params.id, { question, answer, type });
    res.json({ message: "FAQ updated successfully!" });
  } catch (err) {
    console.error("Error updating FAQ:", err.message);
    res.status(500).json({ message: "Error updating FAQ" });
  }
});

// =============================================
// 🗑️ Admin Only: Delete FAQ
// =============================================
router.delete("/:id", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    res.json({ message: "FAQ deleted successfully!" });
  } catch (err) {
    console.error("Error deleting FAQ:", err.message);
    res.status(500).json({ message: "Error deleting FAQ" });
  }
});

export default router;
