import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  Upload,
  MapPin,
  X,
  AlertCircle,
  CloudUpload,
} from "lucide-react";
import Toast from "./Toast";
import { reportApi } from "../services/api/reportApi";
import incidentApi from "../services/api/incidentApi";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const LEGACY_INCIDENT_OPTIONS = [
  { value: "Giao Thông", label: "Giao Thông" },
  { value: "Điện", label: "Điện" },
  { value: "Cây Xanh", label: "Cây Xanh" },
  { value: "CTCC", label: "CTCC" },
];

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png"]);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MIN_IMAGES = 3;
const MAX_IMAGES = 5;

function ReportForm({ onClose, autoOpenCamera = false, initialImage = null }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [incidentType, setIncidentType] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedImages, setUploadedImages] = useState(
    initialImage ? [initialImage] : [],
  );
  const [location, setLocation] = useState("");
  const [gpsCoordinates, setGpsCoordinates] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [incidentOptions, setIncidentOptions] = useState(
    LEGACY_INCIDENT_OPTIONS,
  );
  const [incidentTypeLoading, setIncidentTypeLoading] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const [hasFetchedLocation, setHasFetchedLocation] = useState(false);
  const [toast, setToast] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (autoOpenCamera) {
      openCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoOpenCamera]);

  useEffect(() => {
    const fetchIncidentTypes = async () => {
      try {
        setIncidentTypeLoading(true);
        const response = await incidentApi.getIncidentTypes();

        if (response?.success && Array.isArray(response.data)) {
          const activeOptions = response.data
            .filter((item) => item?.active !== false)
            .map((item) => ({
              value: item.name,
              label: item.name,
            }));

          setIncidentOptions(activeOptions);
          return;
        }

        setIncidentOptions(LEGACY_INCIDENT_OPTIONS);
      } catch (error) {
        console.error("Failed to fetch incident types:", error);
        setIncidentOptions(LEGACY_INCIDENT_OPTIONS);
      } finally {
        setIncidentTypeLoading(false);
      }
    };

    fetchIncidentTypes();
  }, []);

  useEffect(() => {
    if (
      incidentType &&
      !incidentOptions.some((option) => option.value === incidentType)
    ) {
      setIncidentType("");
    }
  }, [incidentType, incidentOptions]);

  useEffect(() => {
    if (!hasFetchedLocation && !location) {
      setHasFetchedLocation(true);
      getLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasFetchedLocation, location]);

  const showErrorToast = (message) => {
    setToast({ message, type: "error" });
  };

  const showSuccessToast = (message) => {
    setToast({ message, type: "success" });
  };

  const validateFiles = (files) => {
    const currentCount = uploadedImages.length;
    const remainingSlots = MAX_IMAGES - currentCount;

    if (remainingSlots <= 0) {
      showErrorToast(`Bạn chỉ được tải tối đa ${MAX_IMAGES} ảnh.`);
      return [];
    }

    const selectedFiles = Array.from(files || []).slice(0, remainingSlots);
    const validFiles = [];

    for (const file of selectedFiles) {
      if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
        showErrorToast(`File "${file.name}" phải là JPG hoặc PNG.`);
        continue;
      }

      if (file.size > MAX_IMAGE_BYTES) {
        showErrorToast(`Ảnh "${file.name}" vượt quá 5MB.`);
        continue;
      }

      validFiles.push(file);
    }

    return validFiles;
  };

  const convertFilesToBase64 = (files) => {
    return Promise.all(
      files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (ev) => resolve(ev.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          }),
      ),
    );
  };

  const validateBase64ImagesForSubmit = (images) => {
    for (let i = 0; i < images.length; i += 1) {
      const image = images[i];
      if (typeof image !== "string" || !image.trim()) {
        showErrorToast(`Ảnh thứ ${i + 1} không hợp lệ.`);
        return false;
      }

      const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/i.exec(
        image.trim(),
      );
      if (!match) {
        showErrorToast(`Ảnh thứ ${i + 1} phải ở định dạng JPG/PNG.`);
        return false;
      }

      const mimeType = match[1].toLowerCase();
      if (!ALLOWED_IMAGE_TYPES.has(mimeType)) {
        showErrorToast(`Ảnh thứ ${i + 1} phải là JPG hoặc PNG.`);
        return false;
      }

      const base64Payload = match[2].replace(/\s/g, "");
      const bytes = Math.floor((base64Payload.length * 3) / 4);
      if (bytes > MAX_IMAGE_BYTES) {
        showErrorToast(`Ảnh thứ ${i + 1} vượt quá 5MB.`);
        return false;
      }
    }

    return true;
  };

  // Upload ảnh chỉ thêm ảnh, vị trí hiện tại đã được lấy tự động khi mở form
  const handleImageUpload = async (e) => {
    const files = validateFiles(e.target.files || []);
    if (!files.length) return;

    try {
      const base64Images = await convertFilesToBase64(files);
      setUploadedImages((prev) => [...prev, ...base64Images]);
    } catch (error) {
      console.error("Error reading files:", error);
      showErrorToast("Không thể đọc ảnh tải lên.");
    } finally {
      if (e.target) e.target.value = "";
    }
  };

  const handleDropFiles = async (files) => {
    const validFiles = validateFiles(files);
    if (!validFiles.length) return;

    try {
      const base64Images = await convertFilesToBase64(validFiles);
      setUploadedImages((prev) => [...prev, ...base64Images]);
    } catch (error) {
      console.error("Error reading dropped files:", error);
      showErrorToast("Không thể đọc ảnh kéo thả.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer?.files;
    if (files?.length) {
      await handleDropFiles(files);
    }
  };

  const removeImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const isCoordinateString = (value) => {
    if (!value || typeof value !== "string") return false;
    return /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/.test(value.trim());
  };

  const resolveAddress = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `/api/geocode/reverse?lat=${latitude}&lon=${longitude}`,
      );

      if (response.ok) {
        const result = await response.json();
        const candidates = [
          result?.data?.address,
          result?.data?.fullAddress,
          result?.data?.details?.display_name,
        ].filter((item) => typeof item === "string" && item.trim().length > 0);

        const address = candidates.find((item) => !isCoordinateString(item));
        if (address) {
          return address;
        }
      }
    } catch (error) {
      console.error("Backend reverse geocode failed:", error);
    }

    try {
      const nominatimResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=vi`,
      );

      if (nominatimResponse.ok) {
        const nominatimData = await nominatimResponse.json();
        if (nominatimData?.display_name) {
          return nominatimData.display_name;
        }
      }
    } catch (error) {
      console.error("Direct Nominatim reverse geocode failed:", error);
    }

    return "";
  };

  const getLocation = async () => {
    if (!navigator.geolocation) {
      alert("Trình duyệt không hỗ trợ GPS");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setGpsCoordinates({ latitude, longitude });

        try {
          const address = await resolveAddress(latitude, longitude);
          if (address) {
            setLocation(address);
          } else {
            showErrorToast(
              "Không thể tự động lấy địa chỉ cụ thể. Vui lòng nhập vị trí thủ công.",
            );
          }
        } catch (err) {
          console.error("Error getting address:", err);
          showErrorToast("Không thể lấy địa chỉ. Vui lòng nhập thủ công.");
        }

        setLocationLoading(false);
      },
      (error) => {
        console.error("GPS error:", error);
        setLocationLoading(false);

        if (error.code === 1) {
          alert(
            "Bạn đã chặn quyền truy cập vị trí. Hãy cho phép lại trong trình duyệt (biểu tượng ổ khóa bên cạnh URL).",
          );
        } else if (error.code === 2) {
          alert(
            "Không xác định được vị trí. Vui lòng thử lại hoặc nhập địa chỉ thủ công.",
          );
        } else if (error.code === 3) {
          alert(
            "Lấy vị trí quá lâu (timeout). Vui lòng thử lại hoặc nhập địa chỉ thủ công.",
          );
        } else {
          alert("Không thể lấy vị trí GPS. Vui lòng nhập địa chỉ thủ công.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  const openCamera = async () => {
    try {
      if (uploadedImages.length >= MAX_IMAGES) {
        showErrorToast(`Bạn chỉ được tải tối đa ${MAX_IMAGES} ảnh.`);
        return;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });

      setStream(mediaStream);
      setShowCamera(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);
    } catch (error) {
      console.error(error);
      alert("Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.");
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    if (uploadedImages.length >= MAX_IMAGES) {
      showErrorToast(`Bạn chỉ được tải tối đa ${MAX_IMAGES} ảnh.`);
      return;
    }

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
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const resetForm = () => {
    setTitle("");
    setIncidentType("");
    setDescription("");
    setUploadedImages([]);
    setLocation("");
    setGpsCoordinates(null);
    setHasFetchedLocation(false);
    setDragActive(false);
  };

  const handleCancel = () => {
    closeCamera();
    resetForm();
    onClose && onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle || !incidentType) {
      alert("Vui lòng điền đầy đủ các trường bắt buộc");
      return;
    }

    if (trimmedDescription.length < 10 || trimmedDescription.length > 100) {
      showErrorToast("Mô tả phải từ 10 đến 100 ký tự.");
      return;
    }

    if (
      uploadedImages.length < MIN_IMAGES ||
      uploadedImages.length > MAX_IMAGES
    ) {
      showErrorToast(`Bạn cần tải từ ${MIN_IMAGES} đến ${MAX_IMAGES} ảnh.`);
      return;
    }

    if (!validateBase64ImagesForSubmit(uploadedImages)) {
      return;
    }

    if (!location && !gpsCoordinates) {
      alert("Vui lòng nhập vị trí hoặc cho phép truy cập GPS");
      return;
    }

    const userId = user?._id || user?.user_id;
    if (!userId) {
      alert("Bạn cần đăng nhập để gửi báo cáo");
      return;
    }

    try {
      const reportData = {
        userId,
        title: trimmedTitle,
        type: incidentType,
        location: gpsCoordinates
          ? `${gpsCoordinates.latitude}, ${gpsCoordinates.longitude}${location ? ` (${location})` : ""}`
          : location,
        latitude: gpsCoordinates?.latitude,
        longitude: gpsCoordinates?.longitude,
        description: trimmedDescription,
        images: uploadedImages,
      };

      const response = await reportApi.createReport(reportData);

      if (response.success) {
        showSuccessToast("Đã gửi báo cáo thành công!");
        setTimeout(() => {
          resetForm();
          onClose && onClose();
          navigate("/myreport", { replace: true });
        }, 1500);
      } else {
        showErrorToast("Gửi báo cáo thất bại!");
      }
    } catch (error) {
      console.error("Error creating report:", error);
      showErrorToast(error.response?.data?.message || "Lỗi khi gửi báo cáo!");
    }
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-3 sm:p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget && onClose) {
            handleCancel();
          }
        }}
      >
        <div className="relative max-h-[94vh] w-full max-w-5xl overflow-hidden rounded-[24px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            className="absolute right-4 top-4 z-20 h-10 w-10 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </Button>

          <form
            onSubmit={handleSubmit}
            className="max-h-[94vh] overflow-y-auto"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* LEFT */}
              <div className="bg-[#f8f8f8] px-4 py-5 sm:px-6 sm:py-6 lg:min-h-[560px] lg:px-8 lg:py-7">
                <div className="max-w-[520px]">
                  <h2 className="text-[24px] font-bold leading-tight text-[#111111] sm:text-[28px]">
                    Tạo báo cáo sự cố
                  </h2>

                  <p className="mt-2.5 text-sm leading-5 text-[#707070]">
                    Vui lòng cung cấp thông tin chi tiết về sự cố hạ tầng để đội
                    ngũ kỹ thuật kịp thời xử lý.
                  </p>

                  <div className="mt-6 space-y-5">
                    <div>
                      <label className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-[#2b2b2b]">
                        Tiêu đề sự cố
                      </label>
                      <Input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Mô tả ngắn gọn sự cố"
                        className="h-11 rounded-xl border-transparent bg-[#ececec] px-4 text-sm text-[#222] placeholder:text-[#9b9b9b] focus-visible:border-[#5d5fef] focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-[#5d5fef]/10"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-[#2b2b2b]">
                        Loại sự cố
                      </label>

                      <Select
                        value={incidentType}
                        onValueChange={setIncidentType}
                      >
                        <SelectTrigger
                          size="default"
                          className="h-11 w-full rounded-xl border-transparent bg-[#ececec] px-4 text-sm text-[#222] data-[placeholder]:text-[#9b9b9b] focus-visible:border-[#5d5fef] focus-visible:ring-4 focus-visible:ring-[#5d5fef]/10 [&>svg]:text-[#9b9b9b]"
                        >
                          <SelectValue
                            placeholder={
                              incidentTypeLoading
                                ? "Đang tải loại sự cố..."
                                : "Chọn loại sự cố"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent
                          position="popper"
                          className="z-[10020] w-[var(--radix-select-trigger-width)] max-h-[260px] rounded-xl border border-gray-100 bg-white p-1 text-sm shadow-[0_12px_30px_rgba(0,0,0,0.12)]"
                        >
                          {incidentOptions.length > 0 ? (
                            incidentOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                                className="rounded-lg py-2 text-sm font-normal text-[#222] focus:bg-[#f5f6ff] focus:text-[#3b3df5] data-[state=checked]:font-medium"
                              >
                                {option.label}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem
                              value="__no_incident_type"
                              disabled
                              className="rounded-lg py-2 text-sm text-gray-400"
                            >
                              Chưa có loại sự cố khả dụng
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-[#2b2b2b]">
                        Mô tả chi tiết
                      </label>
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={6}
                        placeholder="Mô tả chi tiết về sự cố: Tình trạng hiện tại, mức độ nghiêm trọng, các yếu tố liên quan...."
                        className="w-full resize-none rounded-2xl border-transparent bg-[#ececec] px-4 py-3.5 text-sm leading-5 text-[#222] placeholder:text-[#9b9b9b] focus-visible:border-[#5d5fef] focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-[#5d5fef]/10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex flex-col bg-white px-4 py-5 sm:px-6 sm:py-6 lg:min-h-[560px] lg:px-8 lg:py-7">
                <div className="mx-auto flex h-full w-full max-w-[520px] flex-col">
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wide text-[#2b2b2b]">
                      Hình ảnh sự cố
                    </h3>
                    <p className="mt-0.5 text-xs text-[#8b8b8b]">
                      Định dạng JPG, PNG (Tối đa 5MB)
                    </p>
                  </div>

                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`mt-4 rounded-[20px] border-2 border-dashed bg-[#fcfcfc] p-5 transition sm:p-6 ${
                      dragActive
                        ? "border-[#5d5fef] bg-[#f7f7ff]"
                        : "border-[#d7d7d7]"
                    }`}
                  >
                    {uploadedImages.length > 0 ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                          {uploadedImages.map((img, index) => (
                            <div
                              key={index}
                              className="group relative overflow-hidden rounded-xl bg-[#f2f2f2]"
                            >
                              <img
                                src={img}
                                alt={`uploaded-${index}`}
                                className="h-24 w-full object-cover sm:h-28"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => removeImage(index)}
                                className="absolute right-1.5 top-1.5 rounded-full bg-black/65 text-white opacity-100 hover:bg-red-500 sm:opacity-0 sm:group-hover:opacity-100"
                              >
                                <X className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={openCamera}
                            className="h-11 flex-1 rounded-xl border-[#dddddd] bg-white text-sm font-medium text-[#333] hover:border-[#5d5fef] hover:text-[#5d5fef]"
                          >
                            <Camera className="h-4 w-4" />
                            Camera
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="h-11 flex-1 rounded-xl border-[#dddddd] bg-white text-sm font-medium text-[#333] hover:border-[#5d5fef] hover:text-[#5d5fef]"
                          >
                            <Upload className="h-4 w-4" />
                            Upload
                          </Button>
                        </div>

                        <p className="text-center text-[11px] text-[#8b8b8b]">
                          Đã tải {uploadedImages.length}/{MAX_IMAGES} ảnh
                        </p>
                      </div>
                    ) : (
                      <div className="flex min-h-[180px] flex-col items-center justify-center text-center sm:min-h-[200px]">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#dcebff]">
                          <CloudUpload className="h-7 w-7 text-[#2d7ef7]" />
                        </div>

                        <h4 className="text-lg font-bold text-[#151515] sm:text-[20px]">
                          Tải ảnh lên hoặc Chụp ảnh
                        </h4>

                        <p className="mt-2 max-w-[280px] text-[13px] leading-5 text-[#8c8c8c]">
                          Kéo thả file vào đây hoặc nhấp để chọn từ thư viện
                        </p>

                        <div className="mt-5 flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={openCamera}
                            className="h-11 min-w-[130px] rounded-xl border-[#e2e2e2] bg-white px-4 text-sm font-medium text-[#333] shadow-sm hover:border-[#5d5fef] hover:text-[#5d5fef]"
                          >
                            <Camera className="h-4 w-4" />
                            Camera
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="h-11 min-w-[130px] rounded-xl border-[#e2e2e2] bg-white px-4 text-sm font-medium text-[#333] shadow-sm hover:border-[#5d5fef] hover:text-[#5d5fef]"
                          >
                            <Upload className="h-4 w-4" />
                            Upload
                          </Button>
                        </div>
                      </div>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>

                  <div className="mt-5">
                    <label className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-[#2b2b2b]">
                      Vị trí sự cố
                    </label>

                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
                        <MapPin className="h-4 w-4 text-[#8a8a8a]" />
                      </div>
                      <Input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        disabled={locationLoading}
                        placeholder="Nhập vị trí sự cố (Ví dụ: 03 Quang Trung...)"
                        className="h-11 rounded-xl border-transparent bg-[#f2f2f2] pl-10 pr-4 text-sm text-[#222] placeholder:text-[#9b9b9b] focus-visible:border-[#5d5fef] focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-[#5d5fef]/10 disabled:cursor-not-allowed disabled:opacity-70"
                      />
                    </div>

                    <div className="mt-2.5 flex items-start gap-1.5 text-[11px] leading-4 text-[#8d8d8d]">
                      <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#9b9b9b]" />
                      <p>
                        Vui lòng nhập chính xác vị trí của sự cố để thuận tiện
                        cho đội xử lý.
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto flex flex-col-reverse gap-2 pt-5 sm:flex-row sm:justify-end sm:pt-6">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleCancel}
                      className="h-11 rounded-xl px-5 text-sm font-semibold text-[#555] hover:bg-gray-100"
                    >
                      Huỷ bỏ
                    </Button>

                    <Button
                      type="submit"
                      className="h-11 rounded-xl bg-[#3f39f5] px-7 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(63,57,245,0.28)] hover:bg-[#322cf0]"
                    >
                      Gửi báo cáo
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {showCamera && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 p-3 sm:p-4">
            <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl sm:rounded-3xl">
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
                <div>
                  <h2 className="text-lg font-semibold text-[#111]">
                    Chụp ảnh sự cố
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Sau khi chụp ảnh, hệ thống sẽ tự động lấy GPS hiện tại.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={closeCamera}
                  className="h-10 w-10 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <div className="bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="h-auto max-h-[64vh] w-full object-cover sm:max-h-[68vh]"
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>

              <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeCamera}
                  className="h-12 rounded-xl border-gray-300 px-5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Huỷ
                </Button>
                <Button
                  type="button"
                  onClick={capturePhoto}
                  className="h-12 rounded-xl bg-[#3f39f5] px-6 text-sm font-semibold text-white hover:bg-[#322cf0]"
                >
                  <Camera className="h-5 w-5" />
                  Chụp ảnh
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ReportForm;
