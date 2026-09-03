import { useState } from "react";
import CustomerTable from "../../components/CustomerTable";
import CustomerModal from "../../components/CustomerModal";

export default function Customers() {
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const handleCustomerAdded = () => {
    setShowModal(false);
    setRefresh((previous) => previous + 1);
  };

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold">
            Customers
          </h1>

          <p className="text-gray-500">
            Manage customers
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Add Customer
        </button>

      </div>

      <CustomerTable key={refresh} />

      {showModal && (
        <CustomerModal
          onClose={() => setShowModal(false)}
          onCustomerAdded={handleCustomerAdded}
        />
      )}

    </div>
  );
}