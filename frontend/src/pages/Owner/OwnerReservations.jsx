import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  RefreshCw,
  Search,
} from "lucide-react";

import api from "../../services/api";

export default function OwnerReservations() {
  const [reservations, setReservations] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedReservation, setSelectedReservation] = useState(null);

  // ==========================================================
  // LOAD DATA
  // ==========================================================

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      // IMPORTANT:
      // Do NOT request /customers/.
      // The backend now returns customer information
      // inside each reservation.
      const [
        reservationsResponse,
        vehiclesResponse,
      ] = await Promise.all([
        api.get("/reservations/"),
        api.get("/vehicles/"),
      ]);

      const reservationData = Array.isArray(
        reservationsResponse.data
      )
        ? reservationsResponse.data
        : reservationsResponse.data?.items || [];

      const vehicleData = Array.isArray(
        vehiclesResponse.data
      )
        ? vehiclesResponse.data
        : vehiclesResponse.data?.items || [];

      setReservations(reservationData);
      setVehicles(vehicleData);

    } catch (err) {
      console.error(
        "Failed to load owner reservations:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Unable to load reservations. Please try again."
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

  const getVehicle = (vehicleId) => {
    return vehicles.find(
      (vehicle) => vehicle.id === vehicleId
    );
  };

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

  const normalizeStatus = (status) => {
    if (!status) {
      return "Pending";
    }

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1).toLowerCase()
    );
  };

  const getStatusClass = (status) => {
    switch (String(status).toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-700";

      case "completed":
        return "bg-blue-100 text-blue-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      case "pending":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // ==========================================================
  // COMBINE RESERVATION DATA
  // ==========================================================

  const reservationRows = useMemo(() => {
    return reservations.map((reservation) => {
      /*
       * IMPORTANT:
       *
       * Customer now comes directly from:
       *
       * reservation.customer
       *
       * We no longer search the /customers/ endpoint.
       */

      const customer = reservation.customer;

      /*
       * Vehicle also comes directly from the reservation
       * when the backend returns it.
       *
       * Fallback to the vehicles list for compatibility.
       */
      const vehicle =
        reservation.vehicle ||
        getVehicle(reservation.vehicle_id);

      return {
        ...reservation,

        vehicle,
        customer,

        vehicleName: getVehicleName(vehicle),
        customerName: getCustomerName(customer),

        displayStatus: normalizeStatus(
          reservation.status
        ),
      };
    });
  }, [reservations, vehicles]);

  // ==========================================================
  // FILTER RESERVATIONS
  // ==========================================================

  const filteredReservations = useMemo(() => {
    const searchValue = search
      .toLowerCase()
      .trim();

    return reservationRows.filter((reservation) => {
      const matchesStatus =
        statusFilter === "All" ||
        reservation.displayStatus === statusFilter;

      const matchesSearch =
        !searchValue ||
        reservation.customerName
          .toLowerCase()
          .includes(searchValue) ||
        reservation.vehicleName
          .toLowerCase()
          .includes(searchValue) ||
        String(reservation.id)
          .toLowerCase()
          .includes(searchValue);

      return matchesStatus && matchesSearch;
    });
  }, [
    reservationRows,
    search,
    statusFilter,
  ]);

  // ==========================================================
  // COUNTS
  // ==========================================================

  const totalReservations =
    reservations.length;

  const pendingReservations =
    reservations.filter(
      (reservation) =>
        String(reservation.status).toLowerCase() ===
        "pending"
    ).length;

  const confirmedReservations =
    reservations.filter(
      (reservation) =>
        String(reservation.status).toLowerCase() ===
        "confirmed"
    ).length;

  const completedReservations =
    reservations.filter(
      (reservation) =>
        String(reservation.status).toLowerCase() ===
        "completed"
    ).length;

  const cancelledReservations =
    reservations.filter(
      (reservation) =>
        String(reservation.status).toLowerCase() ===
        "cancelled"
    ).length;

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <RefreshCw className="w-5 h-5 animate-spin" />
          Loading reservations...
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
            Reservations
          </h1>

          <p className="text-slate-500 mt-1">
            View and manage reservations for your vehicles.
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
                Total Reservations
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-1">
                {totalReservations}
              </p>

            </div>

            <div className="p-3 rounded-lg bg-slate-100">
              <CalendarDays className="w-5 h-5 text-slate-700" />
            </div>

          </div>

        </div>

        {/* PENDING */}

        <div className="bg-white rounded-xl border border-slate-200 p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Pending
              </p>

              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {pendingReservations}
              </p>

            </div>

            <div className="p-3 rounded-lg bg-yellow-50">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>

          </div>

        </div>

        {/* CONFIRMED */}

        <div className="bg-white rounded-xl border border-slate-200 p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Confirmed
              </p>

              <p className="text-2xl font-bold text-green-600 mt-1">
                {confirmedReservations}
              </p>

            </div>

            <div className="p-3 rounded-lg bg-green-50">
              <CheckCircle className="w-5 h-5 text-green-600" />
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
                {completedReservations}
              </p>

            </div>

            <div className="p-3 rounded-lg bg-blue-50">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>

          </div>

        </div>

        {/* CANCELLED */}

        <div className="bg-white rounded-xl border border-slate-200 p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Cancelled
              </p>

              <p className="text-2xl font-bold text-red-600 mt-1">
                {cancelledReservations}
              </p>

            </div>

            <div className="p-3 rounded-lg bg-red-50">
              <XCircle className="w-5 h-5 text-red-600" />
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
              placeholder="Search customer, vehicle, or reservation ID..."
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

            <option value="Pending">
              Pending
            </option>

            <option value="Confirmed">
              Confirmed
            </option>

            <option value="Completed">
              Completed
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
            Reservation List
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            {filteredReservations.length} reservation
            {filteredReservations.length !== 1
              ? "s"
              : ""}{" "}
            found
          </p>

        </div>

        {filteredReservations.length === 0 ? (

          <div className="py-16 text-center">

            <CalendarDays className="w-12 h-12 mx-auto text-slate-300" />

            <h3 className="mt-4 font-semibold text-slate-700">
              No reservations found
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
                    ID
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                    Customer
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                    Vehicle
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                    Pickup
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                    Return
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                    Status
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-200">

                {filteredReservations.map(
                  (reservation) => (

                    <tr
                      key={reservation.id}
                      className="hover:bg-slate-50"
                    >

                      {/* ID */}

                      <td className="px-6 py-4">

                        <span className="font-medium text-slate-900">
                          #{reservation.id}
                        </span>

                      </td>

                      {/* CUSTOMER */}

                      <td className="px-6 py-4">

                        <div className="font-medium text-slate-900">
                          {reservation.customerName}
                        </div>

                        {reservation.customer?.email && (
                          <div className="text-sm text-slate-500">
                            {reservation.customer.email}
                          </div>
                        )}

                      </td>

                      {/* VEHICLE */}

                      <td className="px-6 py-4">

                        <div className="font-medium text-slate-900">
                          {reservation.vehicleName}
                        </div>

                        {reservation.vehicle?.plate_number && (
                          <div className="text-sm text-slate-500">
                            {reservation.vehicle.plate_number}
                          </div>
                        )}

                      </td>

                      {/* PICKUP */}

                      <td className="px-6 py-4 text-slate-700">
                        {formatDate(
                          reservation.pickup_date
                        )}
                      </td>

                      {/* RETURN */}

                      <td className="px-6 py-4 text-slate-700">
                        {formatDate(
                          reservation.return_date
                        )}
                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-4">

                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                            reservation.displayStatus
                          )}`}
                        >
                          {reservation.displayStatus}
                        </span>

                      </td>

                      {/* ACTION */}

                      <td className="px-6 py-4">

                        <div className="flex justify-end">

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedReservation(
                                reservation
                              )
                            }
                            title="View reservation"
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
          VIEW RESERVATION MODAL
      ====================================================== */}

      {selectedReservation && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() =>
            setSelectedReservation(null)
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
                  Reservation #{selectedReservation.id}
                </h2>

                <p className="text-sm text-slate-500">
                  Reservation details
                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedReservation(null)
                }
                className="text-slate-400 hover:text-slate-700 text-xl"
              >
                ×
              </button>

            </div>

            {/* BODY */}

            <div className="p-6 space-y-5">

              {/* CUSTOMER */}

              <div>

                <p className="text-xs font-semibold uppercase text-slate-400">
                  Customer
                </p>

                <p className="mt-1 font-medium text-slate-900">
                  {selectedReservation.customerName}
                </p>

                {selectedReservation.customer?.email && (
                  <p className="text-sm text-slate-500">
                    {selectedReservation.customer.email}
                  </p>
                )}

                {selectedReservation.customer?.phone && (
                  <p className="text-sm text-slate-500">
                    {selectedReservation.customer.phone}
                  </p>
                )}

              </div>

              {/* VEHICLE */}

              <div>

                <p className="text-xs font-semibold uppercase text-slate-400">
                  Vehicle
                </p>

                <p className="mt-1 font-medium text-slate-900">
                  {selectedReservation.vehicleName}
                </p>

                {selectedReservation.vehicle?.plate_number && (
                  <p className="text-sm text-slate-500">
                    Plate Number:{" "}
                    {selectedReservation.vehicle.plate_number}
                  </p>
                )}

              </div>

              {/* DATES */}

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Pickup Date
                  </p>

                  <p className="mt-1 font-medium text-slate-900">
                    {formatDate(
                      selectedReservation.pickup_date
                    )}
                  </p>

                </div>

                <div>

                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Return Date
                  </p>

                  <p className="mt-1 font-medium text-slate-900">
                    {formatDate(
                      selectedReservation.return_date
                    )}
                  </p>

                </div>

              </div>

              {/* STATUS */}

              <div>

                <p className="text-xs font-semibold uppercase text-slate-400">
                  Status
                </p>

                <span
                  className={`inline-flex mt-2 px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                    selectedReservation.displayStatus
                  )}`}
                >
                  {selectedReservation.displayStatus}
                </span>

              </div>

              {/* OWNER NOTE */}

              <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">

                <p className="text-sm text-slate-600">
                  As a vehicle owner, you can view reservations
                  for your vehicles. Reservation status is managed
                  by the system/customer workflow.
                </p>

              </div>

            </div>

            {/* FOOTER */}

            <div className="px-6 py-4 border-t border-slate-200 flex justify-end">

              <button
                onClick={() =>
                  setSelectedReservation(null)
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