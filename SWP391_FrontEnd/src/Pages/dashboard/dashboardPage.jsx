import React from "react";
import DashboardStats from "./DashboardStats";
import AppLayout from "../../components/layout/AppLayout";

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-8">
      <DashboardStats />
    </div>
  );
};

export default DashboardPage;
