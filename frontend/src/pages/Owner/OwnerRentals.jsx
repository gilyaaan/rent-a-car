import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Car,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  RefreshCw,
  Search,
} from "lucide-react";

import api from "../../services/api";

export default function OwnerRentals() {
  const [rentals, setRentals] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedRental, setSelectedRental] = useState(null);

  // ==========================================================
  // LOAD DATA
  // ==========================================================

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      /*
       * IMPORTANT:
       *
       * We only request /rentals/.
       *
       * We DO NOT request:
       * /customers/
       * /reservations/
       * /vehicles/
       *
       * The backend /rentals/ endpoint returns the
       * related customer, vehicle, and reservation.
       */

      const response = await api.get("/rentals/");

      const rentalData = Array.isArray(response.data)
        ? response.data
        : response.data?.items || [];

      setRentals(rentalData);

    } catch (err) {
      console.error(
        "Failed to load owner rentals:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Unable to load rentals. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ==========================================================
  // HELPERS
  // ==========================================================

  const getCustomerName = (customer) => {
    if (!customer) {
      return "Unknown Customer";
    }

    if (customer.name) {
      return customer.name;
    }

    const fullName =
      `${customer.first_name || ""} ${
        customer.last_name || ""
      }`.trim();

    return fullName || "Unknown Customer";
  };

  const getVehicleName = (vehicle) => {
    if (!vehicle) {
      return "Unknown Vehicle";
    }

    const vehicleName =
      `${vehicle.brand || ""} ${
        vehicle.model || ""
      }`.trim();

    return vehicleName || "Unknown Vehicle";
  };

  const formatDate = (value) => {
    if (!value) {
      return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (value) => {
    const amount = Number(value || 0);

    return amount.toLocaleString("en-PH", {
      style: "currency",
      currency: "PHP",
    });
  };

  const normalizeStatus = (status) => {
    if (!status) {
      return "Active";
    }

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1).toLowerCase()
    );
  };

  const getStatusClass = (status) => {
    switch (String(status).toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-700";

      case "completed":
        return "bg-blue-100 text-blue-700";

      case "overdue":
        return "bg-orange-100 text-orange-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  // ==========================================================
  // PREPARE RENTAL ROWS
  // ==========================================================

  const rentalRows = useMemo(() => {
    return rentals.map((rental) => {

      /*
       * Customer comes directly from the backend.
       */
      const customer = rental.customer;

      /*
       * Vehicle comes directly from the backend.
       */
      const vehicle = rental.vehicle;

      /*
       * Reservation comes directly from the backend.
       */
      const reservation = rental.reservation;

      return {
        ...rental,

        customer,
        vehicle,
        reservation,

        customerName:
          getCustomerName(customer),

        vehicleName:
          getVehicleName(vehicle),

        displayStatus:
          normalizeStatus(rental.status),
      };
    });
  }, [rentals]);

  // ==========================================================
  // FILTER
  // ==========================================================

  const filteredRentals = useMemo(() => {
    const searchValue = search
      .toLowerCase()
      .trim();

    return rentalRows.filter((rental) => {

      const matchesStatus =
        statusFilter === "All" ||
        rental.displayStatus === statusFilter;

      const matchesSearch =
        !searchValue ||
        rental.customerName
          .toLowerCase()
          .includes(searchValue) ||
        rental.vehicleName
          .toLowerCase()
          .includes(searchValue) ||
        String(rental.id)
          .toLowerCase()
          .includes(searchValue) ||
        String(rental.reservation_id)
          .toLowerCase()
          .includes(searchValue);

      return matchesStatus && matchesSearch;
    });

  }, [
    rentalRows,
    search,
    statusFilter,
  ]);

  // ==========================================================
  // COUNTS
  // ==========================================================

  const totalRentals =
    rentals.length;

  const activeRentals =
    rentals.filter(
      (rental) =>
        String(rental.status).toLowerCase() ===
        "active"
    ).length;

  const completedRentals =
    rentals.filter(
      (rental) =>
        String(rental.status).toLowerCase() ===
        "completed"
    ).length;

  const overdueRentals =
    rentals.filter(
      (rental) =>
        String(rental.status).toLowerCase() ===
        "overdue"
    ).length;

  const cancelledRentals =
    rentals.filter(
      (rental) =>
        String(rental.status).toLowerCase() ===
        "cancelled"
    ).length;

  const totalEarnings =
    rentals.reduce(
      (total, rental) =>
        total +
        Number(rental.total_amount || 0),
      0
    );

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">

        <div className="flex items-center gap-3 text-slate-600">

          <RefreshCw className="w-5 h-5 animate-spin" />

          Loading rentals...

        </div>

      </div>
    );
  }

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <div className="space-y-6">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <div className="flex items-center gap-2 mb-2">

            <Link
              to="/owner-dashboard"
              className="text-slate-500 hover:text-slate-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <span className="text-sm text-slate-500">
              Owner Dashboard
            </span>

          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Rentals
          </h1>

          <p className="text-slate-500 mt-1">
            View rental activity and earnings for your vehicles.
          </p>

        </div>

        <button
          onClick={loadData}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>

      </div>

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {/* ======================================================
          SUMMARY CARDS
      ====================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

        {/* TOTAL */}

        <div className="bg-white rounded-xl border border-slate-200 p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Total Rentals
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-1">
                {totalRentals}
              </p>

            </div>

            <div className="p-3 rounded-lg bg-slate-100">
              <Car className="w-5 h-5 text-slate-700" />
            </div>

          </div>

        </div>

        {/* ACTIVE */}

        <div className="bg-white rounded-xl border border-slate-200 p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Active
              </p>

              <p className="text-2xl font-bold text-green-600 mt-1">
                {activeRentals}
              </p>

            </div>

            <div className="p-3 rounded-lg bg-green-50">
              <Clock className="w-5 h-5 text-green-600" />
            </div>

          </div>

        </div>

        {/* COMPLETED */}

        <div className="bg-white rounded-xl border border-slate-200 p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Completed
              </p>

              <p className="text-2xl font-bold text-blue-600 mt-1">
                {completedRentals}
              </p>

            </div>

            <div className="p-3 rounded-lg bg-blue-50">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>

          </div>

        </div>

        {/* OVERDUE */}

        <div className="bg-white rounded-xl border border-slate-200 p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Overdue
              </p>

              <p className="text-2xl font-bold text-orange-600 mt-1">
                {overdueRentals}
              </p>

            </div>

            <div className="p-3 rounded-lg bg-orange-50">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>

          </div>

        </div>

        {/* EARNINGS */}

        <div className="bg-white rounded-xl border border-slate-200 p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Total Earnings
              </p>

              <p className="text-xl font-bold text-slate-900 mt-1">
                {formatCurrency(totalEarnings)}
              </p>

            </div>

            <div className="p-3 rounded-lg bg-slate-100">
              <CheckCircle className="w-5 h-5 text-slate-700" />
            </div>

          </div>

        </div>

      </div>

      {/* ======================================================
          FILTERS
      ====================================================== */}

      <div className="bg-white border border-slate-200 rounded-xl p-4">

        <div className="flex flex-col md:flex-row gap-3">

          <div className="relative flex-1">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              type="text"
              placeholder="Search customer, vehicle, rental ID, or reservation ID..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
            />

          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
          >

            <option value="All">
              All Statuses
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Completed">
              Completed
            </option>

            <option value="Overdue">
              Overdue
            </option>

            <option value="Cancelled">
              Cancelled
            </option>

          </select>

        </div>

      </div>

      {/* ======================================================
          TABLE
      ====================================================== */}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

        <div className="px-6 py-4 border-b border-slate-200">

          <h2 className="font-semibold text-slate-900">
            Rental List
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            {filteredRentals.length} rental
            {filteredRentals.length !== 1
              ? "s"
              : ""}{" "}
            found
          </p>

        </div>

        {filteredRentals.length === 0 ? (

          <div className="py-16 text-center">

            <Car className="w-12 h-12 mx-auto text-slate-300" />

            <h3 className="mt-4 font-semibold text-slate-700">
              No rentals found
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Try changing your search or status filter.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50 border-b border-slate-200">

                <tr>

                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                    Rental
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                    Customer
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                    Vehicle
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                    Start Date
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                    Return Date
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                    Amount
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                    Status
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-200">

                {filteredRentals.map(
                  (rental) => (

                    <tr
                      key={rental.id}
                      className="hover:bg-slate-50"
                    >

                      {/* RENTAL */}

                      <td className="px-6 py-4">

                        <div className="font-medium text-slate-900">
                          Rental #{rental.id}
                        </div>

                        <div className="text-sm text-slate-500">
                          Reservation #{rental.reservation_id}
                        </div>

                      </td>

                      {/* CUSTOMER */}

                      <td className="px-6 py-4">

                        <div className="font-medium text-slate-900">
                          {rental.customerName}
                        </div>

                        {rental.customer?.email && (
                          <div className="text-sm text-slate-500">
                            {rental.customer.email}
                          </div>
                        )}

                      </td>

                      {/* VEHICLE */}

                      <td className="px-6 py-4">

                        <div className="font-medium text-slate-900">
                          {rental.vehicleName}
                        </div>

                        {rental.vehicle?.plate_number && (
                          <div className="text-sm text-slate-500">
                            {rental.vehicle.plate_number}
                          </div>
                        )}

                      </td>

                      {/* START */}

                      <td className="px-6 py-4 text-slate-700">
                        {formatDate(
                          rental.start_date
                        )}
                      </td>

                      {/* RETURN */}

                      <td className="px-6 py-4 text-slate-700">
                        {formatDate(
                          rental.actual_return_date
                        )}
                      </td>

                      {/* AMOUNT */}

                      <td className="px-6 py-4">

                        <span className="font-semibold text-slate-900">
                          {formatCurrency(
                            rental.total_amount
                          )}
                        </span>

                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-4">

                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                            rental.displayStatus
                          )}`}
                        >
                          {rental.displayStatus}
                        </span>

                      </td>

                      {/* ACTION */}

                      <td className="px-6 py-4">

                        <div className="flex justify-end">

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedRental(
                                rental
                              )
                            }
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-700 border border-slate-300 hover:bg-slate-100"
                          >

                            <Eye className="w-4 h-4" />

                            View

                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* ======================================================
          VIEW RENTAL MODAL
      ====================================================== */}

      {selectedRental && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() =>
            setSelectedRental(null)
          }
        >

          <div
            className="w-full max-w-lg bg-white rounded-xl shadow-xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">

              <div>

                <h2 className="text-lg font-bold text-slate-900">
                  Rental #{selectedRental.id}
                </h2>

                <p className="text-sm text-slate-500">
                  Rental details
                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedRental(null)
                }
                className="text-slate-400 hover:text-slate-700 text-xl"
              >
                ×
              </button>

            </div>

            {/* BODY */}

            <div className="p-6 space-y-5">

              {/* RESERVATION */}

              <div>

                <p className="text-xs font-semibold uppercase text-slate-400">
                  Reservation
                </p>

                <p className="mt-1 font-medium text-slate-900">
                  #{selectedRental.reservation_id}
                </p>

              </div>

              {/* CUSTOMER */}

              <div>

                <p className="text-xs font-semibold uppercase text-slate-400">
                  Customer
                </p>

                <p className="mt-1 font-medium text-slate-900">
                  {selectedRental.customerName}
                </p>

                {selectedRental.customer?.email && (
                  <p className="text-sm text-slate-500">
                    {selectedRental.customer.email}
                  </p>
                )}

                {selectedRental.customer?.phone && (
                  <p className="text-sm text-slate-500">
                    {selectedRental.customer.phone}
                  </p>
                )}

              </div>

              {/* VEHICLE */}

              <div>

                <p className="text-xs font-semibold uppercase text-slate-400">
                  Vehicle
                </p>

                <p className="mt-1 font-medium text-slate-900">
                  {selectedRental.vehicleName}
                </p>

                {selectedRental.vehicle?.plate_number && (
                  <p className="text-sm text-slate-500">
                    Plate Number:{" "}
                    {selectedRental.vehicle.plate_number}
                  </p>
                )}

              </div>

              {/* DATES */}

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Start Date
                  </p>

                  <p className="mt-1 font-medium text-slate-900">
                    {formatDate(
                      selectedRental.start_date
                    )}
                  </p>

                </div>

                <div>

                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Actual Return
                  </p>

                  <p className="mt-1 font-medium text-slate-900">
                    {formatDate(
                      selectedRental.actual_return_date
                    )}
                  </p>

                </div>

              </div>

              {/* AMOUNT */}

              <div>

                <p className="text-xs font-semibold uppercase text-slate-400">
                  Total Amount
                </p>

                <p className="mt-1 text-xl font-bold text-slate-900">
                  {formatCurrency(
                    selectedRental.total_amount
                  )}
                </p>

              </div>

              {/* STATUS */}

              <div>

                <p className="text-xs font-semibold uppercase text-slate-400">
                  Status
                </p>

                <span
                  className={`inline-flex mt-2 px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                    selectedRental.displayStatus
                  )}`}
                >
                  {selectedRental.displayStatus}
                </span>

              </div>

              {/* OWNER NOTE */}

              <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">

                <p className="text-sm text-slate-600">
                  Rental status and return information are
                  managed by the administrator. Owners can
                  view rental activity and earnings for their
                  vehicles.
                </p>

              </div>

            </div>

            {/* FOOTER */}

            <div className="px-6 py-4 border-t border-slate-200 flex justify-end">

              <button
                onClick={() =>
                  setSelectedRental(null)
                }
                className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}