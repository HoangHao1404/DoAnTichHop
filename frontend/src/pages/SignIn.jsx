import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

import banner from "../image/banner-public.jpeg";
import comle from "../image/comle.png";
import cone from "../image/trafficCone.png";
import authApi from "../services/api/authApi";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const SignIn = () => {
  const [showPass, setShowPass] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const token = credentialResponse.credential;
      
      const res = await authApi.googleLogin(token);
      
      if (res.data.success) {
        // Login thẳng
        login(res.data.token, res.data.user);
        setToast({ message: `Chào mừng ${res.data.user.full_name || 'bạn'}!`, type: "success" });
        
        const userRole = res.data.user.role;
        if (userRole === "maintenance") {
          setTimeout(() => navigate("/maintenance/dashboard"), 1500);
        } else if (userRole === "admin" || userRole === "manager") {
          setTimeout(() => navigate("/admin/overview"), 1500);
        } else {
          setTimeout(() => navigate("/dashboard"), 1500);
        }
      }
    } catch (err) {
      setToast({ 
        message: err.response?.data?.message || "Google login thất bại",
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setToast({ message: "Google login bị lỗi, vui lòng thử lại", type: "error" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await authApi.login(phone, password);
      if (res.data.success) {
        login(res.data.token, res.data.user);
        setToast({ message: `Chào mừng ${res.data.user.full_name || 'bạn'}!`, type: "success" });
        
        // Kiểm tra role để điều hướng
        const userRole = res.data.user.role;
        if (userRole === "maintenance") {
          setTimeout(() => navigate("/maintenance/dashboard"), 1500);
        } else if (userRole === "admin" || userRole === "manager") {
          setTimeout(() => navigate("/admin/overview"), 1500);
        } else {
          setTimeout(() => navigate("/dashboard"), 1500);
        }
      } else {
        setMessage(res.data.message || "Đăng nhập thất bại");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Lỗi đăng nhập");
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
      {/* Dành cho mt để bàn */}
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
            fontSize: "clamp(80px, 12vw, 180px)",
            textShadow: "0px 15px 40px rgba(0,0,0,0.65)",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Safin
        </h1>
      </div>

     
      <div className="w-full md:w-1/2 min-h-screen bg-white relative flex justify-center items-center py-6 xs:py-8 sm:py-10">
        <img
          src={comle}
          alt="wrench"
          className="absolute top-2 xs:top-3 sm:top-4 -right-16 xs:-right-20 md:-right-20 w-40 xs:w-48 sm:w-56 opacity-90 hidden md:block"
          style={{ transform: "rotate(10deg)" }}
        />
        <img
          src={cone}
          alt="cone"
          className="absolute -bottom-4 xs:-bottom-6 sm:bottom-0 left-4 xs:left-6 w-40 xs:w-48 sm:w-56 opacity-90 hidden md:block"
          style={{ transform: "rotate(-20deg)" }}
        />

        <div className="w-[95vw] xs:w-[90vw] sm:w-[80vw] md:w-full max-w-[450px] mx-auto px-0 xs:px-2 sm:px-4">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-semibold leading-tight mb-1 xs:mb-1.5 sm:mb-2">
            Welcome, Log in to
          </h2>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-semibold leading-tight mb-4 xs:mb-5 sm:mb-6">
            your account.
          </h2>

          {message && (
            <p className="mb-3 xs:mb-4 text-xs xs:text-sm text-red-600 whitespace-pre-line">
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            {/* PHONE */}
            <div className="mb-4 xs:mb-5 sm:mb-5">
              <label className="text-xs xs:text-sm font-medium">Phone</label>
              <input
                type="text"
                placeholder="Enter your phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full mt-1.5 xs:mt-2 px-3 xs:px-4 py-2 xs:py-3 border border-gray-300 rounded-lg xs:rounded-xl text-xs xs:text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-2.5 xs:mb-3 sm:mb-3 relative">
              <label className="text-xs xs:text-sm font-medium">Password</label>

              <input
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1.5 xs:mt-2 px-3 xs:px-4 py-2 xs:py-3 border border-gray-300 rounded-lg xs:rounded-xl text-xs xs:text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10 xs:pr-12"
                required
              />

              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 xs:right-4 top-8 xs:top-9 text-gray-500 hover:text-gray-700 flex-shrink-0"
              >
                {showPass ? <EyeOff size={18} className="xs:w-5 xs:h-5" /> : <Eye size={18} className="xs:w-5 xs:h-5" />}
              </button>
            </div>

            <div className="mb-4 xs:mb-5 sm:mb-6 text-left">
              <a
                href="#"
                className="text-xs xs:text-sm text-blue-600 hover:text-blue-700 font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/forgot-password");
                }}
              >
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 xs:py-3 sm:py-3 rounded-lg text-xs xs:text-sm sm:text-base font-medium hover:bg-blue-700 transition"
            >
              {loading ? "Đang đăng nhập..." : "Log In"}
            </button>
          </form>

          {/* TIẾP TỤC */}
          <div className="flex items-center my-4 xs:my-5 sm:my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-2 xs:px-3 text-gray-500 text-xs xs:text-sm">or continue with</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* GOOGLE Đăng nhập */}
          {GOOGLE_CLIENT_ID ? (
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
              <div className="w-full scale-90 xs:scale-100 origin-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap={false}
                  theme="outline"
                  size="large"
                  text="signin_with"
                />
              </div>
            </GoogleOAuthProvider>
          ) : (
            <p className="text-center text-xs text-amber-600">
              Google login chưa được cấu hình (thiếu VITE_GOOGLE_CLIENT_ID).
            </p>
          )}

          <p className="text-center text-xs xs:text-sm mt-4 xs:mt-5 sm:mt-5">
            Don't Have An Account Yet?{" "}
            <span
              className="text-blue-600 font-semibold cursor-pointer hover:underline"
              onClick={() => navigate("/register")}
            >
              Register For Free
            </span>
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
export default SignIn;
