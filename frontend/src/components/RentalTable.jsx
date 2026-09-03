import { Pencil, Trash2 } from "lucide-react";

export default function RentalTable({
  rentals,
  onEdit,
  onDelete,
}) {
  if (!rentals || rentals.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
        No rentals found.
      </div>
    );
  }

  const formatAmount = (amount) => {
    if (amount === null || amount === undefined) {
      return "₱0.00";
    }

    return `₱${Number(amount).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Active":
        return "bg-blue-100 text-blue-700";

      case "Completed":
        return "bg-green-100 text-green-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

      <div className="overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="bg-gray-50 border-b border-gray-200">

            <tr>

              <th className="text-left px-6 py-4 font-semibold text-gray-700">
                Rental ID
              </th>

              <th className="text-left px-6 py-4 font-semibold text-gray-700">
                Reservation
              </th>

              <th className="text-left px-6 py-4 font-semibold text-gray-700">
                Start Date
              </th>

              <th className="text-left px-6 py-4 font-semibold text-gray-700">
                Return Date
              </th>

              <th className="text-left px-6 py-4 font-semibold text-gray-700">
                Total Amount
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

            {rentals.map((rental) => (

              <tr
                key={rental.id}
                className="hover:bg-gray-50"
              >

                {/* Rental ID */}

                <td className="px-6 py-4 font-medium text-gray-900">
                  #{rental.id}
                </td>


                {/* Reservation */}

                <td className="px-6 py-4 text-gray-700">
                  #{rental.reservation_id}
                </td>


                {/* Start Date */}

                <td className="px-6 py-4 text-gray-700">
                  {formatDate(rental.start_date)}
                </td>


                {/* Actual Return Date */}

                <td className="px-6 py-4 text-gray-700">
                  {formatDate(
                    rental.actual_return_date
                  )}
                </td>


                {/* Backend Calculated Amount */}

                <td className="px-6 py-4 font-semibold text-gray-900">
                  {formatAmount(
                    rental.total_amount
                  )}
                </td>


                {/* Backend Controlled Status */}

                <td className="px-6 py-4">

                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                      rental.status
                    )}`}
                  >
                    {rental.status}
                  </span>

                </td>


                {/* Actions */}

                <td className="px-6 py-4">

                  <div className="flex justify-end gap-2">

                    {onEdit && (
                      <button
                        type="button"
                        onClick={() =>
                          onEdit(rental)
                        }
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Edit rental"
                      >
                        <Pencil size={17} />
                      </button>
                    )}

                    {onDelete && (
                      <button
                        type="button"
                        onClick={() =>
                          onDelete(rental)
                        }
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete rental"
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