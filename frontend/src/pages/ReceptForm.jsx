import React, { useState } from "react";
import { User, Calendar } from "lucide-react";
import ReportDetailQLKV from "../components/ReportDetail-QLKV";
import roadImage from "../image/road.png";
import trafficConeImage from "../image/trafficCone.png";
import fireHydrantImage from "../image/fireHydrant.png";

const ReceptForm = () => {
  const [activeDistrict, setActiveDistrict] = useState("Hải Châu");
  const [selectedReport, setSelectedReport] = useState(null);

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
      code: "BCGT3101",
      title: "Ổ Gà To Đùng",
      category: "Giao Thông",
      categoryColor: "#f97316",
      image: roadImage,
      reporter: "35 Hưng Vương",
      district: "Hải Châu",
      date: "24/11/2025",
      time: "14:19:42 - 24/11/2025",
      status: "Đang Chờ",
      team: "Đội Giao Thông 1 - GTHC01",
      description:
        "Xuất hiện ổ gà lớn giữa làn xe máy, phương tiện thường xuyên phải lách gấp khi di chuyển qua khu vực.",
    },
    {
      id: 2,
      code: "BCDN1278",
      title: "Đèn Giao Thông Không Hoạt Động",
      category: "Điện",
      categoryColor: "#FDCA00",
      image: trafficConeImage,
      reporter: "136 Yên Bái",
      district: "Hải Châu",
      date: "13/11/2025",
      time: "08:25:10 - 13/11/2025",
      status: "Đang Chờ",
      team: "Đội Điện Đô Thị 2 - DDT02",
      description:
        "Cụm đèn tín hiệu tại ngã tư nhấp nháy bất thường, gây ùn tắc vào giờ cao điểm buổi chiều.",
    },
    {
      id: 3,
      code: "BCCT2085",
      title: "Nhà Chờ Xe Bus Bị Gãy Ghế",
      category: "CTCC",
      categoryColor: "#a855f7",
      image: fireHydrantImage,
      reporter: "66 Phan Châu Trinh",
      district: "Thanh Khê",
      date: "18/10/2025",
      time: "10:42:33 - 18/10/2025",
      status: "Đang Chờ",
      team: "Đội Công Trình 1 - CTCC01",
      description:
        "Ghế ngồi tại nhà chờ xe buýt bị gãy chân, có nguy cơ gây tai nạn cho người dân khi sử dụng.",
    },
    {
      id: 4,
      code: "BCDN1320",
      title: "Đèn Giao Thông Không Hoạt Động",
      category: "Điện",
      categoryColor: "#FDCA00",
      image: trafficConeImage,
      reporter: "136 Yên Bái",
      district: "Sơn Trà",
      date: "13/11/2025",
      time: "11:15:08 - 13/11/2025",
      status: "Đang Chờ",
      team: "Đội Điện Đô Thị 3 - DDT03",
      description:
        "Đèn đỏ hướng từ cầu sang đường chính không hiển thị, lưu lượng xe giao cắt tăng và khó điều tiết.",
    },
    {
      id: 5,
      code: "BCCT2201",
      title: "Nhà Chờ Xe Bus Bị Gãy Ghế",
      category: "CTCC",
      categoryColor: "#a855f7",
      image: fireHydrantImage,
      reporter: "66 Phan Châu Trinh",
      district: "Cẩm Lệ",
      date: "18/10/2025",
      time: "15:02:47 - 18/10/2025",
      status: "Đang Chờ",
      team: "Đội Công Trình 2 - CTCC02",
      description:
        "Mái che nhà chờ bị rò nước khi mưa, đồng thời biển tuyến xuống cấp và khó đọc thông tin.",
    },
    {
      id: 6,
      code: "BCGT3144",
      title: "Ổ Gà To Đùng",
      category: "Giao Thông",
      categoryColor: "#f97316",
      image: roadImage,
      reporter: "35 Hưng Vương",
      district: "Liên Chiểu",
      date: "24/11/2025",
      time: "16:37:20 - 24/11/2025",
      status: "Đang Chờ",
      team: "Đội Giao Thông 3 - GTHC03",
      description:
        "Mặt đường bong tróc thành nhiều mảng lớn trước khu dân cư, xuất hiện đọng nước khi trời mưa.",
    },
  ];

  const detailData = selectedReport
    ? {
        id:
          selectedReport.code ||
          `BC-${String(selectedReport.id).padStart(4, "0")}`,
        title: selectedReport.title,
        type: selectedReport.category,
        status: selectedReport.status,
        time: selectedReport.time || selectedReport.date,
        district: selectedReport.district,
        team: selectedReport.team,
        reporter: selectedReport.reporter,
        location: `${selectedReport.reporter}, ${selectedReport.district}, Đà Nẵng`,
        description: selectedReport.description,
        images: [selectedReport.image, selectedReport.afterImage || ""],
      }
    : null;

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
              onClick={() => setSelectedReport(report)}
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
                      filter: "brightness(0.9)",
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
      <ReportDetailQLKV
        data={detailData}
        close={() => setSelectedReport(null)}
      />
    </div>
  );
};

export default ReceptForm;