import mongoose, { Schema } from "mongoose";

const CodeBlockSchema: Schema = new Schema({
  title: { type: String, required: true, unique: true },
  initialCode: { type: String, required: true },
  solution: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("CodeBlock", CodeBlockSchema);