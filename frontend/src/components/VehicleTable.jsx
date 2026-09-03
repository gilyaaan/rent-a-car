import { useEffect, useState } from "react";
import api from "../services/api";

export default function VehicleTable() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const response = await api.get("/vehicles/");

        console.log("Vehicles from API:", response.data);

        setVehicles(response.data);
      } catch (err) {
        console.error("Failed to load vehicles:", err);

        setError("Failed to load vehicles.");
      } finally {
        setLoading(false);
      }
    };

    loadVehicles();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <p className="text-gray-500">
          Loading vehicles...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <p className="text-red-500">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">

      <table className="w-full">

        <thead className="bg-slate-100">
          <tr>
            <th className="p-4 text-left">
              ID
            </th>

            <th className="p-4 text-left">
              Brand
            </th>

            <th className="p-4 text-left">
              Model
            </th>

            <th className="p-4 text-left">
              Year
            </th>

            <th className="p-4 text-left">
              Plate No.
            </th>

            <th className="p-4 text-left">
              Daily Rate
            </th>

            <th className="p-4 text-left">
              Status
            </th>
          </tr>
        </thead>

        <tbody>

          {vehicles.map((vehicle) => (
            <tr
              key={vehicle.id}
              className="border-t"
            >

              <td className="p-4">
                {vehicle.id}
              </td>

              <td className="p-4">
                {vehicle.brand}
              </td>

              <td className="p-4">
                {vehicle.model}
              </td>

              <td className="p-4">
                {vehicle.year}
              </td>

              <td className="p-4">
                {vehicle.plate_number}
              </td>

              <td className="p-4">
                ₱{vehicle.daily_rate}
              </td>

              <td className="p-4">

                <span
                  className={
                    vehicle.status === "Available"
                      ? "bg-green-100 text-green-700 px-3 py-1 rounded-full"
                      : "bg-red-100 text-red-700 px-3 py-1 rounded-full"
                  }
                >
                  {vehicle.status}
                </span>

              </td>

            </tr>
          ))}

        </tbody>

      </table>

      {vehicles.length === 0 && (
        <div className="p-6 text-center text-gray-500">
          No vehicles found.
        </div>
      )}

    </div>
  );
}