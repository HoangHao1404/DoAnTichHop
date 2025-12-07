import React, { useMemo, useState } from "react";
import { Search, Plus, Pencil, Trash2, Lock } from "lucide-react";

// Mock data – sau này thay bằng dữ liệu thật từ API
const mockUsers = [
  {
    id: "user153",
    name: "VLong",
    phone: "(308) 555-0121",
    role: "User",
    area: "Sơn Trà",
    status: "active",
  },
  {
    id: "user154",
    name: "VLong",
    phone: "(239) 555-0128",
    role: "User",
    area: "Liên Chiểu",
    status: "locked",
  },
  {
    id: "user121",
    name: "HHao",
    phone: "(308) 555-0122",
    role: "Admin",
    area: "Hòa Xuân",
    status: "active",
  },
  {
    id: "user192",
    name: "VQuoc",
    phone: "(307) 555-0138",
    role: "QTV",
    area: "Hải Châu",
    status: "active",
  },
  {
    id: "user057",
    name: "NVu",
    phone: "(252) 555-0125",
    role: "KTV",
    area: "Khuê Trung",
    status: "banned",
  },
];

const ROLE_OPTIONS = [
  { value: "all", label: "Tất cả vai trò" },
  { value: "User", label: "User" },
  { value: "Admin", label: "Admin" },
  { value: "QTV", label: "QTV" },
  { value: "KTV", label: "KTV" },
];

const AREA_OPTIONS = [
  { value: "all", label: "Tất cả khu vực" },
  { value: "Sơn Trà", label: "Sơn Trà" },
  { value: "Liên Chiểu", label: "Liên Chiểu" },
  { value: "Hải Châu", label: "Hải Châu" },
  { value: "Hòa Xuân", label: "Hòa Xuân" },
  { value: "Khuê Trung", label: "Khuê Trung" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "active", label: "Hoạt động" },
  { value: "locked", label: "Bị Khóa" },
  { value: "banned", label: "Bị Cấm" },
];

const statusStyle = {
  active: "bg-emerald-100 text-emerald-700",
  locked: "bg-amber-100 text-amber-700",
  banned: "bg-red-100 text-red-700",
};

const statusLabel = {
  active: "Hoạt Động",
  locked: "Bị Khóa",
  banned: "Bị Cấm",
};

export default function UserTable() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [areaFilter, setAreaFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredUsers = useMemo(() => {
    const text = search.toLowerCase().trim();
    return mockUsers.filter((u) => {
      const matchSearch =
        !text ||
        u.name.toLowerCase().includes(text) ||
        u.phone.toLowerCase().includes(text);

      const matchRole = roleFilter === "all" || u.role === roleFilter;
      const matchArea = areaFilter === "all" || u.area === areaFilter;
      const matchStatus = statusFilter === "all" || u.status === statusFilter;

      return matchSearch && matchRole && matchArea && matchStatus;
    });
  }, [search, roleFilter, areaFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const pageUsers = filteredUsers.slice(startIdx, startIdx + pageSize);

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="space-y-4">
      {/* Hàng filter trên cùng */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        {/* Search */}
        <div className="flex-1">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm bg-[#f8fafc] border-gray-200 text-gray-700">
            <Search className="w-4 h-4 opacity-70" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Tìm kiếm bằng tên hoặc SĐT"
              className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400"
            />
          </div>
        </div>

        {/* Droplist + button */}
        <div className="flex flex-wrap lg:flex-nowrap gap-2 lg:gap-3">
          {/* Vai trò */}
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="min-w-[150px] px-3 py-2 text-sm rounded-full border bg-white"
          >
            {ROLE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          {/* Khu vực */}
          <select
            value={areaFilter}
            onChange={(e) => {
              setAreaFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="min-w-[150px] px-3 py-2 text-sm rounded-full border bg-white"
          >
            {AREA_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          {/* Trạng thái */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="min-w-[150px] px-3 py-2 text-sm rounded-full border bg-white"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          {/* Nút Thêm User */}
          <button
            type="button"
            className="ml-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Thêm User
          </button>
        </div>
      </div>

      {/* Bảng */}
      <div className="overflow-x-auto rounded-2xl border shadow-sm bg-white border-gray-100">
        <table className="min-w-full text-sm">
          <thead className="bg-[#f9fafb] text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium text-left">ID</th>
              <th className="px-4 py-3 font-medium text-left">Tên</th>
              <th className="px-4 py-3 font-medium text-left">SĐT</th>
              <th className="px-4 py-3 font-medium text-left">Vai trò</th>
              <th className="px-4 py-3 font-medium text-left">Khu vực</th>
              <th className="px-4 py-3 font-medium text-left">Trạng thái</th>
              <th className="px-4 py-3 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageUsers.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-6 text-center text-gray-400 text-sm"
                >
                  Không tìm thấy người dùng phù hợp.
                </td>
              </tr>
            )}

            {pageUsers.map((u) => (
              <tr
                key={u.id}
                className="border-t border-gray-100 hover:bg-gray-50"
              >
                <td className="px-4 py-3 font-medium text-gray-800">{u.id}</td>

                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3 whitespace-nowrap">{u.phone}</td>
                <td className="px-4 py-3">{u.role}</td>
                <td className="px-4 py-3">{u.area}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      statusStyle[u.status]
                    }`}
                  >
                    {statusLabel[u.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      className="text-amber-500 hover:text-amber-600"
                      title="Khóa / mở khóa"
                    >
                      <Lock className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="text-blue-500 hover:text-blue-600"
                      title="Sửa"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-600"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer phân trang */}
        <div className="flex items-center justify-center gap-4 px-4 py-3 text-xs text-gray-500">
          <button
            type="button"
            onClick={handlePrev}
            disabled={safePage === 1}
            className="px-2 py-1 rounded-md border disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {"<"}
          </button>
          <span>
            {safePage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={handleNext}
            disabled={safePage === totalPages}
            className="px-2 py-1 rounded-md border disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
}
