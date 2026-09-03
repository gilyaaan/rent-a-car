import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function MyReservations() {
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    vehicle_id: "",
    pickup_date: "",
    return_date: "",
  });

  // ==================================================
  // LOAD RESERVATIONS
  // ==================================================

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/reservations/");
      setReservations(response.data);
    } catch (err) {
      console.error("Failed to load reservations:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to load reservations."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  // ==================================================
  // HANDLE INPUT
  // ==================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==================================================
  // CANCEL FORM
  // ==================================================

  const handleCancel = () => {
    setShowForm(false);

    setFormData({
      vehicle_id: "",
      pickup_date: "",
      return_date: "",
    });

    setError("");
  };

  // ==================================================
  // SUBMIT RESERVATION
  // ==================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.vehicle_id ||
      !formData.pickup_date ||
      !formData.return_date
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.return_date < formData.pickup_date) {
      setError(
        "Return date cannot be before pickup date."
      );
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/reservations/", {
        vehicle_id: Number(formData.vehicle_id),
        pickup_date: formData.pickup_date,
        return_date: formData.return_date,
      });

      setSuccess(
        "Reservation created successfully!"
      );

      setShowForm(false);

      setFormData({
        vehicle_id: "",
        pickup_date: "",
        return_date: "",
      });

      await loadReservations();

    } catch (err) {
      console.error(
        "Failed to create reservation:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Unable to create reservation."
      );

    } finally {
      setSubmitting(false);
    }
  };

  // ==================================================
  // STATUS STYLE
  // ==================================================

  const getStatusStyle = (status) => {
    const normalizedStatus = String(
      status || ""
    ).toLowerCase();

    if (
      normalizedStatus === "confirmed" ||
      normalizedStatus === "approved"
    ) {
      return "bg-green-100 text-green-700";
    }

    if (
      normalizedStatus === "pending"
    ) {
      return "bg-yellow-100 text-yellow-700";
    }

    if (
      normalizedStatus === "cancelled" ||
      normalizedStatus === "canceled" ||
      normalizedStatus === "rejected"
    ) {
      return "bg-red-100 text-red-700";
    }

    if (
      normalizedStatus === "completed"
    ) {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-slate-100 text-slate-700";
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <div
            onClick={() =>
              navigate("/user-dashboard")
            }
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

          {/* Back Button */}
          <button
            onClick={() =>
              navigate("/user-dashboard")
            }
            className="bg-[#0F172B] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#18233D] transition"
          >
            Dashboard
          </button>

        </div>
      </header>

      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Page Header */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

          <div>

            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Customer Area
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172B] mt-2">
              My Reservations
            </h2>

            <p className="text-slate-500 mt-2">
              View and manage your vehicle reservations.
            </p>

          </div>

          <button
            type="button"
            onClick={() => {
              setShowForm(true);
              setError("");
              setSuccess("");
            }}
            className="bg-[#0F172B] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#18233D] transition"
          >
            + Add Reservation
          </button>

        </div>

        {/* ==================================================
            SUCCESS MESSAGE
        ================================================== */}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-xl">
            <p className="font-medium">
              {success}
            </p>
          </div>
        )}

        {/* ==================================================
            ERROR MESSAGE
        ================================================== */}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-xl">
            <p className="font-medium">
              {error}
            </p>
          </div>
        )}

        {/* ==================================================
            ADD RESERVATION FORM
        ================================================== */}

        {showForm && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 mb-8">

            <div className="mb-6">

              <h3 className="text-xl font-bold text-[#0F172B]">
                Create Reservation
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Enter the vehicle and rental dates.
              </p>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                {/* Vehicle */}

                <div>

                  <label
                    htmlFor="vehicle_id"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Vehicle ID
                  </label>

                  <input
                    id="vehicle_id"
                    type="number"
                    name="vehicle_id"
                    min="1"
                    value={formData.vehicle_id}
                    onChange={handleChange}
                    placeholder="Enter vehicle ID"
                    required
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-[#0F172B] focus:ring-2 focus:ring-slate-200"
                  />

                </div>

                {/* Pickup Date */}

                <div>

                  <label
                    htmlFor="pickup_date"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Pick-Up Date
                  </label>

                  <input
                    id="pickup_date"
                    type="date"
                    name="pickup_date"
                    value={formData.pickup_date}
                    onChange={handleChange}
                    required
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-[#0F172B] focus:ring-2 focus:ring-slate-200"
                  />

                </div>

                {/* Return Date */}

                <div>

                  <label
                    htmlFor="return_date"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Return Date
                  </label>

                  <input
                    id="return_date"
                    type="date"
                    name="return_date"
                    value={formData.return_date}
                    onChange={handleChange}
                    required
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-[#0F172B] focus:ring-2 focus:ring-slate-200"
                  />

                </div>

              </div>

              {/* Form Buttons */}

              <div className="flex justify-end gap-3 mt-7">

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={submitting}
                  className="px-6 py-3 border border-slate-300 text-slate-700 rounded-full font-semibold hover:bg-slate-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-[#0F172B] text-white rounded-full font-semibold hover:bg-[#18233D] transition disabled:opacity-50"
                >
                  {submitting
                    ? "Submitting..."
                    : "Submit Reservation"}
                </button>

              </div>

            </form>

          </div>
        )}

        {/* ==================================================
            LOADING
        ================================================== */}

        {loading && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">

            <p className="text-slate-500">
              Loading reservations...
            </p>

          </div>
        )}

        {/* ==================================================
            EMPTY STATE
        ================================================== */}

        {!loading &&
          reservations.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">

              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-5">

                <span className="text-2xl">
                  📅
                </span>

              </div>

              <h3 className="text-xl font-bold text-[#0F172B]">
                No Reservations Yet
              </h3>

              <p className="text-slate-500 mt-2">
                You don't have any vehicle reservations yet.
              </p>

              <button
                onClick={() => {
                  setShowForm(true);
                  setError("");
                  setSuccess("");
                }}
                className="mt-6 bg-[#0F172B] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#18233D] transition"
              >
                Make a Reservation
              </button>

            </div>
          )}

        {/* ==================================================
            RESERVATION TABLE
        ================================================== */}

        {!loading &&
          reservations.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

              {/* Table Header */}

              <div className="px-6 py-5 border-b border-slate-200">

                <h3 className="text-lg font-bold text-[#0F172B]">
                  Reservation History
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Your current and previous reservations.
                </p>

              </div>

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-slate-50">

                    <tr>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Reservation
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Vehicle
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Pick-Up
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Return
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Status
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {reservations.map(
                      (reservation) => (
                        <tr
                          key={reservation.id}
                          className="border-t border-slate-100 hover:bg-slate-50 transition"
                        >

                          <td className="px-6 py-5">

                            <span className="font-semibold text-[#0F172B]">
                              #{reservation.id}
                            </span>

                          </td>

                          <td className="px-6 py-5">

                            <span className="text-slate-700">
                              Vehicle #{reservation.vehicle_id}
                            </span>

                          </td>

                          <td className="px-6 py-5 text-slate-600">
                            {reservation.pickup_date}
                          </td>

                          <td className="px-6 py-5 text-slate-600">
                            {reservation.return_date}
                          </td>

                          <td className="px-6 py-5">

                            <span
                              className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                                reservation.status
                              )}`}
                            >
                              {reservation.status ||
                                "Pending"}
                            </span>

                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>
          )}

        {/* ==================================================
            BACK TO DASHBOARD
        ================================================== */}

        <div className="mt-8">

          <button
            onClick={() =>
              navigate("/user-dashboard")
            }
            className="text-sm font-semibold text-slate-600 hover:text-[#0F172B] transition"
          >
            ← Back to Dashboard
          </button>

        </div>

      </main>

      {/* ==================================================
          FOOTER
      ================================================== */}

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