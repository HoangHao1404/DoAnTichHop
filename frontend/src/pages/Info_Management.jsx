import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import userApi from "../services/api/userApi";
import Toast from "../components/Toast";
import {
  User,
  Lock,
  Mail,
  Phone,
  Edit2,
  X,
  ChevronDown,
  ShieldAlert,
  KeyRound,
} from "lucide-react";

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

  const [isEditing, setIsEditing] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
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

  const getRoleLabel = (role) => {
    const roleMap = {
      citizen: "Công Dân",
      admin: "Admin",
      manager: "QTV",
      maintenance: "KTV",
    };
    return roleMap[role] || "Công Dân";
  };

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

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      
      // Get all form inputs
      const modal = e.currentTarget.closest(".modal-content");
      if (!modal) return;
      
      const inputs = Array.from(modal.querySelectorAll("input[type='text'], input[type='email'], input[type='tel'], input[type='password']"));
      const currentIndex = inputs.indexOf(e.currentTarget);
      
      // Focus next input or submit
      if (currentIndex < inputs.length - 1) {
        inputs[currentIndex + 1].focus();
      } else {
        // Submit on last input
        setTimeout(() => {
          if (passwordData.oldPassword || passwordData.newPassword) {
            handleChangePassword();
          } else {
            handleUpdateProfile();
          }
        }, 0);
      }
    }
  };

  const handleUpdateProfile = async () => {
    if (!formData.full_name.trim()) {
      showToast("Vui lòng nhập tên!", "error");
      return;
    }
    setLoading(true);
    try {
      // Only send fields that have values
      const dataToSend = {
        full_name: formData.full_name,
        phone: formData.phone,
        gender: formData.gender,
      };
      // Only include email if it's not empty
      if (formData.email && formData.email.trim()) {
        dataToSend.email = formData.email.trim();
      }
      
      await userApi.updateProfile(dataToSend);
      const updatedUser = { ...user, ...dataToSend };
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
      setShowPasswordForm(false);
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
    setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
  };

  const initials = formData.full_name
    ?.split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "?";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-2 xs:p-3 sm:p-4">
      {/* Modal Container */}
      <div className="w-full max-w-md bg-white rounded-2xl xs:rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header with Avatar */}
        <div className="bg-white pt-4 xs:pt-5 sm:pt-6 pb-3 xs:pb-3.5 sm:pb-4 px-4 xs:px-5 sm:px-6 text-center border-b border-gray-100">
          {/* Avatar */}
          <div className="flex justify-center mb-2 xs:mb-2.5 sm:mb-3">
            <div className="w-16 xs:w-18 sm:w-20 h-16 xs:h-18 sm:h-20 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center shadow-lg text-2xl xs:text-3xl sm:text-4xl">
              🦆
            </div>
          </div>

          {/* Name and Badge */}
          <h2 className="text-base xs:text-lg sm:text-xl font-bold text-gray-800 mb-1 xs:mb-1.5 sm:mb-2 break-words px-2">
            {formData.full_name || "Bạc Xỉu"}
          </h2>
          <a href="#" className="text-xs xs:text-sm font-medium text-blue-600 hover:text-blue-700 inline-block">
            {getRoleLabel(user?.role)}
          </a>
        </div>

        {/* Content */}
        <div className="px-4 xs:px-5 sm:px-6 py-4 xs:py-5 sm:py-6 space-y-4 xs:space-y-5 sm:space-y-6 modal-content">
          {/* Personal Information Section */}
          <div>
            <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3 mb-3 xs:mb-4 sm:mb-5">
              <div className="w-5 xs:w-6 sm:w-6 h-5 xs:h-6 sm:h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <User size={14} className="xs:w-4 xs:h-4 sm:w-4 sm:h-4 text-white" />
              </div>
              <h3 className="text-xs xs:text-sm font-bold text-blue-600 uppercase tracking-wider">
                THÔNG TIN CÁ NHÂN
              </h3>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 xs:gap-3 sm:gap-4">
              {/* Left Column */}
              <div className="space-y-3 xs:space-y-3.5 sm:space-y-4">
                {/* Full Name Card */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1 xs:mb-1.5 uppercase">
                    Họ Và Tên
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      className="w-full bg-white border border-gray-200 rounded-lg px-2.5 xs:px-3 sm:px-3 py-1.5 xs:py-2 sm:py-2 text-xs xs:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  ) : (
                    <p className="text-gray-800 font-semibold text-xs xs:text-sm">{formData.full_name}</p>
                  )}
                </div>

                {/* Phone Card */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1 xs:mb-1.5 uppercase">
                    Số Điện Thoại
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      className="w-full bg-white border border-gray-200 rounded-lg px-2.5 xs:px-3 sm:px-3 py-1.5 xs:py-2 sm:py-2 text-xs xs:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  ) : (
                    <p className="text-gray-800 font-semibold text-xs xs:text-sm">{formData.phone}</p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-3 xs:space-y-3.5 sm:space-y-4">
                {/* Email Card */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1 xs:mb-1.5 uppercase">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      className="w-full bg-white border border-gray-200 rounded-lg px-2.5 xs:px-3 sm:px-3 py-1.5 xs:py-2 sm:py-2 text-xs xs:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  ) : (
                    <p className="text-gray-800 font-semibold text-xs xs:text-sm break-all">{formData.email}</p>
                  )}
                </div>

                {/* Gender Card */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1 xs:mb-1.5 uppercase">
                    Giới Tính
                  </label>
                  {isEditing ? (
                    <div className="relative w-full">
                      <button
                        type="button"
                        onClick={() => setShowGenderDropdown(!showGenderDropdown)}
                        onKeyDown={handleKeyDown}
                        className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg px-2.5 xs:px-3 sm:px-3 py-1.5 xs:py-2 sm:py-2 text-xs xs:text-sm text-gray-800 hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-semibold">{formData.gender}</span>
                        <ChevronDown
                          size={14}
                          className={`text-gray-400 transition-transform xs:w-4 xs:h-4 ${
                            showGenderDropdown ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {showGenderDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                          {["Nam", "Nữ", "Khác"].map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  gender: option,
                                }));
                                setShowGenderDropdown(false);
                              }}
                              className="w-full text-left px-3 xs:px-4 py-1.5 xs:py-2 hover:bg-blue-50 text-gray-800 text-xs xs:text-sm first:rounded-t-lg last:rounded-b-lg transition-colors"
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-gray-800 font-semibold text-xs xs:text-sm">{formData.gender}</p>
                      <ChevronDown size={12} className="text-gray-400 xs:w-3.5 xs:h-3.5" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div>
            <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3 mb-3 xs:mb-4 sm:mb-4">
              <div className="w-5 xs:w-6 sm:w-6 h-5 xs:h-6 sm:h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <ShieldAlert size={14} className="xs:w-4 xs:h-4 sm:w-4 sm:h-4 text-white" />
              </div>
              <h3 className="text-xs xs:text-sm font-bold text-blue-600 uppercase tracking-wider">
                BẢO MẬT
              </h3>
            </div>

            {showPasswordForm ? (
              <div className="space-y-2 xs:space-y-2.5 sm:space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 xs:mb-1.5 uppercase">
                    Mật khẩu hiện tại
                  </label>
                  <input
                    type="password"
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Nhập mật khẩu hiện tại"
                    className="w-full bg-white border border-gray-200 rounded-lg px-2.5 xs:px-3 sm:px-3 py-1.5 xs:py-2 sm:py-2 text-xs xs:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 xs:mb-1.5 uppercase">
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Nhập mật khẩu mới"
                    className="w-full bg-white border border-gray-200 rounded-lg px-2.5 xs:px-3 sm:px-3 py-1.5 xs:py-2 sm:py-2 text-xs xs:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 xs:mb-1.5 uppercase">
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Xác nhận mật khẩu mới"
                    className="w-full bg-white border border-gray-200 rounded-lg px-2.5 xs:px-3 sm:px-3 py-1.5 xs:py-2 sm:py-2 text-xs xs:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2 xs:gap-3">
                <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3 min-w-0">
                  <KeyRound size={18} className="text-blue-500 flex-shrink-0 xs:w-5 xs:h-5 sm:w-5 sm:h-5" />
                  <div className="min-w-0">
                    <h4 className="font-semibold text-gray-800 text-xs xs:text-sm truncate">Mật khẩu</h4>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      Cập nhật mật khẩu để bảo mật
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowPasswordForm(true)}
                  className="flex items-center gap-1 xs:gap-1.5 text-blue-600 hover:text-blue-700 transition-colors flex-shrink-0">
                  <Edit2 size={14} className="xs:w-4 xs:h-4" />
                  <span className="text-xs font-bold whitespace-nowrap">
                    Đổi
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-between gap-2 xs:gap-2.5 sm:gap-3 p-4 xs:p-5 sm:p-6 bg-white border-t border-gray-100">
          <button
            onClick={() => {
              if (showPasswordForm) {
                setShowPasswordForm(false);
                setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
              } else if (isEditing) {
                setIsEditing(false);
                setFormData({
                  full_name: user?.full_name || "",
                  email: user?.email || "",
                  phone: user?.phone || "",
                  gender: user?.gender || "Nam",
                });
              } else {
                handleCloseModal();
              }
            }}
            className="py-1.5 xs:py-2 sm:py-2 px-3 xs:px-4 sm:px-4 text-xs xs:text-sm text-gray-600 font-semibold hover:text-gray-800 transition-colors"
          >
            Hủy
          </button>
          {!isEditing && !showPasswordForm ? (
            <button
              onClick={() => setIsEditing(true)}
              className="py-1.5 xs:py-2 sm:py-2 px-5 xs:px-6 sm:px-8 bg-blue-600 text-white text-xs xs:text-sm font-semibold rounded-full hover:bg-blue-700 transition-all"
            >
              Chỉnh sửa
            </button>
          ) : (
            <button
              onClick={() => {
                if (showPasswordForm) {
                  handleChangePassword();
                } else {
                  handleUpdateProfile();
                }
              }}
              disabled={loading}
              className="py-1.5 xs:py-2 sm:py-2 px-4 xs:px-6 sm:px-8 bg-blue-600 text-white text-xs xs:text-sm font-semibold rounded-full hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          )}
        </div>
      </div>

      {toast.show && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default Info_Management;
