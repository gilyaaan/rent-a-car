import { useEffect, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";

import api from "../../services/api";
import PaymentTable from "../../components/PaymentTable";
import PaymentModal from "../../components/PaymentModal";

export default function Payments() {
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] =
    useState(null);

  // ==================================================
  // LOAD PAYMENTS
  // ==================================================

  const loadPayments = async () => {
    try {
      setError("");

      const response = await api.get("/payments/");

      console.log("Payments:", response.data);

      setPayments(response.data);
    } catch (err) {
      console.error(
        "Failed to load payments:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Unable to load payments."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ==================================================
  // INITIAL LOAD
  // ==================================================

  useEffect(() => {
    loadPayments();
  }, []);

  // ==================================================
  // REFRESH
  // ==================================================

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPayments();
  };

  // ==================================================
  // PAYMENT ADDED
  // ==================================================

  const handlePaymentAdded = (newPayment) => {
    setPayments((previous) => [
      newPayment,
      ...previous,
    ]);

    setShowModal(false);
    setSelectedPayment(null);
  };

  // ==================================================
  // PAYMENT UPDATED
  // ==================================================

  const handlePaymentUpdated = () => {
    setShowModal(false);
    setSelectedPayment(null);

    loadPayments();
  };

  // ==================================================
  // EDIT PAYMENT
  // ==================================================

  const handleEdit = (payment) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  // ==================================================
  // DELETE PAYMENT
  // ==================================================

  const handleDelete = async (payment) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete Payment #" +
        payment.id +
        "?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(
        `/payments/${payment.id}`
      );

      setPayments((previous) =>
        previous.filter(
          (item) =>
            item.id !== payment.id
        )
      );
    } catch (err) {
      console.error(
        "Failed to delete payment:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Failed to delete payment."
      );
    }
  };

  // ==================================================
  // CLOSE MODAL
  // ==================================================

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPayment(null);
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
          Loading payments...
        </div>
      </div>
    );
  }

  // ==================================================
  // PAGE
  // ==================================================

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Payments
          </h1>

          <p className="text-gray-500 mt-1">
            Manage rental payments and payment records.
          </p>
        </div>

        <div className="flex gap-3">

          {/* REFRESH */}

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw
              size={18}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>

          {/* RECORD PAYMENT */}

          <button
            type="button"
            onClick={() => {
              setSelectedPayment(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700"
          >
            <Plus size={18} />

            Record Payment
          </button>

        </div>

      </div>


      {/* ERROR */}

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}


      {/* SUMMARY CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* TOTAL PAYMENTS */}

        <div className="bg-white rounded-xl border border-gray-200 p-5">

          <p className="text-sm text-gray-500">
            Total Payments
          </p>

          <p className="text-2xl font-bold text-gray-900 mt-1">
            {payments.length}
          </p>

        </div>


        {/* TOTAL AMOUNT */}

        <div className="bg-white rounded-xl border border-gray-200 p-5">

          <p className="text-sm text-gray-500">
            Total Amount
          </p>

          <p className="text-2xl font-bold text-gray-900 mt-1">
            ₱
            {payments
              .reduce(
                (total, payment) =>
                  total +
                  Number(
                    payment.amount || 0
                  ),
                0
              )
              .toLocaleString(
                "en-PH",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
          </p>

        </div>


        {/* PAID PAYMENTS */}

        <div className="bg-white rounded-xl border border-gray-200 p-5">

          <p className="text-sm text-gray-500">
            Paid Payments
          </p>

          <p className="text-2xl font-bold text-green-600 mt-1">
            {
              payments.filter(
                (payment) =>
                  payment.status === "Paid"
              ).length
            }
          </p>

        </div>

      </div>


      {/* PAYMENT TABLE */}

      <PaymentTable
        payments={payments}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />


      {/* PAYMENT MODAL */}

      {showModal && (
        <PaymentModal
          payment={selectedPayment}
          onClose={handleCloseModal}
          onPaymentAdded={handlePaymentAdded}
          onPaymentUpdated={handlePaymentUpdated}
        />
      )}

    </div>
  );
}
