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
    <div className="w-full h-screen flex select-none overflow-hidden">
      {/* LEFT */}
      <div className="w-1/2 h-full relative flex justify-center items-center">
        <img src={banner} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/10"></div>
        <h1 className="text-white font-bold drop-shadow-2xl italic" style={{ fontSize: "150px", letterSpacing: "3px" }}>Safin</h1>
      </div>

      {/* RIGHT */}
      <div className="w-1/2 h-full bg-white relative flex overflow-hidden">
        <img src={comle} className="absolute top-4 -right-20 w-56 opacity-90" />
        <img src={cone} className="absolute bottom-0 left-6 w-56 opacity-90" />

        <div className="w-full flex flex-col items-center pt-24">
          <div className="w-[85%] max-w-[550px]">

            <h2 className="text-4xl font-semibold mb-2">Welcome, Sign up</h2>
            <h2 className="text-4xl font-semibold mb-8">to get started</h2>

            {message && <p className="text-red-600 mb-4">{message}</p>}

            <form onSubmit={handleSubmit}>
              {/* NAME */}
              <div className="mb-5">
                <label className="text-sm font-medium">Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full mt-1 px-4 py-3 border rounded-xl"
                />
              </div>

              {/* PHONE */}
              <div className="mb-5">
                <label className="text-sm font-medium">Phone</label>
                <input
                  type="text"
                  placeholder="Enter your phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full mt-1 px-4 py-3 border rounded-xl"
                />
              </div>

              {/* PASSWORD */}
              <div className="mb-7 relative">
                <label className="text-sm font-medium">Password</label>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full mt-1 px-4 py-3 border rounded-xl pr-12"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 bottom-4">
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* CONFIRM PASS */}
              <div className="mb-7 relative">
                <label className="text-sm font-medium">Confirm Password</label>
                <input
                  type={showConfirmPass ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full mt-1 px-4 py-3 border rounded-xl pr-12"
                />
                <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-4 bottom-4">
                  {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
                Sign Up
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
