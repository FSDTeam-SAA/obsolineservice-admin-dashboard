import { Suspense } from "react";
import AddEditFeatureForm from "./_components/add-edit-feature-form";
import DashboardOverviewHeader from "../../_components/dashboard-overview-header";

const AddEditFeatureFormPage = () => {
  return (
    <Suspense fallback={<div className="m-6 h-80 animate-pulse rounded-xl bg-white" />}>
        <DashboardOverviewHeader
        title="Feature Section"
        description="Feature highlights shown in the banner below the hero · 4 items"
      />
      <AddEditFeatureForm />
    </Suspense>
  );
};

export default AddEditFeatureFormPage;
