import { useEffect, useState } from "react";
import {
  Users,
  Car,
  CalendarDays,
  KeyRound,
  ShieldCheck,
  UserCog,
  DollarSign,
  ClipboardList,
  Settings,
  BarChart3,
  Crown,
  RefreshCw,
  ArrowRight,
} from "lucide-react";

import { Link } from "react-router-dom";
import api from "../../services/api";


export default function SuperAdminDashboard() {

  const [stats, setStats] = useState({
    users: 0,
    admins: 0,
    carOwners: 0,
    customers: 0,
    vehicles: 0,
    reservations: 0,
    rentals: 0,
    payments: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ==================================================
  // LOAD SYSTEM DATA
  // ==================================================

  const loadDashboard = async () => {

    try {

      setLoading(true);
      setError("");

      const [
        usersResponse,
        vehiclesResponse,
        reservationsResponse,
        rentalsResponse,
        paymentsResponse,
      ] = await Promise.all([
        api.get("/users/"),
        api.get("/vehicles/"),
        api.get("/reservations/"),
        api.get("/rentals/"),
        api.get("/payments/"),
      ]);


      const users = usersResponse.data || [];

      setStats({
        users: users.length,

        admins: users.filter(
          (user) => user.role === "admin"
        ).length,

        carOwners: users.filter(
          (user) => user.role === "car_owner"
        ).length,

        customers: users.filter(
          (user) => user.role === "user"
        ).length,

        vehicles: (vehiclesResponse.data || []).length,

        reservations:
          (reservationsResponse.data || []).length,

        rentals:
          (rentalsResponse.data || []).length,

        payments:
          (paymentsResponse.data || []).length,
      });

    } catch (err) {

      console.error(
        "Super Admin dashboard error:",
        err
      );

      setError(
        err?.response?.data?.detail ||
        "Unable to load system information."
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    loadDashboard();
  }, []);


  // ==================================================
  // STAT CARD
  // ==================================================

  const StatCard = ({
    title,
    value,
    icon: Icon,
    description,
  }) => (

    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm text-gray-500">
            {title}
          </p>

          <p className="text-3xl font-bold text-gray-900 mt-2">
            {loading ? "—" : value}
          </p>

          {description && (
            <p className="text-xs text-gray-400 mt-1">
              {description}
            </p>
          )}

        </div>

        <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">
          <Icon size={21} className="text-slate-700" />
        </div>

      </div>

    </div>
  );


  // ==================================================
  // MANAGEMENT CARD
  // ==================================================

  const ManagementCard = ({
    icon: Icon,
    title,
    description,
    path,
  }) => (

    <Link
      to={path}
      className="group bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:border-slate-300 transition"
    >

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-4">

          <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">
            <Icon
              size={21}
              className="text-slate-700"
            />
          </div>

          <div>

            <h3 className="font-semibold text-gray-900">
              {title}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              {description}
            </p>

          </div>

        </div>

        <ArrowRight
          size={18}
          className="text-gray-400 group-hover:text-gray-900 transition"
        />

      </div>

    </Link>
  );


  return (

    <div className="min-h-screen bg-gray-50">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="bg-white border-b border-gray-200">

        <div className="px-6 py-6">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center">

                <Crown
                  size={24}
                  className="text-white"
                />

              </div>

              <div>

                <div className="flex items-center gap-2">

                  <h1 className="text-2xl font-bold text-gray-900">
                    Super Admin
                  </h1>

                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-900 text-white">
                    SYSTEM OWNER
                  </span>

                </div>

                <p className="text-sm text-gray-500 mt-1">
                  Complete system control center
                </p>

              </div>

            </div>


            <button
              onClick={loadDashboard}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition disabled:opacity-50"
            >

              <RefreshCw
                size={17}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh

            </button>

          </div>

        </div>

      </div>


      {/* ==================================================
          CONTENT
      ================================================== */}

      <div className="p-6 space-y-8">

        {error && (

          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3">
            {error}
          </div>

        )}


        {/* ==================================================
            SYSTEM STATISTICS
        ================================================== */}

        <section>

          <div className="mb-4">

            <h2 className="text-lg font-bold text-gray-900">
              System Overview
            </h2>

            <p className="text-sm text-gray-500">
              Complete statistics across the platform
            </p>

          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            <StatCard
              title="Total Users"
              value={stats.users}
              icon={Users}
              description="All registered accounts"
            />

            <StatCard
              title="Administrators"
              value={stats.admins}
              icon={ShieldCheck}
              description="System administrators"
            />

            <StatCard
              title="Car Owners"
              value={stats.carOwners}
              icon={UserCog}
              description="Registered vehicle owners"
            />

            <StatCard
              title="Customers"
              value={stats.customers}
              icon={Users}
              description="Customer accounts"
            />

            <StatCard
              title="Vehicles"
              value={stats.vehicles}
              icon={Car}
              description="All registered vehicles"
            />

            <StatCard
              title="Reservations"
              value={stats.reservations}
              icon={CalendarDays}
              description="All reservations"
            />

            <StatCard
              title="Rentals"
              value={stats.rentals}
              icon={ClipboardList}
              description="All rental records"
            />

            <StatCard
              title="Payments"
              value={stats.payments}
              icon={DollarSign}
              description="All payment records"
            />

          </div>

        </section>


        {/* ==================================================
            MANAGEMENT
        ================================================== */}

        <section>

          <div className="mb-4">

            <h2 className="text-lg font-bold text-gray-900">
              System Management
            </h2>

            <p className="text-sm text-gray-500">
              Access every major area of the platform
            </p>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <ManagementCard
              icon={Users}
              title="User Management"
              description="Manage all system accounts"
              path="/users"
            />

            <ManagementCard
              icon={UserCog}
              title="Car Owners"
              description="Manage vehicle owners"
              path="/users"
            />

            <ManagementCard
              icon={Car}
              title="Vehicles"
              description="View and manage every vehicle"
              path="/vehicles"
            />

            <ManagementCard
              icon={Users}
              title="Customers"
              description="View all customers"
              path="/customers"
            />

            <ManagementCard
              icon={CalendarDays}
              title="Reservations"
              description="Manage all reservations"
              path="/reservations"
            />

            <ManagementCard
              icon={ClipboardList}
              title="Rentals"
              description="Manage all rentals"
              path="/rentals"
            />

            <ManagementCard
              icon={DollarSign}
              title="Payments"
              description="View and manage payments"
              path="/payments"
            />

            <ManagementCard
              icon={BarChart3}
              title="Reports"
              description="System-wide reports and analytics"
              path="/reports"
            />

          </div>

        </section>


        {/* ==================================================
            SUPER ADMIN CONTROLS
        ================================================== */}

        <section>

          <div className="mb-4">

            <h2 className="text-lg font-bold text-gray-900">
              Super Admin Controls
            </h2>

            <p className="text-sm text-gray-500">
              Restricted system-owner functions
            </p>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <ManagementCard
              icon={KeyRound}
              title="Access Control"
              description="Manage roles and permissions"
              path="/settings"
            />

            <ManagementCard
              icon={Settings}
              title="System Settings"
              description="Configure platform settings"
              path="/settings"
            />

            <ManagementCard
              icon={ShieldCheck}
              title="Security"
              description="Review system security"
              path="/settings"
            />

          </div>

        </section>


        {/* ==================================================
            SYSTEM OWNER NOTICE
        ================================================== */}

        <div className="bg-slate-900 text-white rounded-2xl p-6">

          <div className="flex items-start gap-4">

            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">

              <Crown size={20} />

            </div>

            <div>

              <h3 className="font-semibold">
                System Owner Access
              </h3>

              <p className="text-sm text-slate-300 mt-1">
                You have unrestricted access to the
                Rent-a-Car Management System. Super
                Admin permissions are controlled by the
                backend and cannot be granted through
                the frontend.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}