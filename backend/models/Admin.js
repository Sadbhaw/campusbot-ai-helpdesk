import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: { type: String, enum: ["admin", "faculty"], default: "admin" },
});

export default mongoose.model("Admin", adminSchema);
