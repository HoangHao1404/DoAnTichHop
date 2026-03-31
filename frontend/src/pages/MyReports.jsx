import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, House, Megaphone } from "lucide-react";
import ReportDetail from "../components/ReportDetail";
import ReportReviews from "../components/ReportReviews";
import { reportApi } from "../services/api/reportApi";
import { useAuth } from "../context/AuthContext";
const TYPE_COLOR = {
  "Giao Thông": "bg-orange-400",
  Điện: "bg-yellow-400",
  "Cây Xanh": "bg-green-400",
  CTCC: "bg-purple-400",
};

const STATUS_COLOR = {
  "Đang Chờ": "bg-gray-400",
  "Đang Xử Lý": "bg-orange-500",
  "Đã Giải Quyết": "bg-blue-500",
};

export default function MyReports() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selected, setSelected] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showReview, setShowReview] = useState(false);

  //! Lấy dữ liệu từ API
  useEffect(() => {
    const userId = user?._id || user?.user_id;
    if (userId) {
      fetchReports();
    } else {
      // Nếu không có user sau 1 giây, dừng loading
      const timer = setTimeout(() => {
        setLoading(false);
        setError("Vui lòng đăng nhập để xem báo cáo");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user]); // Re-fetch khi user hoặc location thay đổi

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      const userId = user?._id || user?.user_id;
      console.log("🔍 Fetching reports for userId:", userId);
      console.log("👤 User object:", user);

      if (!userId) {
        setError("Vui lòng đăng nhập để xem báo cáo");
        setLoading(false);
        return;
      }

      const response = await reportApi.getReportsByUserId(userId);
      console.log("📡 API Response:", response);

      if (response.success) {
        setReports(response.data);
        console.log("✅ Reports loaded:", response.data.length);
      } else {
        setError("Không thể tải báo cáo");
      }
    } catch (error) {
      setError("Lỗi khi tải dữ liệu");
      console.error("❌ Lỗi khi tải dữ liệu:", error);
      console.error("Error details:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = reports.filter((item) => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || item.type === typeFilter;
    const matchStatus = statusFilter === "all" || item.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });
  //! Hiển thị loading
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-red-500 mb-4">❌ {error}</p>
          <button
            onClick={fetchReports}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-hidden bg-gray-100 flex flex-col">
      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src="https://i.pravatar.cc/150?img=15"
            alt="avatar"
            className="w-12 h-12 rounded-full border shadow-sm object-cover"
          />
          <h1 className="text-2xl md:text-3xl font-bold">Báo Cáo Của Tôi</h1>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <StatBox label="Tổng Cộng" number={reports.length} icon="📁" />
          <StatBox
            label="Đang Chờ"
            number={reports.filter((r) => r.status === "Đang Chờ").length}
            icon="⏳"
          />
          <StatBox
            label="Đang Xử Lý"
            number={reports.filter((r) => r.status === "Đang Xử Lý").length}
            icon="⚡"
          />
          <StatBox
            label="Đã Giải Quyết"
            number={reports.filter((r) => r.status === "Đã Giải Quyết").length}
            icon="✔️"
          />
        </div>

        {/* TABLE CARD */}
        <div className="p-4 bg-white border rounded-2xl shadow">
          {/* FILTERS */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
            <div className="relative w-full md:w-1/3">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Nhập báo cáo cần tìm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-full px-3 py-2 rounded-md border bg-gray-100 border-gray-300"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 rounded-md border bg-gray-100 border-gray-300"
              >
                <option value="all">Tất Cả Các Loại</option>
                <option value="Giao Thông">Giao Thông</option>
                <option value="Điện">Điện</option>
                <option value="Cây Xanh">Cây Xanh</option>
                <option value="CTCC">CTCC</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-md border bg-gray-100 border-gray-300"
              >
                <option value="all">Tất Cả Trạng Thái</option>
                <option value="Đang Chờ">Đang Chờ</option>
                <option value="Đang Xử Lý">Đang Xử Lý</option>
                <option value="Đã Giải Quyết">Đã Giải Quyết</option>
              </select>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3">Mã Báo Cáo</th>
                  <th className="p-3">Tiêu Đề</th>
                  <th className="p-3">Loại</th>
                  <th className="p-3">Vị Trí</th>
                  <th className="p-3">Trạng Thái</th>
                  <th className="p-3">Thời Gian</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((item, index) => (
                  <tr
                    key={index}
                    className="border-t hover:bg-gray-50 cursor-pointer transition"
                    onClick={() => {
                      setSelected(item);
                      setShowDetail(true);
                    }}
                  >
                    <td className="p-3 font-semibold">{item.id}</td>
                    <td className="p-3">{item.title}</td>
                    <td className="p-3">
                      <span
                        className={`text-white px-3 py-1 rounded-full text-xs ${
                          TYPE_COLOR[item.type]
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className="p-3">{item.location}</td>
                    <td className="p-3">
                      <span
                        className={`text-white px-3 py-1 rounded-full text-xs ${
                          STATUS_COLOR[item.status]
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3">{item.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {/* <div className="mt-4 flex justify-center">
            <div className="px-4 py-2 bg-gray-100 rounded-full">1 / 3</div>
          </div> */}
        </div>
      </div>

      {showDetail && (
        <ReportDetail
          data={selected}
          close={() => setShowDetail(false)}
          openRating={() => {
            setShowDetail(false);
            setShowReview(true);
          }}
        />
      )}

      {showReview && (
        <ReportReviews
          close={() => setShowReview(false)}
          submit={(rating, text) => {
            alert("Đánh giá thành công!");
            setShowReview(false);
          }}
        />
      )}

      {/* Bottom Navigation */}
      <div className="fixed left-0 right-0 bottom-5 flex justify-center pointer-events-none z-50">
        <div className="bottom-nav pointer-events-auto">
          <button
            onClick={() => navigate("/dashboard")}
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
    </div>
  );
}

/* STAT BOX */
function StatBox({ label, number, icon }) {
  return (
    <div className="p-3 bg-white rounded-xl shadow border flex items-center gap-4">
      <div className="text-2xl">{icon}</div>
      <div>
        <p className="text-sm">{label}</p>
        <p className="text-xl font-bold">{number}</p>
      </div>
    </div>
  );
}
