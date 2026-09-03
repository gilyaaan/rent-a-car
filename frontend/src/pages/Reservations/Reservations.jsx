import { useState } from "react";
import ReservationTable from "../../components/ReservationTable";
import ReservationModal from "../../components/ReservationModal";

export default function Reservations() {
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const handleReservationAdded = () => {
    // Close the modal
    setShowModal(false);

    // Refresh ReservationTable
    setRefresh((previous) => previous + 1);
  };

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold">
            Reservations
          </h1>

          <p className="text-gray-500">
            Manage vehicle reservations
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="
            bg-blue-600
            text-white
            px-4
            py-2
            rounded-lg
            hover:bg-blue-700
          "
        >
          New Reservation
        </button>

      </div>


      {/* Reservation Table */}

      <ReservationTable key={refresh} />


      {/* Reservation Modal */}

      {showModal && (
        <ReservationModal
          onClose={() => setShowModal(false)}
          onReservationAdded={handleReservationAdded}
        />
      )}

    </div>
  );
}