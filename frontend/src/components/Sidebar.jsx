import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Car,
  CalendarDays,
  ClipboardList,
  CreditCard,
  BarChart3,
  Settings,
  Users,
  UserCircle,
  LogOut,
  Wallet,
  Crown,
} from "lucide-react";

import { getCurrentUser, logoutUser } from "../services/auth";


export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const user = getCurrentUser();

  const role = user?.role || "user";


  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };


  // =========================================================
  // ACTIVE LINK
  // =========================================================

  const isActive = (path) => {
    return location.pathname === path;
  };


  // =========================================================
  // ADMIN MENU
  // =========================================================

  const adminMenu = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Vehicles",
      path: "/vehicles",
      icon: Car,
    },
    {
      name: "Customers",
      path: "/customers",
      icon: Users,
    },
    {
      name: "Reservations",
      path: "/reservations",
      icon: CalendarDays,
    },
    {
      name: "Rentals",
      path: "/rentals",
      icon: ClipboardList,
    },
    {
      name: "Payments",
      path: "/payments",
      icon: CreditCard,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: BarChart3,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];


  // =========================================================
  // CAR OWNER MENU
  // =========================================================

  const ownerMenu = [
    {
      name: "Dashboard",
      path: "/owner-dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Vehicles",
      path: "/owner-vehicles",
      icon: Car,
    },
    {
      name: "Reservations",
      path: "/owner-reservations",
      icon: CalendarDays,
    },
    {
      name: "Rentals",
      path: "/owner-rentals",
      icon: ClipboardList,
    },
    {
      name: "Earnings",
      path: "/owner-earnings",
      icon: Wallet,
    },
    {
      name: "Profile",
      path: "/owner-profile",
      icon: UserCircle,
    },
  ];


  // =========================================================
  // SUPER ADMIN MENU
  // =========================================================
  //
  // Super Admin has access to the full system.
  // The Super Admin dashboard is shown first.
  //
  // =========================================================

  const superAdminMenu = [
    {
      name: "Super Admin",
      path: "/super-admin",
      icon: Crown,
    },
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Vehicles",
      path: "/vehicles",
      icon: Car,
    },
    {
      name: "Customers",
      path: "/customers",
      icon: Users,
    },
    {
      name: "Reservations",
      path: "/reservations",
      icon: CalendarDays,
    },
    {
      name: "Rentals",
      path: "/rentals",
      icon: ClipboardList,
    },
    {
      name: "Payments",
      path: "/payments",
      icon: CreditCard,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: BarChart3,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];


  // =========================================================
  // CUSTOMER / USER MENU
  // =========================================================

  const userMenu = [
    {
      name: "Dashboard",
      path: "/user-dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Reservations",
      path: "/my-reservations",
      icon: CalendarDays,
    },
    {
      name: "My Rentals",
      path: "/my-rentals",
      icon: ClipboardList,
    },
    {
      name: "My Payments",
      path: "/my-payments",
      icon: CreditCard,
    },
    {
      name: "My Profile",
      path: "/profile",
      icon: UserCircle,
    },
  ];


  // =========================================================
  // SELECT MENU BASED ON ROLE
  // =========================================================

  let menuItems = userMenu;

  if (role === "admin") {
    menuItems = adminMenu;
  }

  if (role === "super_admin") {
    menuItems = superAdminMenu;
  }

  if (role === "car_owner") {
    menuItems = ownerMenu;
  }


  // =========================================================
  // LOGO DESTINATION
  // =========================================================

  const logoPath =
    role === "super_admin"
      ? "/super-admin"
      : role === "admin"
      ? "/dashboard"
      : role === "car_owner"
      ? "/owner-dashboard"
      : "/user-dashboard";


  // =========================================================
  // ACCOUNT TYPE LABEL
  // =========================================================

  const accountType =
    role === "super_admin"
      ? "System Owner"
      : role === "admin"
      ? "Administration"
      : role === "car_owner"
      ? "Owner Area"
      : "Customer Area";


  // =========================================================
  // ROLE DISPLAY
  // =========================================================

  const roleDisplay =
    role === "super_admin"
      ? "Super Admin"
      : role === "car_owner"
      ? "Car Owner"
      : role;


  // =========================================================
  // SIDEBAR
  // =========================================================

  return (
    <aside className="w-64 min-h-screen bg-slate-950 text-white flex flex-col shrink-0">

      {/* =====================================================
          LOGO
      ===================================================== */}

      <div className="px-6 py-6 border-b border-slate-800">

        <Link
          to={logoPath}
          className="flex items-center gap-3"
        >

          <div className="w-11 h-11 rounded-full bg-white text-slate-950 flex items-center justify-center text-xl font-bold">
            M
          </div>

          <div>

            <h1 className="text-lg font-bold">
              MyCarRental
            </h1>

            <p className="text-xs text-slate-400">
              Premium Car Rentals
            </p>

          </div>

        </Link>

      </div>


      {/* =====================================================
          ACCOUNT TYPE
      ===================================================== */}

      <div className="px-6 pt-5">

        <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
          {accountType}
        </p>

      </div>


      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <nav className="flex-1 px-4 py-4">

        <div className="space-y-1">

          {menuItems.map((item) => {

            const Icon = item.icon;

            const active = isActive(item.path);

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  flex items-center gap-3
                  px-4 py-3
                  rounded-xl
                  text-sm font-medium
                  transition
                  ${
                    active
                      ? "bg-white text-slate-950 shadow-sm"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }
                `}
              >

                <Icon
                  size={19}
                  strokeWidth={1.8}
                />

                <span>
                  {item.name}
                </span>

              </Link>
            );

          })}

        </div>

      </nav>


      {/* =====================================================
          USER INFORMATION
      ===================================================== */}

      <div className="px-4 pb-4">

        <div className="border-t border-slate-800 pt-4">

          <div className="px-3 mb-3">

            <p className="text-sm font-semibold text-white truncate">
              {user?.name || "User"}
            </p>

            <p className="text-xs text-slate-500 truncate">
              {user?.email || ""}
            </p>

            <p className="text-xs text-slate-400 mt-1 capitalize">
              {roleDisplay}
            </p>

          </div>


          {/* =================================================
              LOGOUT
          ================================================= */}

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition"
          >

            <LogOut
              size={19}
              strokeWidth={1.8}
            />

            <span>
              Logout
            </span>

          </button>

        </div>

      </div>

    </aside>
  );
}