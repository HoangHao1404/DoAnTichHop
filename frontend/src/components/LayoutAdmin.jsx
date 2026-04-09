import React from "react";
import { Outlet } from "react-router-dom";
<<<<<<< HEAD
import AdminSidebar from "./AdminSidebar"; 
import { NavbarAdmin } from "./NavBar";
=======
import AdminSidebar from "./AdminSidebar";
import NavbarAdmin from "./NavBar";
>>>>>>> main
import { SidebarProvider } from "./ui/sidebar";

const LayoutAdmin = () => {
  return (
    <SidebarProvider>
      <div className="h-screen w-full bg-gray-100 flex flex-col">
        {/* Floating Sidebar */}
        <AdminSidebar />

        {/* Main content area with margin for floating sidebar */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Navbar */}
<<<<<<< HEAD
          <div className="ml-[6rem] flex-shrink-0 px-3 pt-3 sm:px-4 sm:pt-4">
=======
          <div className="flex-shrink-0 p-7 pb-2 ml-24">
>>>>>>> main
            <NavbarAdmin />
          </div>

          {/* Content */}
<<<<<<< HEAD
          <div className="ml-[6rem] flex-1 overflow-y-auto px-3 pb-3 pt-2 sm:px-4 sm:pb-4">
=======
          <div className="flex-1 overflow-y-auto p-6 pt-2 ml-24">
>>>>>>> main
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default LayoutAdmin;
