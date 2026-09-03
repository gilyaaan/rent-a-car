import ReservationForm from "./ReservationForm";

export default function ReservationModal({
  onClose,
  onReservationAdded
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
            Add Reservation
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>

        </div>

        <ReservationForm
          onClose={onClose}
          onReservationAdded={onReservationAdded}
        />

      </div>
    </div>
  );
}