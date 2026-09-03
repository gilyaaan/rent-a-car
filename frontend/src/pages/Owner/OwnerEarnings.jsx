import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Wallet,
  TrendingUp,
  Car,
  CalendarDays,
  RefreshCw,
  Search,
  Eye,
} from "lucide-react";

import api from "../../services/api";

export default function OwnerEarnings() {
  const [rentals, setRentals] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [timeFilter, setTimeFilter] = useState("All Time");

  const [selectedRental, setSelectedRental] = useState(null);

  // ==========================================================
  // LOAD OWNER DATA
  // ==========================================================

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      /*
       * IMPORTANT:
       * Do NOT call /customers/ here.
       *
       * /rentals/ already returns the rental information
       * belonging to the logged-in owner.
       */

      const [
        rentalsResponse,
        vehiclesResponse,
      ] = await Promise.all([
        api.get("/rentals/"),
        api.get("/vehicles/"),
      ]);

      const rentalData = Array.isArray(rentalsResponse.data)
        ? rentalsResponse.data
        : rentalsResponse.data?.items || [];

      const vehicleData = Array.isArray(vehiclesResponse.data)
        ? vehiclesResponse.data
        : vehiclesResponse.data?.items || [];

      setRentals(rentalData);
      setVehicles(vehicleData);
    } catch (err) {
      console.error("Failed to load earnings:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to load earnings. Please try again."
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

  const formatCurrency = (value) => {
    const amount = Number(value || 0);

    return amount.toLocaleString("en-PH", {
      style: "currency",
      currency: "PHP",
    });
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
      return "Active";
    }

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1).toLowerCase()
    );
  };

  const getStatusClass = (status) => {
    switch (String(status).toLowerCase()) {
      case "completed":
        return "bg-blue-100 text-blue-700";

      case "active":
        return "bg-green-100 text-green-700";

      case "overdue":
        return "bg-orange-100 text-orange-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getVehicle = (vehicleId) => {
    return vehicles.find(
      (vehicle) => vehicle.id === vehicleId
    );
  };

  const getVehicleName = (vehicle) => {
    if (!vehicle) {
      return "Unknown Vehicle";
    }

    const name =
      `${vehicle.brand || ""} ${
        vehicle.model || ""
      }`.trim();

    return name || "Unknown Vehicle";
  };

  const getCustomerName = (rental) => {
    /*
     * The backend rental response should contain:
     *
     * rental.customer
     *
     * We do not request /customers/ anymore.
     */

    if (rental.customer) {
      if (rental.customer.name) {
        return rental.customer.name;
      }

      const fullName =
        `${rental.customer.first_name || ""} ${
          rental.customer.last_name || ""
        }`.trim();

      if (fullName) {
        return fullName;
      }
    }

    return "Unknown Customer";
  };

  // ==========================================================
  // PREPARE RENTAL DATA
  // ==========================================================

  const rentalRows = useMemo(() => {
    return rentals.map((rental) => {
      /*
       * New backend response provides rental.vehicle.
       *
       * We support both:
       * 1. rental.vehicle
       * 2. vehicle lookup from /vehicles/
       */

      const vehicle =
        rental.vehicle ||
        getVehicle(
          rental.reservation?.vehicle_id
        );

      const customer = rental.customer || null;

      return {
        ...rental,

        vehicle,

        customer,

        vehicleName:
          getVehicleName(vehicle),

        customerName:
          getCustomerName(rental),

        displayStatus:
          normalizeStatus(rental.status),
      };
    });
  }, [rentals, vehicles]);

  // ==========================================================
  // DATE FILTER
  // ==========================================================

  const matchesTimeFilter = (rental) => {
    if (timeFilter === "All Time") {
      return true;
    }

    const rentalDate =
      rental.start_date ||
      rental.created_at;

    if (!rentalDate) {
      return false;
    }

    const date = new Date(rentalDate);

    if (Number.isNaN(date.getTime())) {
      return false;
    }

    const now = new Date();

    if (timeFilter === "This Month") {
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }

    if (timeFilter === "Last 3 Months") {
      const threeMonthsAgo = new Date();

      threeMonthsAgo.setMonth(
        threeMonthsAgo.getMonth() - 3
      );

      return date >= threeMonthsAgo;
    }

    if (timeFilter === "This Year") {
      return (
        date.getFullYear() ===
        now.getFullYear()
      );
    }

    return true;
  };

  // ==========================================================
  // FILTER RENTALS
  // ==========================================================

  const filteredRentals = useMemo(() => {
    const searchValue =
      search.toLowerCase().trim();

    return rentalRows.filter((rental) => {
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

      const matchesTime =
        matchesTimeFilter(rental);

      return (
        matchesSearch &&
        matchesTime
      );
    });
  }, [
    rentalRows,
    search,
    timeFilter,
  ]);

  // ==========================================================
  // SUMMARY VALUES
  // ==========================================================

  const totalEarnings = useMemo(() => {
    return filteredRentals.reduce(
      (total, rental) =>
        total +
        Number(
          rental.total_amount || 0
        ),
      0
    );
  }, [filteredRentals]);

  const completedEarnings = useMemo(() => {
    return filteredRentals
      .filter(
        (rental) =>
          String(rental.status).toLowerCase() ===
          "completed"
      )
      .reduce(
        (total, rental) =>
          total +
          Number(
            rental.total_amount || 0
          ),
        0
      );
  }, [filteredRentals]);

  const activeRentalValue = useMemo(() => {
    return filteredRentals
      .filter(
        (rental) =>
          String(rental.status).toLowerCase() ===
          "active"
      )
      .reduce(
        (total, rental) =>
          total +
          Number(
            rental.total_amount || 0
          ),
        0
      );
  }, [filteredRentals]);

  const rentalTransactions =
    filteredRentals.length;

  // ==========================================================
  // EARNINGS BY VEHICLE
  // ==========================================================

  const earningsByVehicle = useMemo(() => {
    const vehicleMap = {};

    filteredRentals.forEach((rental) => {
      const vehicle =
        rental.vehicle ||
        getVehicle(
          rental.reservation?.vehicle_id
        );

      if (!vehicle) {
        return;
      }

      const vehicleId = vehicle.id;

      if (!vehicleMap[vehicleId]) {
        vehicleMap[vehicleId] = {
          vehicleId,
          vehicle,
          vehicleName:
            getVehicleName(vehicle),
          plateNumber:
            vehicle.plate_number || "—",
          rentals: 0,
          earnings: 0,
        };
      }

      vehicleMap[vehicleId].rentals += 1;

      vehicleMap[vehicleId].earnings +=
        Number(
          rental.total_amount || 0
        );
    });

    return Object.values(
      vehicleMap
    ).sort(
      (a, b) =>
        b.earnings - a.earnings
    );
  }, [filteredRentals, vehicles]);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <RefreshCw className="w-5 h-5 animate-spin" />
          Loading earnings...
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
            Earnings
          </h1>

          <p className="text-slate-500 mt-1">
            Track rental earnings generated by your vehicles.
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* TOTAL EARNINGS */}

        <div className="bg-white rounded-xl border border-slate-200 p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Total Earnings
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-1">
                {formatCurrency(totalEarnings)}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-green-50">
              <Wallet className="w-5 h-5 text-green-600" />
            </div>

          </div>

        </div>

        {/* COMPLETED */}

        <div className="bg-white rounded-xl border border-slate-200 p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Completed Earnings
              </p>

              <p className="text-2xl font-bold text-blue-600 mt-1">
                {formatCurrency(completedEarnings)}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-blue-50">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>

          </div>

        </div>

        {/* ACTIVE VALUE */}

        <div className="bg-white rounded-xl border border-slate-200 p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Active Rental Value
              </p>

              <p className="text-2xl font-bold text-green-600 mt-1">
                {formatCurrency(activeRentalValue)}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-green-50">
              <Car className="w-5 h-5 text-green-600" />
            </div>

          </div>

        </div>

        {/* TRANSACTIONS */}

        <div className="bg-white rounded-xl border border-slate-200 p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Rental Transactions
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-1">
                {rentalTransactions}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-100">
              <CalendarDays className="w-5 h-5 text-slate-700" />
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
              placeholder="Search vehicle, customer, rental ID..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
            />

          </div>

          <select
            value={timeFilter}
            onChange={(e) =>
              setTimeFilter(e.target.value)
            }
            className="px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <option value="All Time">
              All Time
            </option>

            <option value="This Month">
              This Month
            </option>

            <option value="Last 3 Months">
              Last 3 Months
            </option>

            <option value="This Year">
              This Year
            </option>
          </select>

        </div>

      </div>

      {/* ======================================================
          EARNINGS BY VEHICLE
      ====================================================== */}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

        <div className="px-6 py-4 border-b border-slate-200">

          <h2 className="font-semibold text-slate-900">
            Earnings by Vehicle
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Revenue generated by each of your vehicles.
          </p>

        </div>

        {earningsByVehicle.length === 0 ? (

          <div className="py-16 text-center">

            <Wallet className="w-12 h-12 mx-auto text-slate-300" />

            <h3 className="mt-4 font-semibold text-slate-700">
              No earnings found
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Earnings will appear here when your vehicles
              have rental transactions.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50 border-b border-slate-200">

                <tr>

                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                    Vehicle
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                    Plate Number
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                    Rentals
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">
                    Earnings
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-200">

                {earningsByVehicle.map(
                  (item) => (

                    <tr
                      key={item.vehicleId}
                      className="hover:bg-slate-50"
                    >

                      <td className="px-6 py-4">

                        <div className="font-medium text-slate-900">
                          {item.vehicleName}
                        </div>

                        {item.vehicle?.year && (
                          <div className="text-sm text-slate-500">
                            {item.vehicle.year}
                          </div>
                        )}

                      </td>

                      <td className="px-6 py-4 text-slate-700">
                        {item.plateNumber}
                      </td>

                      <td className="px-6 py-4 text-slate-700">
                        {item.rentals}
                      </td>

                      <td className="px-6 py-4 text-right">

                        <span className="font-semibold text-slate-900">
                          {formatCurrency(item.earnings)}
                        </span>

                      </td>

                      <td className="px-6 py-4">

                        <div className="flex justify-end">

                          <button
                            type="button"
                            onClick={() => {
                              const rental =
                                filteredRentals.find(
                                  (itemRental) =>
                                    (
                                      itemRental.vehicle?.id ||
                                      itemRental.reservation?.vehicle_id
                                    ) === item.vehicleId
                                );

                              if (rental) {
                                setSelectedRental(rental);
                              }
                            }}
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
          RENTAL TRANSACTIONS
      ====================================================== */}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

        <div className="px-6 py-4 border-b border-slate-200">

          <h2 className="font-semibold text-slate-900">
            Rental Earnings
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Individual rental transactions contributing to your earnings.
          </p>

        </div>

        {filteredRentals.length === 0 ? (

          <div className="py-12 text-center">

            <CalendarDays className="w-10 h-10 mx-auto text-slate-300" />

            <p className="mt-3 text-slate-500">
              No rental transactions found.
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
                    Vehicle
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                    Customer
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                    Start Date
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                    Amount
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                    Status
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

                      <td className="px-6 py-4">

                        <div className="font-medium text-slate-900">
                          Rental #{rental.id}
                        </div>

                        <div className="text-sm text-slate-500">
                          Reservation #{rental.reservation_id}
                        </div>

                      </td>

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

                      <td className="px-6 py-4 text-slate-700">
                        {formatDate(rental.start_date)}
                      </td>

                      <td className="px-6 py-4">

                        <span className="font-semibold text-slate-900">
                          {formatCurrency(
                            rental.total_amount
                          )}
                        </span>

                      </td>

                      <td className="px-6 py-4">

                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                            rental.displayStatus
                          )}`}
                        >
                          {rental.displayStatus}
                        </span>

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
          RENTAL DETAILS MODAL
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
                  Earnings transaction details
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

              </div>

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
                    Return Date
                  </p>

                  <p className="mt-1 font-medium text-slate-900">
                    {formatDate(
                      selectedRental.actual_return_date
                    )}
                  </p>

                </div>

              </div>

              <div>

                <p className="text-xs font-semibold uppercase text-slate-400">
                  Rental Amount
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {formatCurrency(
                    selectedRental.total_amount
                  )}
                </p>

              </div>

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

              <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">

                <p className="text-sm text-slate-600">
                  This earnings information is based on rental
                  transactions associated with your vehicles.
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