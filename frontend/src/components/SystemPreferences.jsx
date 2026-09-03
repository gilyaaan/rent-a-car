export default function SystemPreferences() {
  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-xl font-semibold mb-4">
        System Preferences
      </h2>

      <div className="space-y-4">

        <label className="flex items-center gap-3">

          <input type="checkbox" />

          Enable Email Notifications

        </label>

        <label className="flex items-center gap-3">

          <input type="checkbox" />

          Enable SMS Notifications

        </label>

        <label className="flex items-center gap-3">

          <input type="checkbox" />

          Enable Dark Mode

        </label>

      </div>

    </div>
  );
}