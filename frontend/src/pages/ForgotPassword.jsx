import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Toast from "../components/Toast";
import authApi from "../services/api/authApi";
import banner from "../image/banner-public.jpeg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [devOtp, setDevOtp] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setToast({ message: "Vui lòng nhập email", type: "error" });
      return;
    }

    try {
      setLoading(true);
      // Gửi OTP đến số điện thoại
      const res = await authApi.sendOTP(email.trim().toLowerCase());
      
      if (res.data.success) {
        setDevOtp(res.data.devOtp || "");
        setToast({ 
          message: "OTP đã được gửi đến email của bạn",
          type: "success" 
        });
        
        // Chuyển sang trang reset password với email
        setTimeout(() => {
          navigate("/reset-password", {
            state: {
              email: email.trim().toLowerCase(),
              devOtp: res.data.devOtp || "",
            },
          });
        }, 1500);
      } else {
        setToast({ 
          message: res.data.message || "Không thể gửi OTP", 
          type: "error" 
        });
      }
    } catch (err) {
      setToast({ 
        message: err.response?.data?.message || "Lỗi khi gửi OTP", 
        type: "error" 
      });
    } finally {
      setLoading(false);
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
      <div className="w-full h-screen flex flex-col md:flex-row select-none overflow-hidden">
        {/* Banner */}
        <div className="hidden md:flex w-1/2 min-h-screen relative justify-center items-center overflow-hidden">
          <img
            src={banner}
            alt="banner"
            className="absolute inset-0 h-full w-[200%] object-cover object-right"
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <h1
            className="text-white relative font-sans italic tracking-[-0.03em]"
            style={{
              fontSize: "180px",
              textShadow: "0px 15px 40px rgba(0,0,0,0.65)",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Safin
          </h1>
        </div>

        {/* Form */}
        <div className="w-full md:w-1/2 min-h-screen bg-white relative flex justify-center items-center py-10">
          <div className="w-[90%] max-w-[450px] mx-auto">
            <button
              onClick={() => navigate("/signin")}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-8"
            >
              <ArrowLeft size={20} />
              Back to Sign In
            </button>

            <h2 className="text-3xl md:text-4xl font-semibold leading-tight mb-2">
              Reset Your Password
            </h2>
            <p className="text-gray-600 mb-6">
              Enter your email and we'll send you an OTP to reset your password.
            </p>
            {devOtp && (
              <p className="mb-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
                OTP test: <strong>{devOtp}</strong>
              </p>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-xl 
                             text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg text-base font-medium hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
