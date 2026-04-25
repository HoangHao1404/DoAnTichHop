import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

import banner from "../image/banner-public.jpeg";
import comle from "../image/comle.png";
import cone from "../image/trafficCone.png";

import authApi from "../services/api/authApi";

const Register = () => {
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Password không khớp!");
      return;
    }

    try {
      const res = await authApi.sendRegisterOtp(phone);

      // Điều hướng sang trang nhập OTP
      navigate("/register/confirm", {
        state: {
          phone,
          password,
          full_name: fullName,
          otp_demo: res.data.otp_demo, // demo nếu cần hiển thị
        },
      });
    } catch (err) {
      setMessage(err.response?.data?.message || "Lỗi khi gửi OTP");
    }
  };

  return (
    <div className="flex min-h-screen w-full select-none flex-col overflow-hidden md:flex-row">
      {/* LEFT */}
      <div className="relative hidden min-h-screen w-1/2 items-center justify-center overflow-hidden md:flex">
        <img
          src={banner}
          alt="Background banner"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10" />
        <h1
          className="relative text-white italic font-bold drop-shadow-2xl"
          style={{ fontSize: "clamp(80px, 12vw, 150px)", letterSpacing: "3px" }}
        >
          Safin
        </h1>
      </div>

      {/* RIGHT */}
      <div className="relative flex min-h-screen w-full overflow-hidden bg-white md:w-1/2">
        <img
          src={comle}
          alt=""
          className="pointer-events-none absolute -right-10 xs:-right-12 top-2 xs:top-3 sm:top-4 hidden w-32 xs:w-40 sm:w-56 opacity-90 xs:block md:-right-20 md:top-4"
        />
        <img
          src={cone}
          alt=""
          className="pointer-events-none absolute -bottom-4 xs:-bottom-6 sm:bottom-0 -left-6 xs:-left-8 hidden w-24 xs:w-32 sm:w-56 opacity-90 xs:block md:-left-10 md:w-56"
        />

        <div className="relative z-10 flex w-full flex-col items-center px-3 xs:px-5 sm:px-8 py-6 xs:py-8 sm:py-10 md:justify-center md:px-10">
          <div className="w-full max-w-[550px]">
            <h2 className="mb-1 xs:mb-1.5 sm:mb-2 text-2xl xs:text-3xl sm:text-4xl font-semibold">
              Welcome, Sign up
            </h2>
            <h2 className="mb-4 xs:mb-5 sm:mb-8 text-2xl xs:text-3xl sm:text-4xl font-semibold">
              to get started
            </h2>

            {message && <p className="mb-3 xs:mb-4 text-xs xs:text-sm text-red-600">{message}</p>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3 xs:mb-4 sm:mb-5">
                <label className="text-xs xs:text-sm font-medium">Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="mt-1.5 xs:mt-2 w-full rounded-lg xs:rounded-xl border px-3 xs:px-4 py-2 xs:py-3 text-xs xs:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="mb-3 xs:mb-4 sm:mb-5">
                <label className="text-xs xs:text-sm font-medium">Phone</label>
                <input
                  type="text"
                  placeholder="Enter your phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="mt-1.5 xs:mt-2 w-full rounded-lg xs:rounded-xl border px-3 xs:px-4 py-2 xs:py-3 text-xs xs:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="relative mb-4 xs:mb-5 sm:mb-6">
                <label className="text-xs xs:text-sm font-medium">Password</label>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1.5 xs:mt-2 w-full rounded-lg xs:rounded-xl border px-3 xs:px-4 py-2 xs:py-3 text-xs xs:text-sm pr-10 xs:pr-12 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute bottom-2 xs:bottom-3 right-3 xs:right-4 text-gray-500 hover:text-gray-700 flex-shrink-0"
                >
                  {showPass ? <EyeOff size={18} className="xs:w-5 xs:h-5" /> : <Eye size={18} className="xs:w-5 xs:h-5" />}
                </button>
              </div>

              <div className="relative mb-4 xs:mb-5 sm:mb-6">
                <label className="text-xs xs:text-sm font-medium">Confirm Password</label>
                <input
                  type={showConfirmPass ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="mt-1.5 xs:mt-2 w-full rounded-lg xs:rounded-xl border px-3 xs:px-4 py-2 xs:py-3 text-xs xs:text-sm pr-10 xs:pr-12 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute bottom-2 xs:bottom-3 right-3 xs:right-4 text-gray-500 hover:text-gray-700 flex-shrink-0"
                >
                  {showConfirmPass ? <EyeOff size={18} className="xs:w-5 xs:h-5" /> : <Eye size={18} className="xs:w-5 xs:h-5" />}
                </button>
              </div>

              <button className="w-full rounded-lg xs:rounded-[10px] bg-blue-600 py-2.5 xs:py-3 sm:py-3 text-xs xs:text-sm sm:text-base text-white transition hover:bg-blue-700 font-medium">
                Sign Up
              </button>
            </form>

            <p className="text-center text-xs xs:text-sm mt-4 xs:mt-5 sm:mt-5">
              Already have an account?{" "}
              <span
                className="text-blue-600 font-semibold cursor-pointer hover:underline"
                onClick={() => navigate("/signin")}
              >
                Sign In
              </span>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
