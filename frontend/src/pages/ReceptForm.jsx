import React, { useEffect, useMemo, useState } from "react";
import { Calendar, MapPin, Search } from "lucide-react";
import roadImage from "../image/road.png";
import trafficConeImage from "../image/trafficCone.png";
import fireHydrantImage from "../image/fireHydrant.png";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DISTRICTS = [
  "Hải Châu",
  "Sơn Trà",
  "Liên Chiểu",
  "Hoàng Sa",
  "Thanh Khê",
  "Ngũ Hành Sơn",
  "Cẩm Lệ",
  "Hòa Vang",
];

const TYPE_OPTIONS = ["all", "Giao Thông", "Điện", "Cây Xanh", "CTCC"];
const STATUS_OPTIONS = ["all", "Đang Chờ", "Đang Xử Lý", "Đã Giải Quyết"];

const CATEGORY_COLORS = {
  "Giao Thông": "#f97316",
  Điện: "#fdca00",
  "Cây Xanh": "#16a34a",
  CTCC: "#b78ff2",
};

const reports = [
  {
    id: "bcgt3101",
    title: "Ổ gà to đùng",
    category: "Giao Thông",
    image: roadImage,
    location: "35 Hùng Vương",
    date: "24/11/2025",
    status: "Đang Chờ",
    district: "Hải Châu",
  },
  {
    id: "bcD4228",
    title: "Đèn giao thông không hoạt động",
    category: "Điện",
    image: trafficConeImage,
    location: "136 Yên Bái",
    date: "13/11/2025",
    status: "Đang Chờ",
    district: "Hải Châu",
  },
  {
    id: "bcctcc356",
    title: "Nhà chờ xe bus bị gãy ghế",
    category: "CTCC",
    image: fireHydrantImage,
    location: "66 Phan Châu Trinh",
    date: "18/10/2025",
    status: "Đang Chờ",
    district: "Hải Châu",
  },
  {
    id: "bcD4228",
    title: "Đèn giao thông không hoạt động",
    category: "Điện",
    image: trafficConeImage,
    location: "136 Yên Bái",
    date: "13/11/2025",
    status: "Đang Chờ",
    district: "Sơn Trà",
  },
  {
    id: "bcctcc356",
    title: "Nhà chờ xe bus bị gãy ghế",
    category: "CTCC",
    image: fireHydrantImage,
    location: "66 Phan Châu Trinh",
    date: "18/10/2025",
    status: "Đang Chờ",
    district: "Liên Chiểu",
  },
  {
    id: "bcgt3101",
    title: "Ổ gà to đùng",
    category: "Giao Thông",
    image: roadImage,
    location: "35 Hùng Vương",
    date: "24/11/2025",
    status: "Đang Chờ",
    district: "Hải Châu",
  },
  {
    id: "bcdx5509",
    title: "Cây xanh gãy đổ cản đường",
    category: "Cây Xanh",
    image: roadImage,
    location: "18 Nguyễn Chí Thanh",
    date: "21/11/2025",
    status: "Đang Chờ",
    district: "Hải Châu",
  },
  {
    id: "bcct7702",
    title: "Nắp cống hỏng gây nguy hiểm",
    category: "CTCC",
    image: fireHydrantImage,
    location: "92 Bạch Đằng",
    date: "20/11/2025",
    status: "Đang Chờ",
    district: "Hải Châu",
  },
];

