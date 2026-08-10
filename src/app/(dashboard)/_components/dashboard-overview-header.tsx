import React from "react";

const DashboardOverviewHeader = ({title, description}:{title: string, description:string}) => {
  return (
    <div className="sticky top-0  z-50">
      {/* Header */}
      <div className="bg-white p-5 ">
        <h1 className="text-2xl lg:text-3xl font-bold text-primary leading-normal">
          {title}
        </h1>
        <p className="text-sm font-normal text-primary leading-normal">
          {description}
        </p>
      </div>
    </div>
  );
};

export default DashboardOverviewHeader;









