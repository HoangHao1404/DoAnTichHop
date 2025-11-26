import { useState } from 'react';
import { Camera, Upload, MapPin, X, ChevronDown, AlertCircle, Image } from 'lucide-react';

function ReportForm() {
  const [title, setTitle] = useState('');
  const [incidentType, setIncidentType] = useState('');
  const [location] = useState('345 Hoàng Diệu, Bình Thuận, Hải Châu, Đà Nẵng, 300000');
  const [description, setDescription] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);

  // Xử lý upload ảnh
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setUploadedImage(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !incidentType || !uploadedImage) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }

    // TODO: gọi API gửi báo cáo
    alert('Đã gửi báo cáo thành công!');

    // Reset form
    setTitle('');
    setIncidentType('');
    setDescription('');
    setUploadedImage(null);
  };

  // Hủy form
  const handleCancel = () => {
    setTitle('');
    setIncidentType('');
    setDescription('');
    setUploadedImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden my-4 sm:my-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-400 px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between">
          <h1 className="text-white text-lg sm:text-xl md:text-2xl font-semibold">Báo cáo sự cố nhanh</h1>
          <button
            onClick={handleCancel}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 sm:space-y-6">
          {/* Title Input */}
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

          {/* Incident Type Dropdown */}
          <div>
            <label className="block text-gray-800 font-medium mb-2 text-sm sm:text-base">
              Loại sự cố <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500 text-sm sm:text-base"
              >
                <option value="">Chọn loại sự cố</option>
                <option value="infrastructure">Hạ tầng giao thông</option>
                <option value="lighting">Chiếu sáng công cộng</option>
                <option value="environment">Vệ sinh môi trường</option>
                <option value="water">Cấp thoát nước</option>
                <option value="electricity">Điện lực</option>
                <option value="other">Khác</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-800 font-medium mb-2 text-sm sm:text-base">
              Hình ảnh sự cố <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 md:p-8">
              {uploadedImage ? (
                <div className="relative">
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setUploadedImage(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                    <Image className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                  </div>
                  <h3 className="text-gray-800 font-medium mb-1 text-sm sm:text-base">Thêm hình ảnh sự cố</h3>
                  <p className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6 text-center px-2">Chụp ảnh trực tiếp hoặc tải lên từ thiết bị</p>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                    <label className="bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:bg-blue-700 transition-colors text-sm sm:text-base">
                      <Camera className="w-5 h-5" />
                      <span>Chụp ảnh</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    <label className="bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:bg-blue-700 transition-colors text-sm sm:text-base w-full sm:w-auto">
                      <Upload className="w-5 h-5" />
                      <span>Tải ảnh lên</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-gray-800 font-medium mb-2 text-sm sm:text-base">
              Vị trí sự cố <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 border border-gray-300 rounded-lg">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-800 text-sm sm:text-base break-words">{location}</span>
              </div>
              <div className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-600 text-xs sm:text-sm">
                  Vị trí được ghim tự động từ GPS khi bạn chụp ảnh. Điều này giúp xác định chính xác địa điểm sự cố.
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-800 font-medium mb-2 text-sm sm:text-base">
              Mô tả chi tiết (tùy chọn)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả chi tiết về sự cố: tình trạng hiện tại, mức độ nghiêm trọng, các yếu tố liên quan..."
              rows={4}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
            />
          </div>

          {/* Action Buttons */}
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
  );
}

export default ReportForm;