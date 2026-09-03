import { useState } from "react";
import api from "../services/api";

export default function CustomerForm({
  onClose,
  onCustomerAdded
}) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    license_number: "",
    address: "",
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
      const customerData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        license_number: formData.license_number,
        address: formData.address,
      };

      console.log("Sending customer:", customerData);

      const response = await api.post(
        "/customers/",
        customerData
      );

      console.log(
        "Customer added:",
        response.data
      );

      if (onCustomerAdded) {
        onCustomerAdded(response.data);
      }

      if (onClose) {
        onClose();
      }

    } catch (err) {
      console.error(
        "Failed to add customer:",
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
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >

      {/* First Name */}

      <input
        type="text"
        name="first_name"
        value={formData.first_name}
        onChange={handleChange}
        placeholder="First Name"
        className="w-full border p-3 rounded-lg"
        required
      />

      {/* Last Name */}

      <input
        type="text"
        name="last_name"
        value={formData.last_name}
        onChange={handleChange}
        placeholder="Last Name"
        className="w-full border p-3 rounded-lg"
        required
      />

      {/* Email */}

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email Address"
        className="w-full border p-3 rounded-lg"
        required
      />

      {/* Phone */}

      <input
        type="text"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone Number"
        className="w-full border p-3 rounded-lg"
        required
      />

      {/* Driver License */}

      <input
        type="text"
        name="license_number"
        value={formData.license_number}
        onChange={handleChange}
        placeholder="Driver License Number"
        className="w-full border p-3 rounded-lg"
        required
      />

      {/* Address */}

      <input
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Address"
        className="w-full border p-3 rounded-lg"
        required
      />

      {/* Error */}

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Save Button */}

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
        {loading
          ? "Saving..."
          : "Save Customer"}
      </button>

    </form>
  );
}