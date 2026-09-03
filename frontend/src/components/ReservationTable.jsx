import { useEffect, useState } from "react";
import api from "../services/api";

export default function ReservationTable() {
  const [reservations, setReservations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        reservationsResponse,
        customersResponse,
        vehiclesResponse
      ] = await Promise.all([
        api.get("/reservations/"),
        api.get("/customers/"),
        api.get("/vehicles/")
      ]);

      console.log(
        "Reservations:",
        reservationsResponse.data
      );

      console.log(
        "Customers:",
        customersResponse.data
      );

      console.log(
        "Vehicles:",
        vehiclesResponse.data
      );

      setReservations(reservationsResponse.data);
      setCustomers(customersResponse.data);
      setVehicles(vehiclesResponse.data);

    } catch (err) {
      console.error(
        "Failed to load reservations:",
        err
      );

      if (err.response) {
        setError(
          err.response.data?.detail ||
          `Server error: ${err.response.status}`
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

  const getCustomerName = (customerId) => {
    const customer = customers.find(
      (item) => item.id === customerId
    );

    if (!customer) {
      return `Customer #${customerId}`;
    }

    return `${customer.first_name} ${customer.last_name}`;
  };

  const getVehicleName = (vehicleId) => {
    const vehicle = vehicles.find(
      (item) => item.id === vehicleId
    );

    if (!vehicle) {
      return `Vehicle #${vehicleId}`;
    }

    return `${vehicle.brand} ${vehicle.model}`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <p className="text-gray-500">
          Loading reservations...
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
              Customer
            </th>

            <th className="p-4 text-left">
              Vehicle
            </th>

            <th className="p-4 text-left">
              Pickup
            </th>

            <th className="p-4 text-left">
              Return
            </th>

            <th className="p-4 text-left">
              Status
            </th>
          </tr>

        </thead>

        <tbody>

          {reservations.map((reservation) => (

            <tr
              key={reservation.id}
              className="border-t hover:bg-gray-50"
            >

              <td className="p-4">
                {reservation.id}
              </td>

              <td className="p-4">
                {getCustomerName(
                  reservation.customer_id
                )}
              </td>

              <td className="p-4">
                {getVehicleName(
                  reservation.vehicle_id
                )}
              </td>

              <td className="p-4">
                {reservation.pickup_date}
              </td>

              <td className="p-4">
                {reservation.return_date}
              </td>

              <td className="p-4">

                <span
                  className={
                    reservation.status === "Approved"
                      ? "bg-green-100 text-green-700 px-3 py-1 rounded-full"
                      : reservation.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full"
                        : "bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                  }
                >
                  {reservation.status}
                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

      {reservations.length === 0 && (
        <div className="p-6 text-center text-gray-500">
          No reservations found.
        </div>
      )}

    </div>
  );
}