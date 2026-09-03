import { useEffect, useState } from "react";
import { Save, RefreshCw, User, Shield, Mail } from "lucide-react";
import api from "../../services/api";

export default function Settings() {
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==================================================
  // LOAD CURRENT USER
  // ==================================================

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await api.get("/users/me");

      console.log("Current user:", response.data);

      setUser(response.data);

      setFormData({
        name: response.data.name || "",
        email: response.data.email || "",
      });

    } catch (err) {
      console.error("Failed to load profile:", err);

      setError(
        err.response?.data?.detail ||
        "Unable to load your account information."
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // ==================================================
  // HANDLE FORM CHANGES
  // ==================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==================================================
  // SAVE PROFILE
  // ==================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email cannot be empty.");
      return;
    }

    setSaving(true);

    try {
      const response = await api.put(
        "/users/me",
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
        }
      );

      console.log(
        "Profile updated:",
        response.data
      );

      const updatedUser = response.data.user;

      setUser(updatedUser);

      setFormData({
        name: updatedUser.name || "",
        email: updatedUser.email || "",
      });

      setSuccess(
        "Your profile has been updated successfully."
      );

    } catch (err) {
      console.error(
        "Failed to update profile:",
        err
      );

      console.error(
        "API response:",
        err.response?.data
      );

      setError(
        err.response?.data?.detail ||
        "Unable to update your profile."
      );

    } finally {
      setSaving(false);
    }
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
          Loading account settings...
        </div>
      </div>
    );
  }

  // ==================================================
  // ERROR WITHOUT USER
  // ==================================================

  if (!user) {
    return (
      <div className="p-6">

        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5">
          {error || "Unable to load account information."}
        </div>

        <button
          type="button"
          onClick={loadProfile}
          className="mt-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <RefreshCw size={17} />
          Try Again
        </button>

      </div>
    );
  }

  // ==================================================
  // SETTINGS PAGE
  // ==================================================

  return (
    <div className="space-y-6">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Settings
        </h1>

        <p className="text-gray-500 mt-1">
          Manage your account information and settings.
        </p>
      </div>


      {/* ==================================================
          ACCOUNT OVERVIEW
      ================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ROLE */}

        <div className="bg-white rounded-xl border border-gray-200 p-6">

          <div className="flex items-center gap-3">

            <div className="bg-blue-100 p-3 rounded-lg">
              <Shield
                size={22}
                className="text-blue-600"
              />
            </div>

            <div>

              <p className="text-sm text-gray-500">
                Account Role
              </p>

              <p className="text-lg font-semibold text-gray-900 capitalize">
                {user.role}
              </p>

            </div>

          </div>

        </div>


        {/* STATUS */}

        <div className="bg-white rounded-xl border border-gray-200 p-6">

          <div className="flex items-center gap-3">

            <div className="bg-green-100 p-3 rounded-lg">
              <User
                size={22}
                className="text-green-600"
              />
            </div>

            <div>

              <p className="text-sm text-gray-500">
                Account Status
              </p>

              <span
                className={`inline-flex mt-1 px-3 py-1 rounded-full text-xs font-medium ${
                  user.is_active
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {user.is_active
                  ? "Active"
                  : "Inactive"}
              </span>

            </div>

          </div>

        </div>

      </div>


      {/* ==================================================
          PROFILE FORM
      ================================================== */}

      <div className="bg-white rounded-xl border border-gray-200 p-6">

        <div className="flex items-center gap-3 mb-6">

          <div className="bg-gray-100 p-3 rounded-lg">
            <User
              size={22}
              className="text-gray-700"
            />
          </div>

          <div>

            <h2 className="text-xl font-bold text-gray-900">
              Profile Information
            </h2>

            <p className="text-sm text-gray-500">
              Update your personal account information.
            </p>

          </div>

        </div>


        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* NAME */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>

            <div className="relative">

              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
                required
              />

            </div>

          </div>


          {/* EMAIL */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>

            <div className="relative">

              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />

            </div>

          </div>


          {/* ROLE - READ ONLY */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>

            <input
              type="text"
              value={user.role}
              disabled
              className="w-full border border-gray-200 bg-gray-100 text-gray-500 rounded-lg py-3 px-4 capitalize cursor-not-allowed"
            />

            <p className="text-xs text-gray-500 mt-1">
              Your account role can only be changed by an administrator.
            </p>

          </div>


          {/* ACCOUNT STATUS - READ ONLY */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Status
            </label>

            <input
              type="text"
              value={
                user.is_active
                  ? "Active"
                  : "Inactive"
              }
              disabled
              className="w-full border border-gray-200 bg-gray-100 text-gray-500 rounded-lg py-3 px-4 cursor-not-allowed"
            />

            <p className="text-xs text-gray-500 mt-1">
              Account status is controlled by an administrator.
            </p>

          </div>


          {/* ERROR */}

          {error && (

            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">
              {error}
            </div>

          )}


          {/* SUCCESS */}

          {success && (

            <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg">
              {success}
            </div>

          )}


          {/* SAVE BUTTON */}

          <div className="flex justify-end">

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >

              <Save size={18} />

              {saving
                ? "Saving..."
                : "Save Changes"}

            </button>

          </div>

        </form>

      </div>


      {/* ==================================================
          SECURITY INFORMATION
      ================================================== */}

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">

        <h2 className="font-semibold text-blue-900 mb-2">
          Account Security
        </h2>

        <p className="text-sm text-blue-800">
          Your role and account status are controlled by the
          system administrator. You cannot change these
          values from your account settings.
        </p>

      </div>

    </div>
  );
}

