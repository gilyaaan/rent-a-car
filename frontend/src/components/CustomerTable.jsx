import { useEffect, useState } from "react";
import api from "../services/api";

export default function CustomerTable() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        console.log("Fetching customers...");

        const response = await api.get("/customers/");

        console.log("Customer API response:", response.data);

        setCustomers(response.data);
      } catch (error) {
        console.error("Customer API error:", error);

        setError(
          error.response?.data?.detail ||
          "Failed to load customers."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <p className="text-gray-500">
          Loading customers...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <p className="text-red-500">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">

      <table className="w-full">

        <thead className="bg-slate-100">
          <tr>

            <th className="p-4 text-left">
              ID
            </th>

            <th className="p-4 text-left">
              Name
            </th>

            <th className="p-4 text-left">
              Email
            </th>

            <th className="p-4 text-left">
              Phone
            </th>

            <th className="p-4 text-left">
              License No.
            </th>

            <th className="p-4 text-left">
              Address
            </th>

          </tr>
        </thead>

        <tbody>

          {customers.map((customer) => (

            <tr
              key={customer.id}
              className="border-t hover:bg-gray-50"
            >

              <td className="p-4">
                {customer.id}
              </td>

              <td className="p-4">
                {customer.first_name} {customer.last_name}
              </td>

              <td className="p-4">
                {customer.email}
              </td>

              <td className="p-4">
                {customer.phone}
              </td>

              <td className="p-4">
                {customer.license_number}
              </td>

              <td className="p-4">
                {customer.address}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

      {customers.length === 0 && (
        <div className="p-6 text-center text-gray-500">
          No customers found.
        </div>
      )}

    </div>
  );
}