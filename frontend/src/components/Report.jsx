import { useState, useRef, useEffect } from "react";
import {
  Camera,
  Upload,
  MapPin,
  X,
  ChevronDown,
  AlertCircle,
  Image,
} from "lucide-react";
import Toast from "./Toast";

const incidentOptions = [
  { value: "infrastructure", label: "Hạ tầng giao thông" },
  { value: "lighting", label: "Chiếu sáng công cộng" },
  { value: "environment", label: "Vệ sinh môi trường" },
  { value: "water", label: "Cấp thoát nước" },
  { value: "electricity", label: "Điện lực" },
  { value: "other", label: "Khác" },
];
function ReportForm({ onClose, autoOpenCamera = false, initialImage = null }) {
  const [title, setTitle] = useState("");
  const [incidentType, setIncidentType] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedImages, setUploadedImages] = useState(
    initialImage ? [initialImage] : []
  );
  const [location, setLocation] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const [hasFetchedLocation, setHasFetchedLocation] = useState(false);
  const [openIncidentDropdown, setOpenIncidentDropdown] = useState(false);
  const [toast, setToast] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Auto open camera khi prop autoOpenCamera = true
  useEffect(() => {
    if (autoOpenCamera) {
      openCamera();
    }
  }, [autoOpenCamera]);

  // Auto fetch location khi có initialImage
  useEffect(() => {
    if (initialImage && !hasFetchedLocation) {
      getLocation();
      setHasFetchedLocation(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialImage]);

  // ========= IMAGE + GPS =========
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // chỉ lấy vị trí nếu đây là lần đầu tiên có ảnh
    const shouldGetLocation =
      !hasFetchedLocation && uploadedImages.length === 0;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setUploadedImages((prev) => [...prev, ev.target.result]);
        if (shouldGetLocation) {
          getLocation();
          setHasFetchedLocation(true);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Lấy vị trí GPS
  const getLocation = async () => {
    if (!navigator.geolocation) {
      alert("Trình duyệt không hỗ trợ GPS");
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        console.log("GPS OK:", position);
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
            { headers: { "Accept-Language": "vi" } }
          );
          const data = await response.json();
          console.log("Reverse geocode OK:", data);

          if (data.display_name) {
            setLocation(data.display_name);
          } else {
            setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          }
        } catch (err) {
          console.error("Error reverse geocoding:", err);
          setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        }

        setLocationLoading(false);
      },
      (error) => {
        console.error("GPS error:", error);
        setLocationLoading(false);

        if (error.code === 1) {
          alert(
            "Bạn đã chặn quyền truy cập vị trí. Hãy cho phép lại trong trình duyệt (biểu tượng ổ khóa bên cạnh URL)."
          );
        } else if (error.code === 2) {
          alert(
            "Không xác định được vị trí. Vui lòng thử lại hoặc nhập địa chỉ thủ công."
          );
        } else if (error.code === 3) {
          alert(
            "Lấy vị trí quá lâu (timeout). Vui lòng thử lại hoặc nhập địa chỉ thủ công."
          );
        } else {
          alert("Không thể lấy vị trí GPS. Vui lòng nhập địa chỉ thủ công.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // ========= CAMERA =========
  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      setStream(mediaStream);
      setShowCamera(true);
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = mediaStream;
      }, 100);
    } catch (error) {
      console.error(error);
      alert("Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.");
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/jpeg");

    const shouldGetLocation =
      !hasFetchedLocation && uploadedImages.length === 0;

    setUploadedImages((prev) => [...prev, imageData]);
    if (shouldGetLocation) {
      getLocation();
      setHasFetchedLocation(true);
    }

    closeCamera();
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  // ========= FORM =========
  const resetForm = () => {
    setTitle("");
    setIncidentType("");
    setDescription("");
    setUploadedImages([]);
    setLocation("");
    setHasFetchedLocation(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !incidentType || uploadedImages.length === 0) {
      alert("Vui lòng điền đầy đủ các trường bắt buộc");
      return;
    }
    setToast({ message: "Đã gửi báo cáo thành công!", type: "success" });
    // TODO: gửi uploadedImages + data lên API
    setTimeout(() => {
      resetForm();
      onClose && onClose();
    }, 1500);
  };

  const handleCancel = () => {
    resetForm();
    onClose && onClose();
  };

  return (
    // OVERLAY popup
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "12px",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "20px",
          boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
          width: "100%",
          maxWidth: "640px",
          maxHeight: "88vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-400 px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-white text-lg sm:text-xl md:text-2xl font-semibold">
            Báo cáo sự cố
          </h1>
          <button
            onClick={handleCancel}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Nội dung */}
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Tiêu đề */}
            <div>
              <label className="block text-gray-800 font-medium mb-2 text-sm sm:text-base">
                Tiêu đề sự cố <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Mô tả ngắn gọn sự cố"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>

            {/* Loại sự cố */}
            <div>
              <label className="block text-gray-800 font-medium mb-2 text-sm sm:text-base">
                Loại sự cố <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                {/* Nút mở dropdown */}
                <button
                  type="button"
                  onClick={() => setOpenIncidentDropdown((prev) => !prev)}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl bg-white flex items-center justify-between text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    incidentType
                      ? "border-gray-300 text-gray-800"
                      : "border-gray-300 text-gray-400"
                  }`}
                >
                  <span>
                    {incidentType
                      ? incidentOptions.find((o) => o.value === incidentType)
                          ?.label
                      : "Chọn loại sự cố"}
                  </span>

                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      openIncidentDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Menu dropdown */}
                {openIncidentDropdown && (
                  <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20">
                    {incidentOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setIncidentType(opt.value);
                          setOpenIncidentDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm sm:text-base hover:bg-blue-50 ${
                          incidentType === opt.value
                            ? "bg-blue-50 font-medium"
                            : "text-gray-700"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Hình ảnh */}
            <div>
              <label className="block text-gray-800 font-medium mb-2 text-sm sm:text-base">
                Hình ảnh sự cố <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 md:p-8">
                <div className="flex flex-col items-center w-full">
                  {uploadedImages.length === 0 ? (
                    // Trạng thái chưa có ảnh
                    <div className="flex flex-col items-center mb-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                        <Image className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                      </div>
                      <h3 className="text-gray-800 font-medium mb-1 text-sm sm:text-base text-center">
                        Thêm hình ảnh sự cố
                      </h3>
                      <p className="text-gray-500 text-xs sm:text-sm mb-2 sm:mb-3 text-center px-2">
                        Chụp ảnh trực tiếp hoặc tải lên từ thiết bị
                      </p>
                    </div>
                  ) : (
                    // Grid ảnh đã tải
                    <div className="w-full mb-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {uploadedImages.map((img, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={img}
                            alt={`Uploaded ${index + 1}`}
                            className="w-full h-32 sm:h-36 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setUploadedImages((prev) =>
                                prev.filter((_, i) => i !== index)
                              )
                            }
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors opacity-90 group-hover:opacity-100"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={openCamera}
                      className="bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:bg-blue-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
                    >
                      <Camera className="w-5 h-5" />
                      <span>
                        {uploadedImages.length === 0
                          ? "Chụp ảnh"
                          : "Chụp thêm ảnh"}
                      </span>
                    </button>
                    <label className="bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:bg-blue-700 transition-colors text-sm sm:text-base w-full sm:w-auto">
                      <Upload className="w-5 h-5" />
                      <span>
                        {uploadedImages.length === 0
                          ? "Tải ảnh lên"
                          : "Thêm ảnh từ thiết bị"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Vị trí */}
            <div>
              <label className="block text-gray-800 font-medium mb-2 text-sm sm:text-base">
                Vị trí sự cố <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2 sm:space-y-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 sm:left-4 flex items-center justify-center pointer-events-none">
                    <MapPin className="w-5 h-5 text-cyan-500" />
                  </div>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Nhập vị trí sự cố (VD: 345 Hoàng Diệu, Hải Châu, Đà Nẵng)"
                    className="w-full pl-11 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base text-gray-700"
                    disabled={locationLoading}
                  />
                </div>

                <div className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-amber-700 text-xs sm:text-sm">
                    Vui lòng nhập địa chỉ chi tiết hoặc mở tính năng GPS để
                    chúng tôi có thể đến xử lý.
                  </p>
                </div>
              </div>
            </div>

            {/* Mô tả */}
            <div>
              <label className="block text-gray-800 font-medium mb-2 text-sm sm:text-base">
                Mô tả chi tiết (tùy chọn)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả chi tiết về sự cố..."
                rows={4}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 sm:gap-4 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
              >
                Gửi báo cáo
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Camera overlay giữ nguyên */}
      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-[10000] flex flex-col items-center justify-center p-4">
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

export default ReportForm;
