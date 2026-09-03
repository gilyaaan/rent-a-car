import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Shield,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import api from "../../services/api";

export default function OwnerProfile() {
  const [profile, setProfile] = useState(null);

  const [name, setName] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================================
  // LOAD PROFILE
  // ==========================================================

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await api.get("/users/me");

      const user = response.data;

      setProfile(user);
      setName(user.name || "");
    } catch (err) {
      console.error("Failed to load owner profile:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to load your profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // ==========================================================
  // SAVE PROFILE
  // ==========================================================

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const trimmedName = name.trim();

      if (!trimmedName) {
        setError("Name cannot be empty.");
        setSaving(false);
        return;
      }

      const response = await api.put("/users/me", {
        name: trimmedName,
      });

      const updatedUser = response.data;

      setProfile(updatedUser);
      setName(updatedUser.name || trimmedName);

      setSuccess("Your profile has been updated successfully.");

      // Update local storage if your application stores the user there.
      try {
        const storedUser =
          localStorage.getItem("user");

        if (storedUser) {
          const parsedUser =
            JSON.parse(storedUser);

          localStorage.setItem(
            "user",
            JSON.stringify({
              ...parsedUser,
              ...updatedUser,
            })
          );
        }
      } catch (storageError) {
        console.warn(
          "Could not update stored user:",
          storageError
        );
      }
    } catch (err) {
      console.error("Failed to update profile:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to update your profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <RefreshCw className="w-5 h-5 animate-spin" />
          Loading profile...
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
            Profile
          </h1>

          <p className="text-slate-500 mt-1">
            Manage your car owner account information.
          </p>

        </div>

        <button
          type="button"
          onClick={loadProfile}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>

      </div>

      {/* ======================================================
          SUCCESS MESSAGE
      ====================================================== */}

      {success && (
        <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">

          <CheckCircle className="w-5 h-5" />

          <span>
            {success}
          </span>

        </div>
      )}

      {/* ======================================================
          ERROR MESSAGE
      ====================================================== */}

      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">

          <AlertCircle className="w-5 h-5" />

          <span>
            {error}
          </span>

        </div>
      )}

      {/* ======================================================
          PROFILE CARD
      ====================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ====================================================
            PROFILE SUMMARY
        ==================================================== */}

        <div className="bg-white rounded-xl border border-slate-200 p-6">

          <div className="flex flex-col items-center text-center">

            {/* AVATAR */}

            <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center">

              <span className="text-3xl font-bold text-white">
                {(profile?.name || "O")
                  .charAt(0)
                  .toUpperCase()}
              </span>

            </div>

            {/* NAME */}

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              {profile?.name || "Car Owner"}
            </h2>

            {/* EMAIL */}

            <p className="mt-1 text-sm text-slate-500">
              {profile?.email || "—"}
            </p>

            {/* ROLE */}

            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700">

              <Shield className="w-4 h-4" />

              <span className="text-sm font-semibold">
                Car Owner
              </span>

            </div>

          </div>

          {/* ACCOUNT INFORMATION */}

          <div className="mt-8 pt-6 border-t border-slate-200 space-y-4">

            <div className="flex items-center gap-3">

              <div className="p-2 rounded-lg bg-slate-100">
                <User className="w-4 h-4 text-slate-700" />
              </div>

              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">
                  Account Type
                </p>

                <p className="text-sm font-medium text-slate-800">
                  Vehicle Owner
                </p>
              </div>

            </div>

            <div className="flex items-center gap-3">

              <div className="p-2 rounded-lg bg-slate-100">
                <Mail className="w-4 h-4 text-slate-700" />
              </div>

              <div className="min-w-0">

                <p className="text-xs text-slate-400 uppercase font-semibold">
                  Email
                </p>

                <p className="text-sm font-medium text-slate-800 break-all">
                  {profile?.email || "—"}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* ====================================================
            EDIT PROFILE
        ==================================================== */}

        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200">

          <div className="px-6 py-5 border-b border-slate-200">

            <h2 className="text-lg font-semibold text-slate-900">
              Personal Information
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Update the information associated with your owner account.
            </p>

          </div>

          <form
            onSubmit={handleSave}
            className="p-6 space-y-6"
          >

            {/* NAME */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name
              </label>

              <div className="relative">

                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Enter your full name"
                  className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400"
                />

              </div>

            </div>

            {/* EMAIL */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>

              <div className="relative">

                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                <input
                  type="email"
                  value={profile?.email || ""}
                  disabled
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                />

              </div>

              <p className="mt-2 text-xs text-slate-400">
                Your email address is managed by the system and cannot be changed here.
              </p>

            </div>

            {/* ROLE */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Account Role
              </label>

              <div className="relative">

                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                <input
                  type="text"
                  value="Car Owner"
                  disabled
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                />

              </div>

            </div>

            {/* SAVE */}

            <div className="pt-4 border-t border-slate-200 flex justify-end">

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >

                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}

              </button>

            </div>

          </form>

        </div>

      </div>

      {/* ======================================================
          SECURITY INFORMATION
      ====================================================== */}

      <div className="bg-white rounded-xl border border-slate-200 p-6">

        <div className="flex items-start gap-4">

          <div className="p-3 rounded-lg bg-slate-100">

            <Shield className="w-5 h-5 text-slate-700" />

          </div>

          <div>

            <h2 className="font-semibold text-slate-900">
              Account Security
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Your account permissions are determined by your
              assigned Car Owner role. You can manage your
              vehicles, view reservations, view rentals, and
              monitor your earnings.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}