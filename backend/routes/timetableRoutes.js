import express from "express";
import Timetable from "../models/Timetable.js";
import upload from "../middleware/upload.js";
import { verifyToken, authorizeRoles } from "./authRoutes.js";

const router = express.Router();

// =============================================
// 🟢 Public Route: Get all Timetables (for chatbot / student)
// =============================================
router.get("/", async (req, res) => {
  try {
    const timetables = await Timetable.find().sort({ createdAt: -1 });
    res.json(timetables);
  } catch (err) {
    console.error("Error fetching timetables:", err.message);
    res.status(500).json({ message: "Error fetching timetables" });
  }
});

// =============================================
// 🔒 Admin + Faculty: Upload new Timetable
// =============================================
router.post(
  "/",
  verifyToken,
  authorizeRoles("admin", "faculty"),
  upload.single("file"),
  async (req, res) => {
    try {
      const { title, course, branch, semester, type } = req.body;

      if (!title || !semester || !branch)
        return res.status(400).json({ message: "Title, branch, and semester required" });

      const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

      const timetable = new Timetable({
        title,
        course,
        branch,
        semester,
        type,
        fileUrl,
      });

      await timetable.save();
      res.json({ message: "Timetable added successfully!" });
    } catch (err) {
      console.error("Error adding timetable:", err.message);
      res.status(500).json({ message: "Error adding timetable" });
    }
  }
);

// =============================================
// ✏️ Admin + Faculty: Edit existing Timetable
// =============================================
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "faculty"),
  upload.single("file"),
  async (req, res) => {
    try {
      const { title, course, branch, semester, type } = req.body;
      const fileUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

      await Timetable.findByIdAndUpdate(req.params.id, {
        title,
        course,
        branch,
        semester,
        type,
        ...(fileUrl && { fileUrl }),
      });

      res.json({ message: "Timetable updated successfully!" });
    } catch (err) {
      console.error("Error updating timetable:", err.message);
      res.status(500).json({ message: "Error updating timetable" });
    }
  }
);

// =============================================
// 🗑️ Admin Only: Delete Timetable
// =============================================
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      await Timetable.findByIdAndDelete(req.params.id);
      res.json({ message: "Timetable deleted successfully!" });
    } catch (err) {
      console.error("Error deleting timetable:", err.message);
      res.status(500).json({ message: "Error deleting timetable" });
    }
  }
);

export default router;
