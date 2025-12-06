import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import banner from "../image/banner-public.jpeg";
import comle from "../image/comle.png";
import cone from "../image/trafficCone.png";

const SignIn = () => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    password: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.phone || !formData.password) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }
    
    // Lấy danh sách user đã đăng ký
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Tìm user với phone và password khớp
    const user = registeredUsers.find(
      u => u.phone === formData.phone && u.password === formData.password
    );
    
    if (!user) {
      alert("Số điện thoại hoặc mật khẩu không đúng!");
      return;
    }
    
    // Lưu thông tin đăng nhập
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Navigate to dashboard after successful login
    alert(`Đăng nhập thành công! Chào mừng ${user.name}`);
    navigate("/dashboard");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row select-none overflow-hidden">
      {/* LEFT SIDE (desktop only) */}
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

      {/* RIGHT SIDE (FORM - always visible) */}
      <div className="w-full md:w-1/2 min-h-screen bg-white relative flex justify-center items-center py-10">
        {/* Decor only on desktop */}
        <img
          src={comle}
          alt="wrench"
          className="absolute top-4 -right-20 w-56 opacity-90 hidden md:block"
          style={{ transform: "rotate(10deg)" }}
        />

        <img
          src={cone}
          alt="cone"
          className="absolute -bottom-8 left-6 w-56 opacity-90 hidden md:block"
          style={{ transform: "rotate(-20deg)" }}
        />

        {/* FORM */}
        <form onSubmit={handleSubmit} className="w-[90%] max-w-[450px] mx-auto mt-10 md:mt-0">
          <h2 className="text-3xl md:text-4xl font-semibold leading-tight mb-2">
            Welcome, Log in to
          </h2>
          <h2 className="text-3xl md:text-4xl font-semibold leading-tight mb-8">
            your account.
          </h2>

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
          <div className="mb-7 relative">
            <label className="text-sm font-medium">Password</label>

            <input
              type={showPass ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-xl 
                         text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none pr-12"
            />

            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 bottom-4 text-gray-500 hover:text-gray-700"
            >
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* BUTTON */}
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg text-base font-medium hover:bg-blue-700 transition">
            Log In
          </button>

          {/* REGISTER */}
          <p className="text-center text-sm mt-5">
            Don't Have An Account Yet?{" "}
            <span 
              onClick={() => navigate("/register")} 
              className="text-blue-600 font-semibold cursor-pointer hover:text-blue-700"
            >
              Register For Free
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
