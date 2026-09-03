import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

const data = [
  { month: "Jan", revenue: 50000 },
  { month: "Feb", revenue: 70000 },
  { month: "Mar", revenue: 65000 },
  { month: "Apr", revenue: 90000 },
  { month: "May", revenue: 120000 },
  { month: "Jun", revenue: 85000 }
];

export default function RevenueReport() {
  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-xl font-semibold mb-4">
        Revenue Report
      </h2>

      <ResponsiveContainer
        width="100%"
        height={350}
      >
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="revenue"
          />
        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}