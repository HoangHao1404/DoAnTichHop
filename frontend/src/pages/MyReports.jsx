import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";

const MOCK_REPORTS = [
  {
    id: "BCGT3101",
    title: "Ổ gà siêu bự lụng",
    type: "Giao Thông",
    location: "35 Hùng Vương, ĐN",
    status: "Đang Xử Lý",
    time: "26/11/2025",
  },
  {
    id: "BCD0295",
    title: "Đèn giao thông không hoạt động",
    type: "Điện",
    location: "136 Yên Bái, ĐN",
    status: "Đang Chờ",
    time: "13/11/2025",
  },
  {
    id: "BCCX7138",
    title: "Cây ngã chắn đường",
    type: "Cây Xanh",
    location: "16 Lê Lợi, ĐN",
    status: "Đang Chờ",
    time: "03/11/2025",
  },
  {
    id: "BCCTC1824",
    title: "Nhà chờ xe bus bị gãy ghế",
    type: "CTCC",
    location: "66 Phan Châu Trinh, ĐN",
    status: "Đã Giải Quyết",
    time: "16/08/2025",
  },
  {
    id: "BCD0295",
    title: "Đèn điện phát nổ",
    type: "Điện",
    location: "265 Điện Biên Phủ, ĐN",
    status: "Đã Giải Quyết",
    time: "24/06/2025",
  },
];

const TYPE_COLOR = {
  "Giao Thông": "bg-orange-400",
  "Điện": "bg-yellow-400",
  "Cây Xanh": "bg-green-400",
  "CTCC": "bg-purple-400",
};

const STATUS_COLOR = {
  "Đang Chờ": "bg-gray-400",
  "Đang Xử Lý": "bg-orange-500",
  "Đã Giải Quyết": "bg-blue-500",
};

export default function MyReports() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    setReports(MOCK_REPORTS);
  }, []);

  const filtered = reports.filter((item) => {
    const matchSearch = item.id.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || item.type === typeFilter;
    const matchStatus = statusFilter === "all" || item.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  return (
    <div className="w-full h-screen overflow-hidden bg-gray-100 flex flex-col">

      {/* CONTENT SCROLL AREA */}
      <div className="flex-1 overflow-y-auto p-4">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src="https://i.pravatar.cc/150?img=15"
            alt="avatar"
            className="w-12 h-12 rounded-full border shadow-sm object-cover"
          />
          <h1 className="text-2xl md:text-3xl font-bold">Báo Cáo Của Tôi</h1>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <StatBox label="Tổng Cộng" number={reports.length} icon="📁" />
          <StatBox
            label="Đang Chờ"
            number={reports.filter((r) => r.status === "Đang Chờ").length}
            icon="⏳"
          />
          <StatBox
            label="Đang Xử Lý"
            number={reports.filter((r) => r.status === "Đang Xử Lý").length}
            icon="⚡"
          />
          <StatBox
            label="Đã Giải Quyết"
            number={reports.filter((r) => r.status === "Đã Giải Quyết").length}
            icon="✔️"
          />
        </div>

        {/* TABLE CARD */}
        <div className="p-4 bg-white border rounded-2xl shadow">

          {/* FILTER ROW */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
            <div className="relative w-full md:w-1/3">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Nhập mã báo cáo để tìm kiếm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-full px-3 py-2 rounded-md border bg-gray-100 border-gray-300"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 rounded-md border bg-gray-100 border-gray-300"
              >
                <option value="all">Tất Cả Các Loại</option>
                <option value="Giao Thông">Giao Thông</option>
                <option value="Điện">Điện</option>
                <option value="Cây Xanh">Cây Xanh</option>
                <option value="CTCC">CTCC</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-md border bg-gray-100 border-gray-300"
              >
                <option value="all">Tất Cả Trạng Thái</option>
                <option value="Đang Chờ">Đang Chờ</option>
                <option value="Đang Xử Lý">Đang Xử Lý</option>
                <option value="Đã Giải Quyết">Đã Giải Quyết</option>
              </select>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 whitespace-nowrap">Mã Báo Cáo</th>
                  <th className="p-3 whitespace-nowrap">Tiêu Đề</th>
                  <th className="p-3 whitespace-nowrap">Loại</th>
                  <th className="p-3 whitespace-nowrap">Vị Trí</th>
                  <th className="p-3 whitespace-nowrap">Trạng Thái</th>
                  <th className="p-3 whitespace-nowrap">Thời Gian</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-3 font-semibold">{item.id}</td>
                    <td className="p-3">{item.title}</td>

                    <td className="p-3">
                      <span
                        className={`text-white px-3 py-1 rounded-full text-xs ${TYPE_COLOR[item.type]}`}
                      >
                        {item.type}
                      </span>
                    </td>

                    <td className="p-3">{item.location}</td>

                    <td className="p-3">
                      <span
                        className={`text-white px-3 py-1 rounded-full text-xs ${STATUS_COLOR[item.status]}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="p-3">{item.time}</td>
                  </tr>
                ))}

                {!filtered.length && (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500">
                      Không có dữ liệu phù hợp
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="mt-4 flex justify-center">
            <div className="px-4 py-2 bg-gray-100 rounded-full">1 / 3</div>
          </div>
        </div>
      </div>

     
      
    </div>
  );
}

function StatBox({ label, number, icon }) {
  return (
    <div className="p-3 bg-white rounded-xl shadow border flex items-center gap-4">
      <div className="text-2xl">{icon}</div>
      <div>
        <p className="text-sm">{label}</p>
        <p className="text-xl font-bold">{number}</p>
      </div>
    </div>
  );
}
