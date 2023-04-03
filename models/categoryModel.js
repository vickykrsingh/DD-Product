import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      require: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("category", categorySchema);
