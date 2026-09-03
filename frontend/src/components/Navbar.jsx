import {
  Bell,
  Search,
  UserCircle,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Invalid user data:", error);
      }
    }
  }, []);

  // Determine role
  const role = user?.role?.toLowerCase() || "user";

  const isAdmin = role === "admin" || role === "administrator";

  const displayRole = isAdmin ? "Administrator" : "User";

  // Get user's name
  const displayName =
    user?.name ||
    user?.full_name ||
    user?.username ||
    (isAdmin ? "Administrator" : "User");

  // Get user's email
  const displayEmail =
    user?.email ||
    user?.username ||
    "";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const handleProfile = () => {
    setShowProfile(false);
    navigate("/profile");
  };

  return (
    <header className="bg-white border-b px-6 py-4 flex justify-between items-center">

      {/* Search */}
      <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg w-80">
        <Search size={18} className="text-gray-500" />

        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none w-full text-sm"
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-5">

        {/* Notifications */}
        <button
          type="button"
          className="
            relative
            p-2
            rounded-lg
            hover:bg-gray-100
            transition
          "
        >
          <Bell size={22} className="text-gray-600" />

          <span
            className="
              absolute
              top-1
              right-1
              w-2
              h-2
              bg-red-500
              rounded-full
            "
          />
        </button>

        {/* Profile */}
        <div className="relative">

          <button
            type="button"
            onClick={() => setShowProfile(!showProfile)}
            className="
              flex
              items-center
              gap-2
              hover:bg-gray-100
              px-3
              py-2
              rounded-lg
              transition
            "
          >
            <UserCircle
              size={36}
              className="text-gray-600"
            />

            <div className="text-left">
              <p className="font-semibold text-sm">
                {displayName}
              </p>

              <p className="text-xs text-gray-500">
                {displayRole}
              </p>
            </div>

            <ChevronDown
              size={16}
              className="text-gray-500"
            />
          </button>

          {/* Dropdown */}
          {showProfile && (
            <div
              className="
                absolute
                right-0
                top-14
                w-52
                bg-white
                border
                rounded-lg
                shadow-lg
                py-2
                z-50
              "
            >

             

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-4
                  py-2
                  text-sm
                  text-red-600
                  hover:bg-red-50
                "
              >
                <LogOut size={18} />
                Logout
              </button>

            </div>
          )}

        </div>

      </div>
    </header>
  );
}