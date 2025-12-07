import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar  from "./Sidebar"; 
import NavbarAdmin from "./NavBar";

const LayoutAdmin = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar trái */}
      <Sidebar />

      {/* Khu vực nội dung */}
      <div className="flex-1 ml-[280px] flex flex-col bg-gray-100 overflow-hidden">
        {/* Navbar trên */}
        <div className="flex-shrink-0 p-7 pb-2">
          <NavbarAdmin />
        </div>

        {/* Nội dung page - scrollable */}
        <div className="flex-1 overflow-y-auto p-6 pt-2">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LayoutAdmin;
