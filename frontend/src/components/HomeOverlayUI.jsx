import React, { useState } from "react";
import {
  CircleUserRound,
  Search,
  TrafficCone,
  Zap,
  TreePine,
  Building2,
  House,
  Megaphone,
  Plus,
  Camera,
} from "lucide-react";
import ReportForm from "./Report";

const categories = [
  {
    id: "traffic",
    name: "Giao Thông",
    icon: <TrafficCone size={18} />,
    bgColor: "#fed7aa",
    textColor: "#9a3412",
    activeBgColor: "#f97316",
  },
  {
    id: "electric",
    name: "Điện",
    icon: <Zap size={18} />,
    bgColor: "#fef3c7",
    textColor: "#854d0e",
    activeBgColor: "#eab308",
  },
  {
    id: "tree",
    name: "Cây Xanh",
    icon: <TreePine size={18} />,
    bgColor: "#dcfce7",
    textColor: "#166534",
    activeBgColor: "#22c55e",
  },
  {
    id: "public",
    name: "Công Trình",
    icon: <Building2 size={18} />,
    bgColor: "#f3e8ff",
    textColor: "#6b21a8",
    activeBgColor: "#a855f7",
  },
];

export default function HomeOverlayUI({
  selectedCategory,
  setSelectedCategory,
  userAvatar,
  userName,
}) {
  const [isReportOpen, setIsReportOpen] = useState(false);

  return (
    <>
      <div className="app-map-overlay">
        {/* HEADER: Avatar - Search - Categories */}
        <div className="interactive px-4 pt-6 ml-10">
          <div className="flex items-center gap-4 w-full ml-[15px] h-12">
            {/* Avatar */}
            <button
              onClick={() => console.log("Open profile")}
              className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 border-orange-500 overflow-hidden shrink-0"
            >
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName || "User"}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <CircleUserRound
                  size={24}
                  className="text-orange-500 flex-shrink-0"
                />
              )}
            </button>

            {/* Search box */}
            <div
              className="flex items-center bg-white rounded-full shadow px-4 h-10"
              style={{ width: "450px" }}
            >
              <Search size={20} className="text-gray-500 mr-2" />
              <input
                className="flex-1 bg-transparent outline-none text-base"
                placeholder="Tìm kiếm địa điểm"
                type="text"
              />
            </div>

            {/* Categories row */}
            <div className="flex gap-2 ml-3">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`flex items-center gap-2 px-4 h-10 rounded-full text-sm font-medium transition-all whitespace-nowrap
                  ${
                    selectedCategory === "all"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700"
                  }`}
              >
                <span className="icon-wrap">📍</span>
                Tất cả
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className="flex items-center gap-2 px-4 h-10 rounded-full text-sm font-medium transition-all whitespace-nowrap shadow-md"
                  style={{
                    backgroundColor:
                      selectedCategory === c.id ? c.activeBgColor : c.bgColor,
                    color:
                      selectedCategory === c.id ? "#ffffff" : c.textColor,
                  }}
                >
                  <span className="icon-wrap">{c.icon}</span>
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* bottom nav */}
        <div className="interactive absolute left-0 right-0 bottom-5 flex justify-center">
          <div className="bottom-nav">
            <button
              onClick={() => console.log("Navigate to Home")}
              className="flex flex-col items-center bg-transparent border-0 text-inherit cursor-pointer transition-opacity hover:opacity-70"
            >
              <House size={20} />
              <div className="text-xs">Home</div>
            </button>
            <button
              onClick={() => console.log("Navigate to My Reports")}
              className="flex flex-col items-center bg-transparent border-0 text-inherit cursor-pointer transition-opacity hover:opacity-70"
            >
              <Megaphone size={20} />
              <div className="text-xs">Báo Cáo của tôi</div>
            </button>
          </div>
        </div>

        {/* floating buttons */}
        <div className="interactive">
          {/* Plus: mở / tắt popup */}
          <button
            className="fab"
            style={{
              position: "absolute",
              right: 18,
              bottom: 96,
              background: "#2563EB",
              color: "#fff",
            }}
            onClick={() => setIsReportOpen((prev) => !prev)}
          >
            <Plus size={20} />
          </button>

          <button
            className="fab"
            style={{
              position: "absolute",
              right: 18,
              bottom: 18,
              background: "#2563EB",
              color: "#fff",
            }}
          >
            <Camera size={18} />
          </button>
        </div>

        {/* FORM POPUP: phải bọc trong .interactive để click được */}
        {isReportOpen && (
          <div className="interactive">
            <ReportForm onClose={() => setIsReportOpen(false)} />
          </div>
        )}
      </div>
    </>
  );
}
