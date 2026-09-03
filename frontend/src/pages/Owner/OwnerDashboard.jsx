import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Car,
  CalendarDays,
  ClipboardList,
  Wallet,
  Plus,
  ArrowRight,
  LogOut,
  User,
  TrendingUp,
  Clock,
} from "lucide-react";

import api from "../../services/api";
import { getCurrentUser, logoutUser } from "../../services/auth";


export default function OwnerDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [vehicles, setVehicles] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [rentals, setRentals] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ==========================================================
  // LOAD CURRENT USER
  // ==========================================================

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (currentUser) {
      setUser(currentUser);
    }
  }, []);


  // ==========================================================
  // LOAD OWNER DATA
  // ==========================================================

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          vehiclesResponse,
          reservationsResponse,
          rentalsResponse,
        ] = await Promise.all([
          api.get("/vehicles/"),
          api.get("/reservations/"),
          api.get("/rentals/"),
        ]);

        setVehicles(
          Array.isArray(vehiclesResponse.data)
            ? vehiclesResponse.data
            : []
        );

        setReservations(
          Array.isArray(reservationsResponse.data)
            ? reservationsResponse.data
            : []
        );

        setRentals(
          Array.isArray(rentalsResponse.data)
            ? rentalsResponse.data
            : []
        );

      } catch (err) {
        console.error("Owner dashboard error:", err);

        setError(
          err.response?.data?.detail ||
          "Unable to load your dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);


  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };


  // ==========================================================
  // HELPERS
  // ==========================================================

  const getStatus = (item) => {
    return String(item?.status || "").toLowerCase();
  };


  const formatCurrency = (amount) => {
    const value = Number(amount || 0);

    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(value);
  };


  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };


  // ==========================================================
  // VEHICLE STATISTICS
  // ==========================================================

  const totalVehicles = vehicles.length;

  const availableVehicles = vehicles.filter((vehicle) => {
    const status = getStatus(vehicle);

    return status === "available";
  }).length;

  const rentedVehicles = vehicles.filter((vehicle) => {
    const status = getStatus(vehicle);

    return status === "rented";
  }).length;

  const maintenanceVehicles = vehicles.filter((vehicle) => {
    const status = getStatus(vehicle);

    return status === "maintenance";
  }).length;


  // ==========================================================
  // RESERVATION STATISTICS
  // ==========================================================

  const pendingReservations = reservations.filter((reservation) => {
    const status = getStatus(reservation);

    return status === "pending";
  }).length;

  const confirmedReservations = reservations.filter((reservation) => {
    const status = getStatus(reservation);

    return (
      status === "confirmed" ||
      status === "approved"
    );
  }).length;


  // ==========================================================
  // RENTAL STATISTICS
  // ==========================================================

  const activeRentals = rentals.filter((rental) => {
    const status = getStatus(rental);

    return status === "active";
  }).length;

  const completedRentals = rentals.filter((rental) => {
    const status = getStatus(rental);

    return (
      status === "completed" ||
      status === "returned"
    );
  }).length;


  // ==========================================================
  // EARNINGS
  // ==========================================================

  const totalEarnings = rentals.reduce((total, rental) => {
    const status = getStatus(rental);

    if (
      status === "completed" ||
      status === "returned" ||
      status === "active"
    ) {
      return total + Number(rental.total_amount || 0);
    }

    return total;
  }, 0);


  // ==========================================================
  // RECENT DATA
  // ==========================================================

  const recentReservations = [...reservations]
    .sort((a, b) => {
      const dateA = new Date(
        a.created_at ||
        a.pickup_date ||
        0
      );

      const dateB = new Date(
        b.created_at ||
        b.pickup_date ||
        0
      );

      return dateB - dateA;
    })
    .slice(0, 5);


  const recentRentals = [...rentals]
    .sort((a, b) => {
      const dateA = new Date(
        a.created_at ||
        a.start_date ||
        0
      );

      const dateB = new Date(
        b.created_at ||
        b.start_date ||
        0
      );

      return dateB - dateA;
    })
    .slice(0, 5);


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">

        <div className="border-b border-slate-200 bg-white">
          <div className="flex h-20 items-center justify-between px-6 lg:px-10">

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                Car Owner
              </p>

              <h1 className="mt-1 text-xl font-semibold text-slate-950">
                Owner Dashboard
              </h1>
            </div>

          </div>
        </div>


        <div className="p-6 lg:p-10">

          <div className="animate-pulse space-y-8">

            <div className="h-32 rounded-3xl bg-slate-200" />

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-36 rounded-2xl bg-slate-200"
                />
              ))}

            </div>

            <div className="grid gap-6 xl:grid-cols-2">

              <div className="h-80 rounded-2xl bg-slate-200" />

              <div className="h-80 rounded-2xl bg-slate-200" />

            </div>

          </div>

        </div>

      </div>
    );
  }


  return (
    <div className="min-h-screen bg-slate-50">

      {/* ================================================== */}
      {/* TOP HEADER */}
      {/* ================================================== */}

      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">

        <div className="flex h-20 items-center justify-between px-6 lg:px-10">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              Car Owner
            </p>

            <h1 className="mt-1 text-xl font-semibold text-slate-950">
              Owner Dashboard
            </h1>

          </div>


          <div className="flex items-center gap-4">

            <div className="hidden text-right sm:block">

              <p className="text-sm font-semibold text-slate-900">
                {user?.name || "Car Owner"}
              </p>

              <p className="text-xs text-slate-400">
                {user?.email || ""}
              </p>

            </div>


            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white">
              <User size={18} />
            </div>


            <button
              onClick={handleLogout}
              className="hidden items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:flex"
            >
              <LogOut size={16} />
              Logout
            </button>

          </div>

        </div>

      </header>


      {/* ================================================== */}
      {/* MAIN CONTENT */}
      {/* ================================================== */}

      <main className="px-6 py-8 lg:px-10 lg:py-10">

        {/* ================================================== */}
        {/* WELCOME */}
        {/* ================================================== */}

        <section className="mb-8 overflow-hidden rounded-3xl bg-slate-950 p-7 text-white lg:p-10">

          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

            <div className="max-w-2xl">

              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                MyCarRental
              </p>

              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Welcome back, {user?.name || "Car Owner"}.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">
                Manage your vehicles, monitor reservations, track rentals,
                and keep an eye on your rental business from one place.
              </p>

            </div>


            <Link
              to="/owner-vehicles/new"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              <Plus size={18} />
              Add Vehicle
            </Link>

          </div>

        </section>


        {/* ================================================== */}
        {/* ERROR */}
        {/* ================================================== */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">

            <p className="text-sm font-medium text-red-700">
              {error}
            </p>

            <p className="mt-1 text-xs text-red-500">
              Please make sure your backend server is running.
            </p>

          </div>
        )}


        {/* ================================================== */}
        {/* KPI CARDS */}
        {/* ================================================== */}

        <section className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

          {/* Total Vehicles */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Total Vehicles
                </p>

                <p className="mt-3 text-3xl font-semibold text-slate-950">
                  {totalVehicles}
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                <Car size={21} className="text-slate-700" />
              </div>

            </div>

            <p className="mt-4 text-xs text-slate-400">
              Vehicles registered under your account
            </p>

          </div>


          {/* Available Vehicles */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Available
                </p>

                <p className="mt-3 text-3xl font-semibold text-slate-950">
                  {availableVehicles}
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                <TrendingUp size={21} className="text-slate-700" />
              </div>

            </div>

            <p className="mt-4 text-xs text-slate-400">
              Ready to be rented
            </p>

          </div>


          {/* Active Rentals */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Active Rentals
                </p>

                <p className="mt-3 text-3xl font-semibold text-slate-950">
                  {activeRentals}
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                <ClipboardList size={21} className="text-slate-700" />
              </div>

            </div>

            <p className="mt-4 text-xs text-slate-400">
              Currently rented vehicles
            </p>

          </div>


          {/* Earnings */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Total Earnings
                </p>

                <p className="mt-3 text-2xl font-semibold text-slate-950">
                  {formatCurrency(totalEarnings)}
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                <Wallet size={21} className="text-slate-700" />
              </div>

            </div>

            <p className="mt-4 text-xs text-slate-400">
              Earnings from rentals
            </p>

          </div>

        </section>


        {/* ================================================== */}
        {/* QUICK ACTIONS */}
        {/* ================================================== */}

        <section className="mb-8">

          <div className="mb-4">

            <h2 className="text-xl font-semibold text-slate-950">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage your rental business quickly.
            </p>

          </div>


          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <Link
              to="/owner-vehicles"
              className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-400 hover:shadow-sm"
            >

              <div className="flex items-center justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white">
                  <Car size={20} />
                </div>

                <ArrowRight
                  size={18}
                  className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-700"
                />

              </div>

              <h3 className="mt-5 font-semibold text-slate-950">
                Manage Vehicles
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Add and manage your cars.
              </p>

            </Link>


            <Link
              to="/owner-reservations"
              className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-400 hover:shadow-sm"
            >

              <div className="flex items-center justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                  <CalendarDays size={20} className="text-slate-700" />
                </div>

                <ArrowRight
                  size={18}
                  className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-700"
                />

              </div>

              <h3 className="mt-5 font-semibold text-slate-950">
                Reservations
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Review customer bookings.
              </p>

            </Link>


            <Link
              to="/owner-rentals"
              className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-400 hover:shadow-sm"
            >

              <div className="flex items-center justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                  <ClipboardList size={20} className="text-slate-700" />
                </div>

                <ArrowRight
                  size={18}
                  className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-700"
                />

              </div>

              <h3 className="mt-5 font-semibold text-slate-950">
                Rentals
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Monitor active rentals.
              </p>

            </Link>


            <Link
              to="/owner-profile"
              className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-400 hover:shadow-sm"
            >

              <div className="flex items-center justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                  <User size={20} className="text-slate-700" />
                </div>

                <ArrowRight
                  size={18}
                  className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-700"
                />

              </div>

              <h3 className="mt-5 font-semibold text-slate-950">
                My Profile
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Manage your owner account.
              </p>

            </Link>

          </div>

        </section>


        {/* ================================================== */}
        {/* VEHICLE OVERVIEW + RESERVATIONS */}
        {/* ================================================== */}

        <section className="grid gap-6 xl:grid-cols-2">

          {/* Vehicle Overview */}
          <div className="rounded-2xl border border-slate-200 bg-white">

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

              <div>

                <h2 className="font-semibold text-slate-950">
                  Vehicle Overview
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Current status of your vehicles
                </p>

              </div>

              <Link
                to="/owner-vehicles"
                className="text-sm font-semibold text-slate-900 hover:underline"
              >
                View all
              </Link>

            </div>


            <div className="divide-y divide-slate-100">

              {vehicles.length === 0 ? (

                <div className="px-6 py-12 text-center">

                  <Car
                    size={30}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-3 text-sm font-medium text-slate-700">
                    No vehicles yet
                  </p>

                  <Link
                    to="/owner-vehicles/new"
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-xs font-semibold text-white"
                  >
                    <Plus size={14} />
                    Add Vehicle
                  </Link>

                </div>

              ) : (

                vehicles.slice(0, 5).map((vehicle) => (

                  <div
                    key={vehicle.id}
                    className="flex items-center justify-between px-6 py-4"
                  >

                    <div className="flex items-center gap-4">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                        <Car size={18} className="text-slate-600" />
                      </div>

                      <div>

                        <p className="text-sm font-semibold text-slate-900">
                          {vehicle.brand || "Vehicle"}{" "}
                          {vehicle.model || ""}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {vehicle.plate_number || "No plate number"}
                        </p>

                      </div>

                    </div>


                    <div className="text-right">

                      <p className="text-sm font-semibold text-slate-900">
                        {formatCurrency(vehicle.daily_rate)}
                        <span className="text-xs font-normal text-slate-400">
                          /day
                        </span>
                      </p>

                      <span
                        className={`mt-1 inline-block text-[11px] font-semibold uppercase tracking-wide ${
                          getStatus(vehicle) === "available"
                            ? "text-green-600"
                            : getStatus(vehicle) === "rented"
                            ? "text-blue-600"
                            : getStatus(vehicle) === "maintenance"
                            ? "text-red-600"
                            : "text-slate-500"
                        }`}
                      >
                        {vehicle.status || "Unknown"}
                      </span>

                    </div>

                  </div>

                ))

              )}

            </div>

          </div>


          {/* Reservation Overview */}
          <div className="rounded-2xl border border-slate-200 bg-white">

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

              <div>

                <h2 className="font-semibold text-slate-950">
                  Reservation Overview
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Latest customer reservations
                </p>

              </div>

              <Link
                to="/owner-reservations"
                className="text-sm font-semibold text-slate-900 hover:underline"
              >
                View all
              </Link>

            </div>


            <div className="divide-y divide-slate-100">

              {recentReservations.length === 0 ? (

                <div className="px-6 py-12 text-center">

                  <CalendarDays
                    size={30}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-3 text-sm font-medium text-slate-700">
                    No reservations yet
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    New customer bookings will appear here.
                  </p>

                </div>

              ) : (

                recentReservations.map((reservation) => (

                  <div
                    key={reservation.id}
                    className="flex items-center justify-between px-6 py-4"
                  >

                    <div>

                      <p className="text-sm font-semibold text-slate-900">
                        Reservation #{reservation.id}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {formatDate(reservation.pickup_date)}
                        {" → "}
                        {formatDate(reservation.return_date)}
                      </p>

                    </div>


                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase ${
                        getStatus(reservation) === "pending"
                          ? "bg-amber-100 text-amber-700"
                          : getStatus(reservation) === "confirmed" ||
                            getStatus(reservation) === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {reservation.status || "Unknown"}
                    </span>

                  </div>

                ))

              )}

            </div>

          </div>

        </section>


        {/* ================================================== */}
        {/* RENTAL ACTIVITY */}
        {/* ================================================== */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white">

          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

            <div>

              <h2 className="font-semibold text-slate-950">
                Rental Activity
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Recent rental transactions
              </p>

            </div>

            <Link
              to="/owner-rentals"
              className="text-sm font-semibold text-slate-900 hover:underline"
            >
              View all
            </Link>

          </div>


          <div className="overflow-x-auto">

            <table className="w-full min-w-[700px]">

              <thead>

                <tr className="border-b border-slate-100 text-left">

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Rental
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Start Date
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Return Date
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Status
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100">

                {recentRentals.length === 0 ? (

                  <tr>

                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center"
                    >

                      <ClipboardList
                        size={30}
                        className="mx-auto text-slate-300"
                      />

                      <p className="mt-3 text-sm font-medium text-slate-700">
                        No rental activity
                      </p>

                    </td>

                  </tr>

                ) : (

                  recentRentals.map((rental) => (

                    <tr
                      key={rental.id}
                      className="transition hover:bg-slate-50"
                    >

                      <td className="px-6 py-4">

                        <p className="text-sm font-semibold text-slate-900">
                          Rental #{rental.id}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Reservation #{rental.reservation_id || "—"}
                        </p>

                      </td>


                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatDate(rental.start_date)}
                      </td>


                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatDate(rental.actual_return_date)}
                      </td>


                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                        {formatCurrency(rental.total_amount)}
                      </td>


                      <td className="px-6 py-4">

                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase ${
                            getStatus(rental) === "active"
                              ? "bg-blue-100 text-blue-700"
                              : getStatus(rental) === "completed" ||
                                getStatus(rental) === "returned"
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >

                          {getStatus(rental) === "active" && (
                            <Clock size={12} />
                          )}

                          {rental.status || "Unknown"}

                        </span>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </section>


        {/* ================================================== */}
        {/* BUSINESS SUMMARY */}
        {/* ================================================== */}

        <section className="mt-6 grid gap-5 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-6">

            <p className="text-sm text-slate-500">
              Pending Reservations
            </p>

            <p className="mt-2 text-2xl font-semibold text-slate-950">
              {pendingReservations}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Waiting for confirmation
            </p>

          </div>


          <div className="rounded-2xl border border-slate-200 bg-white p-6">

            <p className="text-sm text-slate-500">
              Confirmed Reservations
            </p>

            <p className="mt-2 text-2xl font-semibold text-slate-950">
              {confirmedReservations}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Approved customer bookings
            </p>

          </div>


          <div className="rounded-2xl border border-slate-200 bg-white p-6">

            <p className="text-sm text-slate-500">
              Completed Rentals
            </p>

            <p className="mt-2 text-2xl font-semibold text-slate-950">
              {completedRentals}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Successfully completed rentals
            </p>

          </div>

        </section>


        {/* ================================================== */}
        {/* FOOTER */}
        {/* ================================================== */}

        <footer className="mt-12 border-t border-slate-200 pt-6">

          <div className="flex flex-col justify-between gap-3 text-xs text-slate-400 sm:flex-row">

            <p>
              © {new Date().getFullYear()} MyCarRental. All rights reserved.
            </p>

            <p>
              Car Owner Management
            </p>

          </div>

        </footer>

      </main>

    </div>
  );
}