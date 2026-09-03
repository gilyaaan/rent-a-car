import { useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../../services/auth";

export default function UserDashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =========================
          TOP NAVBAR
      ========================== */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <div
            onClick={() => navigate("/user-dashboard")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-11 h-11 bg-[#0F172B] rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                M
              </span>
            </div>

            <div>
              <h1 className="text-lg font-bold text-[#0F172B]">
                MyCarRental
              </h1>

              <p className="text-xs text-slate-500">
                Premium Car Rentals
              </p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">

            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-[#0F172B]">
                {user?.name || "User"}
              </p>

              <p className="text-xs text-slate-500">
                Customer
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="bg-[#0F172B] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#18233D] transition"
            >
              Logout
            </button>

          </div>

        </div>
      </header>

      {/* =========================
          MAIN CONTENT
      ========================== */}
      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Welcome */}
        <div className="mb-8">

          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Customer Dashboard
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-[#0F172B] mt-2">
            Welcome, {user?.name || "User"}!
          </h2>

          <p className="text-slate-500 mt-2">
            Manage your reservations, rentals, payments, and profile.
          </p>

        </div>

        {/* =========================
            QUICK ACTIONS
        ========================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          {/* Reservations */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-5">
              <span className="text-2xl">
                📅
              </span>
            </div>

            <h3 className="text-xl font-bold text-[#0F172B]">
              My Reservations
            </h3>

            <p className="text-slate-500 text-sm mt-2">
              View and manage your upcoming vehicle reservations.
            </p>

            <button
              onClick={() => navigate("/my-reservations")}
              className="mt-5 w-full bg-[#0F172B] text-white py-3 rounded-full font-semibold hover:bg-[#18233D] transition"
            >
              View Reservations
            </button>

          </div>

          {/* Rentals */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-5">
              <span className="text-2xl">
                🚗
              </span>
            </div>

            <h3 className="text-xl font-bold text-[#0F172B]">
              My Rentals
            </h3>

            <p className="text-slate-500 text-sm mt-2">
              View your active and previous vehicle rentals.
            </p>

            <button
              onClick={() => navigate("/my-rentals")}
              className="mt-5 w-full bg-[#0F172B] text-white py-3 rounded-full font-semibold hover:bg-[#18233D] transition"
            >
              View Rentals
            </button>

          </div>

          {/* Profile */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-5">
              <span className="text-2xl">
                👤
              </span>
            </div>

            <h3 className="text-xl font-bold text-[#0F172B]">
              My Profile
            </h3>

            <p className="text-slate-500 text-sm mt-2">
              Manage your personal account information.
            </p>

            <button
              onClick={() => navigate("/profile")}
              className="mt-5 w-full bg-[#0F172B] text-white py-3 rounded-full font-semibold hover:bg-[#18233D] transition"
            >
              View Profile
            </button>

          </div>

        </div>

        {/* =========================
            ACCOUNT INFORMATION
        ========================== */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">

          <div className="flex items-center justify-between mb-6">

            <div>
              <h3 className="text-xl font-bold text-[#0F172B]">
                Account Information
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Your current account details.
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full">

              <span className="w-2 h-2 bg-green-500 rounded-full"></span>

              <span className="text-sm font-semibold text-slate-700">
                Active Account
              </span>

            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Name */}
            <div className="bg-slate-50 rounded-xl p-5">
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Full Name
              </p>

              <p className="text-base font-semibold text-[#0F172B] mt-2">
                {user?.name || "Not available"}
              </p>
            </div>

            {/* Email */}
            <div className="bg-slate-50 rounded-xl p-5">
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Email Address
              </p>

              <p className="text-base font-semibold text-[#0F172B] mt-2 break-all">
                {user?.email || "Not available"}
              </p>
            </div>

            {/* Role */}
            <div className="bg-slate-50 rounded-xl p-5">
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Account Type
              </p>

              <p className="text-base font-semibold text-[#0F172B] mt-2">
                User
              </p>
            </div>

          </div>

        </div>

        {/* =========================
            BROWSE VEHICLES
        ========================== */}
        <div className="mt-8 bg-[#0F172B] rounded-2xl p-8 md:p-10 text-white">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>

              <p className="text-slate-300 text-sm font-semibold uppercase tracking-wider">
                Ready for your next trip?
              </p>

              <h3 className="text-2xl md:text-3xl font-bold mt-2">
                Find Your Perfect Car
              </h3>

              <p className="text-slate-300 mt-2 max-w-xl">
                Browse our premium vehicle collection and find the perfect
                car for your next journey.
              </p>

            </div>

            <button
              onClick={() => navigate("/vehicles")}
              className="bg-white text-[#0F172B] px-7 py-3 rounded-full font-semibold hover:bg-slate-100 transition whitespace-nowrap"
            >
              Browse Vehicles
            </button>

          </div>

        </div>

      </main>

      {/* =========================
          FOOTER
      ========================== */}
      <footer className="border-t border-slate-200 bg-white mt-10">

        <div className="max-w-7xl mx-auto px-6 py-6 text-center">

          <p className="text-sm text-slate-500">
            © 2026 MyCarRental. All rights reserved.
          </p>

        </div>

      </footer>

    </div>
  );
}