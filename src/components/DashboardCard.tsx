import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string;
  description: string;
  Icon: LucideIcon;
}

export const DashboardCard = ({
  title,
  value,
  description,
  Icon,
}: DashboardCardProps) => {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 flex w-full flex-col gap-2 rounded-xl p-4 shadow-lg border border-gray-700 hover:border-gray-600 transition-all duration-300">
      <section className="flex justify-between items-center">
        <p className="text-xs md:text-sm font-medium text-gray-300 truncate">
          {title}
        </p>
        <div className="p-1 md:p-2 rounded-lg bg-gray-700/50">
          <Icon className="h-3 w-3 md:h-4 md:w-4 text-white" />
        </div>
      </section>
      <section className="flex flex-col gap-0.5">
        <h2 className="text-lg md:text-2xl font-bold text-white truncate">
          {value}
        </h2>
        <p className="text-[0.6rem] md:text-xs text-gray-400 truncate">
          {description}
        </p>
      </section>
    </div>
  );
};
