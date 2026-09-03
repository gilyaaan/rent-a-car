import { Link } from "react-router-dom";
import { getCurrentUser } from "../../services/auth";

export default function Profile() {
  const user = getCurrentUser();

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">

          <div className="flex items-center justify-between">

            {/* LOGO */}

            <Link
              to="/user-dashboard"
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg">
                M
              </div>

              <div>
                <h1 className="font-bold text-slate-900 text-lg">
                  MyCarRental
                </h1>

                <p className="text-xs text-slate-500">
                  Premium Car Rentals
                </p>
              </div>
            </Link>


            {/* NAVIGATION */}

            <div className="flex items-center gap-4">

              <Link
                to="/user-dashboard"
                className="text-sm font-medium text-slate-600 hover:text-black transition"
              >
                Dashboard
              </Link>

              <Link
                to="/my-reservations"
                className="hidden sm:block text-sm font-medium text-slate-600 hover:text-black transition"
              >
                Reservations
              </Link>

              <Link
                to="/my-rentals"
                className="hidden sm:block text-sm font-medium text-slate-600 hover:text-black transition"
              >
                Rentals
              </Link>

            </div>

          </div>

        </div>
      </header>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="max-w-5xl mx-auto px-6 py-10">

        {/* PAGE TITLE */}

        <div className="mb-8">

          <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
            Customer Area
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-1">
            My Profile
          </h1>

          <p className="text-slate-500 mt-2">
            View your account information and account status.
          </p>

        </div>


        {/* =================================================
            PROFILE CARD
        ================================================= */}

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">

          {/* PROFILE HEADER */}

          <div className="bg-black px-6 md:px-8 py-8">

            <div className="flex flex-col sm:flex-row sm:items-center gap-5">

              {/* AVATAR */}

              <div className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center text-3xl font-bold shrink-0">
                {(user?.name || "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>


              {/* NAME */}

              <div>

                <h2 className="text-2xl font-bold text-white">
                  {user?.name || "User"}
                </h2>

                <p className="text-slate-300 mt-1">
                  {user?.email || "No email available"}
                </p>

                <span className="inline-flex mt-3 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold">
                  Customer
                </span>

              </div>

            </div>

          </div>


          {/* PROFILE INFORMATION */}

          <div className="p-6 md:p-8">

            <h3 className="text-lg font-bold text-slate-900 mb-6">
              Account Information
            </h3>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* FULL NAME */}

              <div className="border border-slate-200 rounded-xl p-5">

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Full Name
                </p>

                <p className="text-lg font-semibold text-slate-900 mt-2">
                  {user?.name || "—"}
                </p>

              </div>


              {/* EMAIL */}

              <div className="border border-slate-200 rounded-xl p-5">

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Email Address
                </p>

                <p className="text-lg font-semibold text-slate-900 mt-2 break-all">
                  {user?.email || "—"}
                </p>

              </div>


              {/* ACCOUNT TYPE */}

              <div className="border border-slate-200 rounded-xl p-5">

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Account Type
                </p>

                <p className="text-lg font-semibold text-slate-900 mt-2">
                  Customer
                </p>

              </div>


              {/* ACCOUNT STATUS */}

              <div className="border border-slate-200 rounded-xl p-5">

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Account Status
                </p>

                <div className="mt-2">

                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                      user?.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user?.is_active
                      ? "Active"
                      : "Inactive"}
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <div className="mt-8">

          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Quick Actions
          </h2>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* RESERVATIONS */}

            <Link
              to="/my-reservations"
              className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-slate-400 hover:shadow-sm transition"
            >

              <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center mb-4 text-xl">
                📅
              </div>

              <h3 className="font-bold text-slate-900">
                My Reservations
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                View and manage your reservations.
              </p>

            </Link>


            {/* RENTALS */}

            <Link
              to="/my-rentals"
              className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-slate-400 hover:shadow-sm transition"
            >

              <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center mb-4 text-xl">
                🚗
              </div>

              <h3 className="font-bold text-slate-900">
                My Rentals
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                View your active and completed rentals.
              </p>

            </Link>


            {/* PAYMENTS */}

            <Link
              to="/my-payments"
              className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-slate-400 hover:shadow-sm transition"
            >

              <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center mb-4 text-xl">
                ₱
              </div>

              <h3 className="font-bold text-slate-900">
                My Payments
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                View your payment history.
              </p>

            </Link>

          </div>

        </div>


        {/* =================================================
            BACK TO DASHBOARD
        ================================================= */}

        <div className="mt-8">

          <Link
            to="/user-dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-black transition"
          >
            ← Back to Dashboard
          </Link>

        </div>

      </main>


      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="border-t border-slate-200 bg-white mt-12">

        <div className="max-w-7xl mx-auto px-6 py-8">

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            <div>
              <p className="font-bold text-slate-900">
                MyCarRental
              </p>

              <p className="text-sm text-slate-500 mt-1">
                Premium car rentals made simple.
              </p>
            </div>

            <p className="text-sm text-slate-400">
              © 2026 MyCarRental. All rights reserved.
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
}