import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LayoutGrid, Inbox, FileText, Users, Tag, BarChart3, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const menuItems = [
  {
    key: "Overview",
    label: "Overview",
    path: "/admin/overview",
    icon: LayoutGrid,
  },
  {
    key: "DonTiepNhan",
    label: "Đơn Tiếp Nhận",
    path: "/admin/reception",
    icon: Inbox,
  },
  {
    key: "QuanLyBaoCao",
    label: "Quản Lý Báo Cáo",
    path: "/admin/reports",
    icon: FileText,
  },
  {
    key: "QuanLyNguoiDung",
    label: "Quản Lý User",
    path: "/admin/users",
    icon: Users,
  },
  {
    key: "QuanLyLoaiSuCo",
    label: "Quản Lý Loại Sự Cố",
    path: "/admin/incident-types",
    icon: Tag,
  },
  {
    key: "ThongKe",
    label: "Thống Kê",
    path: "/admin/statistics",
    icon: BarChart3,
  },
];

const SidebarAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-[280px] flex items-start justify-start p-7 z-30">
      <div className="relative">
        <aside
          className="w-[260px] h-auto min-h-[700px] rounded-[25px] shadow relative flex flex-col transition-colors duration-300 bg-white text-black py-8 px-4"
        >
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <h1 className="font-['Inter'] font-semibold text-[48px] text-black">
              <span className="text-[#5271FF]">S</span>
              <span>afin</span>
            </h1>
          </div>

          {/* Menu */}
          <nav className="flex-1 flex flex-col gap-4">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.key}
                  to={item.path}
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-6 py-3 rounded-[14px] relative z-10 select-none transition-all duration-200 
                     ${isActive 
                       ? "bg-[#5271FF] text-white font-semibold shadow-md" 
                       : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                     }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-['Inter'] text-[16px] leading-[20px]">
                    {item.label}
                  </span>
                </NavLink>
              );
            })}
          </nav>

          {/* Đăng Xuất */}
          <div className="mt-auto pt-8">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-6 py-3 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-[14px] transition-all duration-200 w-full"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-['Inter'] text-[16px] leading-[20px]">
                Đăng Xuất
              </span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default SidebarAdmin;

