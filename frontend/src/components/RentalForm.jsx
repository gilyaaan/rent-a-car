import { useEffect, useState } from "react";
import api from "../services/api";

export default function RentalForm({
  onClose,
  onRentalAdded
}) {
  const [reservations, setReservations] = useState([]);

  const [formData, setFormData] = useState({
    reservation_id: "",
    start_date: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ==================================================
  // LOAD LATEST RESERVATIONS
  // ==================================================

  useEffect(() => {
    let isMounted = true;

    const loadReservations = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/reservations/");

        console.log(
          "Latest reservations from backend:",
          response.data
        );

        if (!isMounted) return;

        const reservationList = Array.isArray(response.data)
          ? response.data
          : [];

        /*
         * Only remove reservations that should definitely
         * not be started as rentals.
         *
         * We normalize the status so:
         *
         * "Pending"
         * "pending"
         * "PENDING"
         *
         * are treated the same.
         */

        const availableReservations =
          reservationList.filter((reservation) => {
            const status = String(
              reservation.status || ""
            )
              .trim()
              .toLowerCase();

            return (
              status !== "cancelled" &&
              status !== "canceled" &&
              status !== "completed"
            );
          });

        console.log(
          "Reservations available for rental:",
          availableReservations
        );

        setReservations(
          availableReservations
        );

      } catch (err) {
        console.error(
          "Failed to load reservations:",
          err
        );

        console.error(
          "API response:",
          err.response?.data
        );

        if (!isMounted) return;

        setError(
          err.response?.data?.detail ||
          "Unable to load reservations."
        );

      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadReservations();

    return () => {
      isMounted = false;
    };
  }, []);


  // ==================================================
  // HANDLE FORM CHANGES
  // ==================================================

  const handleChange = (e) => {
    const {
      name,
      value
    } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));


    // ----------------------------------------------
    // WHEN RESERVATION IS SELECTED
    // AUTOMATICALLY USE PICKUP DATE
    // ----------------------------------------------

    if (name === "reservation_id") {

      const selectedReservation =
        reservations.find(
          (reservation) =>
            String(reservation.id) === String(value)
        );

      if (selectedReservation) {

        setFormData((previous) => ({
          ...previous,
          reservation_id: value,
          start_date:
            selectedReservation.pickup_date || "",
        }));

        console.log(
          "Selected reservation:",
          selectedReservation
        );
      }
    }
  };


  // ==================================================
  // SUBMIT
  // ==================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // ----------------------------------------------
    // VALIDATION
    // ----------------------------------------------

    if (!formData.reservation_id) {
      setError(
        "Please select a reservation."
      );
      return;
    }

    if (!formData.start_date) {
      setError(
        "Please select a start date."
      );
      return;
    }

    // Find selected reservation
    const selectedReservation =
      reservations.find(
        (reservation) =>
          String(reservation.id) ===
          String(formData.reservation_id)
      );

    if (!selectedReservation) {
      setError(
        "Selected reservation could not be found. Please refresh and try again."
      );
      return;
    }

    setSaving(true);

    try {

      // ----------------------------------------------
      // SEND RENTAL DATA
      // ----------------------------------------------

      const rentalData = {
        reservation_id: Number(
          formData.reservation_id
        ),
        start_date: formData.start_date,
      };

      console.log(
        "Creating rental from reservation:",
        rentalData
      );

      const response = await api.post(
        "/rentals/",
        rentalData
      );

      console.log(
        "Rental created successfully:",
        response.data
      );

      // ----------------------------------------------
      // UPDATE RENTALS PAGE
      // ----------------------------------------------

      if (onRentalAdded) {
        onRentalAdded(response.data);
      }

      // ----------------------------------------------
      // CLOSE MODAL
      // ----------------------------------------------

      if (onClose) {
        onClose();
      }

    } catch (err) {

      console.error(
        "Failed to create rental:",
        err
      );

      console.error(
        "API response:",
        err.response?.data
      );

      setError(
        err.response?.data?.detail ||
        "Failed to create rental."
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
      <div className="p-4 text-center text-gray-500">
        Loading latest reservations...
      </div>
    );
  }


  // ==================================================
  // SELECTED RESERVATION
  // ==================================================

  const selectedReservation =
    reservations.find(
      (reservation) =>
        String(reservation.id) ===
        String(formData.reservation_id)
    );


  // ==================================================
  // FORM
  // ==================================================

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >

      {/* ============================================
          RESERVATION
      ============================================ */}

      <div>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Reservation
        </label>

        <select
          name="reservation_id"
          value={formData.reservation_id}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >

          <option value="">
            Select Reservation
          </option>

          {reservations.map(
            (reservation) => (

              <option
                key={reservation.id}
                value={reservation.id}
              >

                Reservation #{reservation.id}

                {" - "}

                {reservation.pickup_date}

                {" to "}

                {reservation.return_date}

              </option>

            )
          )}

        </select>

        {/* No reservations */}

        {reservations.length === 0 && (

          <p className="text-sm text-gray-500 mt-2">
            No available reservations found.
          </p>

        )}

      </div>


      {/* ============================================
          SELECTED RESERVATION INFORMATION
      ============================================ */}

      {selectedReservation && (

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">

          <p className="text-sm font-semibold text-blue-800 mb-2">
            Selected Reservation
          </p>

          <div className="text-sm text-gray-700 space-y-1">

            <p>
              <span className="font-medium">
                Reservation:
              </span>{" "}
              #{selectedReservation.id}
            </p>

            <p>
              <span className="font-medium">
                Customer:
              </span>{" "}
              {selectedReservation.customer_name ||
                selectedReservation.customer ||
                "Customer information"}
            </p>

            <p>
              <span className="font-medium">
                Pickup:
              </span>{" "}
              {selectedReservation.pickup_date}
            </p>

            <p>
              <span className="font-medium">
                Return:
              </span>{" "}
              {selectedReservation.return_date}
            </p>

            <p>
              <span className="font-medium">
                Status:
              </span>{" "}
              {selectedReservation.status}
            </p>

          </div>

        </div>

      )}


      {/* ============================================
          START DATE
      ============================================ */}

      <div>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Start Date
        </label>

        <input
          type="date"
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <p className="text-xs text-gray-500 mt-1">
          Automatically set from the reservation pickup date.
        </p>

      </div>


      {/* ============================================
          SYSTEM CONTROLLED INFORMATION
      ============================================ */}

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">

        <p className="text-sm font-medium text-gray-700 mb-2">
          Rental information
        </p>

        <div className="space-y-1 text-sm text-gray-600">

          <p>
            <span className="font-medium">
              Status:
            </span>{" "}
            Active
          </p>

          <p>
            <span className="font-medium">
              Return date:
            </span>{" "}
            Set when the vehicle is returned
          </p>

          <p>
            <span className="font-medium">
              Total amount:
            </span>{" "}
            Calculated automatically
          </p>

        </div>

      </div>


      {/* ============================================
          ERROR
      ============================================ */}

      {error && (

        <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-lg">

          {error}

        </div>

      )}


      {/* ============================================
          BUTTONS
      ============================================ */}

      <div className="flex gap-3">

        <button
          type="button"
          onClick={onClose}
          disabled={saving}
          className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={
            saving ||
            reservations.length === 0
          }
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >

          {saving
            ? "Creating..."
            : "Create Rental"}

        </button>

      </div>

    </form>
  );
}