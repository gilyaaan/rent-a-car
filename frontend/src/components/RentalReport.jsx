const rentals = [
  {
    id: "RT001",
    customer: "Juan Dela Cruz",
    vehicle: "Toyota Vios",
    amount: 5000
  },
  {
    id: "RT002",
    customer: "Maria Santos",
    vehicle: "Honda City",
    amount: 4500
  }
];

export default function RentalReport() {
  return (
    <div className="bg-white rounded-xl shadow">

      <div className="p-5 border-b">
        <h2 className="font-semibold">
          Rental Report
        </h2>
      </div>

      <table className="w-full">

        <thead className="bg-slate-100">

          <tr>
            <th className="p-4">Rental ID</th>
            <th className="p-4">Customer</th>
            <th className="p-4">Vehicle</th>
            <th className="p-4">Revenue</th>
          </tr>

        </thead>

        <tbody>

          {rentals.map((rental) => (
            <tr
              key={rental.id}
              className="border-t"
            >
              <td className="p-4">
                {rental.id}
              </td>

              <td className="p-4">
                {rental.customer}
              </td>

              <td className="p-4">
                {rental.vehicle}
              </td>

              <td className="p-4">
                ₱{rental.amount.toLocaleString()}
              </td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}