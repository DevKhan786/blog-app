"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export function CountryChart({
  data,
}: {
  data: { country: string; count: number }[];
}) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 10, left: 30, bottom: 20 }}
        >
          <XAxis type="number" tick={{ fill: "#9ca3af", fontSize: 12 }} />
          <YAxis
            dataKey="country"
            type="category"
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            width={80}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              borderColor: "#334155",
              borderRadius: "0.5rem",
              color: "#f8fafc",
            }}
            itemStyle={{ color: "#f8fafc" }}
            formatter={(value) => [
              <span key="value" className="text-blue-300">
                {value} visitors
              </span>,
              "Count",
            ]}
            labelFormatter={(label) => (
              <span className="text-slate-200">Country: {label}</span>
            )}
          />
          <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
