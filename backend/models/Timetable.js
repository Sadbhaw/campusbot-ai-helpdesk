import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema({
  title: String,
  semester: String,
  fileUrl: String,
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Timetable", timetableSchema);
