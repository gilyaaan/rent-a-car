// src/components/RecentPaymentsTable.jsx

export default function RecentPaymentsTable() {
  return (
    <div className="bg-white rounded-xl shadow">

      <div className="p-5 border-b">
        <h2 className="font-semibold">
          Recent Payments
        </h2>
      </div>

      <table className="w-full">

        <thead>

          <tr>
            <th className="p-4">Payment ID</th>
            <th className="p-4">Rental</th>
            <th className="p-4">Method</th>
            <th className="p-4">Amount</th>
          </tr>

        </thead>

        <tbody>

          <tr>
            <td className="p-4">P001</td>
            <td className="p-4">#1001</td>
            <td className="p-4">GCash</td>
            <td className="p-4">₱5,000</td>
          </tr>

        </tbody>

      </table>

    </div>
  );
}