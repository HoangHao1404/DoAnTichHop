import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

import img1 from "../image/banner-public.jpeg";
import img2 from "../image/road.png";

const DEMO_IMAGES = [img1, img2];

export default function ReportDetail({ data, close, openRating }) {
  const [index, setIndex] = useState(0);

  if (!data) return null;

  const isDone = data.status === "Đã Giải Quyết";
  const images = DEMO_IMAGES;

  const prevImg = () =>
    setIndex((i) => (i - 1 + images.length) % images.length);
  const nextImg = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] px-3">
      {/* FORM CHI TIẾT – bo góc nhẹ */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[480px] flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="bg-blue-600 text-white py-3 px-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-lg font-bold">Chi Tiết Báo Cáo</h2>
          <button onClick={close}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY SCROLLABLE */}
        <div className="p-5 overflow-y-auto flex-1">
          {/* Loại */}
          <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs">
            {data.type}
          </span>

          {/* Tiêu đề */}
          <h1 className="text-xl font-bold mt-3">{data.title}</h1>

          {/* Mô tả */}
          <p className="text-gray-700 text-sm mt-1 leading-relaxed">
            {data.description ??
              "Một sự cố được người dân báo cáo liên quan đến cơ sở hạ tầng."}
          </p>

          <div className="h-[1px] bg-gray-200 my-4" />

          {/* INFO ROWS */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="font-semibold">Mã Báo Cáo</span>
              <span>{data.id}</span>
            </div>
            <div className="h-[1px] bg-gray-200" />

            <div className="flex justify-between">
              <span className="font-semibold">Vị Trí</span>
              <span className="max-w-[60%] text-right">{data.location}</span>
            </div>
            <div className="h-[1px] bg-gray-200" />

            <div className="flex justify-between">
              <span className="font-semibold">Thời Gian</span>
              <span>{data.time}</span>
            </div>
            <div className="h-[1px] bg-gray-200" />

            <div className="flex justify-between items-center">
              <span className="font-semibold">Trạng Thái</span>
              <span
                className={`px-3 py-1 rounded-full text-white text-xs ${
                  data.status === "Đang Chờ"
                    ? "bg-gray-500"
                    : data.status === "Đang Xử Lý"
                    ? "bg-orange-500"
                    : "bg-blue-500"
                }`}
              >
                {data.status}
              </span>
            </div>
          </div>

          <div className="h-[1px] bg-gray-200 my-4" />

          {/* IMAGE SLIDER */}
          <div className="relative w-full h-[230px] rounded-xl overflow-hidden">
            <img
              src={images[index]}
              className="w-full h-full object-cover transition-all"
              alt="ảnh sự cố"
            />

            <button
              onClick={prevImg}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={nextImg}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* FOOTER BUTTON FIXED */}
        <div className="p-4 border-t bg-white flex-shrink-0 rounded-b-2xl">
          <button
            disabled={!isDone}
            onClick={openRating}
            className={`w-full py-3 rounded-xl text-sm font-semibold ${
              isDone
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            Đánh Giá
          </button>
        </div>
      </div>
    </div>
  );
}
