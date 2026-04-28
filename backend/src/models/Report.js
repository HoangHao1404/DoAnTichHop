const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema(
  {
    report_id: {
      type: String,
      required: true,
      unique: true,
    },
    id: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    location: {
      type: String,
      required: true,
    },
    reportLatitude: {
      type: Number,
      default: null,
    },
    reportLongitude: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      required: true,
      enum: ["Đang Chờ", "Đang Xử Lý", "Đã Giải Quyết"],
      default: "Đang Chờ",
    },
    time: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    images: {
      type: [String],
      default: [],
    },
    beforeImg: {
      type: String,
    },
    afterImg: {
      type: String,
    },
    aiPercent: {
      type: Number,
      default: null,
    },
    aiVerified: {
      type: Boolean,
      default: false,
    },
    aiLabel: {
      type: String,
      default: "",
    },
    aiTotalObjects: {
      type: Number,
      default: 0,
    },
    aiSource: {
      type: String,
      default: "",
    },
    exifMetadata: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Report", ReportSchema);
