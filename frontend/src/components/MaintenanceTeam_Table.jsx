import React, { useState } from 'react'
import { Search, Plus, X, Lock, Pencil, Trash2 } from 'lucide-react'

//Mock data maintenance teams
const initialMaintenanceTeams = [
    {
        id: "Team-001",
        name: "Đội A - Phản ứng nhanh",
        leader: "VLong",
        memberCount: 5,
        area: "Hải Châu",
        status: "active"
    },
    {
        id: "Team-002",
        name: "Đội B - Phản ứng nhanh",
        leader: "VLong",
        memberCount: 5,
        area: "Hải Châu",
        status: "active"
    },
    {
        id: "Team-003",
        name: "Đội C - Phản ứng nhanh",
        leader: "VLong",
        memberCount: 4,
        area: "Hải Châu",
        status: "active"
    },
    {
        id: "Team-004",
        name: "Đội D - Phản ứng nhanh",
        leader: "VLong",
        memberCount: 4,
        area: "Hải Châu",
        status: "active"
    },
    {
        id: "Team-005",
        name: "Đội E - Phản ứng nhanh",
        leader: "VLong",
        memberCount: 3,
        area: "Hải Châu",
        status: "inactive"
    },
    {
        id: "Team-006",
        name: "Đội F - Phản ứng nhanh",
        leader: "VLong",
        memberCount: 3,
        area: "Hải Châu",
        status: "inactive"
    },
    {
        id: "Team-007",
        name: "Đội G - Phản ứng nhanh",
        leader: "VLong",
        memberCount: 3,
        area: "Hải Châu",
        status: "inactive"
    },
    {
        id: "Team-008",
        name: "Đội H - Phản ứng nhanh",
        leader: "VLong",
        memberCount: 2,
        area: "Hải Châu",
        status: "inactive"
    },
];

const AREA_OPTIONS = [
    { value: "", label: "Tất cả khu vực" },
    { value: "Sơn Trà", label: "Sơn Trà" },
    { value: "Liên Chiểu", label: "Liên Chiểu" },
    { value: "Hải Châu", label: "Hải Châu" },
    { value: "Hòa Xuân", label: "Hòa Xuân" },
    { value: "Khuê Trung", label: "Khuê Trung" },
];

const STATUS_OPTIONS = [
    { value: "", label: "Tất cả trạng thái" },
    { value: "active", label: "Hoạt Động" },
    { value: "inactive", label: "Bị Khóa" },
];

const statusStyle = {
    active: "bg-blue-100 text-blue-800",
    inactive: "bg-amber-100 text-amber-800"
};

