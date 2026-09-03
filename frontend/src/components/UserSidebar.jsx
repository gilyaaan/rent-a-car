import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  CreditCard
} from "lucide-react";

export default function UserSidebar() {

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/user-dashboard"
    },
    {
      title: "My Reservations",
      icon: Calendar,
      path: "/my-reservations"
    },
    {
      title: "My Rentals",
      icon: ClipboardList,
      path: "/my-rentals"
    },
    {
      title: "My Payments",
      icon: CreditCard,
      path: "/my-payments"
    }
  ];

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">

      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold">
          ARGO HQ
        </h1>

        <p className="text-sm text-slate-400">
          Rent-A-Car System
        </p>
      </div>

      {/* Navigation */}
      <nav className="p-3 flex-1">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.title}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-200 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={20} />

              <span>
                {item.title}
              </span>
            </NavLink>
          );
        })}

      </nav>

    </aside>
  );
}