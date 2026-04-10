import React, { useState, useRef } from "react";
import {
  X,
  Hash,
  MapPin,
  Clock,
  Activity,
  Camera,
  CloudUpload,
  Send,
  Trash2,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export default function MaintenanceReportDetail({ isOpen, onClose, report }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen || !report) return null;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-3 backdrop-blur-sm sm:items-center sm:p-6">
      {/* Modal Container */}
      <div className="relative mx-auto my-3 flex max-h-[calc(100dvh-1.5rem)] w-full max-w-[620px] flex-col overflow-hidden rounded-[24px] bg-white p-4 shadow-2xl sm:my-0 sm:max-h-[90vh] sm:p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-1.5 border-b border-gray-50/50 pb-1.5 shrink-0">
          <h2 className="text-[18px] md:text-[20px] font-bold text-gray-900">
            Chi tiết báo cáo
          </h2>
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex h-7 w-7 p-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors focus-visible:ring-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content Body - Shrinkable */}
        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
          {/* Title Section */}
          <div className="flex flex-col items-start gap-1 shrink-0">
            <Badge className="inline-flex items-center rounded-full bg-[#FF7F1F] hover:bg-[#FF7F1F] px-2 py-0.5 h-auto border-0 text-[9px] font-semibold text-white tracking-wide shadow-sm">
              Giao Thông
            </Badge>
            <h1 className="text-[18px] md:text-[21px] font-bold text-gray-900 leading-tight">
              {report?.title || "Chi tiết sự cố"}
            </h1>
          </div>

          {/* Description Box */}
          <div className="rounded-xl bg-gray-50/80 p-2.5 border border-gray-100 shrink-0">
            <p className="text-[12px] md:text-[13px] italic leading-relaxed text-gray-600 line-clamp-2">
              Có một ổ gà lớn gây nguy hiểm cho người tham gia giao thông, đặc
              biệt là xe máy. Kích thước khoảng 50cm x 30cm, sâu khoảng 15cm.
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-x-5 gap-y-1.5 shrink-0">
            {/* Mã báo cáo */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                <Hash className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                  Mã báo cáo
                </span>
                <span className="text-[12px] md:text-[14px] font-bold text-blue-600">
                  {report?.id || "---"}
                </span>
              </div>
            </div>

            {/* Vị trí */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                  Vị trí
                </span>
                <span className="text-[12px] md:text-[13px] font-medium text-gray-900 leading-snug line-clamp-1">
                  {report?.location || "---"}
                </span>
              </div>
            </div>

            {/* Thời gian */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                <Clock className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                  Thời gian
                </span>
                <span className="text-[12px] md:text-[13px] font-medium text-gray-900">
                  {report?.time || "---"}
                </span>
              </div>
            </div>

            {/* Trạng thái */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-500">
                <Activity className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                  Trạng thái
                </span>
                <span className="text-[12px] md:text-[13px] font-bold text-[#FFB020]">
                  Đang Xử Lý
                </span>
              </div>
            </div>
          </div>

          {/* Photo Section - This block will flexibly shrink vertically if short on space */}
          <div className="mt-0 grid min-h-[130px] max-h-[240px] flex-1 grid-cols-2 gap-3 sm:min-h-[150px] sm:max-h-[260px]">
            {/* Ảnh sự cố */}
            <div className="flex flex-col h-full bg-gray-100 rounded-2xl p-2.5 flex-1 min-h-0">
              <div className="flex items-center gap-1.5 mb-1.5 px-0.5 shrink-0">
                <Camera className="h-3.5 w-3.5 text-blue-600" />
                <span className="text-[12px] font-semibold text-gray-900">
                  Ảnh Sự Cố
                </span>
              </div>
              <div className="w-full flex-1 rounded-[12px] overflow-hidden bg-gray-200 min-h-0">
                <img
                  src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=600&auto=format&fit=crop"
                  alt="Pothole"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Ảnh sau khắc phục upload */}
            <div className="flex flex-col h-full bg-gray-100 rounded-2xl p-2.5 flex-1 min-h-0">
              <div className="flex items-center justify-between mb-1.5 px-0.5 shrink-0">
                <div className="flex items-center gap-1.5">
                  <Camera className="h-3.5 w-3.5 text-blue-500" />
                  <span className="text-[12px] font-semibold text-blue-500">
                    Ảnh Sau Khắc Phục
                  </span>
                </div>
                {selectedImage && (
                  <Button
                    variant="ghost"
                    onClick={handleRemoveImage}
                    className="h-auto w-auto p-1 py-1 px-1 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Xóa ảnh"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>

              <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                accept="image/png, image/jpeg"
                onChange={handleImageUpload}
              />

              {selectedImage ? (
                <div
                  className="flex-1 w-full rounded-[12px] overflow-hidden bg-gray-200 cursor-pointer group relative border border-gray-100 min-h-0"
                  onClick={() => fileInputRef.current.click()}
                >
                  <img
                    src={selectedImage}
                    alt="Uploaded"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <CloudUpload className="h-6 w-6 text-white mb-1" />
                    <span className="text-white text-[11px] font-medium">
                      Thay đổi ảnh
                    </span>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current.click()}
                  className="flex-1 w-full h-full p-0 whitespace-normal min-h-0 rounded-[12px] border-[1.5px] border-dashed border-gray-300 bg-transparent hover:bg-gray-100/50 transition-colors flex flex-col items-center justify-center gap-1.5 group"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-500 group-hover:scale-105 transition-transform">
                    <CloudUpload className="h-4 w-4" />
                  </div>
                  <div className="text-center px-1">
                    <p className="text-[11px] font-semibold text-gray-800 mb-0.5">
                      Tải lên ảnh sau khi khắc phục
                    </p>
                    <p className="text-[9px] text-gray-500">
                      Định dạng JPG, PNG (Tối đa 10MB)
                    </p>
                  </div>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-2.5 mt-2.5 pt-3 border-t border-gray-100 shrink-0">
          <Button
            variant="ghost"
            onClick={onClose}
            className="h-auto px-4 py-2 text-[13px] md:text-[14px] font-medium text-gray-600 hover:text-gray-900 hover:bg-transparent transition-colors rounded-none bg-transparent"
          >
            Hủy
          </Button>
          <Button className="h-auto flex items-center gap-1.5 rounded-[10px] bg-[#2b6cb0] hover:bg-blue-700 px-4 md:px-5 py-2 text-[13px] md:text-[14px] font-semibold text-white shadow-md transition-all active:scale-95 border-0 hover:border-0">
            Cập nhật tiến độ
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
