import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Map,
  Inbox,
  Users,
  Shield,
  BarChart3,
  LogOut,
  User,
  Tag,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import Info_Management from "../pages/Info_Management";
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
  const [showInfoModal, setShowInfoModal] = useState(false);
  const { user, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const portalTarget = typeof document !== "undefined" ? document.body : null;

  const menuItems = [
    {
      id: "map",
      path: "/admin/overview",
      icon: <Map className="h-5 w-5" />,
      label: "Báº£n Ä‘á»“",
    },
    {
      id: "receive",
      path: "/admin/recept-form",
      icon: <Inbox className="h-5 w-5" />,
      label: "ÄÆ¡n tiáº¿p nháº­n",
    },
    {
      id: "routes",
      path: "/admin/maintenanceteam",
      icon: <Shield className="h-5 w-5" />,
      label: "Quáº£n lÃ½ Ä‘á»™i xá»­ lÃ½",
    },
    {
      id: "users",
      path: "/admin/users",
      icon: <Users className="h-5 w-5" />,
      label: "Quáº£n lÃ½ ngÆ°á»i dÃ¹ng",
    },
    {
      id: "categories",
      path: "/admin/incident-types",
      icon: <Tag className="h-5 w-5" />,
      label: "Quáº£n lÃ½ loáº¡i sá»± cá»‘",
    },
    {
      id: "stats",
      path: "/admin/statistics",
      icon: <BarChart3 className="h-5 w-5" />,
      label: "Thá»‘ng kÃª",
    },
  ];

  const userInfo = {
    name: user?.full_name || "NgÆ°á»i dÃ¹ng",
    email: user?.email || "user@example.com",
    avatar: user?.avatar || null,
  };

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    toast.success("ÄÄƒng xuáº¥t thÃ nh cÃ´ng!");
    setTimeout(() => {
      logout();
      navigate("/signin");
    }, 1500);
  };

  return (
    <>
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
              XÃ¡c nháº­n Ä‘Äƒng xuáº¥t
            </h3>
            <p className="text-gray-600 mb-6">
              Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n Ä‘Äƒng xuáº¥t khá»i há»‡ thá»‘ng?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium"
                >
                Há»§y
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors font-medium"
              >
                ÄÄƒng xuáº¥t
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed left-3 top-4 z-30">
        <Sidebar
          className="w-20 rounded-2xl border border-gray-200 overflow-hidden shadow-lg"
          style={{ height: "calc(100vh - 32px)" }}
        >
          <SidebarHeader className="flex items-center justify-center pb-4">
            <div className="flex items-center gap-0.5">
              <span className="text-2xl font-bold text-blue-600">S</span>
              <span className="text-lg font-semibold text-black">afin</span>
            </div>
          </SidebarHeader>

          <SidebarContent className="flex flex-col items-center py-4 gap-4">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  title={item.label}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
                    isActive
                      ? "bg-black text-white shadow-md"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  {item.icon}
                </button>
              );
            })}
          </SidebarContent>

          <SidebarFooter className="flex flex-col items-center gap-2 py-4 relative">
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
      </div>

      {showAvatarMenu &&
        portalTarget &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-[1900]"
              onClick={() => setShowAvatarMenu(false)}
            />

            <div
              className="fixed bottom-[4.5rem] left-24 z-[2000] w-56 rounded-xl border border-gray-100 bg-white shadow-lg"
              onClick={(event) => event.stopPropagation()}
            >
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

              <div className="py-2">
                <button
                  onClick={() => {
                    setShowAvatarMenu(false);
                    setShowInfoModal(true);
                  }}
                  className="w-full px-4 py-2 flex items-center gap-3 text-gray-700 hover:bg-gray-50 transition-colors text-left"
                >
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">ThÃ´ng tin cÃ¡ nhÃ¢n</span>
                </button>

                <button
                  onClick={() => {
                    setShowAvatarMenu(false);
                    setShowLogoutConfirm(true);
                  }}
                  className="w-full px-4 py-2 flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm font-medium">ÄÄƒng xuáº¥t</span>
                </button>
              </div>
            </div>
          </>,
          portalTarget,
        )}

      {showInfoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <Info_Management onClose={() => setShowInfoModal(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
