const bcrypt = require("bcrypt");
const userRepository = require("./user.repository");

class UserService {
  async getUserProfile(user_id) {
    const user = await userRepository.findById(user_id);
    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateProfile(user_id, updateData) {
    const user = await userRepository.findById(user_id);
    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }

    // Kiểm tra nếu phone khác và đã tồn tại
    if (updateData.phone && updateData.phone !== user.phone) {
      const existing = await userRepository.findByPhone(updateData.phone);
      if (existing) {
        throw new Error("Số điện thoại đã được sử dụng");
      }
    }

    const updated = await userRepository.updateProfile(user_id, updateData);
    const { password, ...userWithoutPassword } = updated;
    return userWithoutPassword;
  }

  async changePassword(user_id, oldPassword, newPassword) {
    const user = await userRepository.findById(user_id);
    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new Error("Mật khẩu cũ không đúng");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userRepository.updatePassword(user_id, hashedPassword);

    return { success: true };
  }

  async deleteAccount(user_id) {
    const deleted = await userRepository.deleteUser(user_id);
    if (!deleted) {
      throw new Error("Người dùng không tồn tại");
    }
    return { success: true };
  }

  async getAllUsers() {
    return await userRepository.getAllUsers();
  }
}

module.exports = new UserService();
