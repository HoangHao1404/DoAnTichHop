import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar"; 
import { NavbarAdmin } from "./NavBar";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";

const LayoutAdmin = () => {
  return (
    <SidebarProvider style={{ "--sidebar-width": "5.5rem" }}>
      <div className="flex h-screen w-full bg-gray-100 overflow-x-hidden">
        <AdminSidebar />

        <div className="fixed left-3 top-3 z-50 md:hidden">
          <SidebarTrigger className="h-9 w-9 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50" />
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="shrink-0 px-3 pt-14 sm:px-4 sm:pt-4">
            <NavbarAdmin />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 pb-3 pt-2 sm:px-4 sm:pb-4">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default LayoutAdmin;