import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MaintenanceHomeOverlayUI from "../components/MaintenanceHomeOverlayUI";
import { useAuth } from "../context/AuthContext";

// import icon của leaflet (VITE không dùng require)
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix icon issue với Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Component để lưu map reference
function MapController({ mapRef }) {
  const map = useMap();

  useEffect(() => {
    mapRef.current = map;
  }, [map, mapRef]);

  return null;
}

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

    const options = {
      enableHighAccuracy: false,
      maximumAge: 60000,
      timeout: 10000,
    };

    const handleSuccess = (pos) => {
      const newPos = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };

      setPosition(newPos);

      if (!hasLocationRef.current) {
        map.flyTo([newPos.lat, newPos.lng], 15);
        hasLocationRef.current = true;
      }
    };

    const handleError = (error) => {
      console.error("GPS error:", error);
    };

    const watchId = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      options,
    );

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

const MaintenanceDashboard = () => {
  const defaultCenter = [10.8231, 106.6297]; // TP.HCM
  const [selectedCategory, setSelectedCategory] = useState("all");

  const mapRef = useRef(null);
  const [searchMarker, setSearchMarker] = useState(null);

  const { user } = useAuth();

  const currentUser = user || JSON.parse(localStorage.getItem("user") || "{}");

  const userName = currentUser.full_name || currentUser.name || "Người dùng";

  const userAvatar = currentUser.avatar || null;

  const handleSearchLocation = async (query) => {
    console.log("Search query: ", query);

    if (!query || !mapRef.current) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query,
        )}&limit=1&addressdetails=1`,
      );

      const data = await res.json();

      if (!data || data.length === 0) {
        alert("Không tìm thấy địa điểm phù hợp");
        return;
      }

      const place = data[0];

      const lat = parseFloat(place.lat);
      const lon = parseFloat(place.lon);

      if (mapRef.current) {
        mapRef.current.setView([lat, lon], 17);
      }

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
    <div className="w-full h-screen">
      <MaintenanceHomeOverlayUI
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onSearch={handleSearchLocation}
        userName={userName}
        userAvatar={userAvatar}
        mapElement={
          <MapContainer
            center={defaultCenter}
            zoom={13}
            className="w-full h-full"
            zoomControl={true}
            ref={mapRef}
          >
            <MapController mapRef={mapRef} />

            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <LocationMarker />

            {searchMarker && (
              <Marker position={[searchMarker.lat, searchMarker.lon]}>
                <Popup>{searchMarker.displayName}</Popup>
              </Marker>
            )}
          </MapContainer>
        }
      />
    </div>
  );
};

export default MaintenanceDashboard;
