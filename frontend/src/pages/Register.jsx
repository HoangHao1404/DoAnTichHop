import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import banner from "../image/banner-public.jpeg";
import comle from "../image/comle.png";
import cone from "../image/trafficCone.png";

const Register = () => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.phone || !formData.password || !formData.confirmPassword) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu không khớp");
      return;
    }
    
    // Danh sách các mã OTP có thể dùng
    const otpList = [
      "123456",
      "234567",
      "345678",
      "456789",
      "567890",
      "678901",
      "789012",
      "890123",
      "901234",
      "012345"
    ];
    
    // Random 1 mã OTP từ danh sách
    const randomOTP = otpList[Math.floor(Math.random() * otpList.length)];
    
    // Lưu OTP và thông tin user vào localStorage
    localStorage.setItem('pendingOTP', randomOTP);
    localStorage.setItem('pendingUser', JSON.stringify({
      name: formData.name,
      phone: formData.phone,
      password: formData.password
    }));
    
    console.log("OTP đã gửi:", randomOTP); // Để test, nên xóa khi deploy
    alert(`Mã OTP của bạn là: ${randomOTP}`);
    
    // Navigate to OTP confirmation page
    navigate("/register-confirm", { state: { phone: formData.phone } });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  return (
    <div className="w-full h-screen flex flex-col md:flex-row select-none overflow-hidden">
      {/* LEFT SIDE (IMAGE + LOGO) - hidden on mobile */}
      <div className="hidden md:flex w-1/2 min-h-screen relative justify-center items-center overflow-hidden">
        {/* Background image */}
        <img
          src={banner}
          alt="banner"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay giúp nổi chữ */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Logo Safin */}
        <h1
          className="text-white font-bold drop-shadow-2xl italic font-inter relative z-10"
          style={{
            fontSize: "150px",
            letterSpacing: "3px",
          }}
        >
          Safin
        </h1>
      </div>

      {/* RIGHT SIDE (FORM) - always visible */}
      <div className="w-full md:w-1/2 min-h-screen bg-white relative flex overflow-hidden py-8 md:py-0">
        {/* TOP RIGHT IMAGE - hidden on mobile */}
        <img
          src={comle}
          alt="wrench"
          className="absolute top-4 -right-20 w-56 opacity-90 hidden md:block"
          style={{ transform: "rotate(10deg)" }}
        />

        {/* BOTTOM LEFT IMAGE - hidden on mobile */}
        <img
          src={cone}
          alt="cone"
          className="absolute bottom-0 left-6 w-56 opacity-90 hidden md:block"
          style={{ transform: "rotate(-20deg)" }}
        />

        {/* LOGIN FORM WRAPPER */}
        <div className="w-full flex flex-col justify-start items-center pt-8 md:pt-24">
          {/* FORM BOX */}
          <form onSubmit={handleSubmit} className="w-[90%] max-w-[550px] mx-auto">
            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-semibold leading-tight mb-2">
              Welcome, Sign up 
            </h2>
            <h2 className="text-3xl md:text-4xl font-semibold leading-tight mb-6 md:mb-8">
              to get started
            </h2>


            {/* Name */}
            <div className="mb-5">
              <label className="text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-xl 
                           text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            {/* PHONE */}
            <div className="mb-5">
              <label className="text-sm font-medium">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone"
                className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-xl 
                           text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-5 relative">
              <label className="text-sm font-medium">Password</label>

              <input
                type={showPass ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full mt-1 px-4 py-3 pr-12 border border-gray-300 rounded-xl 
                           text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              
              {/* TOGGLE ICON */}
              <button type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-9 text-gray-500 hover:text-gray-700"
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {/* CONFIRM PASSWORD */}
            <div className="mb-7 relative">
              <label className="text-sm font-medium">Confirm Password</label>
              <input
                type={showConfirmPass ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full mt-1 px-4 py-3 pr-12 border border-gray-300 rounded-xl 
                           text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              
              {/* TOGGLE ICON */}
              <button type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-4 top-9 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            

            {/* BUTTON */}
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg text-base font-medium hover:bg-blue-700 transition">
              Sign Up
            </button>

            {/* REGISTER */}
            <p className="text-center text-sm mt-5">
              Already have an account?{" "}
              <span 
                onClick={() => navigate("/signin")} 
                className="text-blue-600 font-semibold cursor-pointer hover:text-blue-700"
              >
                Sign in 
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;