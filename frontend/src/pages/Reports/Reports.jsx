import { useEffect, useState } from "react";
import {
  RefreshCw,
  Car,
  Users,
  CalendarDays,
  ClipboardList,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  Wrench,
} from "lucide-react";

import api from "../../services/api";

export default function Reports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // ==================================================
  // LOAD REPORT
  // ==================================================

  const loadReport = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.get(
        "/reports/dashboard"
      );

      console.log(
        "Report data:",
        response.data
      );

      setReport(response.data);

    } catch (err) {
      console.error(
        "Failed to load report:",
        err
      );

      setError(
        err.response?.data?.detail ||
        "Unable to load reports."
      );

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ==================================================
  // INITIAL LOAD
  // ==================================================

  useEffect(() => {
    loadReport();
  }, []);

  // ==================================================
  // FORMAT CURRENCY
  // ==================================================

  const formatCurrency = (amount) => {
    return `₱${Number(
      amount || 0
    ).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
          Loading reports...
        </div>
      </div>
    );
  }

  // ==================================================
  // ERROR
  // ==================================================

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6">
          <p className="font-semibold">
            Failed to load reports
          </p>

          <p className="mt-1">
            {error}
          </p>

          <button
            type="button"
            onClick={() => loadReport()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="p-6">
        No report data available.
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Reports
          </h1>

          <p className="text-gray-500 mt-1">
            View rental business reports and statistics
          </p>

          <div className="mt-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              {report.role === "admin"
                ? "Administrator Report"
                : "My Rental Report"}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => loadReport(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          <RefreshCw
            size={17}
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}
        </button>

      </div>


      {/* ==================================================
          SUMMARY CARDS
      ================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* VEHICLES */}

        <div className="bg-white rounded-xl border border-gray-200 p-6">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Vehicles
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                {report.total_vehicles || 0}
              </h2>

              <p className="text-sm text-green-600 mt-2">
                {report.available_vehicles || 0} available
              </p>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg">
              <Car
                size={24}
                className="text-blue-600"
              />
            </div>

          </div>

        </div>


        {/* CUSTOMERS */}

        <div className="bg-white rounded-xl border border-gray-200 p-6">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                {report.role === "admin"
                  ? "Total Customers"
                  : "My Account"}
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                {report.total_customers || 0}
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                Customer profiles
              </p>
            </div>

            <div className="p-3 bg-purple-50 rounded-lg">
              <Users
                size={24}
                className="text-purple-600"
              />
            </div>

          </div>

        </div>


        {/* RENTALS */}

        <div className="bg-white rounded-xl border border-gray-200 p-6">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Active Rentals
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                {report.active_rentals || 0}
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                {report.completed_rentals || 0} completed
              </p>
            </div>

            <div className="p-3 bg-green-50 rounded-lg">
              <ClipboardList
                size={24}
                className="text-green-600"
              />
            </div>

          </div>

        </div>


        {/* REVENUE */}

        <div className="bg-white rounded-xl border border-gray-200 p-6">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Monthly Revenue
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-2">
                {formatCurrency(
                  report.monthly_revenue
                )}
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                Paid payments
              </p>
            </div>

            <div className="p-3 bg-yellow-50 rounded-lg">
              <CreditCard
                size={24}
                className="text-yellow-600"
              />
            </div>

          </div>

        </div>

      </div>


      {/* ==================================================
          VEHICLE STATUS
      ================================================== */}

      <div className="bg-white rounded-xl border border-gray-200 p-6">

        <div className="flex items-center gap-2 mb-5">

          <Car
            size={21}
            className="text-blue-600"
          />

          <h2 className="text-xl font-bold text-gray-900">
            Vehicle Status
          </h2>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* AVAILABLE */}

          <div className="border border-gray-200 rounded-lg p-4">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Available
                </p>

                <p className="text-2xl font-bold text-green-600 mt-1">
                  {report.available_vehicles || 0}
                </p>
              </div>

              <CheckCircle
                size={24}
                className="text-green-600"
              />

            </div>

          </div>


          {/* RENTED */}

          <div className="border border-gray-200 rounded-lg p-4">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Rented
                </p>

                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {report.rented_vehicles || 0}
                </p>
              </div>

              <ClipboardList
                size={24}
                className="text-blue-600"
              />

            </div>

          </div>


          {/* MAINTENANCE */}

          <div className="border border-gray-200 rounded-lg p-4">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Maintenance
                </p>

                <p className="text-2xl font-bold text-orange-600 mt-1">
                  {report.maintenance_vehicles || 0}
                </p>
              </div>

              <Wrench
                size={24}
                className="text-orange-600"
              />

            </div>

          </div>

        </div>

      </div>


      {/* ==================================================
          RESERVATION + RENTAL SUMMARY
      ================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* RESERVATIONS */}

        <div className="bg-white rounded-xl border border-gray-200 p-6">

          <div className="flex items-center gap-2 mb-5">

            <CalendarDays
              size={21}
              className="text-blue-600"
            />

            <h2 className="text-xl font-bold text-gray-900">
              Reservation Summary
            </h2>

          </div>

          <div className="space-y-4">

            <div className="flex justify-between">
              <span className="text-gray-600">
                Total Reservations
              </span>

              <span className="font-semibold">
                {report.total_reservations || 0}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">
                Pending
              </span>

              <span className="font-semibold text-yellow-600">
                {report.pending_reservations || 0}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">
                Confirmed
              </span>

              <span className="font-semibold text-blue-600">
                {report.confirmed_reservations || 0}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">
                Completed
              </span>

              <span className="font-semibold text-green-600">
                {report.completed_reservations || 0}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">
                Cancelled
              </span>

              <span className="font-semibold text-red-600">
                {report.cancelled_reservations || 0}
              </span>
            </div>

          </div>

        </div>


        {/* RENTALS */}

        <div className="bg-white rounded-xl border border-gray-200 p-6">

          <div className="flex items-center gap-2 mb-5">

            <ClipboardList
              size={21}
              className="text-green-600"
            />

            <h2 className="text-xl font-bold text-gray-900">
              Rental Summary
            </h2>

          </div>

          <div className="space-y-4">

            <div className="flex justify-between">
              <span className="text-gray-600">
                Total Rentals
              </span>

              <span className="font-semibold">
                {report.total_rentals || 0}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">
                Active
              </span>

              <span className="font-semibold text-blue-600">
                {report.active_rentals || 0}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">
                Completed
              </span>

              <span className="font-semibold text-green-600">
                {report.completed_rentals || 0}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">
                Cancelled
              </span>

              <span className="font-semibold text-red-600">
                {report.cancelled_rentals || 0}
              </span>
            </div>

          </div>

        </div>

      </div>


      {/* ==================================================
          REVENUE
      ================================================== */}

      <div className="bg-white rounded-xl border border-gray-200 p-6">

        <div className="flex items-center gap-2 mb-5">

          <CreditCard
            size={21}
            className="text-green-600"
          />

          <h2 className="text-xl font-bold text-gray-900">
            Revenue
          </h2>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* TOTAL REVENUE */}

          <div>
            <p className="text-sm text-gray-500">
              Total Paid Revenue
            </p>

            <p className="text-2xl font-bold text-gray-900 mt-2">
              {formatCurrency(
                report.total_revenue
              )}
            </p>
          </div>


          {/* MONTHLY */}

          <div>
            <p className="text-sm text-gray-500">
              This Month
            </p>

            <p className="text-2xl font-bold text-green-600 mt-2">
              {formatCurrency(
                report.monthly_revenue
              )}
            </p>
          </div>


          {/* PAYMENTS */}

          <div>
            <p className="text-sm text-gray-500">
              Total Payments
            </p>

            <p className="text-2xl font-bold text-gray-900 mt-2">
              {report.total_payments || 0}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

