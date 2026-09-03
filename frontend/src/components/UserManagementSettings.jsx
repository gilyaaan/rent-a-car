export default function UserManagementSettings() {
  return (
    <div className="bg-white rounded-xl shadow p-6">

      <div className="flex justify-between items-center mb-4">

        <h2 className="text-xl font-semibold">
          User Management
        </h2>

        <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
          Add User
        </button>

      </div>

      <table className="w-full">

        <thead className="bg-slate-100">

          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Role</th>
            <th className="p-3">Status</th>
          </tr>

        </thead>

        <tbody>

          <tr>
            <td className="p-3">Administrator</td>
            <td className="p-3">Admin</td>
            <td className="p-3">Active</td>
          </tr>

        </tbody>

      </table>

    </div>
  );
}