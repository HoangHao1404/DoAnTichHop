import React, { useCallback, useEffect, useState } from "react";
import { Search, Plus, X, Lock, Pencil, Trash2 } from "lucide-react";
import { maintenanceTeamApi } from "../services/api/maintenanceTeamApi";

const AREA_OPTIONS = [
    { value: "", label: "Táº¥t cáº£ khu vá»±c" },
    { value: "SÆ¡n TrÃ ", label: "SÆ¡n TrÃ " },
    { value: "LiÃªn Chiá»ƒu", label: "LiÃªn Chiá»ƒu" },
    { value: "Háº£i ChÃ¢u", label: "Háº£i ChÃ¢u" },
    { value: "HÃ²a XuÃ¢n", label: "HÃ²a XuÃ¢n" },
    { value: "KhuÃª Trung", label: "KhuÃª Trung" },
];

const STATUS_OPTIONS = [
    { value: "", label: "Táº¥t cáº£ tráº¡ng thÃ¡i" },
    { value: "active", label: "Hoáº¡t Äá»™ng" },
    { value: "inactive", label: "Bá»‹ KhÃ³a" },
];

const statusStyle = {
    active: "bg-blue-100 text-blue-800",
    inactive: "bg-amber-100 text-amber-800"
};

const emptyForm = {
  id: "",
  name: "",
  leader: "",
  memberCount: 1,
  area: "Háº£i ChÃ¢u",
  status: "active",
};

const normalizeTeam = (team) => ({
  id: team.team_id || team.id,
  name: team.name || "",
  leader: team.leader || "",
  memberCount: team.memberCount ?? team.member_count ?? 1,
  area: team.area || "",
  status: team.status || "active",
});

