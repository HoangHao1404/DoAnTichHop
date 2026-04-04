import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Map,
  FolderOpen,
  Bell,
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

const UserSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const { user, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [toast, setToast] = useState(null);

  const mainMenuItems = [
    {
      id: "dashboard",
      path: "/dashboard",
      icon: <Map className="h-5 w-5" />,
      title: "Trang chủ"
    },
    {
      id: "myreports",
      path: "/myreport",
      icon: <FolderOpen className="h-5 w-5" />,
      title: "Báo cáo của tôi"
    },
    {
      id: "notifications",
      path: "/notifications",
      icon: <Bell className="h-5 w-5" />,
      title: "Thông báo"
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

      {/* ICON-ONLY SIDEBAR - Floating */}
      <Sidebar 
        className="w-20 rounded-2xl border border-gray-200 overflow-hidden shadow-lg"
        style={{ height: 'calc(100vh - 40px)' }}
      >
        <SidebarHeader className="flex items-center justify-center pb-4">
          <div className="flex items-center gap-0.5">
            <span className="text-2xl font-bold text-blue-600">S</span>
            <span className="text-lg font-semibold text-black">afin</span>
          </div>
        </SidebarHeader>

        <SidebarContent className="flex flex-col items-center py-4 gap-4">
          {mainMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              title={item.title}
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
                location.pathname === item.path
                  ? "bg-black text-white shadow-md"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {item.icon}
            </button>
          ))}
        </SidebarContent>

        <SidebarFooter className="flex flex-col items-center gap-2 py-4 relative">
          {/* User Avatar Button */}
          <button
            onClick={() => setShowAvatarMenu(!showAvatarMenu)}
            title={userInfo.name}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-sm hover:shadow-md transition-all relative z-40"
          >
            {userInfo.avatar ? (
              <img
                src={userInfo.avatar}
                alt={userInfo.name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              userInfo.name.charAt(0).toUpperCase()
            )}
          </button>
        </SidebarFooter>
      </Sidebar>

      {/* Dropdown Menu - Positioned outside sidebar */}
      {showAvatarMenu && (
        <>
          {/* Close dropdown backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowAvatarMenu(false)}
          />

          {/* Dropdown */}
          <div
            className="fixed bottom-[4.5rem] left-24 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* User Info Header */}
            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-base flex-shrink-0">
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
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">
                  {userInfo.name}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {userInfo.email}
                </p>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button
                onClick={() => {
                  setShowAvatarMenu(false);
                  navigate("/profile");
                }}
                className="w-full px-4 py-2 flex items-center gap-3 text-gray-700 hover:bg-gray-50 transition-colors text-left"
              >
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Thông tin cá nhân</span>
              </button>

              <button
                onClick={() => {
                  setShowAvatarMenu(false);
                  setShowLogoutConfirm(true);
                }}
                className="w-full px-4 py-2 flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors text-left"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Đăng xuất</span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default UserSidebar;
