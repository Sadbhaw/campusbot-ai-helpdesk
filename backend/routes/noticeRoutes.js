import express from "express";
import upload from "../middleware/upload.js"; // ✅ for file uploads
import Notice from "../models/Notice.js";
import { verifyToken, authorizeRoles } from "./authRoutes.js";

const router = express.Router();

// =============================================
// 🟢 Public Route: Get all Notices (for chatbot / student)
// =============================================
router.get("/", async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) {
    console.error("Error fetching notices:", err.message);
    res.status(500).json({ message: "Error fetching notices" });
  }
});

// =============================================
// 🔒 Admin + Faculty: Add new Notice
// =============================================
router.post(
  "/",
  verifyToken,
  authorizeRoles("admin", "faculty"),
  upload.single("file"),
  async (req, res) => {
    try {
      const { title, description, type } = req.body;
      if (!title || !description)
        return res.status(400).json({ message: "Title and description required" });

      const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

      const newNotice = new Notice({
        title,
        description,
        type,
        fileUrl,
      });

      await newNotice.save();
      res.json({ message: "Notice added successfully!" });
    } catch (err) {
      console.error("Error adding notice:", err.message);
      res.status(500).json({ message: "Error adding notice" });
    }
  }
);

// =============================================
// ✏️ Admin + Faculty: Edit existing Notice
// =============================================
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "faculty"),
  upload.single("file"),
  async (req, res) => {
    try {
      const { title, description, type } = req.body;
      const fileUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

      await Notice.findByIdAndUpdate(req.params.id, {
        title,
        description,
        type,
        ...(fileUrl && { fileUrl }),
      });

      res.json({ message: "Notice updated successfully!" });
    } catch (err) {
      console.error("Error updating notice:", err.message);
      res.status(500).json({ message: "Error updating notice" });
    }
  }
);

// =============================================
// 🗑️ Admin Only: Delete Notice
// =============================================
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      await Notice.findByIdAndDelete(req.params.id);
      res.json({ message: "Notice deleted successfully!" });
    } catch (err) {
      console.error("Error deleting notice:", err.message);
      res.status(500).json({ message: "Error deleting notice" });
    }
  }
);

export default router;
