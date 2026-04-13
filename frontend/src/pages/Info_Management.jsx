import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import userApi from "../services/api/userApi";
import Toast from "../components/Toast";

const Info_Management = ({ onClose }) => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const handleCloseModal = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({ message: "", type: "", show: false });

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    gender: "Nam",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: user.gender || "Nam",
      });
    }
  }, [user]);

  const showToast = (message, type = "success") => {
    setToast({ message, type, show: true });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    if (!formData.full_name.trim()) {
      showToast("Vui lòng nhập tên!", "error");
      return;
    }
    setLoading(true);
    try {
      await userApi.updateProfile(formData);
      const updatedUser = { ...user, ...formData };
      login(localStorage.getItem("token"), updatedUser);
      showToast("Cập nhật thông tin thành công!");
      setIsEditing(false);
    } catch (error) {
      showToast(error.response?.data?.message || "Cập nhật thất bại!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      showToast("Vui lòng điền đầy đủ thông tin!", "error");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("Mật khẩu mới không trùng khớp!", "error");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showToast("Mật khẩu phải có ít nhất 6 ký tự!", "error");
      return;
    }
    setLoading(true);
    try {
      await userApi.changePassword(passwordData.oldPassword, passwordData.newPassword);
      showToast("Đổi mật khẩu thành công!");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      showToast(error.response?.data?.message || "Đổi mật khẩu thất bại!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: user.gender || "Nam",
      });
    }
  };

  const initials = formData.full_name
    ?.split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "?";

  const inputClass =
    "w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-default";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden max-h-[92vh] overflow-y-auto">


        {/* Top accent strip */}
        <div className="h-1.5 bg-gradient-to-r from-blue-600 via-blue-400 to-teal-400" />

        {/* Header */}
        <div className="relative flex items-center justify-center px-5 pt-5 pb-4">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center text-blue-700 font-medium text-base">
              {initials}
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-800 leading-snug">
                {formData.full_name || "Người dùng"}
              </p>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-1">
                Quản trị viên
              </span>
            </div>
          </div>
          <button
            onClick={handleCloseModal}
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 text-sm transition"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-5">
          {["profile", "password"].map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); if (tab === "profile") setIsEditing(false); }}
              className={`pb-2.5 pt-1 px-1 mr-5 text-sm font-medium border-b-2 transition ${
                activeTab === tab
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab === "profile" ? "Thông tin" : "Bảo mật"}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="px-5 py-5 space-y-4">

          {/* Profile tab */}
          {activeTab === "profile" && (
            <>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2">
                Thông tin cá nhân
                <span className="flex-1 h-px bg-gray-100" />
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-500">Họ và tên</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Họ và tên"
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-500">Giới tính</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={inputClass}
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-gray-500">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Email"
                  className={inputClass}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-gray-500">Số điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Số điện thoại"
                  className={inputClass}
                />
              </div>
            </>
          )}

          {/* Password tab */}
          {activeTab === "password" && (
            <>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2">
                Đổi mật khẩu
                <span className="flex-1 h-px bg-gray-100" />
              </p>
              <div className="space-y-3">
                <input
                  type="password"
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  placeholder="Mật khẩu hiện tại"
                  className={inputClass}
                />
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Mật khẩu mới"
                  className={inputClass}
                />
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Xác nhận mật khẩu mới"
                  className={inputClass}
                />
              </div>
            </>
          )}
        </div>

        {/* Footer meta */}
        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400">Tạo lúc 12/03/2023</span>
          <span className="text-xs font-medium text-emerald-600 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            Đã xác minh
          </span>
        </div>

        {/* Actions */}
        <div className="px-5 pb-5 pt-3 flex gap-2.5">
          {activeTab === "profile" ? (
            !isEditing ? (
              <>
                <button
                  onClick={handleCloseModal}
                  className="flex-1 py-2 text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  Đóng
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                >
                  Chỉnh sửa
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="flex-1 py-2 text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  Hủy
                </button>
                <button
                  onClick={handleUpdateProfile}
                  disabled={loading}
                  className="flex-1 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50"
                >
                  {loading ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </>
            )
          ) : (
            <>
              <button
                onClick={handleCloseModal}
                className="flex-1 py-2 text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                Đóng
              </button>
              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="flex-1 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50"
              >
                {loading ? "Đang lưu..." : "Đổi mật khẩu"}
              </button>
            </>
          )}
        </div>
      </div>

      {toast.show && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default Info_Management;
