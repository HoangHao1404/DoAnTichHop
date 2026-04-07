const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  user_id: { type: Number, unique: true },

  full_name: String,
  
  email: String,

  phone: { type: String, unique: true, required: true },
  
  password: String, // hash (nullable cho Google login)
  
  gender: { type: String, enum: ["Nam", "Nữ", "Khác"], default: "Nam" },

  phone_verified: { type: Boolean, default: false },

  email_verified: { type: Boolean, default: false },

  verification_token: String,

  role: {
    type: String,
<<<<<<< HEAD
    enum: ["citizen", "handling_team", "admin"],
=======
    enum: ["citizen", "manager", "maintenance", "admin"],
>>>>>>> Quoc
    default: "citizen",
  },

  created_at: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
