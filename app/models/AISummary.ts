import mongoose, { Schema } from "mongoose";

const AISummarySchema = new Schema(
  {
    title: String,
    summary: String,
    document: {
      type: Schema.Types.ObjectId,
      ref: "File",
    },
    isReported: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const AISummary =
  mongoose.models?.AISummary || mongoose.model("AISummary", AISummarySchema);
export default AISummary;
