import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import NavbarAdmin from "./NavBar";
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
          <div className="flex-shrink-0 p-7 pb-2 ml-24">
            <NavbarAdmin />
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 pt-2 ml-24">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default LayoutAdmin;
