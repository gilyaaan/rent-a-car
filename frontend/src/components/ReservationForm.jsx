import { useEffect, useState } from "react";
import api from "../services/api";

export default function ReservationForm({
  onClose,
  onReservationAdded
}) {
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [formData, setFormData] = useState({
    customer_id: "",
    vehicle_id: "",
    pickup_date: "",
    return_date: "",
    status: "Pending",
  });

  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ----------------------------------------
  // Load customers and vehicles
  // ----------------------------------------

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        setError("");

        const [
          customersResponse,
          vehiclesResponse
        ] = await Promise.all([
          api.get("/customers/"),
          api.get("/vehicles/")
        ]);

        console.log(
          "Customers:",
          customersResponse.data
        );

        console.log(
          "Vehicles:",
          vehiclesResponse.data
        );

        setCustomers(customersResponse.data);
        setVehicles(vehiclesResponse.data);

      } catch (err) {
        console.error(
          "Failed to load reservation data:",
          err
        );

        setError(
          err.response?.data?.detail ||
          "Unable to load customers and vehicles."
        );
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

  // ----------------------------------------
  // Handle input changes
  // ----------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ----------------------------------------
  // Save reservation
  // ----------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSaving(true);

    try {
      const reservationData = {
        customer_id: Number(formData.customer_id),
        vehicle_id: Number(formData.vehicle_id),
        pickup_date: formData.pickup_date,
        return_date: formData.return_date,
        status: formData.status,
      };

      console.log(
        "Sending reservation:",
        reservationData
      );

      const response = await api.post(
        "/reservations/",
        reservationData
      );

      console.log(
        "Reservation created:",
        response.data
      );

      if (onReservationAdded) {
        onReservationAdded(response.data);
      }

      if (onClose) {
        onClose();
      }

    } catch (err) {
      console.error(
        "Failed to create reservation:",
        err
      );

      if (err.response) {
        console.error(
          "API response:",
          err.response.data
        );

        setError(
          err.response.data?.detail ||
          `Server error: ${err.response.status}`
        );
      } else if (err.request) {
        setError(
          "Unable to connect to the server. Make sure FastAPI is running."
        );
      } else {
        setError(err.message);
      }

    } finally {
      setSaving(false);
    }
  };

  // ----------------------------------------
  // Loading
  // ----------------------------------------

  if (loadingData) {
    return (
      <div className="p-4 text-center text-gray-500">
        Loading customers and vehicles...
      </div>
    );
  }

  // ----------------------------------------
  // Form
  // ----------------------------------------

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >

      {/* Customer */}

      <select
        name="customer_id"
        value={formData.customer_id}
        onChange={handleChange}
        className="w-full border p-3 rounded-lg"
        required
      >
        <option value="">
          Select Customer
        </option>

        {customers.map((customer) => (
          <option
            key={customer.id}
            value={customer.id}
          >
            {customer.first_name} {customer.last_name}
          </option>
        ))}
      </select>


      {/* Vehicle */}

      <select
        name="vehicle_id"
        value={formData.vehicle_id}
        onChange={handleChange}
        className="w-full border p-3 rounded-lg"
        required
      >
        <option value="">
          Select Vehicle
        </option>

        {vehicles.map((vehicle) => (
          <option
            key={vehicle.id}
            value={vehicle.id}
          >
            {vehicle.brand} {vehicle.model} -{" "}
            {vehicle.plate_number}
          </option>
        ))}
      </select>


      {/* Pickup Date */}

      <input
        type="date"
        name="pickup_date"
        value={formData.pickup_date}
        onChange={handleChange}
        className="w-full border p-3 rounded-lg"
        required
      />


      {/* Return Date */}

      <input
        type="date"
        name="return_date"
        value={formData.return_date}
        onChange={handleChange}
        className="w-full border p-3 rounded-lg"
        required
      />


      {/* Status */}

      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        className="w-full border p-3 rounded-lg"
      >
        <option value="Pending">
          Pending
        </option>

        <option value="Approved">
          Approved
        </option>

        <option value="Cancelled">
          Cancelled
        </option>
      </select>


      {/* Error */}

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg">
          {error}
        </div>
      )}


      {/* Save */}

      <button
        type="submit"
        disabled={saving}
        className="
          w-full
          bg-blue-600
          text-white
          py-3
          rounded-lg
          disabled:bg-gray-400
        "
      >
        {saving
          ? "Saving..."
          : "Save Reservation"}
      </button>

    </form>
  );
}