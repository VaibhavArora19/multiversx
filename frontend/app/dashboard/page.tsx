import { Navbar } from "@/components/(ui)/navbar";
import { PortfolioOverview } from "@/components/dashboard/portfolio-overview";

const DashboardPage = () => {
  return (
    <div className="w-full">
      <Navbar title="Dashboard" />
      <PortfolioOverview />
    </div>
  );
};

export default DashboardPage;
