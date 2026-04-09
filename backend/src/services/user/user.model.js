const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  user_id: { type: Number, unique: true },

  full_name: String,
  email: { type: String, trim: true, lowercase: true },
  gender: {
    type: String,
    enum: ["Nam", "Nữ", "Khác"],
    default: "Nam",
  },

  phone: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // hash

  phone_verified: { type: Boolean, default: false },

  role: {
    type: String,
    enum: ["citizen", "manager", "admin"],
    default: "citizen",
  },

  created_at: { type: Date, default: Date.now },
});

// Chỉ áp unique khi email có giá trị thực tế (không rỗng).
UserSchema.index(
  { email: 1 },
  {
    name: "email_1",
    unique: true,
    sparse: true,
  },
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
