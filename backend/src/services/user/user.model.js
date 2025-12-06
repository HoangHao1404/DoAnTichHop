const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  user_id: { type: Number, unique: true },
  full_name: String,
  phone: { type: String, unique: true, required: true },
  password: { type: String, required: true },

  phone_verified: { type: Boolean, default: false }, 

  role: {
    type: String,
    enum: ["citizen", "manager", "admin"],
    default: "citizen",
  },
  created_at: { type: Date, default: Date.now },
});

module.export = mongoose.model("User", UserSchema)
