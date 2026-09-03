import {
  UserCircle,
  Mail,
  Shield,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    }
  }, []);

  if (!user) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">
          My Profile
        </h1>

        <p className="mt-2 text-gray-500">
          No user information found.
        </p>
      </div>
    );
  }

  const role = user.role?.toLowerCase() || "user";

  const isAdmin =
    role === "admin" ||
    role === "administrator";

  const roleName = isAdmin
    ? "Administrator"
    : "User";

  const name =
    user.name ||
    user.full_name ||
    user.username ||
    "Unknown User";

  const email =
    user.email ||
    "No email available";

  return (
    <div className="p-6">

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          My Profile
        </h1>

        <p className="text-gray-500 mt-1">
          View your account information.
        </p>
      </div>

      <div className="max-w-2xl bg-white border rounded-xl shadow-sm">

        {/* Profile Header */}
        <div className="flex items-center gap-5 p-6 border-b">

          <UserCircle
            size={70}
            className="text-gray-400"
          />

          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {name}
            </h2>

            <p className="text-gray-500">
              {roleName}
            </p>
          </div>

        </div>

        {/* Information */}
        <div className="p-6 space-y-6">

          {/* Name */}
          <div className="flex items-center gap-4">

            <div className="p-3 bg-gray-100 rounded-lg">
              <User size={20} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Name
              </p>

              <p className="font-medium text-gray-800">
                {name}
              </p>
            </div>

          </div>

          {/* Email */}
          <div className="flex items-center gap-4">

            <div className="p-3 bg-gray-100 rounded-lg">
              <Mail size={20} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Email Address
              </p>

              <p className="font-medium text-gray-800">
                {email}
              </p>
            </div>

          </div>

          {/* Role */}
          <div className="flex items-center gap-4">

            <div className="p-3 bg-gray-100 rounded-lg">
              <Shield size={20} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Account Type
              </p>

              <span
                className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${
                  isAdmin
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {roleName}
              </span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}