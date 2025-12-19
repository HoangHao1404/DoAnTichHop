import React, { useState } from "react";
import { Calendar, Download } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ThongKe = () => {
  const [selectedDate, setSelectedDate] = useState(new Date("2025-08-28"));
  const [timeFilter, setTimeFilter] = useState("day");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Dữ liệu mẫu cho khu vực (bar chart ngang)
  const areaData = [
    { name: "Liên Chiểu", value: 278, color: "#a855f7" },
    { name: "Ngũ Hành Sơn", value: 647, color: "#84cc16" },
    { name: "Sơn Trà", value: 573, color: "#eab308" },
    { name: "Thanh Khê", value: 689, color: "#22c55e" },
    { name: "Hòa Vang", value: 856, color: "#eab308" },
    { name: "Cẩm Lệ", value: 732, color: "#a855f7" },
    { name: "Hải Châu", value: 725, color: "#f97316" },
    { name: "Hoàng Sa", value: 891, color: "#f97316" },
  ];

  // Dữ liệu cho biểu đồ tròn - Loại Trạng Thái
  const statusData = [
    { name: "Đang Chờ", value: 78, color: "#ef4444" },
    { name: "Đang Xử Lý", value: 156, color: "#3b82f6" },
    { name: "Đã Giải Quyết", value: 3210, color: "#84cc16" },
  ];

  // Dữ liệu cho biểu đồ cột - Loại Sự Cố
  const incidentData = [
    { name: "Giao Thông Vận Tải", value: 950, fill: "#f97316" },
    { name: "Điện", value: 780, fill: "#eab308" },
    { name: "Cây Xanh", value: 620, fill: "#22c55e" },
    { name: "Công Trình Công Cộng", value: 680, fill: "#a855f7" },
  ];

  const totalReports = 3444;

  const handleExportFile = () => {
    // Tạo dữ liệu để xuất
    const exportData = {
      date: formatDate(selectedDate),
      timeFilter: timeFilter === "day" ? "Ngày" : timeFilter === "week" ? "Tuần" : "Tháng",
      totalReports: totalReports,
      areaData: areaData,
      statusData: statusData,
      incidentData: incidentData,
    };

    // Chuyển sang JSON string
    const jsonString = JSON.stringify(exportData, null, 2);
    
    // Tạo blob và download
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `thong-ke-${selectedDate.toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Controls */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Left: Date and Time Filter */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* Date */}
            <div className="relative">
              <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                   onClick={() => document.getElementById('datePicker').showPicker()}>
                <Calendar size={18} className="text-gray-500" />
                <span className="text-sm text-gray-700">{formatDate(selectedDate)}</span>
              </div>
              <input
                id="datePicker"
                type="date"
                className="absolute opacity-0 pointer-events-none"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
              />
            </div>

            {/* Time Filter Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setTimeFilter("day")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeFilter === "day"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Ngày
              </button>
              <button
                onClick={() => setTimeFilter("week")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeFilter === "week"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Tuần
              </button>
              <button
                onClick={() => setTimeFilter("month")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeFilter === "month"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Tháng
              </button>
            </div>
          </div>

          {/* Right: Filters and Export */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white cursor-pointer text-sm"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="waiting">Đang Chờ</option>
              <option value="processing">Đang Xử Lý</option>
              <option value="resolved">Đã Giải Quyết</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white cursor-pointer text-sm"
            >
              <option value="all">Tất Cả Các Loại</option>
              <option value="traffic">Giao Thông</option>
              <option value="electric">Điện</option>
              <option value="tree">Cây Xanh</option>
              <option value="public">Công Trình Công Cộng</option>
            </select>

            {/* Export Button */}
            <button 
              onClick={handleExportFile}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
              <span>Xuất File</span>
              <Download size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Số Lượng Đơn */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-400 mb-4">
              Số Lượng Đơn
            </h3>
            <p className="text-5xl font-bold text-gray-800">{totalReports}</p>
          </div>

          {/* Khu Vực - Horizontal Bar Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-400 mb-6">
              Khu Vực
            </h3>
            <div className="space-y-3">
              {areaData.map((area, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-24 text-sm text-gray-700 truncate">
                    {area.name}
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(area.value / Math.max(...areaData.map(a => a.value))) * 100}%`,
                        backgroundColor: area.color
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Loại Trạng Thái - Donut Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-400 mb-6">
              Loại Trạng Thái
            </h3>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="w-full sm:w-1/2">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-3">
                {statusData.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Loại Sự Cố - Bar Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-400 mb-6">
              Loại Sự Cố
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={incidentData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={false} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {incidentData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: item.fill }}
                  ></div>
                  <span className="text-xs text-gray-600 truncate">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThongKe;
