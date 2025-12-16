const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
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
    },
    image: {
      type: String,
    },
    beforeImg: {
      type: String,
    },
    afterImg: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Report", ReportSchema);
