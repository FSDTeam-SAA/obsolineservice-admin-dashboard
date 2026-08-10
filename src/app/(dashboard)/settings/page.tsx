import React from "react";
import SettingsContainer from "./_components/settings-container";
import DashboardHeader from "@/components/ui/dashboard-header";

const SettingsPage = () => {
  return (
    <div className="">
      <DashboardHeader
        title="Settings"
        desc="Manage your admin preferences and platform configuration"
      />
      <SettingsContainer />
    </div>
  );
};

export default SettingsPage;
