import React from "react";
// import { DashboardOverview } from './_components/dashboard-overview'
import DashboardOverviewHeader from "./_components/dashboard-overview-header";
import RecentRequests from "./_components/recent-requests";

const DashboardOverviewPage = () => {
  return (
    <div>
      <DashboardOverviewHeader
        title="Request List"
        description="View your profile summary, application status, and recent activity at a glance."
      />
      {/* <DashboardOverview/> */}
      <RecentRequests />
    </div>
  );
};

export default DashboardOverviewPage;
