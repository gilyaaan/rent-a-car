export default function RentalRateSettings() {
  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-xl font-semibold mb-4">
        Rental Rates
      </h2>

      <div className="grid md:grid-cols-3 gap-4">

        <input
          type="number"
          placeholder="Economy Rate"
          className="border p-3 rounded-lg"
        />

        <input
          type="number"
          placeholder="Sedan Rate"
          className="border p-3 rounded-lg"
        />

        <input
          type="number"
          placeholder="SUV Rate"
          className="border p-3 rounded-lg"
        />

      </div>

      <button className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg">
        Update Rates
      </button>

    </div>
  );
}