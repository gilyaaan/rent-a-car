export default function CompanySettings() {
  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-xl font-semibold mb-4">
        Company Information
      </h2>

      <div className="grid md:grid-cols-2 gap-4">

        <input
          type="text"
          placeholder="Company Name"
          className="border p-3 rounded-lg"
        />

        <input
          type="text"
          placeholder="Contact Number"
          className="border p-3 rounded-lg"
        />

        <input
          type="email"
          placeholder="Email Address"
          className="border p-3 rounded-lg"
        />

        <input
          type="text"
          placeholder="Company Address"
          className="border p-3 rounded-lg"
        />

      </div>

      <button className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg">
        Save Changes
      </button>

    </div>
  );
}