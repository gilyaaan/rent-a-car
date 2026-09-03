import { Pencil, Trash2 } from "lucide-react";

export default function PaymentTable({
  payments,
  onEdit,
  onDelete,
}) {
  if (!payments || payments.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
        No payments found.
      </div>
    );
  }

  // ==================================================
  // FORMAT AMOUNT
  // ==================================================

  const formatAmount = (amount) => {
    if (
      amount === null ||
      amount === undefined ||
      amount === ""
    ) {
      return "₱0.00";
    }

    return `₱${Number(amount).toLocaleString(
      "en-PH",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  // ==================================================
  // FORMAT DATE
  // ==================================================

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString(
      "en-PH",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  // ==================================================
  // STATUS STYLE
  // ==================================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700";

      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Failed":
        return "bg-red-100 text-red-700";

      case "Refunded":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ==================================================
  // TABLE
  // ==================================================

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

      <div className="overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="bg-gray-50 border-b border-gray-200">

            <tr>

              <th className="text-left px-6 py-4 font-semibold text-gray-700">
                Payment ID
              </th>

              <th className="text-left px-6 py-4 font-semibold text-gray-700">
                Rental
              </th>

              <th className="text-left px-6 py-4 font-semibold text-gray-700">
                Amount
              </th>

              <th className="text-left px-6 py-4 font-semibold text-gray-700">
                Payment Method
              </th>

              <th className="text-left px-6 py-4 font-semibold text-gray-700">
                Payment Date
              </th>

              <th className="text-left px-6 py-4 font-semibold text-gray-700">
                Status
              </th>

              <th className="text-right px-6 py-4 font-semibold text-gray-700">
                Actions
              </th>

            </tr>

          </thead>

          <tbody className="divide-y divide-gray-100">

            {payments.map((payment) => (

              <tr
                key={payment.id}
                className="hover:bg-gray-50"
              >

                {/* PAYMENT ID */}

                <td className="px-6 py-4 font-medium text-gray-900">
                  #{payment.id}
                </td>


                {/* RENTAL */}

                <td className="px-6 py-4 text-gray-700">
                  #{payment.rental_id}
                </td>


                {/* AMOUNT */}

                <td className="px-6 py-4 font-semibold text-gray-900">
                  {formatAmount(
                    payment.amount
                  )}
                </td>


                {/* PAYMENT METHOD */}

                <td className="px-6 py-4 text-gray-700">
                  {payment.payment_method || "—"}
                </td>


                {/* PAYMENT DATE */}

                <td className="px-6 py-4 text-gray-700">
                  {formatDate(
                    payment.payment_date
                  )}
                </td>


                {/* STATUS */}

                <td className="px-6 py-4">

                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                      payment.status
                    )}`}
                  >
                    {payment.status || "Unknown"}
                  </span>

                </td>


                {/* ACTIONS */}

                <td className="px-6 py-4">

                  <div className="flex justify-end gap-2">

                    {onEdit && (
                      <button
                        type="button"
                        onClick={() =>
                          onEdit(payment)
                        }
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Edit payment"
                      >
                        <Pencil size={17} />
                      </button>
                    )}

                    {onDelete && (
                      <button
                        type="button"
                        onClick={() =>
                          onDelete(payment)
                        }
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete payment"
                      >
                        <Trash2 size={17} />
                      </button>
                    )}

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