const ReceptForm = () => {
  const [activeDistrict, setActiveDistrict] = useState("Hải Châu");
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [page, setPage] = useState(2);
  const [selectedReport, setSelectedReport] = useState(null);

  const filteredReports = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();

    return reports.filter((item) => {
      const byDistrict = item.district === activeDistrict;
      const byType = typeFilter === "all" || item.category === typeFilter;
      const byStatus = statusFilter === "all" || item.status === statusFilter;
      const byDate =
        dateFilter === "all" ||
        (dateFilter === "recent" && item.date === "24/11/2025") ||
        (dateFilter === "old" && item.date !== "24/11/2025");

      const haystack = `${item.id} ${item.title}`.toLowerCase();
      const bySearch = !searchTerm || haystack.includes(searchTerm);

      return byDistrict && byType && byStatus && byDate && bySearch;
    });
  }, [activeDistrict, query, typeFilter, statusFilter, dateFilter]);

  const pageSize = 6;
  const totalPages = Math.max(Math.ceil(filteredReports.length / pageSize), 1);
  const safePage = Math.min(page, totalPages);
  const visibleReports = filteredReports.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const pageNumbers = useMemo(() => {
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const start = Math.max(1, safePage - 2);
    const end = Math.min(totalPages, start + maxVisible - 1);
    const adjustedStart = Math.max(1, end - maxVisible + 1);

    return Array.from(
      { length: end - adjustedStart + 1 },
      (_, index) => adjustedStart + index,
    );
  }, [safePage, totalPages]);

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
    <div className="h-full overflow-hidden rounded-[24px] border border-gray-200 bg-white p-4 sm:p-5 flex flex-col">
      <div className="mb-3 rounded-[10px] bg-[#f5f5f5] px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {DISTRICTS.map((district) => {
            const active = district === activeDistrict;
            return (
              <button
                key={district}
                type="button"
                onClick={() => {
                  setActiveDistrict(district);
                  setPage(1);
                }}
                className={`text-sm transition-colors ${
                  active ? "font-semibold text-black" : "text-gray-500"
                }`}
              >
                {district}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-3 flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative w-full xl:max-w-[541px]">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#969696]" />
          <Input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Tìm kiếm theo mã sự cố, tiêu đề sự cố..."
            className="h-[45px] rounded-full border-0 bg-[#f5f5f5] pl-12 text-sm text-gray-700 placeholder:text-[#969696]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={typeFilter}
            onValueChange={(value) => {
              setTypeFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-[45px] rounded-[10px] border-0 bg-[#f5f5f5] px-[15px] text-gray-700">
              <SelectValue placeholder="Loại sự cố" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Loại sự cố</SelectItem>
              <SelectItem value="Giao Thông">Giao thông</SelectItem>
              <SelectItem value="Điện">Điện</SelectItem>
              <SelectItem value="Cây Xanh">Cây xanh</SelectItem>
              <SelectItem value="CTCC">CTCC</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-[45px] rounded-[10px] border-0 bg-[#f5f5f5] px-[15px] text-gray-700">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Trạng thái</SelectItem>
              {STATUS_OPTIONS.filter((option) => option !== "all").map(
                (option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="h-[45px] rounded-[10px] border-0 bg-[#f5f5f5] px-[15px] text-gray-700">
              <SelectValue placeholder="Chọn ngày" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Chọn ngày</SelectItem>
              <SelectItem value="recent">Mới nhất</SelectItem>
              <SelectItem value="old">Cũ hơn</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-3 grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
        {visibleReports.map((report, index) => (
          <div
            key={`${report.id}-${report.location}-${index}`}
            className="relative h-[220px] overflow-hidden rounded-[24px] cursor-pointer"
            onClick={() => setSelectedReport(report)}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${report.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/65" />

            <div className="absolute left-3 right-3 top-3 flex items-center justify-between">
              <div className="rounded-full bg-white px-4 py-1 text-[11px] font-semibold text-[#424242]">
                {report.id}
              </div>
              <div
                className="rounded-full px-4 py-1 text-[11px] font-medium text-white"
                style={{
                  backgroundColor:
                    CATEGORY_COLORS[report.category] || "#64748b",
                }}
              >
                {report.category.toLowerCase()}
              </div>
            </div>

            <div className="absolute bottom-[82px] left-1/2 flex -translate-x-1/2 items-center gap-1">
              <span className="h-[6px] w-[6px] rounded-full bg-white" />
              <span className="h-[6px] w-[6px] rounded-full bg-white/50" />
              <span className="h-[6px] w-[6px] rounded-full bg-white/50" />
            </div>

            <div className="absolute bottom-3 left-4 right-4 text-white">
              <div className="mb-1.5 flex items-start justify-between gap-3">
                <h3 className="max-w-[210px] text-[14px] font-semibold leading-tight capitalize">
                  {report.title}
                </h3>
                <div className="rounded-full bg-black/45 px-3 py-1 text-xs font-medium lowercase leading-none">
                  {report.status}
                </div>
              </div>

              <div className="space-y-1 text-xs font-medium text-[#d7d7d7]">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{report.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{report.date}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {visibleReports.length === 0 && (
        <div className="mb-6 rounded-[20px] border border-dashed border-gray-300 px-6 py-10 text-center text-gray-500">
          Không có đơn tiếp nhận phù hợp.
        </div>
      )}

      <div className="mt-auto flex items-center justify-center gap-2 pb-0.5 text-sm font-semibold text-[#4b4b4b]">
        <button
          type="button"
          className="rounded-md px-2 py-1 hover:bg-[#f5f5f5] hover:text-black"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={safePage === 1}
        >
          Trước
        </button>

        {pageNumbers[0] > 1 && (
          <>
            <button
              type="button"
              className="h-7 min-w-7 rounded-[6px] px-2"
              onClick={() => setPage(1)}
            >
              1
            </button>
            {pageNumbers[0] > 2 && <span className="px-1">...</span>}
          </>
        )}

        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            className={`h-7 min-w-7 rounded-[6px] px-2 ${
              safePage === pageNumber
                ? "bg-[#f5f5f5] text-black"
                : "hover:bg-[#f5f5f5]"
            }`}
            onClick={() => setPage(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}

        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <span className="px-1">...</span>
            )}
            <button
              type="button"
              className="h-7 min-w-7 rounded-[6px] px-2"
              onClick={() => setPage(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          type="button"
          className="rounded-md px-2 py-1 hover:bg-[#f5f5f5] hover:text-black"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={safePage === totalPages}
        >
          Sau
        </button>
      </div>
    </div>
  );
};

export default ReceptForm;
