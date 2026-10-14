const bcrypt = require("bcrypt");
const userRepository = require("./user.repository");
const normalizePhone = require("./phone.utils");
const User = require("./user.model");

const ROLE_DB_TO_UI = {
  citizen: "User",
  admin: "QTV",
  manager: "QTV",
  maintenance: "KTV",
};

const ROLE_UI_TO_DB = {
  User: "citizen",
  Admin: "admin",
  QTV: "admin",
  KTV: "maintenance",
};

function requiresPhoneLogin(role) {
  return ["QTV", "KTV", "admin", "manager", "maintenance"].includes(role);
}

function toManagementUser(user) {
  return {
    user_id: user.user_id,
    id: `user${String(user.user_id).padStart(3, "0")}`,
    name: user.full_name || "",
    email: user.email || "",
    phone: user.phone || "",
    role: ROLE_DB_TO_UI[user.role] || "User",
    area: user.area || "",
    status: user.account_status || "active",
    is_first_login: user.is_first_login || false,
    created_at: user.created_at,
  };
}

class UserService {
  async getUserProfile(user_id) {
    const user = await userRepository.findById(user_id);
    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    delete userWithoutPassword.phone;
    delete userWithoutPassword.phone_verified;
    return userWithoutPassword;
  }

  async updateProfile(user_id, updateData) {
    const user = await userRepository.findById(user_id);
    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }

    // Kiểm tra nếu email khác và đã tồn tại (chỉ nếu email được cung cấp)
    const email = typeof updateData.email === "string"
      ? updateData.email.trim().toLowerCase()
      : "";
    if (email && !/^[^\s@]+@gmail\.com$/i.test(email)) {
      throw new Error("Email phải có dạng ten@gmail.com");
    }
    if (email && email !== user.email) {
      const existing = await userRepository.findByEmail(email);
      if (existing) {
        throw new Error("Email đã được sử dụng");
      }
    }

    const updated = await userRepository.updateProfile(user_id, {
      ...updateData,
      email,
    });
    
    if (!updated) {
      throw new Error("Cập nhật hồ sơ thất bại");
    }

    const userWithoutPassword = { ...updated };
    delete userWithoutPassword.password;
    delete userWithoutPassword.phone;
    delete userWithoutPassword.phone_verified;
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
    
    // Đánh dấu đã đổi mật khẩu
    await User.findOneAndUpdate({ user_id }, { is_first_login: false });

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

  mapRoleForDb(uiRole = "User") {
    return ROLE_UI_TO_DB[uiRole] || "citizen";
  }

  async getManagementUsers({ search, role, area, status, page, limit }) {
    const roleForDb = role && role !== "all" ? this.mapRoleForDb(role) : "all";

    const result = await userRepository.getManagementList({
      search,
      role: roleForDb,
      area,
      status,
      page,
      limit,
    });

    return {
      items: result.items.map(toManagementUser),
      pagination: result.pagination,
    };
  }

  async createUserByAdmin({ name, email, phone, role, area, status, password }) {
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const normalizedPhone = normalizePhone(phone);
    if (!name || !normalizedEmail) {
      throw new Error("Tên và Gmail là bắt buộc");
    }

    if (!/^[^\s@]+@gmail\.com$/i.test(normalizedEmail)) {
      throw new Error("Email phải có dạng ten@gmail.com");
    }

    if (requiresPhoneLogin(role) && !normalizedPhone) {
      throw new Error("Vui lòng nhập số điện thoại hợp lệ cho tài khoản nhân sự");
    }

    const existingEmail = await userRepository.findByEmail(normalizedEmail);
    if (existingEmail) {
      throw new Error("Email đã được sử dụng");
    }

    if (normalizedPhone && (await userRepository.findByPhone(normalizedPhone))) {
      throw new Error("Số điện thoại đã được sử dụng");
    }

    const user_id = await userRepository.getNextUserId();
    const finalPassword = password || process.env.DEFAULT_USER_PASSWORD || "123456";
    const hashedPassword = await bcrypt.hash(finalPassword, 10);

    const createdData = {
      user_id,
      full_name: name,
      email: normalizedEmail,
      ...(normalizedPhone ? { phone: normalizedPhone } : {}),
      password: hashedPassword,
      gender: "Nam",
      email_verified: true,
      role: this.mapRoleForDb(role),
      area: area || "",
      account_status: status || "active",
      is_first_login: true,
    };

    const created = await userRepository.createByAdmin(createdData);

    return {
      user: toManagementUser(created),
      defaultPassword: finalPassword,
    };
  }

  async updateUserByAdmin(user_id, { name, email, phone, role, area, status }) {
    const target = await userRepository.findById(user_id);
    if (!target) {
      throw new Error("Người dùng không tồn tại");
    }

    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    if (!normalizedEmail || !/^[^\s@]+@gmail\.com$/i.test(normalizedEmail)) {
      throw new Error("Email phải có dạng ten@gmail.com");
    }

    const normalizedPhone = typeof phone === "string" && phone.trim()
      ? normalizePhone(phone)
      : target.phone || "";
    if (typeof phone === "string" && phone.trim() && !normalizedPhone) {
      throw new Error("Số điện thoại không hợp lệ");
    }
    const finalRole = role ? this.mapRoleForDb(role) : target.role;
    if (requiresPhoneLogin(finalRole) && !normalizedPhone) {
      throw new Error("Vui lòng nhập số điện thoại hợp lệ cho tài khoản nhân sự");
    }

    if (normalizedEmail !== target.email) {
      const existingEmail = await userRepository.findByEmail(normalizedEmail);
      if (existingEmail && existingEmail.user_id !== user_id) {
        throw new Error("Email đã được sử dụng");
      }
    }

    if (normalizedPhone && normalizedPhone !== target.phone) {
      const existingPhone = await userRepository.findByPhone(normalizedPhone);
      if (existingPhone && existingPhone.user_id !== user_id) {
        throw new Error("Số điện thoại đã được sử dụng");
      }
    }

    const updated = await userRepository.updateUserByAdmin(user_id, {
      full_name: name || target.full_name,
      email: normalizedEmail,
      phone: normalizedPhone,
      email_verified: true,
      role: finalRole,
      area: area !== undefined ? area : target.area,
      account_status: status || target.account_status || "active",
    });

    return toManagementUser(updated);
  }

  async updateUserStatusByAdmin(user_id, status) {
    const allowedStatus = ["active", "locked", "banned"];
    if (!allowedStatus.includes(status)) {
      throw new Error("Trạng thái không hợp lệ");
    }

    const updated = await userRepository.updateUserStatus(user_id, status);
    if (!updated) {
      throw new Error("Người dùng không tồn tại");
    }

    return toManagementUser(updated);
  }

  async deleteUserByAdmin(user_id) {
    const deleted = await userRepository.deleteUserById(user_id);
    if (!deleted) {
      throw new Error("Người dùng không tồn tại");
    }

    return toManagementUser(deleted);
  }
}

module.exports = new UserService();
