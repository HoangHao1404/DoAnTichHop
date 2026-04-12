import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar"; 
import { NavbarAdmin } from "./NavBar";
import { SidebarProvider } from "./ui/sidebar";

const LayoutAdmin = () => {
  const location = useLocation();
  const isAdminMapRoute = location.pathname === "/admin/overview";

  if (isAdminMapRoute) {
    return (
      <SidebarProvider>
        <div className="relative h-screen w-full overflow-hidden bg-gray-100">
          <AdminSidebar />

          <div className="absolute inset-0 z-0">
            <Outlet />
          </div>

          <div className="ml-4 pointer-events-none absolute left-[6rem] right-3 top-3 z-30 sm:right-4 sm:top-4">
            <div className="pointer-events-auto">
              <NavbarAdmin />
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="h-screen w-full bg-gray-100 flex flex-col">
        {/* Floating Sidebar */}
        <AdminSidebar />

        {/* Main content area with margin for floating sidebar */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Navbar */}
          <div className="ml-[6rem] flex-shrink-0 px-3 pt-3 sm:px-4 sm:pt-4">
            <NavbarAdmin />
          </div>

          {/* Content */}
          <div className="ml-[6rem] flex-1 overflow-y-auto px-3 pb-3 pt-2 sm:px-4 sm:pb-4">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default LayoutAdmin;
