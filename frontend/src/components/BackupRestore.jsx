export default function BackupRestore() {
  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-xl font-semibold mb-4">
        Backup & Restore
      </h2>

      <div className="flex gap-4">

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          Backup Database
        </button>

        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg">
          Restore Database
        </button>

      </div>

    </div>
  );
}