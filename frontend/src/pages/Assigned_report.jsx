import React, { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "../components/ui/pagination";
import { NavbarAdmin } from "../components/NavBar";
import MaintenanceUserSidebar from "../components/MaintenanceUserSidebar";
import { SidebarProvider } from "../components/ui/sidebar";
import MaintenanceReportDetail from "../components/MaintenanceReportDetail";

export default function Assigned_report() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const ITEMS_PER_PAGE = 4;

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

  const maxPage = Math.ceil(filteredReports.length / ITEMS_PER_PAGE) || 1;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentReports = filteredReports.slice(offset, offset + ITEMS_PER_PAGE);

  return (
    <div className="w-full h-screen overflow-hidden bg-[#fafafa] flex flex-col md:flex-row relative text-sm md:text-base">
      {/* Sidebar */}
      <div className="hidden md:block absolute left-6 top-4 z-10">
        <SidebarProvider>
          <MaintenanceUserSidebar />
        </SidebarProvider>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col h-full w-full overflow-hidden md:pl-[7rem]">
        
        {/* Navbar cố định */}
        <div className="flex-shrink-0 px-4 sm:px-5 pt-3 sm:pt-4 pb-0">
          <div className="w-full max-w-[1320px] mx-auto">
            <NavbarAdmin />
          </div>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 pt-3 pb-3 sm:pb-4">
          <div className="flex flex-col w-full max-w-[1320px] mx-auto gap-3 h-full min-h-min">
            
            {/* Search Area */}
            <div className="h-[56px] w-full flex-shrink-0 rounded-[20px] border border-gray-200 bg-white px-5 md:px-9 shadow-sm flex items-center gap-4">
              <Search className="h-6 w-6 text-[#767676] shrink-0" />
              <Input
                className="flex-1 border-0 bg-transparent p-0 text-[15px] text-gray-700 placeholder:text-gray-400 shadow-none focus-visible:ring-0"
                placeholder="Nhập tên loại sự cố để tìm kiếm, mã sự cố, tiêu đề…"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className="flex flex-col flex-1 w-full rounded-[30px] border border-gray-200 bg-white shadow-sm overflow-hidden pt-3 pb-3 px-3 md:px-8">
              <div className="w-full flex-1">
                <Table className="w-full min-w-[860px] border-collapse text-center relative table-fixed">
                  <TableHeader className="bg-white z-10 border-b border-gray-200">
                    <TableRow className="text-[13px] font-semibold uppercase tracking-[0.08em] text-gray-700 hover:bg-transparent border-0">
                      <TableHead className="w-[15%] px-3 py-2 text-center h-auto text-gray-700 font-semibold align-middle">Mã báo cáo</TableHead>
                      <TableHead className="w-[35%] px-3 py-2 text-center h-auto text-gray-700 font-semibold align-middle">Tiêu đề</TableHead>
                      <TableHead className="w-[35%] px-3 py-2 text-center h-auto text-gray-700 font-semibold align-middle">Vị trí</TableHead>
                      <TableHead className="w-[15%] px-3 py-2 text-center h-auto text-gray-700 font-semibold align-middle">Thời gian</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100 text-[15px]">
                    {currentReports.map((report) => (
                      <TableRow
                        key={`${report.id}-${report.time}`}
                        onClick={() => setSelectedReport(report)}
                        className="transition-colors hover:bg-slate-50/70 cursor-pointer border-0"
                      >
                        <TableCell className="px-3 py-3 font-medium text-blue-700 whitespace-nowrap">
                          {report.id}
                        </TableCell>
                        <TableCell className="px-3 py-3 text-gray-800">{report.title}</TableCell>
                        <TableCell className="px-3 py-3 text-gray-700">
                          {report.location}
                        </TableCell>
                        <TableCell className="px-3 py-3 text-gray-700 whitespace-nowrap leading-relaxed">
                          {report.time.split(", ")[0]},
                          <br />
                          {report.time.split(", ")[1]}
                        </TableCell>
                      </TableRow>
                    ))}

                    {currentReports.length === 0 && (
                      <TableRow className="hover:bg-transparent border-0">
                        <TableCell
                          colSpan={4}
                          className="px-4 py-10 text-center text-gray-500"
                        >
                          Không tìm thấy báo cáo phù hợp.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <Pagination className="mt-2 pt-2 flex-shrink-0 bg-white">
                <PaginationContent className="gap-[15px] text-[15px] font-semibold text-gray-700">
                  <PaginationItem>
                    <button
                      className="flex items-center gap-1 text-gray-500 transition-colors hover:text-gray-900 cursor-pointer bg-transparent border-0 p-0"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Trước
                    </button>
                  </PaginationItem>

                  {Array.from({ length: maxPage }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                        isActive={currentPage === page}
                        className={`h-7 w-7 rounded-[5px] transition-colors flex items-center justify-center cursor-pointer p-0 ${
                          currentPage === page
                            ? "border border-gray-300 bg-white shadow-sm text-gray-900 hover:bg-white hover:text-gray-900"
                            : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 border-transparent bg-transparent shadow-none"
                        }`}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  {maxPage > 5 && (
                    <PaginationItem>
                      <span className="text-gray-400">…</span>
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <button
                      className="flex items-center gap-1 text-gray-500 transition-colors hover:text-gray-900 cursor-pointer bg-transparent border-0 p-0"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(maxPage, prev + 1))
                      }
                    >
                      Sau
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </div>
      </div>

      <MaintenanceReportDetail 
        isOpen={!!selectedReport} 
        onClose={() => setSelectedReport(null)} 
        report={selectedReport}
      />
    </div>
  );
}
