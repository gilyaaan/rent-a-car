import { useEffect, useState } from "react";
import api from "../services/api";

export default function PaymentForm({
  onClose,
  onPaymentAdded,
}) {
  const [rentals, setRentals] = useState([]);

  const [formData, setFormData] = useState({
    rental_id: "",
    amount: "",
    payment_method: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ==================================================
  // LOAD RENTALS
  // ==================================================

  useEffect(() => {
    const loadRentals = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/rentals/");

        console.log(
          "Rentals:",
          response.data
        );

        // Only show rentals that can reasonably
        // receive a payment.
        const availableRentals =
          response.data.filter(
            (rental) =>
              rental.status === "Active" ||
              rental.status === "Completed"
          );

        setRentals(availableRentals);

      } catch (err) {
        console.error(
          "Failed to load rentals:",
          err
        );

        setError(
          err.response?.data?.detail ||
          "Unable to load rentals."
        );

      } finally {
        setLoading(false);
      }
    };

    loadRentals();
  }, []);

  // ==================================================
  // HANDLE CHANGES
  // ==================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==================================================
  // SUBMIT
  // ==================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.rental_id) {
      setError(
        "Please select a rental."
      );
      return;
    }

    if (!formData.amount) {
      setError(
        "Please enter the payment amount."
      );
      return;
    }

    if (Number(formData.amount) <= 0) {
      setError(
        "Payment amount must be greater than zero."
      );
      return;
    }

    if (!formData.payment_method) {
      setError(
        "Please select a payment method."
      );
      return;
    }

    setSaving(true);

    try {
      /*
       * IMPORTANT:
       *
       * Only send fields controlled by the admin.
       *
       * Do NOT send:
       *
       * status
       * payment_date
       */

      const paymentData = {
        rental_id: Number(
          formData.rental_id
        ),

        amount: Number(
          formData.amount
        ),

        payment_method:
          formData.payment_method,
      };

      console.log(
        "Sending payment:",
        paymentData
      );

      const response = await api.post(
        "/payments/",
        paymentData
      );

      console.log(
        "Payment created:",
        response.data
      );

      if (onPaymentAdded) {
        onPaymentAdded(
          response.data
        );
      }

      if (onClose) {
        onClose();
      }

    } catch (err) {
      console.error(
        "Failed to create payment:",
        err
      );

      console.error(
        "API response:",
        err.response?.data
      );

      setError(
        err.response?.data?.detail ||
        "Failed to create payment."
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
        Loading rentals...
      </div>
    );
  }

  // ==================================================
  // FORM
  // ==================================================

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >

      {/* ============================================
          RENTAL
      ============================================ */}

      <div>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rental
        </label>

        <select
          name="rental_id"
          value={formData.rental_id}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >

          <option value="">
            Select Rental
          </option>

          {rentals.map((rental) => (
            <option
              key={rental.id}
              value={rental.id}
            >
              Rental #{rental.id}
              {" - "}
              Reservation #
              {rental.reservation_id}
            </option>
          ))}

        </select>

        {rentals.length === 0 && (
          <p className="text-sm text-gray-500 mt-2">
            No available rentals found.
          </p>
        )}

      </div>


      {/* ============================================
          AMOUNT
      ============================================ */}

      <div>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Payment Amount
        </label>

        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Enter payment amount"
          min="0.01"
          step="0.01"
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

      </div>


      {/* ============================================
          PAYMENT METHOD
      ============================================ */}

      <div>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Payment Method
        </label>

        <select
          name="payment_method"
          value={formData.payment_method}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >

          <option value="">
            Select Payment Method
          </option>

          <option value="Cash">
            Cash
          </option>

          <option value="GCash">
            GCash
          </option>

          <option value="Bank Transfer">
            Bank Transfer
          </option>

          <option value="Credit Card">
            Credit Card
          </option>

          <option value="Debit Card">
            Debit Card
          </option>

        </select>

      </div>


      {/* ============================================
          SYSTEM CONTROLLED INFORMATION
      ============================================ */}

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">

        <p className="text-sm font-medium text-gray-700 mb-2">
          Payment information
        </p>

        <div className="space-y-1 text-sm text-gray-600">

          <p>
            <span className="font-medium">
              Status:
            </span>{" "}
            Paid
          </p>

          <p>
            <span className="font-medium">
              Payment date:
            </span>{" "}
            Set automatically by the server
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
            rentals.length === 0
          }
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {saving
            ? "Recording..."
            : "Record Payment"}
        </button>

      </div>

    </form>
  );
}