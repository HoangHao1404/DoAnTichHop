import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, MapPin, LogOut, Settings, User, BookOpen, Folder, Zap, AlertCircle, Trees, Building2, CloudSun, Navigation } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Toast from "./Toast";
import { Button } from "@/components/ui/button";

// const Avatar = ({ src, alt }) => (
//   <img
//     src={src}
//     alt={alt}
//     className="h-8 w-8 rounded-full object-cover ring-1 ring-black/5"
//     onError={(e) => (e.currentTarget.style.display = "none")}
//   />
// );

const CATEGORIES = [
  { id: "all", label: "Táº¥t Cáº£", icon: "ðŸ“‹", color: "blue" },
  { id: "traffic", label: "Giao ThÃ´ng", icon: "ðŸš—", color: "orange" },
  { id: "electricity", label: "Äiá»‡n", icon: "âš¡", color: "yellow" },
  { id: "water", label: "IU", icon: "ðŸ’§", color: "red" },
  { id: "green", label: "CÃ¢y Xanh", icon: "ðŸŒ³", color: "green" },
  { id: "public", label: "CÃ´ng TrÃ¬nh CÃ´ng Cá»™ng", icon: "ðŸ—ï¸", color: "purple" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [openUser, setOpenUser] = useState(false);
  const [openNoti, setOpenNoti] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [toast, setToast] = useState(null);

  // Refs Ä‘á»ƒ detect click outside
  const userRef = useRef(null);
  const notiRef = useRef(null);

  // ÄÃ³ng dropdown khi click bÃªn ngoÃ i
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
    city: "Äang táº£i...",
    country: "",
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 60 * 1000); // cáº­p nháº­t má»—i phÃºt
    return () => clearInterval(timer);
  }, []);

  // Láº¥y vá»‹ trÃ­ thÃ nh phá»‘
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Gá»i API vá»›i zoom=8 Ä‘á»ƒ láº¥y cáº¥p tá»‰nh/thÃ nh phá»‘
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=8&addressdetails=1&accept-language=vi`,
            );
            const data = await response.json();
            console.log("Full location data:", data);
            const addressParts = data.display_name.split(", ");
            const city =
              addressParts.length >= 2
                ? addressParts[1]
                : data.address.city ||
                  data.address.state ||
                  "Vá»‹ trÃ­ khÃ´ng xÃ¡c Ä‘á»‹nh";

            const country = data.address.country || "";
            setLocation({ city, country });
          } catch (error) {
            setLocation({ city: "KhÃ´ng thá»ƒ xÃ¡c Ä‘á»‹nh", country: "" });
          }
        },
        () => {
          setLocation({ city: "ChÆ°a cáº¥p quyá»n", country: "" });
        },
      );
    } else {
      setLocation({ city: "KhÃ´ng há»— trá»£", country: "" });
    }
  }, []);

  const formatDate = (d) =>
    d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    });

  // ===============================
  // ðŸ”” NOTIFICATION
  // ===============================
  const [noti, setNoti] = useState([
    {
      id: "1",
      title: "BÃ¡o cÃ¡o má»›i Ä‘Æ°á»£c gá»­i",
      message: "HÆ° há»ng Ä‘Æ°á»ng táº¡i Quáº­n Háº£i ChÃ¢u - Äang chá» xá»­ lÃ½",
      severity: "info",
      createdAt: new Date().toISOString(),
      unread: true,
    },
    {
      id: "2",
      title: "BÃ¡o cÃ¡o Ä‘Ã£ Ä‘Æ°á»£c phÃª duyá»‡t",
      message: "BÃ¡o cÃ¡o vá» hÆ° há»ng cáº§u Ä‘Ã£ Ä‘Æ°á»£c xÃ¡c nháº­n bá»Ÿi quáº£n trá»‹ viÃªn",
      severity: "success",
      createdAt: new Date(Date.now() - 3600e3).toISOString(),
      unread: true,
    },
  ]);

  const markAllRead = () =>
    setNoti((prev) => prev.map((n) => ({ ...n, unread: false })));

  const handleLogout = () => {
    setToast({ message: "ÄÄƒng xuáº¥t thÃ nh cÃ´ng!", type: "success" });
    setOpenUser(false);
    setTimeout(() => {
      logout();
      navigate("/signin");
    }, 1500);
  };

  // ===============================
  // ðŸ§­ NAVBAR UI
  // ===============================
  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Popup xÃ¡c nháº­n Ä‘Äƒng xuáº¥t */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              ThÃ´ng bÃ¡o
            </h3>
            <p className="text-gray-600 mb-6">
              Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n Ä‘Äƒng xuáº¥t?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Há»§y
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  handleLogout();
                }}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                ÄÄƒng xuáº¥t
              </button>
            </div>
          </div>
        </div>
      )}

      <header
        className="relative z-40"
        style={{ transition: "background-color 300ms ease, color 300ms ease" }}
      >
      <div
        className="bg-white/95 backdrop-blur border-b border-gray-200 
                   px-4 py-3 flex items-center justify-between gap-4 flex-wrap"
        style={{ minHeight: "70px" }}
      >
        {/* LOCATION + USER INFO */}
        <div className="flex items-center gap-4">
          <div
            className="flex items-center gap-2 rounded-full 
                        bg-gray-100/90 
                        text-gray-700 
                        px-3 py-2 shadow-sm text-sm"
          >
            <MapPin className="h-4 w-4 opacity-70" />
            <span className="font-medium">{location.city}</span>
            {location.country && (
              <>
                <span className="text-gray-400">|</span>
                <span className="text-xs">{formatDate(currentDate)}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>
              Xin chÃ o,{" "}
              <span className="font-semibold text-gray-800">
                {user?.full_name || "NgÆ°á»i dÃ¹ng"}
              </span>{" "}
              ðŸ‘‹
            </span>
          </div>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-3">
          {/* ðŸ”” Notification */}
          <div className="relative" ref={notiRef}>
            <button
              onClick={() => setOpenNoti((v) => !v)}
              className="relative h-10 w-10 rounded-full 
                       bg-white 
                       border border-gray-200 
                       shadow-sm hover:bg-gray-50"
            >
              <Bell className="mx-auto h-5 w-5 text-gray-800" />
              {noti.some((n) => n.unread) && (
                <span className="absolute -top-0.5 -right-0.5 inline-block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
              )}
            </button>

            {openNoti && (
              <div
                className="absolute right-0 mt-2 w-80 rounded-2xl border border-gray-200 
                           bg-white/95 backdrop-blur shadow-lg p-2"
              >
                <div className="flex items-center justify-between px-2 py-1">
                  <p className="text-sm font-semibold text-gray-800">ThÃ´ng bÃ¡o</p>
                  <button
                    onClick={markAllRead}
                    className="text-xs rounded-full px-2 py-1 hover:bg-gray-100 text-gray-600"
                  >
                    ÄÃ¡nh dáº¥u Ä‘Ã£ Ä‘á»c
                  </button>
                </div>

                <div className="max-h-80 overflow-auto pr-1">
                  {noti.length === 0 ? (
                    <p className="text-xs text-gray-500 px-3 py-6 text-center">
                      KhÃ´ng cÃ³ thÃ´ng bÃ¡o
                    </p>
                  ) : (
                    <ul className="space-y-1">
                      {noti.map((n) => (
                        <li
                          key={n.id}
                          className={`flex gap-3 rounded-xl px-3 py-2 hover:bg-gray-50 ${
                            n.unread ? "bg-gray-50" : ""
                          }`}
                        >
                          <div className="pt-1">
                            <span
                              className={`inline-block h-2 w-2 rounded-full ${
                                n.severity === "critical"
                                  ? "bg-red-500"
                                  : n.severity === "warning"
                                  ? "bg-amber-500"
                                  : "bg-blue-500"
                              }`}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate text-gray-800">
                              {n.title}
                            </p>
                            {n.message && (
                              <p className="text-xs text-gray-600 overflow-hidden text-ellipsis">
                                {n.message}
                              </p>
                            )}
                            <p className="text-[10px] text-gray-400 mt-1">
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

          {/* ðŸ‘¤ User */}
          <div className="relative" ref={userRef}>
            <button
              onClick={() => setOpenUser((v) => !v)}
              className="group flex items-center gap-3 
                         rounded-full 
                         bg-amber-50 
                         px-4 py-2 shadow-sm 
                         hover:bg-amber-100"
            >
              <User className="h-4 w-4" />
            </button>

            {openUser && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-2xl 
                            border border-gray-200 
                            bg-white/95 
                            backdrop-blur shadow-lg p-2 z-50"
              >
                <ul className="space-y-1">
                  <li>
                    <button
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 
                                       hover:bg-gray-50 text-sm text-gray-800"
                    >
                      <User className="h-4 w-4" /> Há»“ sÆ¡
                    </button>
                  </li>
                  <li>
                    <button
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 
                                       hover:bg-gray-50 text-sm text-gray-800"
                    >
                      <Settings className="h-4 w-4" /> CÃ i Ä‘áº·t
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setOpenUser(false);
                        setShowLogoutConfirm(true);
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 
                                 hover:bg-gray-50 text-sm text-red-600"
                    >
                      <LogOut className="h-4 w-4" /> ÄÄƒng xuáº¥t
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export function NavbarAdmin() {
  const [temperature, setTemperature] = useState(25);
  const [openNoti, setOpenNoti] = useState(false);

  const notiRef = useRef(null);

  // ÄÃ³ng dropdown thÃ´ng bÃ¡o khi click bÃªn ngoÃ i
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notiRef.current && !notiRef.current.contains(event.target)) {
        setOpenNoti(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [location, setLocation] = useState({
    city: "Äang táº£i...",
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const [locationResponse, weatherResponse] = await Promise.all([
              fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=8&addressdetails=1&accept-language=vi`,
              ),
              fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&timezone=Asia%2FBangkok`,
              ),
            ]);

            const data = await locationResponse.json();
            const addressParts = data.display_name.split(", ");
            const city =
              addressParts.length >= 2
                ? addressParts[1]
                : data.address.city ||
                  data.address.state ||
                  "Vá»‹ trÃ­ khÃ´ng xÃ¡c Ä‘á»‹nh";
            setLocation({ city });

            if (weatherResponse.ok) {
              const weatherData = await weatherResponse.json();
              const currentTemp = weatherData?.current?.temperature_2m;
              if (typeof currentTemp === "number") {
                setTemperature(Math.round(currentTemp));
              }
            }
          } catch (error) {
            setLocation({ city: "TP. ÄÃ  Náºµng" });
          }
        },
        () => {
          setLocation({ city: "TP. ÄÃ  Náºµng" });
        },
      );
    } else {
      setLocation({ city: "TP. ÄÃ  Náºµng" });
    }
  }, []);

  const [noti, setNoti] = useState([
    {
      id: "1",
      title: "BÃ¡o cÃ¡o má»›i Ä‘Æ°á»£c gá»­i",
      message: "HÆ° há»ng Ä‘Æ°á»ng táº¡i Quáº­n Háº£i ChÃ¢u - Äang chá» xá»­ lÃ½",
      severity: "info",
      createdAt: new Date().toISOString(),
      unread: true,
    },
    {
      id: "2",
      title: "BÃ¡o cÃ¡o Ä‘Ã£ Ä‘Æ°á»£c phÃª duyá»‡t",
      message: "BÃ¡o cÃ¡o vá» hÆ° há»ng cáº§u Ä‘Ã£ Ä‘Æ°á»£c xÃ¡c nháº­n bá»Ÿi quáº£n trá»‹ viÃªn",
      severity: "success",
      createdAt: new Date(Date.now() - 3600e3).toISOString(),
      unread: true,
    },
  ]);

  const markAllRead = () =>
    setNoti((prev) => prev.map((n) => ({ ...n, unread: false })));

  const formatDate = (d) => {
    const day = d.toLocaleDateString("en-GB", { day: "2-digit" });
    const month = d.toLocaleDateString("en-GB", { month: "short" });
    const year = d.toLocaleDateString("en-GB", { year: "2-digit" });
    return `${day} ${month}, ${year}`;
  };

  const displayCity =
    location.city && location.city !== "Äang táº£i..."
      ? location.city.toLowerCase().includes("Ä‘Ã  náºµng")
        ? "TP. ÄÃ  Náºµng"
        : `TP. ${location.city.replace(/^TP\.\s*/i, "")}`
      : "TP. ÄÃ  Náºµng";

  return (
    <>
      <header className="relative z-40">
        <div
          className="bg-white border border-gray-200 rounded-[30px] shadow-sm
                   px-5 py-2.5 flex items-center justify-end"
          style={{ minHeight: "60px" }}
        >
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-full border-gray-200 bg-[#eaeaea] px-5 text-sm text-gray-700 hover:bg-[#eaeaea]"
            >
              <CloudSun className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-gray-700">{temperature}Â°C</span>
              <span className="text-gray-400">|</span>
              <span className="font-medium text-gray-600">
                {formatDate(currentDate)}
              </span>
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-full border-gray-200 bg-[#eaeaea] px-5 text-sm text-gray-800 hover:bg-[#eaeaea]"
            >
              <Navigation className="h-4 w-4 text-gray-700" />
              <span className="font-semibold">{displayCity}</span>
            </Button>

            <div className="relative" ref={notiRef}>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setOpenNoti((v) => !v)}
                className="relative h-10 w-10 rounded-full border border-gray-300 bg-[#f3f3f3] shadow-sm hover:bg-gray-100"
              >
                <Bell className="mx-auto h-6 w-6 text-gray-800" />
                {noti.some((n) => n.unread) && (
                  <span className="absolute top-1.5 right-1.5 inline-block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-[#f3f3f3]" />
                )}
              </Button>

              {openNoti && (
                <div
                  className="absolute right-0 mt-2 w-80 rounded-2xl border border-gray-200 
                           bg-white/95 backdrop-blur shadow-lg p-2 z-50"
                >
                  <div className="flex items-center justify-between px-2 py-1">
                    <p className="text-sm font-semibold text-gray-800">
                      ThÃ´ng bÃ¡o
                    </p>
                    <button
                      onClick={markAllRead}
                      className="text-xs rounded-full px-2 py-1 hover:bg-gray-100 text-gray-600"
                    >
                      ÄÃ¡nh dáº¥u Ä‘Ã£ Ä‘á»c
                    </button>
                  </div>

                  <div className="max-h-80 overflow-auto pr-1">
                    {noti.length === 0 ? (
                      <p className="text-xs text-gray-500 px-3 py-6 text-center">
                        KhÃ´ng cÃ³ thÃ´ng bÃ¡o
                      </p>
                    ) : (
                      <ul className="space-y-1">
                        {noti.map((n) => (
                          <li
                            key={n.id}
                            className={`flex gap-3 rounded-xl px-3 py-2 hover:bg-gray-50 ${
                              n.unread ? "bg-gray-50" : ""
                            }`}
                          >
                            <div className="pt-1">
                              <span
                                className={`inline-block h-2 w-2 rounded-full ${
                                  n.severity === "critical"
                                    ? "bg-red-500"
                                    : n.severity === "warning"
                                      ? "bg-amber-500"
                                      : "bg-blue-500"
                                }`}
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate text-gray-800">
                                {n.title}
                              </p>
                              {n.message && (
                                <p className="text-xs text-gray-600 overflow-hidden text-ellipsis">
                                  {n.message}
                                </p>
                              )}
                              <p className="text-[10px] text-gray-400 mt-1">
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
          </div>
        </div>
      </header>
    </>
  );
}

export function NavbarAdmin() {
  const [temperature, setTemperature] = useState(25);
  const [openNoti, setOpenNoti] = useState(false);

  const notiRef = useRef(null);

  // ÄÃ³ng dropdown thÃ´ng bÃ¡o khi click bÃªn ngoÃ i
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notiRef.current && !notiRef.current.contains(event.target)) {
        setOpenNoti(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [location, setLocation] = useState({
    city: "Äang táº£i...",
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const [locationResponse, weatherResponse] = await Promise.all([
              fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=8&addressdetails=1&accept-language=vi`
              ),
              fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&timezone=Asia%2FBangkok`
              ),
            ]);

            const data = await locationResponse.json();
            const addressParts = data.display_name.split(", ");
            const city =
              addressParts.length >= 2
                ? addressParts[1]
                : data.address.city ||
                  data.address.state ||
                  "Vá»‹ trÃ­ khÃ´ng xÃ¡c Ä‘á»‹nh";
            setLocation({ city });

            if (weatherResponse.ok) {
              const weatherData = await weatherResponse.json();
              const currentTemp = weatherData?.current?.temperature_2m;
              if (typeof currentTemp === "number") {
                setTemperature(Math.round(currentTemp));
              }
            }
          } catch (error) {
            setLocation({ city: "TP. ÄÃ  Náºµng" });
          }
        },
        () => {
          setLocation({ city: "TP. ÄÃ  Náºµng" });
        }
      );
    } else {
      setLocation({ city: "TP. ÄÃ  Náºµng" });
    }
  }, []);

  const [noti, setNoti] = useState([
    {
      id: "1",
      title: "BÃ¡o cÃ¡o má»›i Ä‘Æ°á»£c gá»­i",
      message: "HÆ° há»ng Ä‘Æ°á»ng táº¡i Quáº­n Háº£i ChÃ¢u - Äang chá» xá»­ lÃ½",
      severity: "info",
      createdAt: new Date().toISOString(),
      unread: true,
    },
    {
      id: "2",
      title: "BÃ¡o cÃ¡o Ä‘Ã£ Ä‘Æ°á»£c phÃª duyá»‡t",
      message: "BÃ¡o cÃ¡o vá» hÆ° há»ng cáº§u Ä‘Ã£ Ä‘Æ°á»£c xÃ¡c nháº­n bá»Ÿi quáº£n trá»‹ viÃªn",
      severity: "success",
      createdAt: new Date(Date.now() - 3600e3).toISOString(),
      unread: true,
    },
  ]);

  const markAllRead = () =>
    setNoti((prev) => prev.map((n) => ({ ...n, unread: false })));

  const formatDate = (d) => {
    const day = d.toLocaleDateString("en-GB", { day: "2-digit" });
    const month = d.toLocaleDateString("en-GB", { month: "short" });
    const year = d.toLocaleDateString("en-GB", { year: "2-digit" });
    return `${day} ${month}, ${year}`;
  };

  const displayCity =
    location.city && location.city !== "Äang táº£i..."
      ? location.city.toLowerCase().includes("Ä‘Ã  náºµng")
        ? "TP. ÄÃ  Náºµng"
        : `TP. ${location.city.replace(/^TP\.\s*/i, "")}`
      : "TP. ÄÃ  Náºµng";

  return (
    <>
      <header className="relative z-40">
        <div
          className="bg-white border border-gray-200 rounded-[20px] shadow-sm
                   px-5 py-2.5 flex items-center justify-end"
          style={{ minHeight: "60px" }}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-10 items-center gap-2.5 rounded-full border border-gray-200 bg-[#eaeaea] px-5 text-sm text-gray-700">
              <CloudSun className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-gray-700">{temperature}Â°C</span>
              <span className="text-gray-400">|</span>
              <span className="font-medium text-gray-600">{formatDate(currentDate)}</span>
            </div>

            <div className="flex h-10 items-center gap-2.5 rounded-full border border-gray-200 bg-[#eaeaea] px-5 text-sm text-gray-800">
              <Navigation className="h-4 w-4 text-gray-700" />
              <span className="font-semibold">{displayCity}</span>
            </div>

            <div className="relative" ref={notiRef}>
              <button
                onClick={() => setOpenNoti((v) => !v)}
                className="relative h-10 w-10 rounded-full bg-[#f3f3f3] border border-gray-300 shadow-sm hover:bg-gray-100"
              >
                <Bell className="mx-auto h-6 w-6 text-gray-800" />
                {noti.some((n) => n.unread) && (
                  <span className="absolute top-1.5 right-1.5 inline-block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-[#f3f3f3]" />
                )}
              </button>

              {openNoti && (
                <div
                  className="absolute right-0 mt-2 w-80 rounded-2xl border border-gray-200 
                           bg-white/95 backdrop-blur shadow-lg p-2 z-50"
                >
                  <div className="flex items-center justify-between px-2 py-1">
                    <p className="text-sm font-semibold text-gray-800">ThÃ´ng bÃ¡o</p>
                    <button
                      onClick={markAllRead}
                      className="text-xs rounded-full px-2 py-1 hover:bg-gray-100 text-gray-600"
                    >
                      ÄÃ¡nh dáº¥u Ä‘Ã£ Ä‘á»c
                    </button>
                  </div>

                  <div className="max-h-80 overflow-auto pr-1">
                    {noti.length === 0 ? (
                      <p className="text-xs text-gray-500 px-3 py-6 text-center">
                        KhÃ´ng cÃ³ thÃ´ng bÃ¡o
                      </p>
                    ) : (
                      <ul className="space-y-1">
                        {noti.map((n) => (
                          <li
                            key={n.id}
                            className={`flex gap-3 rounded-xl px-3 py-2 hover:bg-gray-50 ${
                              n.unread ? "bg-gray-50" : ""
                            }`}
                          >
                            <div className="pt-1">
                              <span
                                className={`inline-block h-2 w-2 rounded-full ${
                                  n.severity === "critical"
                                    ? "bg-red-500"
                                    : n.severity === "warning"
                                    ? "bg-amber-500"
                                    : "bg-blue-500"
                                }`}
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate text-gray-800">
                                {n.title}
                              </p>
                              {n.message && (
                                <p className="text-xs text-gray-600 overflow-hidden text-ellipsis">
                                  {n.message}
                                </p>
                              )}
                              <p className="text-[10px] text-gray-400 mt-1">
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
          </div>
        </div>
      </header>
    </>
  );
}
