import React, { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "../components/ui/input";

export default function Assigned_report() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(2);

  // Du lieu mau theo giao dien Framer
  const reports = [
    {
      id: "#BC-23456",
      title: "Ổ gà lủng to đùng",
      location: "556 Hoàng Diệu, Hải Châu",
      time: "10:45, 24/03",
    },
    {
      id: "#BC-9999",
      title: "Đường lủng bự tổ chảng",
      location: "123 Thâm Tâm, Hoà Xuân",
      time: "22:05, 26/03",
    },
    {
      id: "#BC-7374",
      title: "Ổ voi siêu khủng lồ",
      location: "27 Hói Kiếng 34, Hoà Xuân",
      time: "13:45, 27/03",
    },
    {
      id: "#BC-9248",
      title: "Đường thủng gây nguy hiểm giao...",
      location: "98 Mai Thúc Lân, Ngũ Hành Sơn",
      time: "11:45, 11/03",
    },
    {
      id: "#BC-2821",
      title: "Mặt đường bị hư hỏng nặng",
      location: "44 Phan Tứ, Ngũ Hành Sơn",
      time: "09:00, 09/03",
    },
    {
      id: "#BC-9999",
      title: "Đường xấu dễ tai nạn",
      location: "99 Tôn Đức Thắng, Hoà Khánh",
      time: "14:30, 25/03",
    },
  ];

  const filteredReports = reports.filter((report) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      report.id.toLowerCase().includes(query) ||
      report.title.toLowerCase().includes(query) ||
      report.location.toLowerCase().includes(query)
    );
  });

  const maxPage = 3;

  return (
    <div className="w-full flex-1 p-5 md:p-8 text-sm md:text-base">
      <div className="mx-auto w-full max-w-[1320px] space-y-6">
        <div className="h-[76px] w-full rounded-[20px] border border-gray-200 bg-white px-5 md:px-9 shadow-sm flex items-center gap-4">
          <Search className="h-7 w-7 text-[#767676] shrink-0" />
          <Input
            className="flex-1 border-0 bg-transparent p-0 text-[15px] text-gray-700 placeholder:text-gray-400 shadow-none focus-visible:ring-0"
            placeholder="Nhập tên loại sự cố để tìm kiếm, mã sự cố, tiêu đề…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="w-full rounded-[30px] border border-gray-200 bg-white px-3 md:px-8 pt-7 pb-8 shadow-sm">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-200 text-[13px] font-semibold uppercase tracking-[0.08em] text-gray-700">
                  <th className="px-4 py-4">Mã báo cáo</th>
                  <th className="px-4 py-4">Tiêu đề</th>
                  <th className="px-4 py-4">Vị trí</th>
                  <th className="px-4 py-4">Thời gian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[15px]">
                {filteredReports.map((report) => (
                  <tr
                    key={`${report.id}-${report.time}`}
                    className="transition-colors hover:bg-slate-50/70"
                  >
                    <td className="px-4 py-5 font-medium text-gray-800 whitespace-nowrap">
                      {report.id}
                    </td>
                    <td className="px-4 py-5 text-gray-800">{report.title}</td>
                    <td className="px-4 py-5 text-gray-700">
                      {report.location}
                    </td>
                    <td className="px-4 py-5 text-gray-700 whitespace-nowrap">
                      {report.time}
                    </td>
                  </tr>
                ))}

                {filteredReports.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-10 text-center text-gray-500"
                    >
                      Không tìm thấy báo cáo phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex items-center justify-center gap-[15px] text-[15px] font-semibold text-gray-700">
            <button
              className="flex items-center gap-1 text-gray-500 transition-colors hover:text-gray-900"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
              Trước
            </button>

            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`h-7 w-7 rounded-[5px] transition-colors ${
                  currentPage === page
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {page}
              </button>
            ))}

            <span className="text-gray-400">…</span>

            <button
              className="flex items-center gap-1 text-gray-500 transition-colors hover:text-gray-900"
              onClick={() =>
                setCurrentPage((prev) => Math.min(maxPage, prev + 1))
              }
            >
              Sau
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
