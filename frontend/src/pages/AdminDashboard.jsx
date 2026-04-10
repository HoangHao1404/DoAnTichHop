import React, { useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { Building2, TrafficCone, TreePine, Zap } from "lucide-react";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const CATEGORY_OPTIONS = [
  {
    id: "all",
    label: "Tất Cả",
    icon: "⌘",
    color: "#2563eb",
  },
  {
    id: "traffic",
    label: "Giao Thông",
    icon: <TrafficCone className="h-4 w-4" />,
    color: "#f97316",
  },
  {
    id: "electric",
    label: "Điện",
    icon: <Zap className="h-4 w-4" />,
    color: "#eab308",
  },
  {
    id: "tree",
    label: "Cây Xanh",
    icon: <TreePine className="h-4 w-4" />,
    color: "#22c55e",
  },
  {
    id: "public",
    label: "Công Trình Công Cộng",
    icon: <Building2 className="h-4 w-4" />,
    color: "#a855f7",
  },
];

const INCIDENT_POINTS = [
  {
    id: "RPT-A001",
    category: "traffic",
    title: "Hư hỏng mặt đường",
    status: "Đang xử lý",
    position: [16.0587, 108.216],
  },
  {
    id: "RPT-A002",
    category: "electric",
    title: "Đèn đường chập chờn",
    status: "Đang chờ",
    position: [16.0422, 108.2258],
  },
  {
    id: "RPT-A003",
    category: "tree",
    title: "Cây xanh nghiêng nguy hiểm",
    status: "Đã giải quyết",
    position: [16.0341, 108.2014],
  },
  {
    id: "RPT-A004",
    category: "public",
    title: "Hư hỏng công trình công cộng",
    status: "Đang xử lý",
    position: [16.0158, 108.2312],
  },
];

export default function AdminDashboard() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const visiblePoints = useMemo(() => {
    if (selectedCategory === "all") {
      return INCIDENT_POINTS;
    }

    return INCIDENT_POINTS.filter((point) => point.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="relative h-screen w-full">
      <MapContainer
        center={[16.0471, 108.2068]}
        zoom={14}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {visiblePoints.map((point) => (
          <Marker key={point.id} position={point.position}>
            <Popup>
              <div className="space-y-1">
                <p className="font-semibold text-gray-900">{point.id}</p>
                <p className="text-sm text-gray-700">{point.title}</p>
                <p className="text-xs text-gray-500">{point.status}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="pointer-events-none absolute left-[7.2rem] right-4 top-[5.4rem] z-20">
        <div className="pointer-events-auto flex gap-3 overflow-x-auto scrollbar-hide">
          {CATEGORY_OPTIONS.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategory(category.id)}
              className="inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold text-white shadow-md transition hover:brightness-95 sm:h-10 sm:px-4"
              style={{
                backgroundColor: category.color,
                opacity: selectedCategory === category.id ? 1 : 0.92,
              }}
            >
              <span className="inline-flex items-center justify-center">
                {category.icon}
              </span>
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
