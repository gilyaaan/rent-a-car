import { useState } from "react";
import VehicleTable from "../../components/VehicleTable";
import VehicleModal from "../../components/VehicleModal";

export default function Vehicles() {
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const handleVehicleAdded = () => {
    setShowModal(false);
    setRefresh((previous) => previous + 1);
  };

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold">
            Vehicles
          </h1>

          <p className="text-gray-500">
            Manage company vehicles
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Add Vehicle
        </button>

      </div>

      <VehicleTable key={refresh} />

      {showModal && (
        <VehicleModal
          onClose={() => setShowModal(false)}
          onVehicleAdded={handleVehicleAdded}
        />
      )}

    </div>
  );
}