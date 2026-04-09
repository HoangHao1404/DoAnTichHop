const bcrypt = require("bcrypt");
const userRepo = require("./user.repository");

async function updateProfile(req, res) {
	try {
		const userId = req.user?.id;
		if (!userId) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const { full_name, email, phone, gender } = req.body || {};
		if (!full_name || !full_name.trim()) {
			return res.status(400).json({ message: "Vui lòng nhập họ và tên" });
		}

		const updateData = {
			full_name: full_name.trim(),
		};

		if (typeof email === "string") {
			updateData.email = email.trim();
		}
		if (typeof phone === "string") {
			updateData.phone = phone.trim();
		}
		if (typeof gender === "string") {
			updateData.gender = gender;
		}

		const updated = await userRepo.updateByUserId(userId, updateData);

		if (!updated) {
			return res.status(404).json({ message: "Không tìm thấy người dùng" });
		}

		return res.json({
			success: true,
			user: {
				user_id: updated.user_id,
				full_name: updated.full_name,
				email: updated.email || "",
				phone: updated.phone,
				gender: updated.gender || "Nam",
				role: updated.role,
			},
		});
	} catch (err) {
		if (err?.code === 11000) {
			return res.status(400).json({ message: "Số điện thoại đã được sử dụng" });
		}
		console.error("updateProfile error:", err);
		return res.status(500).json({ message: "Lỗi server" });
	}
}

async function changePassword(req, res) {
	try {
		const userId = req.user?.id;
		if (!userId) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const { oldPassword, newPassword } = req.body || {};
		if (!oldPassword || !newPassword) {
			return res.status(400).json({ message: "Thiếu mật khẩu cũ hoặc mới" });
		}
		if (newPassword.length < 6) {
			return res
				.status(400)
				.json({ message: "Mật khẩu mới phải có ít nhất 6 ký tự" });
		}

		const user = await userRepo.findByUserId(userId);
		if (!user) {
			return res.status(404).json({ message: "Không tìm thấy người dùng" });
		}

		const matched = await bcrypt.compare(oldPassword, user.password);
		if (!matched) {
			return res.status(400).json({ message: "Mật khẩu hiện tại không đúng" });
		}

		const hashed = await bcrypt.hash(newPassword, 10);
		await userRepo.updateByUserId(userId, { password: hashed });

		return res.json({ success: true, message: "Đổi mật khẩu thành công" });
	} catch (err) {
		console.error("changePassword error:", err);
		return res.status(500).json({ message: "Lỗi server" });
	}
}

module.exports = {
	updateProfile,
	changePassword,
};
