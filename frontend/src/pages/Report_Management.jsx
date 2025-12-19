import React, { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

const ReportManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Dữ liệu mẫu báo cáo
  const reports = [
    {
      id: "BCGT3101",
      title: "Ổ gà sâu bự lung",
      category: "Giao Thông",
      categoryColor: "#f97316",
      location: "35 Hưng Vương, Hải Châu",
      status: "Đang Xử Lý",
      statusColor: "#f97316",
      date: "26/11/2025",
    },
    {
      id: "BCD0295",
      title: "Đèn giao thông không hoạt động",
      category: "Điện",
      categoryColor: "#eab308",
      location: "136 Yên Bái, Hải Châu",
      status: "Đang Chờ",
      statusColor: "#9ca3af",
      date: "13/11/2025",
    },
    {
      id: "BCCX7138",
      title: "Cây ngã chắn đường",
      category: "Cây Xanh",
      categoryColor: "#22c55e",
      location: "16 Lê Lợi, Hải Châu",
      status: "Đang Chờ",
      statusColor: "#9ca3af",
      date: "03/11/2025",
    },
    {
      id: "BCCX7137",
      title: "Cây ngã chắn đường",
      category: "Cây Xanh",
      categoryColor: "#22c55e",
      location: "36 Hải Phòng, Hải Châu",
      status: "Đang Chờ",
      statusColor: "#9ca3af",
      date: "01/11/2025",
    },
    {
      id: "BCCTCC1824",
      title: "Nhà chờ xe bus bị gãy ghế",
      category: "CTCC",
      categoryColor: "#a855f7",
      location: "66 Phan Châu Trinh, Hải Châu",
      status: "Đã Giải Quyết",
      statusColor: "#06b6d4",
      date: "16/08/2025",
    },
    {
      id: "BCCTCC1824",
      title: "Nhà chờ xe bus bị gãy ghế",
      category: "CTCC",
      categoryColor: "#a855f7",
      location: "66 Phan Châu Trinh, Hải Châu",
      status: "Đã Giải Quyết",
      statusColor: "#06b6d4",
      date: "16/08/2025",
    },
    {
      id: "BCD0295",
      title: "Đèn điện phát nổ",
      category: "Điện",
      categoryColor: "#eab308",
      location: "265 Điện Biên Phủ, Liên Chiểu",
      status: "Đã Giải Quyết",
      statusColor: "#06b6d4",
      date: "24/06/2025",
    },
  ];

  const totalPages = 3;

  // Lọc báo cáo theo search query, category và status
  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || 
                           report.category === getCategoryName(selectedCategory);
    
    const matchesStatus = selectedStatus === "all" || 
                         report.status === getStatusName(selectedStatus);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Helper functions để chuyển đổi giá trị select thành tên hiển thị
  function getCategoryName(value) {
    const categoryMap = {
      "giao-thong": "Giao Thông",
      "dien": "Điện",
      "cay-xanh": "Cây Xanh",
      "ctcc": "CTCC"
    };
    return categoryMap[value] || value;
  }

  function getStatusName(value) {
    const statusMap = {
      "dang-cho": "Đang Chờ",
      "dang-xu-ly": "Đang Xử Lý",
      "da-giai-quyet": "Đã Giải Quyết"
    };
    return statusMap[value] || value;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 mb-4">
        <div className="px-4 sm:px-6 py-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Quản lý báo cáo
          </h1>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="px-4 sm:px-6 mb-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Nhập mã báo cáo để tìm kiếm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white cursor-pointer"
          >
            <option value="all">Tất Cả Các Loại</option>
            <option value="giao-thong">Giao Thông</option>
            <option value="dien">Điện</option>
            <option value="cay-xanh">Cây Xanh</option>
            <option value="ctcc">CTCC</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white cursor-pointer"
          >
            <option value="all">Tất Cả Trạng Thái</option>
            <option value="dang-cho">Đang Chờ</option>
            <option value="dang-xu-ly">Đang Xử Lý</option>
            <option value="da-giai-quyet">Đã Giải Quyết</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="px-4 sm:px-6">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                    Mã Báo Cáo
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                    Tiêu Đề
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                    Loại
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                    Vị Trí
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                    Trạng Thái
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                    Thời Gian
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.length > 0 ? (
                  filteredReports.map((report, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-4 text-sm font-medium text-gray-900">
                        {report.id}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">
                        {report.title}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className="inline-block px-3 py-1 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: report.categoryColor }}
                        >
                          {report.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">
                        {report.location}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className="inline-block px-3 py-1 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: report.statusColor }}
                        >
                          {report.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">
                        {report.date}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500">
                      Không tìm thấy báo cáo nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-6 mb-4">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          
          <span className="px-4 py-2 text-sm font-medium text-gray-700">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportManagement;