const MaintenanceTeam_Table = () => {
  const [teams, setTeams] = useState(initialMaintenanceTeams);
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    leader: "",
    memberCount: 1,
    area: "Hải Châu",
    status: "active",
  });

  const handleAddTeam = () => {
    if (formData.name && formData.leader && formData.id) {
      const newTeam = {
        ...formData,
        memberCount: parseInt(formData.memberCount) || 1
      };
      setTeams([...teams, newTeam]);
      setShowAddModal(false);
      setFormData({
        id: "",
        name: "",
        leader: "",
        memberCount: 1,
        area: "Hải Châu",
        status: "active",
      });
    }
  };

  const handleEditClick = (team) => {
    setEditingTeam(team);
    setFormData(team);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (editingTeam) {
      setTeams(teams.map(t => t.id === editingTeam.id ? {...formData, memberCount: parseInt(formData.memberCount) || 1} : t));
      setShowEditModal(false);
      setEditingTeam(null);
      setFormData({
        id: "",
        name: "",
        leader: "",
        memberCount: 1,
        area: "Hải Châu",
        status: "active",
      });
    }
  };

  const handleDelete = (id) => {
    setTeams(teams.filter(t => t.id !== id));
  };

  const handleToggleLock = (id) => {
    setTeams(teams.map(t => 
      t.id === id ? {...t, status: t.status === "inactive" ? "active" : "inactive"} : t
    ));
  };

  // Filter logic
  const filteredTeams = teams.filter(t => {
    return (
      (search === "" || t.name.toLowerCase().includes(search.toLowerCase()) || t.id.includes(search)) &&
      (areaFilter === "" || t.area === areaFilter) &&
      (statusFilter === "" || t.status === statusFilter)
    );
  });

  const totalPages = Math.ceil(filteredTeams.length / itemsPerPage);
  const safePage = Math.min(currentPage, totalPages || 1);
  const pageTeams = filteredTeams.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);

  const handleNext = () => {
    if (safePage < totalPages) setCurrentPage(safePage + 1);
  };

  const handlePrev = () => {
    if (safePage > 1) setCurrentPage(safePage - 1);
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
              placeholder="Tìm kiếm đội..."
              className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400"
            />
          </div>
        </div>

        {/* Filters + Add button */}
        <div className="flex flex-wrap lg:flex-nowrap gap-2 lg:gap-3">
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

          {/* Nút Thêm Đội */}
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="ml-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Thêm Đội
          </button>
        </div>
      </div>

      {/* Add Team Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Thêm Đội Xử Lý Mới</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({
                    id: "",
                    name: "",
                    leader: "",
                    memberCount: 1,
                    area: "Hải Châu",
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
                  Team ID
                </label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Nhập Team ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên Đội
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Nhập tên đội"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trưởng Đội
                </label>
                <input
                  type="text"
                  value={formData.leader}
                  onChange={(e) => setFormData({ ...formData, leader: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Nhập tên trưởng đội"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số Lượng Thành Viên
                </label>
                <input
                  type="number"
                  value={formData.memberCount}
                  onChange={(e) => setFormData({ ...formData, memberCount: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Nhập số lượng"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Khu Vực
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
                  Trạng Thái
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="active">Hoạt Động</option>
                  <option value="inactive">Bị Khóa</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({
                    id: "",
                    name: "",
                    leader: "",
                    memberCount: 1,
                    area: "Hải Châu",
                    status: "active",
                  });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleAddTeam}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Team Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Chỉnh Sửa Đội</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingTeam(null);
                  setFormData({
                    id: "",
                    name: "",
                    leader: "",
                    memberCount: 1,
                    area: "Hải Châu",
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
                  Tên Đội
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Nhập tên đội"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trưởng Đội
                </label>
                <input
                  type="text"
                  value={formData.leader}
                  onChange={(e) => setFormData({ ...formData, leader: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Nhập tên trưởng đội"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số Lượng Thành Viên
                </label>
                <input
                  type="number"
                  value={formData.memberCount}
                  onChange={(e) => setFormData({ ...formData, memberCount: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Nhập số lượng"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Khu Vực
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
                  Trạng Thái
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="active">Hoạt Động</option>
                  <option value="inactive">Bị Khóa</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingTeam(null);
                  setFormData({
                    id: "",
                    name: "",
                    leader: "",
                    memberCount: 1,
                    area: "Hải Châu",
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
              <th className="px-4 py-3 font-medium text-left">Team ID</th>
              <th className="px-4 py-3 font-medium text-left">Tên Đội</th>
              <th className="px-4 py-3 font-medium text-left">Trưởng Đội</th>
              <th className="px-4 py-3 font-medium text-left">Số Lượng</th>
              <th className="px-4 py-3 font-medium text-left">Khu Vực</th>
              <th className="px-4 py-3 font-medium text-left">Trạng Thái</th>
              <th className="px-4 py-3 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageTeams.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-6 text-center text-gray-400 text-sm"
                >
                  Không tìm thấy đội phù hợp.
                </td>
              </tr>
            )}

            {pageTeams.map((team) => (
              <tr
                key={team.id}
                className="border-t border-gray-100 hover:bg-gray-50"
              >
                <td className="px-4 py-3 font-medium text-gray-800">{team.id}</td>
                <td className="px-4 py-3 font-medium">{team.name}</td>
                <td className="px-4 py-3 whitespace-nowrap">{team.leader}</td>
                <td className="px-4 py-3">{team.memberCount}</td>
                <td className="px-4 py-3">{team.area}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      statusStyle[team.status]
                    }`}
                  >
                    {team.status === "active" ? "Hoạt Động" : "Bị Khóa"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleEditClick(team)}
                      className="text-blue-500 hover:text-blue-600"
                      title="Sửa"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleLock(team.id)}
                      className="text-amber-500 hover:text-amber-600"
                      title="Khóa / mở khóa"
                    >
                      <Lock className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(team.id)}
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
};

export default MaintenanceTeam_Table;
