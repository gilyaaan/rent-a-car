// src/components/RecentRentalsTable.jsx

export default function RecentRentalsTable() {
  return (
    <div className="bg-white rounded-xl shadow">

      <div className="p-5 border-b">
        <h2 className="font-semibold">
          Recent Rentals
        </h2>
      </div>

      <table className="w-full">

        <thead>

          <tr>
            <th className="p-4">ID</th>
            <th className="p-4">Customer</th>
            <th className="p-4">Vehicle</th>
            <th className="p-4">Status</th>
            <th className="p-4">Amount</th>
          </tr>

        </thead>

        <tbody>

          <tr>
            <td className="p-4">#1001</td>
            <td className="p-4">Juan Dela Cruz</td>
            <td className="p-4">Toyota Vios</td>
            <td className="p-4">Active</td>
            <td className="p-4">₱5,000</td>
          </tr>

        </tbody>

      </table>

    </div>
  );
}