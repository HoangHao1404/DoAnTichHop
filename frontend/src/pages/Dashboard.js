import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import HomeOverlayUI from "../components/HomeOverlayUI";

// Fix icon issue với Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Component để di chuyển map đến vị trí hiện tại
function LocationMarker() {
  const [position, setPosition] = useState(null);
  const map = useMap();
  const hasLocationRef = useRef(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("GPS error: Trình duyệt không hỗ trợ geolocation");
      return;
    }

    // Thử lấy vị trí với cấu hình dễ dãi hơn
    const options = {
      enableHighAccuracy: false, // Tắt GPS chính xác cao, dùng WiFi/Cell tower
      maximumAge: 60000, // Chấp nhận vị trí cũ trong 60 giây
      timeout: 20000, // Tăng timeout lên 20 giây
    };

    const handleSuccess = (pos) => {
      const newPos = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };
      setPosition(newPos);
      
      // Chỉ di chuyển map lần đầu tiên
      if (!hasLocationRef.current) {
        map.flyTo([newPos.lat, newPos.lng], 15);
        hasLocationRef.current = true;
      }
    };

    const handleError = (error) => {
      console.error("GPS error:", error);
      // Không làm gì thêm, map sẽ ở vị trí mặc định
    };

    // Bắt đầu theo dõi vị trí
    const watchId = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      options
    );

    // Cleanup: Dừng theo dõi vị trí khi component unmount
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [map]);

  return position === null ? null : (
    <Marker position={[position.lat, position.lng]}>
      <Popup>📍 Bạn đang ở đây!</Popup>
    </Marker>
  );
}

const Dashboard = () => {
  const defaultCenter = [10.8231, 106.6297]; // TP.HCM
  const [selectedCategory, setSelectedCategory] = useState("all");

  const mapRef = useRef(null);
  const [searchMarker, setSearchMarker] = useState(null);

  // HÀM XỬ LÝ SEARCH TỪ THANH TÌM KIẾM
  const handleSearchLocation = async (query) => {
    console.log("Search query: ", query);
    
    if (!query || !mapRef.current) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=1&addressdetails=1`
      );
      const data = await res.json();

      if (!data || data.length === 0) {
        alert("Không tìm thấy địa điểm phù hợp");
        return;
      }

      const place = data[0];
      const lat = parseFloat(place.lat);
      const lon = parseFloat(place.lon);

      // di chuyển map đến vị trí tìm được
      mapRef.current.setView([lat, lon], 17);

      // đặt marker tại vị trí search
      setSearchMarker({
        lat,
        lon,
        displayName: place.display_name,
      });
    } catch (error) {
      console.error("Lỗi tìm kiếm địa điểm:", error);
      alert("Có lỗi khi tìm kiếm địa điểm");
    }
  };

  return (
    <div className="w-full h-screen relative">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        className="w-full h-full"
        zoomControl={true}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance; // lưu ref map để điều khiển
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Marker vị trí hiện tại */}
        <LocationMarker />

        {/* Marker kết quả search */}
        {searchMarker && (
          <Marker position={[searchMarker.lat, searchMarker.lon]}>
            <Popup>{searchMarker.displayName}</Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Overlay UI luôn nằm trên map */}
      <div className="absolute inset-0 z-[9999] pointer-events-none">
        <HomeOverlayUI
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onSearch={handleSearchLocation}  
        />
      </div>
    </div>
  );
};

export default Dashboard;
