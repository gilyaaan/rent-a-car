import { useEffect, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";

import api from "../../services/api";
import RentalTable from "../../components/RentalTable";
import RentalModal from "../../components/RentalModal";

export default function Rentals() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);

  // ==================================================
  // LOAD RENTALS
  // ==================================================

  const loadRentals = async () => {
    try {
      setError("");

      const response = await api.get("/rentals/");

      console.log("Rentals:", response.data);

      setRentals(response.data || []);
    } catch (err) {
      console.error("Failed to load rentals:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to load rentals."
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
    loadRentals();
  }, []);

  // ==================================================
  // REFRESH
  // ==================================================

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadRentals();
  };

  // ==================================================
  // ADD RENTAL
  // ==================================================

  const handleAdd = () => {
    setSelectedRental(null);
    setShowModal(true);
  };

  // ==================================================
  // EDIT RENTAL
  // ==================================================

  const handleEdit = (rental) => {
    setSelectedRental(rental);
    setShowModal(true);
  };

  // ==================================================
  // DELETE RENTAL
  // ==================================================

  const handleDelete = async (rental) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete Rental #${rental.id}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(
        `/rentals/${rental.id}`
      );

      setRentals((previous) =>
        previous.filter(
          (item) => item.id !== rental.id
        )
      );
    } catch (err) {
      console.error(
        "Failed to delete rental:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Failed to delete rental."
      );
    }
  };

  // ==================================================
  // RENTAL CREATED / UPDATED
  // ==================================================

  const handleRentalSaved = (savedRental) => {
    if (!savedRental) {
      return;
    }

    setRentals((previous) => {
      const exists = previous.some(
        (rental) =>
          rental.id === savedRental.id
      );

      if (exists) {
        return previous.map((rental) =>
          rental.id === savedRental.id
            ? savedRental
            : rental
        );
      }

      return [
        savedRental,
        ...previous,
      ];
    });

    setShowModal(false);
    setSelectedRental(null);
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-500">
          Loading rentals...
        </div>
      </div>
    );
  }

  // ==================================================
  // PAGE
  // ==================================================

  return (
    <div className="p-6 space-y-6">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Rentals
          </h1>

          <p className="text-gray-500 mt-1">
            Manage vehicle rentals and rental activity.
          </p>
        </div>

        <div className="flex items-center gap-3">

          {/* Refresh */}

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 border border-gray-300 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
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

          {/* Add Rental */}

          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700"
          >
            <Plus size={18} />

            Add Rental
          </button>

        </div>

      </div>


      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}


      {/* ==================================================
          RENTAL TABLE
      ================================================== */}

      <RentalTable
        rentals={rentals}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />


      {/* ==================================================
          RENTAL MODAL
      ================================================== */}

      {showModal && (
        <RentalModal
          rental={selectedRental}
          onClose={() => {
            setShowModal(false);
            setSelectedRental(null);
          }}
          onRentalAdded={handleRentalSaved}
          onRentalUpdated={handleRentalSaved}
        />
      )}

    </div>
  );
}