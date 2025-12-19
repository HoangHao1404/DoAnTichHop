const axios = require("axios");

class GeocodeController {
  async reverseGeocode(req, res) {
    try {
      const { lat, lon } = req.query;

      if (!lat || !lon) {
        return res.status(400).json({
          success: false,
          message: "Thiếu tham số lat và lon",
        });
      }

      console.log(`🌍 Reverse geocoding: ${lat}, ${lon}`);

      try {
        // Thử BigDataCloud API - miễn phí, không cần key, ít rate limit
        console.log("🔍 Trying BigDataCloud API...");
        const bigDataResponse = await axios.get(
          `https://api.bigdatacloud.net/data/reverse-geocode-client`,
          {
            params: {
              latitude: lat,
              longitude: lon,
              localityLanguage: "vi",
            },
            timeout: 5000,
          }
        );

        if (bigDataResponse.data) {
          const data = bigDataResponse.data;
          console.log("✅ BigDataCloud response:", data);

          // Tạo địa chỉ từ BigDataCloud
          const parts = [
            data.locality,
            data.localityInfo?.administrative?.[3]?.name || data.principalSubdivision,
            data.countryName || "Việt Nam"
          ].filter(Boolean);

          const address = parts.length > 0 ? parts.join(", ") : data.localityInfo?.informative?.[0]?.description || `${lat}, ${lon}`;

          return res.status(200).json({
            success: true,
            data: {
              address: address,
              fullAddress: data.localityInfo?.informative?.[0]?.description || address,
              details: data,
            },
          });
        }
      } catch (bigDataError) {
        console.log("⚠️ BigDataCloud failed:", bigDataError.message);
      }

      // Fallback: Thử Nominatim (có thể bị rate limit)
      console.log("🌍 Trying Nominatim API...");
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse`,
        {
          params: {
            format: "json",
            lat: lat,
            lon: lon,
            addressdetails: 1,
            "accept-language": "vi",
          },
          headers: {
            "User-Agent": "ReportApp/1.0 (Contact: admin@example.com)",
          },
          timeout: 5000,
        }
      );

      const data = response.data;
      console.log("📡 Nominatim full response:", JSON.stringify(data, null, 2));

      if (data && data.address) {
        console.log("✅ Has address object:", data.address);
        // Tạo địa chỉ tiếng Việt ngắn gọn
        const addr = data.address;
        const parts = [
          addr.road || addr.street || addr.path,
          addr.suburb || addr.neighbourhood || addr.quarter || addr.hamlet,
          addr.city || addr.town || addr.village || addr.city_district,
          addr.state || addr.province,
          addr.country || "Việt Nam",
        ].filter(Boolean);

        const address = parts.join(", ");

        return res.status(200).json({
          success: true,
          data: {
            address: address,
            fullAddress: data.display_name,
            details: data.address,
          },
        });
      } else {
        return res.status(200).json({
          success: true,
          data: {
            address: `${parseFloat(lat).toFixed(6)}, ${parseFloat(lon).toFixed(
              6
            )}`,
            fullAddress: data.display_name || "Không tìm thấy địa chỉ",
          },
        });
      }
    } catch (error) {
      console.error("❌ Geocode error:", error.message);
      const { lat, lon } = req.query;
      
      // Trả về tọa độ nếu có lỗi
      return res.status(200).json({
        success: true,
        data: {
          address: `${parseFloat(lat).toFixed(6)}, ${parseFloat(lon).toFixed(
            6
          )}`,
          fullAddress: "Không thể lấy địa chỉ",
          error: error.message,
        },
      });
    }
  }
}

module.exports = new GeocodeController();
