const User = require("./user.model");  

class UserRepository {
  async findByPhone(phone) {
    return User.findOne({ phone }).lean();
  }

  async findByUserId(userId) {
    return User.findOne({ user_id: userId });
  }

  async getNextUserId() {
    const last = await User.findOne().sort({ user_id: -1 }).lean();
    return (last?.user_id || 0) + 1;
  }

  async create(data) {
    const doc = await User.create(data);
    return doc.toObject();
  }

  async updateByUserId(userId, updateData) {
    return User.findOneAndUpdate(
      { user_id: userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }
}

module.exports = new UserRepository();
