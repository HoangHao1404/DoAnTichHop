import React, { useState } from "react";
import { Search, Plus, Car, Zap, TreePine, Building2 } from "lucide-react";

const IncidentManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingIncident, setEditingIncident] = useState(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#f97316");

  // Danh sách loại sự cố - chuyển thành state
  const [incidentTypes, setIncidentTypes] = useState([
    {
      id: 1,
      name: "Giao Thông",
      icon: Car,
      color: "#f97316",
      bgColor: "#fed7aa",
      count: 245,
    },
    {
      id: 2,
      name: "Điện",
      icon: Zap,
      color: "#eab308",
      bgColor: "#fef3c7",
      count: 156,
    },
    {
      id: 3,
      name: "Cây Xanh",
      icon: TreePine,
      color: "#22c55e",
      bgColor: "#bbf7d0",
      count: 89,
    },
    {
      id: 4,
      name: "Công Trình Công Cộng",
      icon: Building2,
      color: "#a855f7",
      bgColor: "#e9d5ff",
      count: 132,
    },
  ]);

  // Lọc theo search query
  const filteredIncidents = incidentTypes.filter((type) =>
    type.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle edit incident
  const handleEditClick = (incident) => {
    setEditingIncident(incident);
    setEditName(incident.name);
    setEditColor(incident.color);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    // Cập nhật dữ liệu
    setIncidentTypes(prev => prev.map(item => 
      item.id === editingIncident.id 
        ? { 
            ...item, 
            name: editName, 
            color: editColor,
            bgColor: editColor + '33' // Thêm opacity cho background
          }
        : item
    ));
    setShowEditModal(false);
    setEditingIncident(null);
  };

  // Handle add incident
  const handleAddIncident = () => {
    if (!newName.trim()) return;
    
    const newIncident = {
      id: Math.max(...incidentTypes.map(t => t.id)) + 1,
      name: newName,
      icon: Building2, // Icon mặc định
      color: newColor,
      bgColor: newColor + '33', // Thêm opacity
      count: 0,
    };
    
    setIncidentTypes(prev => [...prev, newIncident]);
    setShowAddModal(false);
    setNewName("");
    setNewColor("#f97316");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Search and Add Button */}
      <div className="mx-4 sm:mx-6 mt-4 mb-6 p-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Nhập tên loại sự cố để tìm kiếm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-96 pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Add Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors whitespace-nowrap"
          >
            <Plus size={20} />
            <span>Thêm Loại Sự Cố</span>
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="px-4 sm:px-6 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-400">
          Danh Sách Các Loại Sự Cố
        </h2>
      </div>

      {/* Incident Type Pills */}
      <div className="px-4 sm:px-6">
        {filteredIncidents.length > 0 ? (
          <div className="flex flex-wrap gap-3 sm:gap-4">
            {filteredIncidents.map((type) => (
              <button
                key={type.id}
                onClick={() => handleEditClick(type)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-full transition-all hover:shadow-md cursor-pointer"
                style={{ backgroundColor: type.bgColor }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-white"
                >
                  <type.icon size={18} style={{ color: type.color }} />
                </div>
                <span className="font-semibold text-gray-800">
                  {type.name}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Không tìm thấy loại sự cố nào
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Thêm Loại Sự Cố Mới
            </h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên loại sự cố
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Nhập tên loại sự cố"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Màu sắc
                </label>
                <div className="flex gap-3">
                  {["#f97316", "#eab308", "#22c55e", "#a855f7", "#06b6d4", "#ef4444"].map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-colors ${
                        newColor === color ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300 hover:border-blue-400'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewName("");
                  setNewColor("#f97316");
                }}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleAddIncident}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingIncident && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Chỉnh Sửa Loại Sự Cố
            </h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên loại sự cố
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Nhập tên loại sự cố"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Màu sắc
                </label>
                <div className="flex gap-3">
                  {["#f97316", "#eab308", "#22c55e", "#a855f7", "#06b6d4", "#ef4444"].map((color) => (
                    <button
                      key={color}
                      onClick={() => setEditColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-colors ${
                        editColor === color ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300 hover:border-blue-400'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingIncident(null);
                }}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentManagement;
