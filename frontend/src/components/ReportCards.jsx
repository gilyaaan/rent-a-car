export default function ReportCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-gray-500">
          Total Revenue
        </p>

        <h2 className="text-3xl font-bold mt-2">
          ₱850,000
        </h2>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-gray-500">
          Total Rentals
        </p>

        <h2 className="text-3xl font-bold mt-2">
          142
        </h2>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-gray-500">
          Active Vehicles
        </p>

        <h2 className="text-3xl font-bold mt-2">
          35
        </h2>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-gray-500">
          Customers
        </p>

        <h2 className="text-3xl font-bold mt-2">
          140
        </h2>
      </div>

    </div>
  );
}