import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, MapPin, LogOut, Settings, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

// const Avatar = ({ src, alt }) => (
//   <img
//     src={src}
//     alt={alt}
//     className="h-8 w-8 rounded-full object-cover ring-1 ring-black/5"
//     onError={(e) => (e.currentTarget.style.display = "none")}
//   />
// );

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [openUser, setOpenUser] = useState(false);
  const [openNoti, setOpenNoti] = useState(false);

  // Refs để detect click outside
  const userRef = useRef(null);
  const notiRef = useRef(null);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userRef.current && !userRef.current.contains(event.target)) {
        setOpenUser(false);
      }
      if (notiRef.current && !notiRef.current.contains(event.target)) {
        setOpenNoti(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ===============================
  // LOCATION & DATE
  // ===============================
  const [currentDate, setCurrentDate] = useState(new Date());
  const [location, setLocation] = useState({
    city: "Đang tải...",
    country: "",
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 60 * 1000); // cập nhật mỗi phút
    return () => clearInterval(timer);
  }, []);

  // Lấy vị trí thành phố
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Gọi API với zoom=8 để lấy cấp tỉnh/thành phố
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=8&addressdetails=1&accept-language=vi`
            );
            const data = await response.json();
            console.log("Full location data:", data);
            const addressParts = data.display_name.split(", ");
            const city =
              addressParts.length >= 2
                ? addressParts[1]
                : data.address.city ||
                  data.address.state ||
                  "Vị trí không xác định";

            const country = data.address.country || "";
            setLocation({ city, country });
          } catch (error) {
            setLocation({ city: "Không thể xác định", country: "" });
          }
        },
        () => {
          setLocation({ city: "Chưa cấp quyền", country: "" });
        }
      );
    } else {
      setLocation({ city: "Không hỗ trợ", country: "" });
    }
  }, []);

  const formatDate = (d) =>
    d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    });

  // ===============================
  // 🔔 NOTIFICATION
  // ===============================
  const [noti, setNoti] = useState([
    {
      id: "1",
      title: "Báo cáo mới được gửi",
      message: "Hư hỏng đường tại Quận Hải Châu - Đang chờ xử lý",
      severity: "info",
      createdAt: new Date().toISOString(),
      unread: true,
    },
    {
      id: "2",
      title: "Báo cáo đã được phê duyệt",
      message: "Báo cáo về hư hỏng cầu đã được xác nhận bởi quản trị viên",
      severity: "success",
      createdAt: new Date(Date.now() - 3600e3).toISOString(),
      unread: true,
    },
  ]);

  const markAllRead = () =>
    setNoti((prev) => prev.map((n) => ({ ...n, unread: false })));

  const handleLogout = () => {
    logout();
    setOpenUser(false);
    navigate("/signin");
  };

  // ===============================
  // 🧭 NAVBAR UI
  // ===============================
  return (
    <header
      className="fixed top-7 left-[250px] right-4 z-40"
      style={{ transition: "background-color 300ms ease, color 300ms ease" }}
    >
      <div
        className="rounded-3xl bg-white/90 
                   shadow px-4 py-2 flex items-center justify-end gap-3"
        style={{ height: "70px" }}
      >
        {/* LOCATION */}
        <div
          className="hidden sm:flex items-center gap-2 rounded-full 
                        bg-zinc-100/90 
                        text-zinc-700 
                        px-4 py-2 shadow-inner"
        >
          <MapPin className="h-4 w-4 opacity-70" />
          <span className="text-sm font-medium">{location.city}</span>
          {location.country && (
            <>
              <span className="text-zinc-400">|</span>
              <span className="text-sm">{formatDate(currentDate)}</span>
            </>
          )}
        </div>

        {/* 🔔 Notification */}
        <div className="relative" ref={notiRef}>
          <button
            onClick={() => setOpenNoti((v) => !v)}
            className="relative h-10 w-10 rounded-full 
                     bg-white 
                     border border-zinc-200 
                     shadow-sm hover:bg-zinc-50"
          >
            <Bell className="mx-auto h-5 w-5 text-zinc-800" />
            {noti.some((n) => n.unread) && (
              <span className="absolute -top-0.5 -right-0.5 inline-block h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {openNoti && (
            <div
              className="absolute right-0 mt-2 w-80 rounded-2xl border border-zinc-200 
                         bg-white/90 backdrop-blur shadow-lg p-2"
            >
              <div className="flex items-center justify-between px-2 py-1">
                <p className="text-sm font-semibold text-zinc-800">Thông báo</p>
                <button
                  onClick={markAllRead}
                  className="text-xs rounded-full px-2 py-1 hover:bg-zinc-100 text-zinc-600"
                >
                  Đánh dấu đã đọc
                </button>
              </div>

              <div className="max-h-80 overflow-auto pr-1">
                {noti.length === 0 ? (
                  <p className="text-xs text-zinc-500 px-3 py-6 text-center">
                    Không có thông báo
                  </p>
                ) : (
                  <ul className="space-y-1">
                    {noti.map((n) => (
                      <li
                        key={n.id}
                        className={`flex gap-3 rounded-xl px-3 py-2 hover:bg-zinc-50 ${
                          n.unread ? "bg-zinc-50" : ""
                        }`}
                      >
                        <div className="pt-1">
                          <span
                            className={`inline-block h-2 w-2 rounded-full ${
                              n.severity === "critical"
                                ? "bg-rose-500"
                                : n.severity === "warning"
                                ? "bg-amber-500"
                                : "bg-sky-500"
                            }`}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate text-zinc-800">
                            {n.title}
                          </p>
                          {n.message && (
                            <p className="text-xs text-zinc-600 overflow-hidden text-ellipsis">
                              {n.message}
                            </p>
                          )}
                          <p className="text-[10px] text-zinc-400 mt-1">
                            {new Date(n.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 👤 User */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setOpenUser((v) => !v)}
            className="group flex items-center gap-3 
                       rounded-full 
                       bg-amber-50 
                       px-4 py-2 shadow-sm 
                       hover:bg-amber-100"
          >
            <span className="text-sm text-zinc-800">
              Xin chào,{" "}
              <span className="font-semibold">
                {user?.name || "Người dùng"}
              </span>{" "}
              👋
            </span>
          </button>

          {openUser && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-2xl 
                          border border-zinc-200 
                          bg-white/95 
                          backdrop-blur shadow-lg p-2"
            >
              <ul className="space-y-1">
                <li>
                  <button
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 
                                     hover:bg-zinc-50 text-sm text-zinc-800"
                  >
                    <User className="h-4 w-4" /> Hồ sơ
                  </button>
                </li>
                <li>
                  <button
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 
                                     hover:bg-zinc-50 text-sm text-zinc-800"
                  >
                    <Settings className="h-4 w-4" /> Cài đặt
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 
                               hover:bg-zinc-50 text-sm text-rose-600"
                  >
                    <LogOut className="h-4 w-4" /> Đăng xuất
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
