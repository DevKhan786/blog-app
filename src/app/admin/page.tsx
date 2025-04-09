import { PagesPieChart } from "@/components/PagesPieChart";
import { CountryChart } from "@/components/CountryChart";
import {
  Eye,
  Users,
  Globe,
  FileText,
  ArrowUpRight,
  Calendar,
} from "lucide-react";
import {
  getTotalViews,
  getUniqueVisitors,
  getPopularPages,
  getViewsByCountry,
} from "./lib/analytics";
import { DashboardCard } from "@/components/DashboardCard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Dashboard() {
  const [totalViews, uniqueVisitors, popularPages, viewsByCountry] =
    await Promise.all([
      getTotalViews(),
      getUniqueVisitors(30),
      getPopularPages(30),
      getViewsByCountry(30),
    ]);

  return (
    <div className=" bg-black/30 rounded-2xl p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
              Analytics Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-gray-700 w-fit">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-300" />
            <span className="text-xs sm:text-sm text-gray-300">
              Last 30 days
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
          <DashboardCard
            title="Total Views"
            value={totalViews.toLocaleString()}
            Icon={Eye}
            description="All-time page views"
          />
          <DashboardCard
            title="Unique Visitors"
            value={uniqueVisitors.toLocaleString()}
            Icon={Users}
            description="Last 30 days"
          />
          <DashboardCard
            title="Top Countries"
            value={viewsByCountry.length.toString()}
            Icon={Globe}
            description="Tracking visitors"
          />
          <DashboardCard
            title="Tracked Pages"
            value={popularPages.length.toString()}
            Icon={FileText}
            description="Active pages"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-800/50 p-4 sm:p-6 rounded-xl border border-gray-700 shadow-lg">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-base sm:text-xl font-semibold text-white">
                Top Pages
              </h2>
              <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <div className="h-[250px] sm:h-[300px] md:h-[350px]">
              <PagesPieChart data={popularPages.slice(0, 5)} />
            </div>
          </div>

          <div className="bg-gray-800/50 p-4 sm:p-6 rounded-xl border border-gray-700 shadow-lg">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-base sm:text-xl font-semibold text-white">
                Visitors by Country
              </h2>
              <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <div className="h-[250px] sm:h-[300px] md:h-[350px]">
              <CountryChart data={viewsByCountry.slice(0, 8)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
