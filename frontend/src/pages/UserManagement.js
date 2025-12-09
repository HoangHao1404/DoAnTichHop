import React from "react";
import UserTable from "../components/UserTable";

const UserManagement = () => {
  return (
    <div className="w-full min-h-full bg-gray-50">
      <div className="bg-white rounded-[24px] shadow-md border border-gray-100 p-6">
        {/* Gọi component UserTable */}
        <UserTable />
      </div>
    </div>
  );
};

export default UserManagement;
