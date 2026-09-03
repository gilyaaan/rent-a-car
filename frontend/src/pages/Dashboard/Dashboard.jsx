import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/reports/dashboard");

      console.log("Dashboard response:", response);
      console.log("Dashboard data:", response.data);

      // Make sure we actually received data
      if (!response.data) {
        throw new Error("Dashboard returned no data.");
      }

      setDashboard(response.data);
    } catch (err) {
      console.error("Failed to load dashboard:", err);

      setError(
        err.response?.data?.detail ||
        err.message ||
        "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // Loading
  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Loading dashboard...
        </p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Dashboard
        </h1>

        <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg">
          <p className="font-semibold">
            Failed to load dashboard
          </p>

          <p className="mt-1">
            {error}
          </p>
        </div>

        <button
          type="button"
          onClick={loadDashboard}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  // No dashboard data
  if (!dashboard) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          No dashboard data available.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Overview of your Rent-A-Car business
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Vehicles */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <p className="text-gray-500">
            Total Vehicles
          </p>

          <h2 className="text-3xl font-bold mt-2 text-slate-900">
            {dashboard.total_vehicles ?? 0}
          </h2>

          <p className="text-sm text-green-600 mt-2">
            {dashboard.available_vehicles ?? 0} Available
          </p>
        </div>

        {/* Customers */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <p className="text-gray-500">
            Total Customers
          </p>

          <h2 className="text-3xl font-bold mt-2 text-slate-900">
            {dashboard.total_customers ?? 0}
          </h2>
        </div>

        {/* Rentals */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <p className="text-gray-500">
            Active Rentals
          </p>

          <h2 className="text-3xl font-bold mt-2 text-slate-900">
            {dashboard.active_rentals ?? 0}
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            {dashboard.completed_rentals ?? 0} Completed
          </p>
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <p className="text-gray-500">
            Monthly Revenue
          </p>

          <h2 className="text-3xl font-bold mt-2 text-slate-900">
            ₱{Number(
              dashboard.monthly_revenue ?? 0
            ).toLocaleString("en-PH", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Current month
          </p>
        </div>

      </div>

      {/* SECONDARY INFORMATION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Vehicle Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">

          <h2 className="text-xl font-bold text-slate-900 mb-5">
            Vehicle Overview
          </h2>

          <div className="space-y-4">

            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                Available
              </span>

              <span className="font-semibold text-green-600">
                {dashboard.available_vehicles ?? 0}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                Rented
              </span>

              <span className="font-semibold text-blue-600">
                {dashboard.rented_vehicles ?? 0}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                Maintenance
              </span>

              <span className="font-semibold text-orange-600">
                {dashboard.maintenance_vehicles ?? 0}
              </span>
            </div>

          </div>
        </div>

        {/* Rental Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">

          <h2 className="text-xl font-bold text-slate-900 mb-5">
            Rental Overview
          </h2>

          <div className="space-y-4">

            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                Total Reservations
              </span>

              <span className="font-semibold">
                {dashboard.total_reservations ?? 0}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                Total Rentals
              </span>

              <span className="font-semibold">
                {dashboard.total_rentals ?? 0}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                Active Rentals
              </span>

              <span className="font-semibold text-green-600">
                {dashboard.active_rentals ?? 0}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                Completed Rentals
              </span>

              <span className="font-semibold text-blue-600">
                {dashboard.completed_rentals ?? 0}
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* REVENUE */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">

        <div className="flex justify-between items-center">

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Revenue Overview
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Revenue from paid payments
            </p>
          </div>

          <div className="text-right">

            <p className="text-sm text-gray-500">
              Total Revenue
            </p>

            <p className="text-2xl font-bold text-slate-900">
              ₱{Number(
                dashboard.total_revenue ?? 0
              ).toLocaleString("en-PH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}