import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Map,
  Inbox,
  Users,
  Shield,
  BarChart3,
  LogOut,
  User,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Toast from "./Toast";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "./ui/sidebar";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const { user, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [toast, setToast] = useState(null);

  const menuItems = [
    {
      id: "map",
      path: "/admin/overview",
      icon: <Map className="h-5 w-5" />,
      label: "Bản Đồ",
    },
    {
      id: "receive",
      path: "/admin/recept-form",
      icon: <Inbox className="h-5 w-5" />,
      label: "Đơn Tiếp Nhận",
    },
    {
      id: "routes",
      path: "/admin/routes",
      icon: <Shield className="h-5 w-5" />,
      label: "Quản Lý Đội Xử Lý",
    },
    {
      id: "users",
      path: "/admin/users",
      icon: <Users className="h-5 w-5" />,
      label: "Quản Lý Người Dùng",
    },
    {
      id: "categories",
      path: "/admin/categories",
      icon: <Shield className="h-5 w-5" />,
      label: "Quản Lý Loại Sự Cố",
    },
    {
      id: "stats",
      path: "/admin/stats",
      icon: <BarChart3 className="h-5 w-5" />,
      label: "Thống Kê",
    },
  ];

  const userInfo = {
    name: user?.full_name || "Người dùng",
    email: user?.email || "user@example.com",
    avatar: user?.avatar || null,
  };

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    setToast({ message: "Đăng xuất thành công!", type: "success" });
    setTimeout(() => {
      logout();
      navigate("/signin");
    }, 1500);
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {showLogoutConfirm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowLogoutConfirm(false);
            }
          }}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Xác nhận đăng xuất
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors font-medium"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN SIDEBAR - Floating Left */}
      <div className="fixed left-6 top-1/2 transform -translate-y-1/2 h-[95vh] w-64 z-30">
        <Sidebar className="rounded-3xl border border-gray-200 bg-white shadow-lg h-full overflow-hidden">
          <SidebarHeader className="flex items-center justify-start px-6 py-8">
            <div className="flex items-center gap-1">
              <span className="text-3xl font-bold text-blue-600">S</span>
              <span className="text-2xl font-semibold text-black">afin</span>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-0">
            <nav className="space-y-2 px-3">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    location.pathname === item.path
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </SidebarContent>

          <SidebarFooter className="px-6 py-8 border-t border-gray-200">
            <div className="relative">
              {/* User Info */}
              <button
                onClick={() => setShowAvatarMenu(!showAvatarMenu)}
                className="w-full flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                  {userInfo.avatar ? (
                    <img
                      src={userInfo.avatar}
                      alt={userInfo.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    userInfo.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">
                    {userInfo.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {userInfo.email}
                  </p>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showAvatarMenu && (
                <>
                  {/* Close backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowAvatarMenu(false)}
                  />

                  {/* Dropdown */}
                  <div
                    className="absolute bottom-full left-0 mb-2 w-full bg-white rounded-xl shadow-lg border border-gray-100 z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setShowAvatarMenu(false);
                          navigate("/profile");
                        }}
                        className="w-full px-4 py-2 flex items-center gap-3 text-gray-700 hover:bg-gray-50 transition-colors text-left text-sm"
                      >
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">Thông tin cá nhân</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowAvatarMenu(false);
                          setShowLogoutConfirm(true);
                        }}
                        className="w-full px-4 py-2 flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors text-left text-sm"
                      >
                        <LogOut className="h-4 w-4" />
                        <span className="font-medium">Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </SidebarFooter>
        </Sidebar>
      </div>
    </>
  );
};

export default AdminSidebar;