const MaintenanceTeam_Table = () => {
  const [teams, setTeams] = useState([]);
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const itemsPerPage = 10;

  const [formData, setFormData] = useState(emptyForm);

  const fetchTeams = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await maintenanceTeamApi.getTeams({
        search,
        area: areaFilter || "all",
        status: statusFilter || "all",
        page: currentPage,
        limit: itemsPerPage,
      });

      setTeams((response?.data || []).map(normalizeTeam));
      setTotalPages(response?.pagination?.totalPages || 1);
    } catch (error) {
      setTeams([]);
      setTotalPages(1);
      setErrorMessage(
        error?.response?.data?.message || "KhÃ´ng táº£i Ä‘Æ°á»£c danh sÃ¡ch Ä‘á»™i xá»­ lÃ½"
      );
    } finally {
      setLoading(false);
    }
  }, [search, areaFilter, statusFilter, currentPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTeams();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchTeams]);

  const handleAddTeam = async () => {
    try {
      if (!formData.name || !formData.leader || !formData.id) {
        return;
      }

      await maintenanceTeamApi.createTeam({
        id: formData.id,
        name: formData.name,
        leader: formData.leader,
        memberCount: parseInt(formData.memberCount, 10) || 1,
        area: formData.area,
        status: formData.status,
      });

      setShowAddModal(false);
      setFormData(emptyForm);
      await fetchTeams();
    } catch (error) {
      alert(error?.response?.data?.message || "KhÃ´ng thá»ƒ thÃªm Ä‘á»™i xá»­ lÃ½");
    }
  };

  const handleEditClick = (team) => {
    setEditingTeam(team);
    setFormData(team);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      if (!editingTeam) {
        return;
      }

      await maintenanceTeamApi.updateTeam(editingTeam.id, {
        name: formData.name,
        leader: formData.leader,
        memberCount: parseInt(formData.memberCount, 10) || 1,
        area: formData.area,
        status: formData.status,
      });

      setShowEditModal(false);
      setEditingTeam(null);
      setFormData(emptyForm);
      await fetchTeams();
    } catch (error) {
      alert(error?.response?.data?.message || "KhÃ´ng thá»ƒ cáº­p nháº­t Ä‘á»™i xá»­ lÃ½");
    }
  };

  const handleDelete = async (id) => {
    try {
      if (!window.confirm("Báº¡n cÃ³ cháº¯c muá»‘n xÃ³a Ä‘á»™i xá»­ lÃ½ nÃ y?")) {
        return;
      }
      await maintenanceTeamApi.deleteTeam(id);
      await fetchTeams();
    } catch (error) {
      alert(error?.response?.data?.message || "KhÃ´ng thá»ƒ xÃ³a Ä‘á»™i xá»­ lÃ½");
    }
  };

  const handleToggleLock = async (id, currentStatus) => {
    try {
      const nextStatus = currentStatus === "inactive" ? "active" : "inactive";
      await maintenanceTeamApi.updateTeamStatus(id, nextStatus);
      await fetchTeams();
    } catch (error) {
      alert(error?.response?.data?.message || "KhÃ´ng thá»ƒ Ä‘á»•i tráº¡ng thÃ¡i Ä‘á»™i xá»­ lÃ½");
    }
  };

  const safePage = Math.min(currentPage, totalPages || 1);
  const pageTeams = teams;

  const handleNext = () => {
    if (safePage < totalPages) setCurrentPage(safePage + 1);
  };

  const handlePrev = () => {
    if (safePage > 1) setCurrentPage(safePage - 1);
  };

  return (
    <div className="space-y-4">
      {/* HÃ ng filter trÃªn cÃ¹ng */}
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
              placeholder="TÃ¬m kiáº¿m Ä‘á»™i..."
              className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400"
            />
          </div>
        </div>

        {/* Filters + Add button */}
        <div className="flex flex-wrap lg:flex-nowrap gap-2 lg:gap-3">
          {/* Khu vá»±c */}
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

          {/* Tráº¡ng thÃ¡i */}
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

          {/* NÃºt ThÃªm Äá»™i */}
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="ml-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            ThÃªm Äá»™i
          </button>
        </div>
      </div>

      {/* Add Team Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">ThÃªm Äá»™i Xá»­ LÃ½ Má»›i</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormData(emptyForm);
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
                  placeholder="Nháº­p Team ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  TÃªn Äá»™i
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Nháº­p tÃªn Ä‘á»™i"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  TrÆ°á»Ÿng Äá»™i
                </label>
                <input
                  type="text"
                  value={formData.leader}
                  onChange={(e) => setFormData({ ...formData, leader: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Nháº­p tÃªn trÆ°á»Ÿng Ä‘á»™i"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sá»‘ LÆ°á»£ng ThÃ nh ViÃªn
                </label>
                <input
                  type="number"
                  value={formData.memberCount}
                  onChange={(e) => setFormData({ ...formData, memberCount: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Nháº­p sá»‘ lÆ°á»£ng"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Khu Vá»±c
                </label>
                <select
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="SÆ¡n TrÃ ">SÆ¡n TrÃ </option>
                  <option value="LiÃªn Chiá»ƒu">LiÃªn Chiá»ƒu</option>
                  <option value="Háº£i ChÃ¢u">Háº£i ChÃ¢u</option>
                  <option value="HÃ²a XuÃ¢n">HÃ²a XuÃ¢n</option>
                  <option value="KhuÃª Trung">KhuÃª Trung</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tráº¡ng ThÃ¡i
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="active">Hoáº¡t Äá»™ng</option>
                  <option value="inactive">Bá»‹ KhÃ³a</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormData(emptyForm);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Há»§y
              </button>
              <button
                onClick={handleAddTeam}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                ThÃªm
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
              <h3 className="text-lg font-semibold text-gray-800">Chá»‰nh Sá»­a Äá»™i</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingTeam(null);
                  setFormData(emptyForm);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  TÃªn Äá»™i
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Nháº­p tÃªn Ä‘á»™i"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  TrÆ°á»Ÿng Äá»™i
                </label>
                <input
                  type="text"
                  value={formData.leader}
                  onChange={(e) => setFormData({ ...formData, leader: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Nháº­p tÃªn trÆ°á»Ÿng Ä‘á»™i"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sá»‘ LÆ°á»£ng ThÃ nh ViÃªn
                </label>
                <input
                  type="number"
                  value={formData.memberCount}
                  onChange={(e) => setFormData({ ...formData, memberCount: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Nháº­p sá»‘ lÆ°á»£ng"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Khu Vá»±c
                </label>
                <select
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="SÆ¡n TrÃ ">SÆ¡n TrÃ </option>
                  <option value="LiÃªn Chiá»ƒu">LiÃªn Chiá»ƒu</option>
                  <option value="Háº£i ChÃ¢u">Háº£i ChÃ¢u</option>
                  <option value="HÃ²a XuÃ¢n">HÃ²a XuÃ¢n</option>
                  <option value="KhuÃª Trung">KhuÃª Trung</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tráº¡ng ThÃ¡i
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="active">Hoáº¡t Äá»™ng</option>
                  <option value="inactive">Bá»‹ KhÃ³a</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingTeam(null);
                  setFormData(emptyForm);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Há»§y
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                LÆ°u
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Báº£ng */}
      <div className="overflow-x-auto rounded-2xl border shadow-sm bg-white border-gray-100">
        <table className="min-w-full text-sm">
          <thead className="bg-[#f9fafb] text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium text-left">Team ID</th>
              <th className="px-4 py-3 font-medium text-left">TÃªn Äá»™i</th>
              <th className="px-4 py-3 font-medium text-left">TrÆ°á»Ÿng Äá»™i</th>
              <th className="px-4 py-3 font-medium text-left">Sá»‘ LÆ°á»£ng</th>
              <th className="px-4 py-3 font-medium text-left">Khu Vá»±c</th>
              <th className="px-4 py-3 font-medium text-left">Tráº¡ng ThÃ¡i</th>
              <th className="px-4 py-3 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-6 text-center text-gray-400 text-sm"
                >
                  Äang táº£i dá»¯ liá»‡u...
                </td>
              </tr>
            )}

            {!loading && pageTeams.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-6 text-center text-gray-400 text-sm"
                >
                  {errorMessage || "KhÃ´ng tÃ¬m tháº¥y Ä‘á»™i phÃ¹ há»£p."}
                </td>
              </tr>
            )}

            {!loading && pageTeams.map((team) => (
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
                    {team.status === "active" ? "Hoáº¡t Äá»™ng" : "Bá»‹ KhÃ³a"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleEditClick(team)}
                      className="text-blue-500 hover:text-blue-600"
                      title="Sá»­a"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleLock(team.id, team.status)}
                      className="text-amber-500 hover:text-amber-600"
                      title="KhÃ³a / má»Ÿ khÃ³a"
                    >
                      <Lock className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(team.id)}
                      className="text-red-500 hover:text-red-600"
                      title="XÃ³a"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer phÃ¢n trang */}
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
