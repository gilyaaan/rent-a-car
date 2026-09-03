// src/components/VehicleStatusChart.jsx

import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  Cell
} from "recharts";

const data = [
  { name: "Available", value: 35 },
  { name: "Rented", value: 12 },
  { name: "Maintenance", value: 3 }
];

const COLORS = [
  "#22c55e", // Green
  "#3b82f6", // Blue
  "#f59e0b"  // Orange
];

export default function VehicleStatusChart() {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="font-semibold text-lg mb-4">
        Vehicle Status
      </h2>

      <ResponsiveContainer
        width="100%"
        height={280}
      >
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            outerRadius={100}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index]}
              />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}