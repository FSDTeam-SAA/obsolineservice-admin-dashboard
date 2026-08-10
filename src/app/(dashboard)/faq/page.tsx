import React from "react";
import FaqContainer from "./_components/faq-container";
import DashboardOverviewHeader from "../_components/dashboard-overview-header";

const FaqPage = () => {
  return (
    <div>
      <DashboardOverviewHeader
        title="FAQ Section"
        description="Create, review, and manage frequently asked questions."
      />
      <FaqContainer />
    </div>
  );
};

export default FaqPage;
