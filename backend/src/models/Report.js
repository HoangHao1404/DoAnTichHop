const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    report_id: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    user_id: {
      type: Number,
      index: true,
      default: null,
    },

    title: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["Giao Thông", "Điện", "Cây Xanh", "CTCC"],
    },

    location: {
      type: String,
      required: true,
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
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    images: {
      type: [String],
      default: [],
    },

    beforeImg: {
      type: String,
      default: "",
    },

    afterImg: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Report", ReportSchema);
