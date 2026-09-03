import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function MyRentals() {
  const navigate = useNavigate();

  const [rentals, setRentals] = useState([]);
  const [reservations, setReservations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [reservationId, setReservationId] = useState("");
  const [startDate, setStartDate] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ==================================================
  // LOAD RENTALS
  // ==================================================

  const loadRentals = async () => {
    try {
      const response = await api.get("/rentals/");
      setRentals(response.data);
    } catch (err) {
      console.error("Failed to load rentals:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to load rentals."
      );
    }
  };

  // ==================================================
  // LOAD RESERVATIONS
  // ==================================================

  const loadReservations = async () => {
    try {
      const response = await api.get("/reservations/");
      setReservations(response.data);
    } catch (err) {
      console.error("Failed to load reservations:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to load reservations."
      );
    }
  };

  // ==================================================
  // INITIAL LOAD
  // ==================================================

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");

      await Promise.all([
        loadRentals(),
        loadReservations(),
      ]);

      setLoading(false);
    };

    loadData();
  }, []);

  // ==================================================
  // RESET FORM
  // ==================================================

  const resetForm = () => {
    setReservationId("");
    setStartDate("");
  };

  // ==================================================
  // CANCEL
  // ==================================================

  const handleCancel = () => {
    resetForm();
    setShowForm(false);
    setError("");
  };

  // ==================================================
  // SUBMIT RENTAL
  // ==================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!reservationId) {
      setError("Please select a reservation.");
      return;
    }

    if (!startDate) {
      setError("Please select a start date.");
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/rentals/", {
        reservation_id: Number(reservationId),
        start_date: startDate,
      });

      setSuccess("Rental created successfully!");

      resetForm();
      setShowForm(false);

      await loadRentals();
      await loadReservations();

    } catch (err) {
      console.error(
        "Failed to create rental:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Failed to create rental."
      );

    } finally {
      setSubmitting(false);
    }
  };

  // ==================================================
  // SELECTED RESERVATION
  // ==================================================

  const selectedReservation =
    reservations.find(
      (reservation) =>
        String(reservation.id) ===
        String(reservationId)
    );

  // ==================================================
  // AVAILABLE RESERVATIONS
  // ==================================================

  const availableReservations =
    reservations.filter((reservation) => {
      const alreadyHasRental = rentals.some(
        (rental) =>
          Number(rental.reservation_id) ===
          Number(reservation.id)
      );

      return (
        !alreadyHasRental &&
        ["Pending", "Confirmed"].includes(
          reservation.status
        )
      );
    });

  // ==================================================
  // STATUS STYLE
  // ==================================================

  const getStatusStyle = (status) => {
    const normalizedStatus = String(
      status || ""
    ).toLowerCase();

    if (
      normalizedStatus === "active"
    ) {
      return "bg-green-100 text-green-700";
    }

    if (
      normalizedStatus === "completed"
    ) {
      return "bg-blue-100 text-blue-700";
    }

    if (
      normalizedStatus === "overdue"
    ) {
      return "bg-red-100 text-red-700";
    }

    if (
      normalizedStatus === "cancelled" ||
      normalizedStatus === "canceled"
    ) {
      return "bg-red-100 text-red-700";
    }

    return "bg-slate-100 text-slate-700";
  };

  // ==================================================
  // RENDER
  // ==================================================

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

          {/* Dashboard */}

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
              My Rentals
            </h2>

            <p className="text-slate-500 mt-2">
              View and manage your current and previous rentals.
            </p>

          </div>

          <button
            type="button"
            onClick={() => {
              setError("");
              setSuccess("");
              setShowForm(true);
            }}
            className="bg-[#0F172B] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#18233D] transition"
          >
            + Add Rental
          </button>

        </div>

        {/* ==================================================
            SUCCESS
        ================================================== */}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-xl">
            <p className="font-medium">
              {success}
            </p>
          </div>
        )}

        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-xl">
            <p className="font-medium">
              {error}
            </p>
          </div>
        )}

        {/* ==================================================
            ADD RENTAL FORM
        ================================================== */}

        {showForm && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 mb-8">

            <div className="mb-6">

              <h3 className="text-xl font-bold text-[#0F172B]">
                Create Rental
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Select an approved reservation to create a rental.
              </p>

            </div>

            <form onSubmit={handleSubmit}>

              {/* Reservation */}

              <div className="mb-6">

                <label
                  htmlFor="reservation"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Reservation
                </label>

                <select
                  id="reservation"
                  value={reservationId}
                  onChange={(e) => {
                    setReservationId(
                      e.target.value
                    );

                    const selected =
                      reservations.find(
                        (reservation) =>
                          String(
                            reservation.id
                          ) ===
                          String(
                            e.target.value
                          )
                      );

                    if (selected) {
                      setStartDate(
                        selected.pickup_date ||
                          ""
                      );
                    }
                  }}
                  disabled={submitting}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-[#0F172B] focus:ring-2 focus:ring-slate-200"
                >

                  <option value="">
                    Select a reservation
                  </option>

                  {availableReservations.map(
                    (reservation) => (
                      <option
                        key={reservation.id}
                        value={reservation.id}
                      >
                        Reservation #
                        {reservation.id}
                        {" - "}
                        Vehicle #
                        {reservation.vehicle_id}
                        {" - "}
                        {
                          reservation.pickup_date
                        }
                        {" to "}
                        {
                          reservation.return_date
                        }
                      </option>
                    )
                  )}

                </select>

                {availableReservations.length ===
                  0 && (
                  <p className="text-sm text-slate-500 mt-2">
                    You don't have any available
                    reservations for a new rental.
                  </p>
                )}

              </div>

              {/* Start Date */}

              <div className="mb-7">

                <label
                  htmlFor="start_date"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Start Date
                </label>

                <input
                  id="start_date"
                  type="date"
                  value={startDate}
                  min={
                    selectedReservation?.pickup_date ||
                    ""
                  }
                  max={
                    selectedReservation?.return_date ||
                    ""
                  }
                  onChange={(e) =>
                    setStartDate(
                      e.target.value
                    )
                  }
                  disabled={
                    submitting ||
                    !reservationId
                  }
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-[#0F172B] focus:ring-2 focus:ring-slate-200"
                />

                {selectedReservation && (
                  <p className="text-sm text-slate-500 mt-2">
                    Start date must be between{" "}
                    <strong>
                      {
                        selectedReservation.pickup_date
                      }
                    </strong>{" "}
                    and{" "}
                    <strong>
                      {
                        selectedReservation.return_date
                      }
                    </strong>
                    .
                  </p>
                )}

              </div>

              {/* Buttons */}

              <div className="flex justify-end gap-3">

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
                  disabled={
                    submitting ||
                    availableReservations.length ===
                      0
                  }
                  className="px-6 py-3 bg-[#0F172B] text-white rounded-full font-semibold hover:bg-[#18233D] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting
                    ? "Creating..."
                    : "Create Rental"}
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
              Loading rentals...
            </p>

          </div>
        )}

        {/* ==================================================
            EMPTY STATE
        ================================================== */}

        {!loading &&
          rentals.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">

              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-5">

                <span className="text-2xl">
                  🚗
                </span>

              </div>

              <h3 className="text-xl font-bold text-[#0F172B]">
                No Rentals Yet
              </h3>

              <p className="text-slate-500 mt-2">
                You don't have any rentals yet.
              </p>

              <button
                onClick={() =>
                  setShowForm(true)
                }
                className="mt-6 bg-[#0F172B] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#18233D] transition"
              >
                Add Rental
              </button>

            </div>
          )}

        {/* ==================================================
            RENTALS TABLE
        ================================================== */}

        {!loading &&
          rentals.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

              {/* Table Title */}

              <div className="px-6 py-5 border-b border-slate-200">

                <h3 className="text-lg font-bold text-[#0F172B]">
                  Rental History
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Your active and completed rentals.
                </p>

              </div>

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-slate-50">

                    <tr>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Rental
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Reservation
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Start Date
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Return Date
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Amount
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Status
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {rentals.map(
                      (rental) => (
                        <tr
                          key={rental.id}
                          className="border-t border-slate-100 hover:bg-slate-50 transition"
                        >

                          <td className="px-6 py-5">

                            <span className="font-semibold text-[#0F172B]">
                              #{rental.id}
                            </span>

                          </td>

                          <td className="px-6 py-5 text-slate-700">
                            #{rental.reservation_id}
                          </td>

                          <td className="px-6 py-5 text-slate-600">
                            {rental.start_date}
                          </td>

                          <td className="px-6 py-5 text-slate-600">
                            {rental.actual_return_date ||
                              "-"}
                          </td>

                          <td className="px-6 py-5">

                            <span className="font-semibold text-[#0F172B]">
                              ₱
                              {Number(
                                rental.total_amount ||
                                  0
                              ).toLocaleString(
                                "en-PH",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}
                            </span>

                          </td>

                          <td className="px-6 py-5">

                            <span
                              className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                                rental.status
                              )}`}
                            >
                              {rental.status ||
                                "Active"}
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