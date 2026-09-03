import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function MyPayments() {
  const [payments, setPayments] = useState([]);
  const [rentals, setRentals] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    rental_id: "",
    amount: "",
    payment_method: "",
    payment_date: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // LOAD PAYMENTS AND RENTALS
  // =====================================================

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [paymentsResponse, rentalsResponse] =
        await Promise.all([
          api.get("/payments/"),
          api.get("/rentals/"),
        ]);

      setPayments(paymentsResponse.data);
      setRentals(rentalsResponse.data);
    } catch (error) {
      console.error("Failed to load payments:", error);

      setError(
        error?.response?.data?.detail ||
        "Unable to load payments."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // HANDLE FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // ADD PAYMENT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.rental_id) {
      setError("Please select a rental.");
      return;
    }

    if (!form.amount) {
      setError("Please enter the payment amount.");
      return;
    }

    if (Number(form.amount) <= 0) {
      setError("Payment amount must be greater than ₱0.00.");
      return;
    }

    if (!form.payment_method) {
      setError("Please select a payment method.");
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/payments/", {
        rental_id: Number(form.rental_id),
        amount: Number(form.amount),
        payment_method: form.payment_method,
        payment_date: form.payment_date || null,
      });

      setSuccess("Payment added successfully.");

      setForm({
        rental_id: "",
        amount: "",
        payment_method: "",
        payment_date: "",
      });

      setShowForm(false);

      await loadData();
    } catch (error) {
      console.error("Failed to add payment:", error);

      setError(
        error?.response?.data?.detail ||
        "Failed to add payment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // CANCEL
  // =====================================================

  const handleCancel = () => {
    setShowForm(false);

    setForm({
      rental_id: "",
      amount: "",
      payment_method: "",
      payment_date: "",
    });

    setError("");
  };

  // =====================================================
  // FORMAT CURRENCY
  // =====================================================

  const formatCurrency = (amount) => {
    return `₱${Number(amount || 0).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    switch (String(status || "").toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "failed":
        return "bg-red-100 text-red-700";

      case "cancelled":
      case "canceled":
        return "bg-slate-100 text-slate-600";

      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">

          <div className="flex items-center justify-between">

            {/* LOGO */}

            <Link
              to="/user-dashboard"
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg">
                M
              </div>

              <div>
                <h1 className="font-bold text-slate-900 text-lg">
                  MyCarRental
                </h1>

                <p className="text-xs text-slate-500">
                  Premium Car Rentals
                </p>
              </div>
            </Link>

            {/* NAVIGATION */}

            <div className="flex items-center gap-4">

              <Link
                to="/user-dashboard"
                className="text-sm font-medium text-slate-600 hover:text-black transition"
              >
                Dashboard
              </Link>

              <Link
                to="/profile"
                className="text-sm font-medium text-slate-600 hover:text-black transition"
              >
                Profile
              </Link>

            </div>

          </div>

        </div>
      </header>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* PAGE TITLE */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
              Customer Area
            </p>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-1">
              My Payments
            </h1>

            <p className="text-slate-500 mt-2">
              View and manage your rental payment history.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowForm(true);
              setError("");
              setSuccess("");
            }}
            className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-slate-800 transition"
          >
            + Add Payment
          </button>

        </div>


        {/* =================================================
            SUCCESS MESSAGE
        ================================================= */}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-xl">
            <div className="font-medium">
              {success}
            </div>
          </div>
        )}


        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl">
            <div className="font-medium">
              {error}
            </div>
          </div>
        )}


        {/* =================================================
            PAYMENT SUMMARY
        ================================================= */}

        {!loading && payments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

            {/* TOTAL PAYMENTS */}

            <div className="bg-white rounded-2xl border border-slate-200 p-6">

              <p className="text-sm text-slate-500">
                Total Payments
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-2">
                {payments.length}
              </p>

            </div>


            {/* TOTAL PAID */}

            <div className="bg-white rounded-2xl border border-slate-200 p-6">

              <p className="text-sm text-slate-500">
                Total Amount
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-2">
                {formatCurrency(
                  payments.reduce(
                    (total, payment) =>
                      total + Number(payment.amount || 0),
                    0
                  )
                )}
              </p>

            </div>


            {/* PAID PAYMENTS */}

            <div className="bg-white rounded-2xl border border-slate-200 p-6">

              <p className="text-sm text-slate-500">
                Paid Transactions
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-2">
                {
                  payments.filter(
                    (payment) =>
                      String(payment.status || "").toLowerCase() ===
                      "paid"
                  ).length
                }
              </p>

            </div>

          </div>
        )}


        {/* =================================================
            ADD PAYMENT FORM
        ================================================= */}

        {showForm && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 mb-8">

            <div className="flex items-center justify-between mb-6">

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Add Payment
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Record a payment for one of your rentals.
                </p>
              </div>

            </div>


            <form onSubmit={handleSubmit}>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* RENTAL */}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Rental
                  </label>

                  <select
                    name="rental_id"
                    value={form.rental_id}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >

                    <option value="">
                      Select Rental
                    </option>

                    {rentals.map((rental) => (
                      <option
                        key={rental.id}
                        value={rental.id}
                      >
                        Rental #{rental.id}
                        {" - "}
                        {formatCurrency(rental.total_amount)}
                      </option>
                    ))}

                  </select>
                </div>


                {/* AMOUNT */}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Amount
                  </label>

                  <div className="relative">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                      ₱
                    </span>

                    <input
                      type="number"
                      name="amount"
                      value={form.amount}
                      onChange={handleChange}
                      min="0.01"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full border border-slate-300 rounded-xl pl-9 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400"
                    />

                  </div>
                </div>


                {/* PAYMENT METHOD */}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Payment Method
                  </label>

                  <select
                    name="payment_method"
                    value={form.payment_method}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >

                    <option value="">
                      Select Payment Method
                    </option>

                    <option value="Cash">
                      Cash
                    </option>

                    <option value="GCash">
                      GCash
                    </option>

                    <option value="Credit Card">
                      Credit Card
                    </option>

                    <option value="Debit Card">
                      Debit Card
                    </option>

                    <option value="Bank Transfer">
                      Bank Transfer
                    </option>

                  </select>
                </div>


                {/* PAYMENT DATE */}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Payment Date
                  </label>

                  <input
                    type="date"
                    name="payment_date"
                    value={form.payment_date}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>

              </div>


              {/* BUTTONS */}

              <div className="flex justify-end gap-3 mt-8">

                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 rounded-full border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 rounded-full bg-black text-white font-medium hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Adding..." : "Add Payment"}
                </button>

              </div>

            </form>

          </div>
        )}


        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">

            <p className="text-slate-500">
              Loading payments...
            </p>

          </div>
        )}


        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {!loading && payments.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">

            <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-2xl mb-5">
              ₱
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              No Payments Yet
            </h2>

            <p className="text-slate-500 mt-2 max-w-md mx-auto">
              Your payment transactions will appear here once
              you make a payment for a rental.
            </p>

            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="mt-6 bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-slate-800 transition"
            >
              Add Your First Payment
            </button>

          </div>
        )}


        {/* =================================================
            PAYMENTS TABLE
        ================================================= */}

        {!loading && payments.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">

            {/* TABLE HEADER */}

            <div className="px-6 py-5 border-b border-slate-200">

              <h2 className="text-xl font-bold text-slate-900">
                Payment History
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Your recent rental payment transactions.
              </p>

            </div>


            {/* RESPONSIVE TABLE */}

            <div className="overflow-x-auto">

              <table className="w-full min-w-[800px]">

                <thead className="bg-slate-50">

                  <tr>

                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Payment
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Rental
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Amount
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Method
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Date
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {payments.map((payment) => (

                    <tr
                      key={payment.id}
                      className="border-t border-slate-100 hover:bg-slate-50 transition"
                    >

                      {/* PAYMENT */}

                      <td className="px-6 py-5">

                        <span className="font-semibold text-slate-900">
                          #{payment.id}
                        </span>

                      </td>


                      {/* RENTAL */}

                      <td className="px-6 py-5">

                        <span className="text-slate-700">
                          Rental #{payment.rental_id}
                        </span>

                      </td>


                      {/* AMOUNT */}

                      <td className="px-6 py-5">

                        <span className="font-bold text-slate-900">
                          {formatCurrency(payment.amount)}
                        </span>

                      </td>


                      {/* METHOD */}

                      <td className="px-6 py-5">

                        <span className="text-slate-700">
                          {payment.payment_method || "—"}
                        </span>

                      </td>


                      {/* DATE */}

                      <td className="px-6 py-5">

                        <span className="text-slate-600">
                          {payment.payment_date || "—"}
                        </span>

                      </td>


                      {/* STATUS */}

                      <td className="px-6 py-5">

                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                            payment.status
                          )}`}
                        >
                          {payment.status || "Unknown"}
                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>
        )}


        {/* =================================================
            BACK TO DASHBOARD
        ================================================= */}

        <div className="mt-8">

          <Link
            to="/user-dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-black transition"
          >
            ← Back to Dashboard
          </Link>

        </div>

      </main>


      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="border-t border-slate-200 bg-white mt-12">

        <div className="max-w-7xl mx-auto px-6 py-8">

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            <div>
              <p className="font-bold text-slate-900">
                MyCarRental
              </p>

              <p className="text-sm text-slate-500 mt-1">
                Premium car rentals made simple.
              </p>
            </div>

            <p className="text-sm text-slate-400">
              © 2026 MyCarRental. All rights reserved.
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
}