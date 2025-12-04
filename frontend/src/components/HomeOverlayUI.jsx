import React, { useState, useRef } from "react";
import {
  CircleUserRound,
  Search,
  TrafficCone,
  Zap,
  TreePine,
  Building2,
  House,
  Megaphone,
  Plus,
  Camera,
  X,
} from "lucide-react";
import ReportForm from "./Report";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    id: "traffic",
    name: "Giao Thông",
    icon: <TrafficCone size={18} />,
    bgColor: "#fed7aa",
    textColor: "#9a3412",
    activeBgColor: "#f97316",
  },
  {
    id: "electric",
    name: "Điện",
    icon: <Zap size={18} />,
    bgColor: "#fef3c7",
    textColor: "#854d0e",
    activeBgColor: "#eab308",
  },
  {
    id: "tree",
    name: "Cây Xanh",
    icon: <TreePine size={18} />,
    bgColor: "#dcfce7",
    textColor: "#166534",
    activeBgColor: "#22c55e",
  },
  {
    id: "public",
    name: "Công Trình",
    icon: <Building2 size={18} />,
    bgColor: "#f3e8ff",
    textColor: "#6b21a8",
    activeBgColor: "#a855f7",
  },
];

export default function HomeOverlayUI({
  selectedCategory,
  setSelectedCategory,
  userAvatar,
  userName,
}) {
  const navigate = useNavigate();
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [showCameraOnly, setShowCameraOnly] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Mở camera
  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      setStream(mediaStream);
      setShowCameraOnly(true);
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = mediaStream;
      }, 100);
    } catch (error) {
      console.error(error);
      alert("Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.");
    }
  };

  // Đóng camera
  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setShowCameraOnly(false);
  };

  // Chụp ảnh
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/jpeg");
    
    // Đóng camera, lưu ảnh và mở form Report
    closeCamera();
    setCapturedImage(imageData);
    setIsReportOpen(true);
  };

  return (
    <>
      <div className="app-map-overlay">
        {/* HEADER: Avatar - Search - Categories */}
        <div className="interactive px-2 sm:px-3 md:px-4 pt-2 sm:pt-3 md:pt-4 lg:pt-6 ml-0 sm:ml-2 md:ml-4 lg:ml-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 sm:gap-3 md:gap-4 w-full ml-0 sm:ml-[15px]">
            {/* Avatar */}
            <button
              onClick={() => console.log("Open profile")}
              className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 border-orange-500 overflow-hidden shrink-0"
            >
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName || "User"}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <CircleUserRound
                  size={20}
                  className="text-orange-500 flex-shrink-0 sm:w-6 sm:h-6"
                />
              )}
            </button>

            {/* Search box */}
            <div className="flex items-center bg-white rounded-full shadow px-2 sm:px-3 md:px-4 h-8 sm:h-9 md:h-10 w-full md:w-auto md:min-w-[280px] md:max-w-[450px]">
              <Search size={16} className="text-gray-500 mr-1 sm:mr-2 sm:w-5 sm:h-5" />
              <input
                className="flex-1 bg-transparent outline-none text-sm sm:text-base"
                placeholder="Tìm kiếm địa điểm"
                type="text"
              />
            </div>

            {/* Categories row */}
            <div className="flex gap-1.5 sm:gap-2 ml-0 md:ml-3 overflow-x-auto pb-1 sm:pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`flex items-center gap-1 sm:gap-1.5 md:gap-2 px-2 sm:px-3 md:px-4 h-7 sm:h-8 md:h-9 lg:h-10 rounded-full text-[10px] sm:text-xs md:text-sm font-medium transition-all whitespace-nowrap
                  ${
                    selectedCategory === "all"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700"
                  }`}
              >
                <span className="icon-wrap">📍</span>
                Tất cả
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className="flex items-center gap-1 sm:gap-1.5 md:gap-2 px-2 sm:px-3 md:px-4 h-7 sm:h-8 md:h-9 lg:h-10 rounded-full text-[10px] sm:text-xs md:text-sm font-medium transition-all whitespace-nowrap shadow-md"
                  style={{
                    backgroundColor:
                      selectedCategory === c.id ? c.activeBgColor : c.bgColor,
                    color:
                      selectedCategory === c.id ? "#ffffff" : c.textColor,
                  }}
                >
                  <span className="icon-wrap">{c.icon}</span>
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* bottom nav */}
        <div className="interactive absolute left-0 right-0 bottom-5 flex justify-center">
          <div className="bottom-nav">
            <button
              onClick={() => navigate("/")}
              className="flex flex-col items-center bg-transparent border-0 text-inherit cursor-pointer transition-opacity hover:opacity-70"
            >
              <House size={20} />
              <div className="text-xs">Home</div>
            </button>
            <button
              onClick={() => navigate("/myreport")}
              className="flex flex-col items-center bg-transparent border-0 text-inherit cursor-pointer transition-opacity hover:opacity-70"
            >
              <Megaphone size={20} />
              <div className="text-xs">Báo Cáo của tôi</div>
            </button>
          </div>
        </div>

        {/* floating buttons */}
        <div className="interactive">
          {/* Plus: mở / tắt popup */}
          <button
            className="fab fixed md:absolute w-12 h-12 sm:w-14 sm:h-14 md:w-14 md:h-14"
            style={{
              right: "8px",
              bottom: "80px",
              background: "#2563EB",
              color: "#fff",
            }}
            onClick={() => setIsReportOpen((prev) => !prev)}
          >
            <Plus size={18} className="sm:w-5 sm:h-5" />
          </button>

          <button
            className="fab fixed md:absolute w-12 h-12 sm:w-14 sm:h-14 md:w-14 md:h-14"
            style={{
              right: "8px",
              bottom: "12px",
              background: "#2563EB",
              color: "#fff",
            }}
            onClick={openCamera}
          >
            <Camera size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>

        {/* FORM POPUP: phải bọc trong .interactive để click được */}
        {isReportOpen && (
          <div className="interactive">
            <ReportForm 
              onClose={() => {
                setIsReportOpen(false);
                setCapturedImage(null);
              }} 
              initialImage={capturedImage}
            />
          </div>
        )}

        {/* CAMERA MODAL - Chỉ hiển thị màn hình camera */}
        {showCameraOnly && (
          <div className="interactive fixed inset-0 bg-black bg-opacity-90 z-[10000] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl">
              <div className="bg-white rounded-t-lg p-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Chụp ảnh sự cố</h2>
                <button
                  onClick={closeCamera}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="relative bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-auto max-h-[60vh] object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>

              <div className="bg-white rounded-b-lg p-4">
                <button
                  onClick={capturePhoto}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors font-medium"
                >
                  <Camera className="w-5 h-5" />
                  <span>Chụp ảnh</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
