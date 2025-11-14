import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema({
  title: String,
  description: String,
  fileUrl: String, // path to uploaded PDF or DOC
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Notice", noticeSchema);
