import React from "react";
import { CircleUserRound, Search, TrafficCone, Zap, TreePine, Building2, House, Megaphone, Plus, Camera } from 'lucide-react';

const categories = [
  { id: "traffic", name: "Giao Thông", icon: <TrafficCone size={18} />, color: "bg-orange-300 text-orange-800", activeColor: "bg-orange-500" },
  { id: "electric", name: "Điện", icon: <Zap size={18} />, color: "bg-yellow-100 text-yellow-800", activeColor: "bg-yellow-500" },
  { id: "tree", name: "Cây Xanh", icon: <TreePine size={18} />, color: "bg-green-100 text-green-800", activeColor: "bg-green-500" },
  { id: "public", name: "Công Trình", icon: <Building2 size={18} />, color: "bg-purple-100 text-purple-800", activeColor: "bg-purple-500" },
];

export default function HomeOverlayUI({ selectedCategory, setSelectedCategory }) {
  return (
    <div className="app-map-overlay">
      {/* HEADER: Avatar - Search - Categories */}
      <div className="interactive px-4 pt-6 ml-10">
        <div className="flex items-center gap-4 w-full ml-[15px] h-12">
          {/* Avatar */}
          <div className="flex items-center">
            <CircleUserRound size={36} className="text-orange-500 drop-shadow-md" />
          </div>
          {/* Search box */}
            <div className="flex items-center bg-white rounded-full shadow px-4 h-10" style={{ width: '450px' }}>
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
              className={`flex items-center gap-2 px-4 h-12 rounded-full text-sm font-medium transition-all whitespace-nowrap
                ${selectedCategory === "all"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700"}`}
            >
              <span className="icon-wrap">📍</span>
              Tất cả
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`flex items-center gap-2 px-4 h-10 rounded-full text-sm font-medium transition-all whitespace-nowrap
                  ${selectedCategory === c.id
                    ? `${c.activeColor} text-white shadow-md`
                    : `${c.color}`}`}
              >
                <span className="icon-wrap">{c.icon}</span>
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* bottom nav */}
      <div className="interactive" style={{ position: "absolute", left: 0, right: 0, bottom: 20, display: "flex", justifyContent: "center" }}>
        <div className="bottom-nav">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <House size={20} />
            <div style={{ fontSize: 12 }}>Home</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Megaphone size={20} />
            <div style={{ fontSize: 12 }}>Báo Cáo của tôi</div>
          </div>
        </div>
      </div>

      {/* floating buttons */}
      <div className="interactive">
        <button className="fab" style={{ position: "absolute", right: 18, bottom: 96, background: "#2563EB", color: "#fff" }}>
          <Plus size={20} weight="bold" />
        </button>

        <button className="fab" style={{ position: "absolute", right: 18, bottom: 18, background: "#2563EB", color: "#fff" }}>
          <Camera size={18} weight="bold" />
        </button>
      </div>
    </div>
  );
}
