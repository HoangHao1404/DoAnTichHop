import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { Map, FolderOpen, Bell, LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { reportApi } from "../services/api/reportApi";
import InfoManagement from "../pages/Info_Management";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "./ui/sidebar";
import NotificationPanel from "./NotificationPanel";

function formatRelativeTime(inputDate) {
  if (!inputDate) return "Vừa xong";

  const date = new Date(inputDate);
  if (Number.isNaN(date.getTime())) return "Vừa xong";

  const diffMs = Date.now() - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) return "Vừa xong";
  if (diffMs < hour) return `${Math.floor(diffMs / minute)} phút trước`;
  if (diffMs < day) return `${Math.floor(diffMs / hour)} giờ trước`;
  if (diffMs < 2 * day) return "Hôm qua";
  return `${Math.floor(diffMs / day)} ngày trước`;
}

function mapStatusToNotificationMeta(status) {
  if (status === "Đang Xử Lý") {
    return { level: "critical", type: "warning" };
  }
  if (status === "Đã Giải Quyết") {
    return { level: "low", type: "system" };
  }
  return { level: "normal", type: "report" };
}

const UserSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [showNotificationsPopup, setShowNotificationsPopup] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const { user, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const userId = useMemo(() => user?._id || user?.user_id, [user]);
  const unreadCount = notifications.filter((item) => !item.isRead).length;
  const portalTarget = typeof document !== "undefined" ? document.body : null;

  const fetchNotifications = useCallback(async () => {
    if (!userId) {
      setNotifications([]);
      return;
    }

    try {
      setLoadingNotifications(true);
      const response = await reportApi.getReportsByUserId(userId);
      const reports = Array.isArray(response?.data) ? response.data : [];

      const mapped = reports.slice(0, 30).map((report) => {
        const reportId =
          report?.id || report?.report_id || report?._id || "N/A";
        const status = report?.status || "Đang Chờ";
        const meta = mapStatusToNotificationMeta(status);

        return {
          id: `NTF-${reportId}`,
          title: `Báo cáo #${reportId}: ${status}`,
          message:
            report?.description ||
            `Vị trí: ${report?.location || "Chưa có vị trí"} | Loại: ${report?.type || "Khác"}`,
          level: meta.level,
          type: meta.type,
          isRead: false,
          createdAt: formatRelativeTime(report?.createdAt || report?.time),
        };
      });

      setNotifications(mapped);
    } catch (error) {
      console.error("Không tải được thông báo từ MongoDB:", error);
      setNotifications([]);
    } finally {
      setLoadingNotifications(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const mainMenuItems = [
    {
      id: "dashboard",
      path: "/dashboard",
      icon: <Map className="h-5 w-5" />,
      title: "Trang chủ",
    },
    {
      id: "myreports",
      path: "/myreport",
      icon: <FolderOpen className="h-5 w-5" />,
      title: "Báo cáo của tôi",
    },
    {
      id: "notifications",
      path: "/notifications",
      icon: <Bell className="h-5 w-5" />,
      title: "Thông báo",
    },
  ];

  const userInfo = {
    name: user?.full_name || "Người dùng",
    email: user?.email || "user@example.com",
    avatar: user?.avatar || null,
  };

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    toast.success("Đăng xuất thành công!");
    setTimeout(() => {
      logout();
      navigate("/signin");
    }, 1500);
  };

  const handleMainMenuClick = (item) => {
    if (item.id === "notifications") {
      setShowAvatarMenu(false);
      setShowNotificationsPopup((prev) => {
        const next = !prev;
        if (next) {
          fetchNotifications();
        }
        return next;
      });
      return;
    }

    setShowNotificationsPopup(false);
    navigate(item.path);
  };

  const markNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item)),
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
  };

  return (
    <>
      {showLogoutConfirm &&
        portalTarget &&
        createPortal(
          <div
            className="fixed inset-0 z-[2500] flex items-center justify-center bg-black/50 px-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowLogoutConfirm(false);
              }
            }}
          >
            <div
              className="w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-3xl font-semibold text-gray-800">
                Xác nhận đăng xuất
              </h3>
              <p className="mt-3 text-base leading-6 text-gray-600">
                Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200"
                >
                  Hủy
                </button>
                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition-colors hover:bg-red-600"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>,
          portalTarget,
        )}

      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar
          className="w-20 overflow-hidden rounded-2xl border border-gray-200 shadow-lg"
          style={{ height: "calc(100vh - 40px)" }}
        >
          <SidebarHeader className="flex items-center justify-center pb-4">
            <div className="flex items-center gap-0.5">
              <span className="text-2xl font-bold text-blue-600">S</span>
              <span className="text-lg font-semibold text-black">afin</span>
            </div>
          </SidebarHeader>

          <SidebarContent className="flex flex-col items-center gap-4 py-4">
            {mainMenuItems.map((item) => {
              const isNotificationItem = item.id === "notifications";
              const isActive = isNotificationItem
                ? showNotificationsPopup
                : !showNotificationsPopup && location.pathname === item.path;

              return (
                <button
                  key={item.id}
                  onClick={() => handleMainMenuClick(item)}
                  title={item.title}
                  className={`relative flex h-10 w-10 items-center justify-center rounded-lg transition-all ${
                    isActive
                      ? "bg-black text-white shadow-md"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  {item.icon}
                  {isNotificationItem && unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </SidebarContent>

          <SidebarFooter className="relative flex flex-col items-center gap-2 py-4">
            <button
              onClick={() => setShowAvatarMenu(!showAvatarMenu)}
              title={userInfo.name}
              className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-sm font-semibold text-white transition-all hover:shadow-md"
            >
              {userInfo.avatar ? (
                <img
                  src={userInfo.avatar}
                  alt={userInfo.name}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                userInfo.name.charAt(0).toUpperCase()
              )}
            </button>
          </SidebarFooter>
        </Sidebar>
      </div>

      {/* Mobile bottom navigation */}
      <div className="fixed inset-x-0 bottom-0 z-[1800] border-t border-gray-200 bg-white/95 backdrop-blur md:hidden">
        <div className="mx-auto flex h-16 w-full max-w-lg items-center justify-between px-4">
          {mainMenuItems.map((item) => {
            const isNotificationItem = item.id === "notifications";
            const isActive = isNotificationItem
              ? showNotificationsPopup
              : !showNotificationsPopup && location.pathname === item.path;

            return (
              <button
                key={item.id}
                onClick={() => handleMainMenuClick(item)}
                title={item.title}
                className={`relative flex h-11 w-11 items-center justify-center rounded-xl transition-all ${
                  isActive
                    ? "bg-black text-white shadow-md"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                {item.icon}
                {isNotificationItem && unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            );
          })}

          <button
            onClick={() => setShowAvatarMenu(!showAvatarMenu)}
            title={userInfo.name}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-sm font-semibold text-white"
          >
            {userInfo.avatar ? (
              <img
                src={userInfo.avatar}
                alt={userInfo.name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              userInfo.name.charAt(0).toUpperCase()
            )}
          </button>
        </div>
      </div>

      {/* Dropdown Menu - Positioned outside sidebar */}
      {showAvatarMenu &&
        portalTarget &&
        createPortal(
          <>
            {/* Close dropdown backdrop */}
            <div
              className="fixed inset-0 z-[1900]"
              onClick={() => setShowAvatarMenu(false)}
            />

            {/* Dropdown */}
            <div
              className="fixed bottom-20 right-4 z-[2000] w-56 rounded-xl border border-gray-100 bg-white shadow-lg md:bottom-[4.5rem] md:left-24 md:right-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* User Info Header */}
              <div className="flex items-center gap-3 border-b border-gray-100 p-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-base font-semibold text-white">
                  {userInfo.avatar ? (
                    <img
                      src={userInfo.avatar}
                      alt={userInfo.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    userInfo.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-gray-800">
                    {userInfo.name}
                  </p>
                  <p className="truncate text-sm text-gray-500">
                    {userInfo.email}
                  </p>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <button
                  onClick={() => {
                    setShowAvatarMenu(false);
                    setShowProfileModal(true);
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
          </>,
          portalTarget,
        )}

      <NotificationPanel
        open={showNotificationsPopup}
        notifications={notifications}
        loading={loadingNotifications}
        unreadCount={unreadCount}
        onClose={() => setShowNotificationsPopup(false)}
        onMarkAllRead={markAllRead}
        onMarkRead={markNotificationRead}
      />

      {showProfileModal && (
        <InfoManagement onClose={() => setShowProfileModal(false)} />
      )}
    </>
  );
};

export default UserSidebar;
