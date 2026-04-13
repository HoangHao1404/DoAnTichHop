import React, { useMemo, useState } from "react";
import { Search, Plus, Building2, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const INITIAL_TYPES = [
  {
    id: 1,
    name: "Giao Thông",
    color: "#f97316",
    description: "Sự cố liên quan đến đường xá, giao thông đô thị.",
    count: 245,
  },
  {
    id: 2,
    name: "Điện",
    color: "#fdca00",
    description: "Sự cố đèn chiếu sáng và hạ tầng điện.",
    count: 156,
  },
  {
    id: 3,
    name: "Cây Xanh",
    color: "#74c365",
    description: "Sự cố cây xanh, công viên và cảnh quan.",
    count: 89,
  },
  {
    id: 4,
    name: "CTCC",
    color: "#b78ff2",
    description: "Sự cố công trình công cộng.",
    count: 132,
  },
];

const COLOR_OPTIONS = [
  "#f97316",
  "#fdca00",
  "#74c365",
  "#b78ff2",
  "#06b6d4",
  "#ef4444",
];

const IncidentManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [incidentTypes, setIncidentTypes] = useState(INITIAL_TYPES);
  const [showModal, setShowModal] = useState(false);
  const [editingIncident, setEditingIncident] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#f97316");

  const filteredIncidents = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();
    if (!keyword) return incidentTypes;

    return incidentTypes.filter((item) =>
      item.name.toLowerCase().includes(keyword),
    );
  }, [incidentTypes, searchQuery]);

  const openCreate = () => {
    setEditingIncident(null);
    setName("");
    setDescription("");
    setColor("#f97316");
    setShowModal(true);
  };

  const openEdit = (incident) => {
    setEditingIncident(incident);
    setName(incident.name || "");
    setDescription(incident.description || "");
    setColor(incident.color || "#f97316");
    setShowModal(true);
  };

  const handleSave = () => {
    if (!name.trim()) return;

    if (editingIncident) {
      setIncidentTypes((prev) =>
        prev.map((item) =>
          item.id === editingIncident.id
            ? {
                ...item,
                name: name.trim(),
                description: description.trim(),
                color,
              }
            : item,
        ),
      );
    } else {
      const nextId =
        incidentTypes.length > 0
          ? Math.max(...incidentTypes.map((item) => item.id)) + 1
          : 1;

      setIncidentTypes((prev) => [
        ...prev,
        {
          id: nextId,
          name: name.trim(),
          description: description.trim(),
          color,
          count: 0,
        },
      ]);
    }

    setShowModal(false);
  };

  const handleDelete = (incidentId) => {
    setIncidentTypes((prev) => prev.filter((item) => item.id !== incidentId));
  };

  return (
    <div className="h-full bg-transparent px-2 py-2 sm:px-3 sm:py-3">
      <div className="mx-auto flex h-full w-full max-w-[1322px] flex-col">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:w-[410px]">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={20}
            />
            <Input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Nhập tên loại sự cố để tìm kiếm"
              className="h-[50px] rounded-[10px] border-gray-200 bg-[#fcfcff] pl-10 pr-4"
            />
          </div>

          <Button
            onClick={openCreate}
            className="h-[45px] rounded-[10px] bg-blue-600 px-5 text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            Thêm Loại Sự Cố
          </Button>
        </div>

        {filteredIncidents.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filteredIncidents.map((item) => (
              <Card key={item.id} className="rounded-2xl border border-gray-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full"
                      style={{ backgroundColor: `${item.color}22` }}
                    >
                      <Building2 size={18} style={{ color: item.color }} />
                    </div>
                    <span className="text-xs font-semibold text-gray-500">
                      {item.count} báo cáo
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-gray-900">{item.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-600">{item.description}</p>

                  <div className="mt-4 flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => openEdit(item)}
                      className="h-9 rounded-lg px-3 text-sm"
                    >
                      <Pencil className="mr-1 h-4 w-4" />
                      Sửa
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleDelete(item.id)}
                      className="h-9 rounded-lg px-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Xóa
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 py-16 text-center text-gray-500">
            Không tìm thấy loại sự cố nào
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="mb-4 text-xl font-bold text-gray-800">
              {editingIncident ? "Chỉnh sửa loại sự cố" : "Thêm loại sự cố mới"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Tên loại sự cố</label>
                <Input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Nhập tên loại sự cố"
                  className="h-11"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Mô tả</label>
                <Input
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Nhập mô tả ngắn"
                  className="h-11"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Màu sắc</label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((itemColor) => (
                    <button
                      key={itemColor}
                      type="button"
                      onClick={() => setColor(itemColor)}
                      className={`h-9 w-9 rounded-full border-2 ${
                        color === itemColor ? "border-blue-500" : "border-transparent"
                      }`}
                      style={{ backgroundColor: itemColor }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                Hủy
              </Button>
              <Button type="button" onClick={handleSave}>
                Lưu
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentManagement;
