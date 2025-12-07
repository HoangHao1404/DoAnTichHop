import React from "react";
import UserTable from "../components/UserTable";

const UserManagement = () => {
  return (
    <div
      className="
        w-full min-h-screen
        px-4 md:px-6 lg:px-8 py-4
        bg-[#f4f5fb]
      "
    >
      <div
        className="
          max-w-7xl mx-auto
          bg-white
          rounded-[24px]
          shadow-[0_8px_30px_rgba(15,23,42,0.08)]
          border border-gray-100
          px-6 lg:px-8 py-6
          mt-24
          ml-[220px]
        "
      >
        {/* Gọi component UserTable */}
        <UserTable />
      </div>
    </div>
  );
};

export default UserManagement;
