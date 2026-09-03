import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Car,
  Plus,
  Search,
  Pencil,
  Trash2,
  ArrowLeft,
  X,
} from "lucide-react";

import api from "../../services/api";


export default function OwnerVehicles() {
  const [vehicles, setVehicles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const [form, setForm] = useState({
    brand: "",
    model: "",
    year: "",
    plate_number: "",
    daily_rate: "",
    status: "Available",
  });

  // ==========================================================
  // LOAD VEHICLES
  // ==========================================================

  const loadVehicles = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/vehicles/");

      setVehicles(
        Array.isArray(response.data)
          ? response.data
          : []
      );

    } catch (err) {
      console.error("Owner vehicles error:", err);

      setError(
        err.response?.data?.detail ||
        "Unable to load your vehicles."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadVehicles();
  }, []);


  // ==========================================================
  // FORM
  // ==========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  const resetForm = () => {
    setForm({
      brand: "",
      model: "",
      year: "",
      plate_number: "",
      daily_rate: "",
      status: "Available",
    });

    setEditingVehicle(null);
  };


  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };


  const openEditModal = (vehicle) => {
    setEditingVehicle(vehicle);

    setForm({
      brand: vehicle.brand || "",
      model: vehicle.model || "",
      year: vehicle.year || "",
      plate_number: vehicle.plate_number || "",
      daily_rate: vehicle.daily_rate || "",
      status: vehicle.status || "Available",
    });

    setShowModal(true);
  };


  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };


  // ==========================================================
  // SAVE VEHICLE
  // ==========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const vehicleData = {
        brand: form.brand,
        model: form.model,
        year: Number(form.year),
        plate_number: form.plate_number,
        daily_rate: Number(form.daily_rate),
        status: form.status,
      };

      if (editingVehicle) {
        await api.put(
          `/vehicles/${editingVehicle.id}`,
          vehicleData
        );
      } else {
        await api.post(
          "/vehicles/",
          vehicleData
        );
      }

      closeModal();
      await loadVehicles();

    } catch (err) {
      console.error("Save vehicle error:", err);

      setError(
        err.response?.data?.detail ||
        "Unable to save vehicle."
      );
    }
  };


  // ==========================================================
  // DELETE VEHICLE
  // ==========================================================

  const handleDelete = async (vehicle) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${vehicle.brand} ${vehicle.model}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(
        `/vehicles/${vehicle.id}`
      );

      await loadVehicles();

    } catch (err) {
      console.error("Delete vehicle error:", err);

      setError(
        err.response?.data?.detail ||
        "Unable to delete vehicle."
      );
    }
  };


  // ==========================================================
  // HELPERS
  // ==========================================================

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(Number(amount || 0));
  };


  const getStatusClass = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "available") {
      return "bg-green-100 text-green-700";
    }

    if (value === "rented") {
      return "bg-blue-100 text-blue-700";
    }

    if (value === "maintenance") {
      return "bg-red-100 text-red-700";
    }

    return "bg-slate-100 text-slate-600";
  };


  // ==========================================================
  // SEARCH + FILTER
  // ==========================================================

  const filteredVehicles = vehicles.filter((vehicle) => {

    const searchText = search.toLowerCase();

    const matchesSearch =
      String(vehicle.brand || "")
        .toLowerCase()
        .includes(searchText) ||

      String(vehicle.model || "")
        .toLowerCase()
        .includes(searchText) ||

      String(vehicle.plate_number || "")
        .toLowerCase()
        .includes(searchText);


    const matchesStatus =
      statusFilter === "all" ||
      String(vehicle.status || "").toLowerCase() ===
        statusFilter.toLowerCase();


    return matchesSearch && matchesStatus;
  });


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="space-y-6">

        <div className="animate-pulse space-y-6">

          <div className="h-10 w-64 rounded-lg bg-slate-200" />

          <div className="h-20 rounded-2xl bg-slate-200" />

          <div className="h-96 rounded-2xl bg-slate-200" />

        </div>

      </div>
    );
  }


  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <div className="w-full">

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>

          <Link
            to="/owner-dashboard"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Owner Dashboard
          </Link>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            My Vehicles
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage the vehicles available for your rental business.
          </p>

        </div>


        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Plus size={18} />
          Add Vehicle
        </button>

      </div>


      {/* ================================================== */}
      {/* ERROR */}
      {/* ================================================== */}

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">

          <p className="text-sm font-medium text-red-700">
            {error}
          </p>

        </div>
      )}


      {/* ================================================== */}
      {/* SUMMARY */}
      {/* ================================================== */}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-2xl border border-slate-200 bg-white p-5">

          <p className="text-sm text-slate-500">
            Total Vehicles
          </p>

          <p className="mt-2 text-2xl font-semibold text-slate-950">
            {vehicles.length}
          </p>

        </div>


        <div className="rounded-2xl border border-slate-200 bg-white p-5">

          <p className="text-sm text-slate-500">
            Available
          </p>

          <p className="mt-2 text-2xl font-semibold text-green-600">
            {
              vehicles.filter(
                (vehicle) =>
                  String(vehicle.status).toLowerCase() ===
                  "available"
              ).length
            }
          </p>

        </div>


        <div className="rounded-2xl border border-slate-200 bg-white p-5">

          <p className="text-sm text-slate-500">
            Rented
          </p>

          <p className="mt-2 text-2xl font-semibold text-blue-600">
            {
              vehicles.filter(
                (vehicle) =>
                  String(vehicle.status).toLowerCase() ===
                  "rented"
              ).length
            }
          </p>

        </div>


        <div className="rounded-2xl border border-slate-200 bg-white p-5">

          <p className="text-sm text-slate-500">
            Maintenance
          </p>

          <p className="mt-2 text-2xl font-semibold text-red-600">
            {
              vehicles.filter(
                (vehicle) =>
                  String(vehicle.status).toLowerCase() ===
                  "maintenance"
              ).length
            }
          </p>

        </div>

      </div>


      {/* ================================================== */}
      {/* VEHICLE TABLE */}
      {/* ================================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

        {/* TABLE HEADER */}

        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <h2 className="font-semibold text-slate-950">
              Vehicle List
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              {filteredVehicles.length} vehicle
              {filteredVehicles.length !== 1 ? "s" : ""}
              {" "}shown
            </p>

          </div>


          <div className="flex flex-col gap-3 sm:flex-row">

            {/* SEARCH */}

            <div className="relative">

              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search vehicles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white sm:w-64"
              />

            </div>


            {/* FILTER */}

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400"
            >

              <option value="all">
                All Status
              </option>

              <option value="available">
                Available
              </option>

              <option value="rented">
                Rented
              </option>

              <option value="maintenance">
                Maintenance
              </option>

            </select>

          </div>

        </div>


        {/* TABLE */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[850px]">

            <thead>

              <tr className="border-b border-slate-100 text-left">

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Vehicle
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Plate Number
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Year
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Daily Rate
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Status
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Actions
                </th>

              </tr>

            </thead>


            <tbody className="divide-y divide-slate-100">

              {filteredVehicles.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="px-6 py-16 text-center"
                  >

                    <Car
                      size={40}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-4 text-sm font-semibold text-slate-700">
                      No vehicles found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Add a vehicle or change your search filters.
                    </p>

                    <button
                      type="button"
                      onClick={openAddModal}
                      className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-xs font-semibold text-white"
                    >
                      <Plus size={14} />
                      Add Vehicle
                    </button>

                  </td>

                </tr>

              ) : (

                filteredVehicles.map((vehicle) => (

                  <tr
                    key={vehicle.id}
                    className="transition hover:bg-slate-50"
                  >

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-4">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                          <Car
                            size={20}
                            className="text-slate-600"
                          />
                        </div>

                        <div>

                          <p className="text-sm font-semibold text-slate-950">
                            {vehicle.brand || "Vehicle"}{" "}
                            {vehicle.model || ""}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            Vehicle ID: {vehicle.id}
                          </p>

                        </div>

                      </div>

                    </td>


                    <td className="px-6 py-5 text-sm font-medium text-slate-700">
                      {vehicle.plate_number || "—"}
                    </td>


                    <td className="px-6 py-5 text-sm text-slate-600">
                      {vehicle.year || "—"}
                    </td>


                    <td className="px-6 py-5 text-sm font-semibold text-slate-900">
                      {formatCurrency(vehicle.daily_rate)}
                      <span className="text-xs font-normal text-slate-400">
                        {" "}/ day
                      </span>
                    </td>


                    <td className="px-6 py-5">

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase ${getStatusClass(
                          vehicle.status
                        )}`}
                      >
                        {vehicle.status || "Unknown"}
                      </span>

                    </td>


                    <td className="px-6 py-5">

                      <div className="flex justify-end gap-2">

                        <button
                          type="button"
                          onClick={() => openEditModal(vehicle)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                          title="Edit vehicle"
                        >
                          <Pencil size={15} />
                        </button>


                        <button
                          type="button"
                          onClick={() => handleDelete(vehicle)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 text-red-500 transition hover:bg-red-50"
                          title="Delete vehicle"
                        >
                          <Trash2 size={15} />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </section>


      {/* ================================================== */}
      {/* ADD / EDIT MODAL */}
      {/* ================================================== */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

              <div>

                <h2 className="font-semibold text-slate-950">
                  {editingVehicle
                    ? "Edit Vehicle"
                    : "Add Vehicle"}
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  {editingVehicle
                    ? "Update your vehicle information."
                    : "Add a vehicle to your rental fleet."}
                </p>

              </div>


              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >

              <div className="grid gap-4 sm:grid-cols-2">

                {/* BRAND */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Brand
                  </label>

                  <input
                    type="text"
                    name="brand"
                    value={form.brand}
                    onChange={handleChange}
                    placeholder="Toyota"
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                  />

                </div>


                {/* MODEL */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Model
                  </label>

                  <input
                    type="text"
                    name="model"
                    value={form.model}
                    onChange={handleChange}
                    placeholder="Vios"
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                  />

                </div>


                {/* YEAR */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Year
                  </label>

                  <input
                    type="number"
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    placeholder="2025"
                    min="1900"
                    max="2100"
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                  />

                </div>


                {/* PLATE */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Plate Number
                  </label>

                  <input
                    type="text"
                    name="plate_number"
                    value={form.plate_number}
                    onChange={handleChange}
                    placeholder="ABC 1234"
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm uppercase outline-none focus:border-slate-400"
                  />

                </div>


                {/* DAILY RATE */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Daily Rate
                  </label>

                  <input
                    type="number"
                    name="daily_rate"
                    value={form.daily_rate}
                    onChange={handleChange}
                    placeholder="2500"
                    min="0"
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                  />

                </div>


                {/* STATUS */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
                  >

                    <option value="Available">
                      Available
                    </option>

                    <option value="Rented">
                      Rented
                    </option>

                    <option value="Maintenance">
                      Maintenance
                    </option>

                  </select>

                </div>

              </div>


              {/* ACTIONS */}

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">

                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  {editingVehicle
                    ? "Save Changes"
                    : "Add Vehicle"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

