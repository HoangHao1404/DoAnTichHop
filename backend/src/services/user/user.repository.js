const User = require("./user.model");  

class UserRepository {
  async findByPhone(phone) {
    return User.findOne({ phone }).lean();
  }

  async findByEmail(email) {
    return User.findOne({ email }).lean();
  }

  async findById(user_id) {
    return User.findOne({ user_id }).lean();
  }

  async getNextUserId() {
    const last = await User.findOne().sort({ user_id: -1 }).lean();
    return (last?.user_id || 0) + 1;
  }

  async create(data) {
    const doc = await User.create(data);
    return doc.toObject();
  }

  async updateProfile(user_id, data) {
    return User.findOneAndUpdate(
      { user_id },
      { 
        full_name: data.full_name,
        phone: data.phone,
        email: data.email,
        gender: data.gender,
      },
      { new: true }
    ).lean();
  }

  async updatePassword(user_id, hashedPassword) {
    return User.findOneAndUpdate(
      { user_id },
      { password: hashedPassword },
      { new: true }
    ).lean();
  }

  async deleteUser(user_id) {
    return User.findOneAndDelete({ user_id });
  }

  async getAllUsers() {
    return User.find({}, { password: 0 }).lean();
  }
}

module.exports = new UserRepository();
