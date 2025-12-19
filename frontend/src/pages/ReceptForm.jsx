import React, { useState } from "react";
import {
  User,
  Calendar,
} from "lucide-react";
import roadImage from "../image/road.png";
import trafficConeImage from "../image/trafficCone.png";
import fireHydrantImage from "../image/fireHydrant.png";

const ReceptForm = () => {
  const [activeDistrict, setActiveDistrict] = useState("Hải Châu");

  // Danh sách quận
  const districts = [
    "Hải Châu",
    "Sơn Trà",
    "Liên Chiểu",
    "Hoàng Sa",
    "Thanh Khê",
    "Ngũ Hành Sơn",
    "Cẩm Lệ",
    "Hòa Vang",
  ];

  // Dữ liệu mẫu cho các đơn tiếp nhận
  const reports = [
    {
      id: 1,
      title: "Ổ Gà To Đùng",
      category: "Giao Thông",
      categoryColor: "#f97316",
      image: roadImage,
      reporter: "35 Hưng Vương",
      date: "24/11/2025",
      status: "Đang Chờ",
    },
    {
      id: 2,
      title: "Đèn Giao Thông Không Hoạt Động",
      category: "Điện",
      categoryColor: "#eab308",
      image: trafficConeImage,
      reporter: "136 Yên Bái",
      date: "13/11/2025",
      status: "Đang Chờ",
    },
    {
      id: 3,
      title: "Nhà Chờ Xe Bus Bị Gãy Ghế",
      category: "CTCC",
      categoryColor: "#a855f7",
      image: fireHydrantImage,
      reporter: "66 Phan Châu Trinh",
      date: "18/10/2025",
      status: "Đang Chờ",
    },
    {
      id: 4,
      title: "Đèn Giao Thông Không Hoạt Động",
      category: "Điện",
      categoryColor: "#eab308",
      image: trafficConeImage,
      reporter: "136 Yên Bái",
      date: "13/11/2025",
      status: "Đang Chờ",
    },
    {
      id: 5,
      title: "Nhà Chờ Xe Bus Bị Gãy Ghế",
      category: "CTCC",
      categoryColor: "#a855f7",
      image: fireHydrantImage,
      reporter: "66 Phan Châu Trinh",
      date: "18/10/2025",
      status: "Đang Chờ",
    },
    {
      id: 6,
      title: "Ổ Gà To Đùng",
      category: "Giao Thông",
      categoryColor: "#f97316",
      image: roadImage,
      reporter: "35 Hưng Vương",
      date: "24/11/2025",
      status: "Đang Chờ",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 mb-4">
          <div className="px-4 sm:px-6 py-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Đơn tiếp nhận
            </h1>
          </div>
        </div>

        {/* Districts Tabs */}
        <div className="bg-white border-b border-gray-200 mb-4">
          <div className="px-4 sm:px-6">
            <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
              {districts.map((district) => (
                <button
                  key={district}
                  onClick={() => setActiveDistrict(district)}
                  className={`px-6 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    activeDistrict === district
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {district}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="px-4 sm:px-6 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  {/* Category Badge */}
                  <div
                    className="absolute top-3 right-3 px-3 py-1 rounded-full text-white text-xs font-medium shadow-md z-10"
                    style={{ backgroundColor: report.categoryColor }}
                  >
                    {report.category}
                  </div>
                  {/* Background Image */}
                  {report.image ? (
                    <div 
                      className="w-full h-full bg-cover bg-center"
                      style={{ 
                        backgroundImage: `url(${report.image})`,
                        filter: 'brightness(0.9)'
                      }}
                    ></div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400"></div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-base font-bold text-gray-800 mb-3 line-clamp-2">
                    {report.title}
                  </h3>

                  <div className="space-y-2 mb-4">
                    {/* Reporter */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User size={16} className="text-gray-400" />
                      <span>{report.reporter}</span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} className="text-gray-400" />
                      <span>{report.date}</span>
                    </div>
                  </div>

                  {/* Status Button */}
                  <button className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors">
                    {report.status}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
  );
};

export default ReceptForm;
