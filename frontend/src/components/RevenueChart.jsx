// src/components/RevenueChart.jsx

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

const data = [
  { month: "Jan", revenue: 50000 },
  { month: "Feb", revenue: 75000 },
  { month: "Mar", revenue: 60000 },
  { month: "Apr", revenue: 90000 },
  { month: "May", revenue: 120000 },
  { month: "Jun", revenue: 85000 }
];

export default function RevenueChart() {
  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="font-semibold text-lg mb-4">
        Monthly Revenue
      </h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="revenue"
            fill="#1e40af"
           radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}