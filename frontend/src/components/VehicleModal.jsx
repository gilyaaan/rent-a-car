import VehicleForm from "./VehicleForm";

export default function VehicleModal({
  onClose,
  onVehicleAdded
}) {
  return (
    <div
      className="
        fixed
        inset-0
        bg-black/50
        flex
        items-center
        justify-center
      "
    >
      <div className="bg-white rounded-xl p-6 w-[500px]">

        <div className="flex justify-between mb-4">

          <h2 className="text-xl font-bold">
            Add Vehicle
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>

        </div>

        <VehicleForm
          onClose={onClose}
          onVehicleAdded={onVehicleAdded}
        />

      </div>
    </div>
  );
}