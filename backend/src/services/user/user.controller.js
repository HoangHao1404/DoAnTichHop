const userService = require("./user.service");

class UserController {
  async getProfile(req, res) {
    try {
      const user_id = req.user?.user_id;
      
      if (!user_id) {
        return res.status(401).json({ message: "Không được phép" });
      }

      const user = await userService.getUserProfile(user_id);
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateProfile(req, res) {
    try {
      const user_id = req.user?.user_id;
      
      if (!user_id) {
        return res.status(401).json({ message: "Không được phép" });
      }

      const { full_name, phone, gender, email } = req.body;

      if (!full_name || !full_name.trim()) {
        return res.status(400).json({ message: "Tên không được để trống" });
      }

      const updated = await userService.updateProfile(user_id, {
        full_name,
        phone,
        gender,
        email,
      });

      return res.json({
        message: "Cập nhật hồ sơ thành công",
        user: updated,
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async changePassword(req, res) {
    try {
      const user_id = req.user?.user_id;
      
      if (!user_id) {
        return res.status(401).json({ message: "Không được phép" });
      }

      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        return res
          .status(400)
          .json({ message: "Mật khẩu cũ và mới là bắt buộc" });
      }

      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ message: "Mật khẩu mới phải có ít nhất 6 ký tự" });
      }

      await userService.changePassword(user_id, oldPassword, newPassword);

      return res.json({ message: "Đổi mật khẩu thành công" });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async deleteAccount(req, res) {
    try {
      const user_id = req.user?.user_id;
      
      if (!user_id) {
        return res.status(401).json({ message: "Không được phép" });
      }

      await userService.deleteAccount(user_id);

      return res.json({ message: "Xóa tài khoản thành công" });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new UserController();
