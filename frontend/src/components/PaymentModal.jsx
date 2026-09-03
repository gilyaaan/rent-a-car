import PaymentForm from "./PaymentForm";

export default function PaymentModal({
  onClose,
  onPaymentAdded
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">

      <div className="bg-white rounded-xl p-6 w-[550px]">

        <div className="flex justify-between mb-4">

          <h2 className="text-xl font-bold">
            Record Payment
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>

        </div>

        <PaymentForm
          onClose={onClose}
          onPaymentAdded={onPaymentAdded}
        />

      </div>

    </div>
  );
}