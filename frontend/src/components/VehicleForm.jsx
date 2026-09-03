import { useState } from "react";
import api from "../services/api";

export default function VehicleForm({
  onClose,
  onVehicleAdded
}) {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    plate_number: "",
    daily_rate: "",
    status: "Available",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const vehicleData = {
        brand: formData.brand,
        model: formData.model,
        year: Number(formData.year),
        plate_number: formData.plate_number,
        daily_rate: Number(formData.daily_rate),
        status: formData.status,
      };

      console.log("Sending vehicle:", vehicleData);

      const response = await api.post(
        "/vehicles/",
        vehicleData
      );

      console.log("Vehicle added:", response.data);

      if (onVehicleAdded) {
        onVehicleAdded(response.data);
      }

      onClose();

    } catch (err) {
      console.error("Failed to add vehicle:", err);

      if (err.response) {
        console.error("API response:", err.response.data);

        setError(
          err.response.data?.detail ||
          "Failed to add vehicle."
        );
      } else {
        setError(
          "Unable to connect to the server."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >

      <input
        type="text"
        name="brand"
        value={formData.brand}
        onChange={handleChange}
        placeholder="Brand"
        className="w-full border p-3 rounded-lg"
        required
      />

      <input
        type="text"
        name="model"
        value={formData.model}
        onChange={handleChange}
        placeholder="Model"
        className="w-full border p-3 rounded-lg"
        required
      />

      <input
        type="number"
        name="year"
        value={formData.year}
        onChange={handleChange}
        placeholder="Year"
        className="w-full border p-3 rounded-lg"
        required
      />

      <input
        type="text"
        name="plate_number"
        value={formData.plate_number}
        onChange={handleChange}
        placeholder="Plate Number"
        className="w-full border p-3 rounded-lg"
        required
      />

      <input
        type="number"
        name="daily_rate"
        value={formData.daily_rate}
        onChange={handleChange}
        placeholder="Daily Rate"
        className="w-full border p-3 rounded-lg"
        required
      />

      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        className="w-full border p-3 rounded-lg"
      >
        <option value="Available">
          Available
        </option>

        <option value="Rented">
          Rented
        </option>

        <option value="Maintenance">
          Maintenance
        </option>
      </select>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="
          w-full
          bg-blue-600
          text-white
          py-3
          rounded-lg
          disabled:bg-gray-400
        "
      >
        {loading ? "Saving..." : "Save Vehicle"}
      </button>

    </form>
  );
}