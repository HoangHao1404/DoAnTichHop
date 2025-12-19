import React, { useMemo, useState } from "react";
import { Search, Plus, Pencil, Trash2, Lock, X } from "lucide-react";

// Mock data – sau này thay bằng dữ liệu thật từ API
const initialUsers = [
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
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [areaFilter, setAreaFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    role: "User",
    area: "Sơn Trà",
    status: "active",
  });

  const filteredUsers = useMemo(() => {
    const text = search.toLowerCase().trim();
    return users.filter((u) => {
      const matchSearch =
        !text ||
        u.name.toLowerCase().includes(text) ||
        u.phone.toLowerCase().includes(text);

      const matchRole = roleFilter === "all" || u.role === roleFilter;
      const matchArea = areaFilter === "all" || u.area === areaFilter;
      const matchStatus = statusFilter === "all" || u.status === statusFilter;

      return matchSearch && matchRole && matchArea && matchStatus;
    });
  }, [search, roleFilter, areaFilter, statusFilter, users]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const pageUsers = filteredUsers.slice(startIdx, startIdx + pageSize);

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  // Handle Add User
  const handleAddUser = () => {
    const newId = `user${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`;
    const newUser = {
      id: newId,
      ...formData,
    };
    setUsers((prev) => [...prev, newUser]);
    setShowAddModal(false);
    setFormData({
      name: "",
      phone: "",
      role: "User",
      area: "Sơn Trà",
      status: "active",
    });
  };

  // Handle Edit User
  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      phone: user.phone,
      role: user.role,
      area: user.area,
      status: user.status,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === editingUser.id
          ? { ...u, ...formData }
          : u
      )
    );
    setShowEditModal(false);
    setEditingUser(null);
    setFormData({
      name: "",
      phone: "",
      role: "User",
      area: "Sơn Trà",
      status: "active",
    });
  };

  // Handle Delete User
  const handleDelete = (userId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    }
  };

  // Handle Lock/Unlock User
  const handleToggleLock = (userId) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            status: u.status === "active" ? "locked" : "active",
          };
        }
        return u;
      })
    );
  };

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
            onClick={() => setShowAddModal(true)}
            className="ml-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Thêm User
          </button>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Thêm User Mới</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({
                    name: "",
                    phone: "",
                    role: "User",
                    area: "Sơn Trà",
                    status: "active",
                  });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Nhập tên"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="(xxx) xxx-xxxx"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vai trò
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                  <option value="QTV">QTV</option>
                  <option value="KTV">KTV</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Khu vực
                </label>
                <select
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="Sơn Trà">Sơn Trà</option>
                  <option value="Liên Chiểu">Liên Chiểu</option>
                  <option value="Hải Châu">Hải Châu</option>
                  <option value="Hòa Xuân">Hòa Xuân</option>
                  <option value="Khuê Trung">Khuê Trung</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="active">Hoạt động</option>
                  <option value="locked">Bị Khóa</option>
                  <option value="banned">Bị Cấm</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({
                    name: "",
                    phone: "",
                    role: "User",
                    area: "Sơn Trà",
                    status: "active",
                  });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleAddUser}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Chỉnh Sửa User</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingUser(null);
                  setFormData({
                    name: "",
                    phone: "",
                    role: "User",
                    area: "Sơn Trà",
                    status: "active",
                  });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Nhập tên"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="(xxx) xxx-xxxx"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vai trò
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                  <option value="QTV">QTV</option>
                  <option value="KTV">KTV</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Khu vực
                </label>
                <select
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="Sơn Trà">Sơn Trà</option>
                  <option value="Liên Chiểu">Liên Chiểu</option>
                  <option value="Hải Châu">Hải Châu</option>
                  <option value="Hòa Xuân">Hòa Xuân</option>
                  <option value="Khuê Trung">Khuê Trung</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="active">Hoạt động</option>
                  <option value="locked">Bị Khóa</option>
                  <option value="banned">Bị Cấm</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingUser(null);
                  setFormData({
                    name: "",
                    phone: "",
                    role: "User",
                    area: "Sơn Trà",
                    status: "active",
                  });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

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
                      onClick={() => handleToggleLock(u.id)}
                      className="text-amber-500 hover:text-amber-600"
                      title="Khóa / mở khóa"
                    >
                      <Lock className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditClick(u)}
                      className="text-blue-500 hover:text-blue-600"
                      title="Sửa"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(u.id)}
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
