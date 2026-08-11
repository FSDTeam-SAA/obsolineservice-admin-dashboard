import DashboardOverviewHeader from "@/app/(dashboard)/_components/dashboard-overview-header";

interface DashboardHeaderProps {
  title: string;
  desc: string;
}

const DashboardHeader = ({ title, desc }: DashboardHeaderProps) => {
  return <DashboardOverviewHeader title={title} description={desc} />;
};

export default DashboardHeader;
