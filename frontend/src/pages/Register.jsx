import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import banner from "../image/banner-public.jpeg";
import comle from "../image/comle.png";
import cone from "../image/trafficCone.png";

const Register = () => {
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false)

  return (
    <div className="w-full h-screen flex select-none overflow-hidden">
      {/* LEFT SIDE (IMAGE + LOGO) */}
      <div className="w-1/2 h-full relative flex justify-center items-center">
        {/* Background image */}
        <img
          src={banner}
          alt="banner"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay giúp nổi chữ */}
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Logo Safin */}
        <h1
          className="text-white font-bold drop-shadow-2xl italic font-inter relative"
          style={{
            fontSize: "150px",
            letterSpacing: "3px",
          }}
        >
          Safin
        </h1>
      </div>

      {/* RIGHT SIDE (FORM) */}
      <div className="w-1/2 h-full bg-white relative flex overflow-hidden">
        {/* TOP RIGHT IMAGE */}
        <img
          src={comle}
          alt="wrench"
          className="absolute top-4 -right-20 w-56 opacity-90"
          style={{ transform: "rotate(10deg)" }}
        />

        {/* BOTTOM LEFT IMAGE */}
        <img
          src={cone}
          alt="cone"
          className="absolute bottom-0 left-6 w-56 opacity-90"
          style={{ transform: "rotate(-20deg)" }}
        />

        {/* LOGIN FORM WRAPPER */}
        <div className="w-full flex flex-col justify-start items-center pt-24">
          {/* FORM BOX */}
          <div className="w-[85%] max-w-[550px] mx-auto">
            {/* Title */}
            <h2 className="text-4xl font-semibold leading-tight mb-2">
              Welcome, Sign up 
            </h2>
            <h2 className="text-4xl font-semibold leading-tight mb-8">
              to get started
            </h2>


            {/* Name */}
            <div className="mb-5">
              <label className="text-sm font-medium">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-xl 
                           text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            {/* PHONE */}
            <div className="mb-5">
              <label className="text-sm font-medium">Phone</label>
              <input
                type="text"
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
                placeholder="Enter your password"
                className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-xl 
                           text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              </div>
            {/* CONFIRM PASSWORD */}
            <div className="mb-7 relative">
              <label className="text-sm font-medium">Confirm Password</label>
              <input
                type= {showConfirmPass ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-xl 
                           text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

              {/* TOGGLE ICON */}
              <button type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 bottom-4 text-gray-500 hover:text-gray-700"
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>

              {/* TOGGLE ICON */}
              <button type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-4 bottom-4 text-gray-500 hover:text-gray-700"
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            

            {/* BUTTON */}
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg text-base font-medium hover:bg-blue-700 transition">
              Sign Up
            </button>

            {/* REGISTER */}
            <p className="text-center text-sm mt-5">
              Already have an account?{" "}
              <span className="text-blue-600 font-semibold cursor-pointer">
                Sign in 
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;