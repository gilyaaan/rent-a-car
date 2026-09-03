import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

// ==================================================
// PUBLIC PAGES
// ==================================================

import LandingPage from "../pages/LandingPage";
import Register from "../pages/Register";
import Login from "../pages/Login";

// ==================================================
// USER PAGES
// ==================================================

import UserDashboard from "../pages/User/UserDashboard";
import MyReservations from "../pages/User/MyReservations";
import MyRentals from "../pages/User/MyRentals";
import MyPayments from "../pages/User/MyPayments";
import Profile from "../pages/Profile";

// ==================================================
// OWNER PAGES
// ==================================================

import OwnerDashboard from "../pages/Owner/OwnerDashboard";
import OwnerVehicles from "../pages/Owner/OwnerVehicles";
import OwnerReservations from "../pages/Owner/OwnerReservations";
import OwnerRentals from "../pages/Owner/OwnerRentals";
import OwnerEarnings from "../pages/Owner/OwnerEarnings";
import OwnerProfile from "../pages/Owner/OwnerProfile";

// ==================================================
// ADMIN PAGES
// ==================================================

import Dashboard from "../pages/Dashboard/Dashboard";
import Vehicles from "../pages/Vehicles/Vehicles";
import Customers from "../pages/Customers/Customers";
import Reservations from "../pages/Reservations/Reservations";
import Rentals from "../pages/Rentals/Rentals";
import Payments from "../pages/Payments/Payments";
import Reports from "../pages/Reports/Reports";
import Settings from "../pages/Settings/Settings";

// ==================================================
// SUPER ADMIN PAGES
// ==================================================

import SuperAdminDashboard from "../pages/SuperAdmin/SuperAdminDashboard";

// ==================================================
// ROUTE PROTECTION
// ==================================================

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================================================== */}
        {/* PUBLIC PAGES */}
        {/* ================================================== */}

        <Route
          path="/"
          element={<LandingPage />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* ================================================== */}
        {/* USER PAGES */}
        {/* ================================================== */}

        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["user"]}>
                <MainLayout>
                  <UserDashboard />
                </MainLayout>
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-reservations"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["user"]}>
                <MainLayout>
                  <MyReservations />
                </MainLayout>
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-rentals"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["user"]}>
                <MainLayout>
                  <MyRentals />
                </MainLayout>
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-payments"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["user"]}>
                <MainLayout>
                  <MyPayments />
                </MainLayout>
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["user"]}>
                <MainLayout>
                  <Profile />
                </MainLayout>
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* ================================================== */}
        {/* OWNER PAGES */}
        {/* ================================================== */}

        <Route
          path="/owner-dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["car_owner"]}>
                <MainLayout>
                  <OwnerDashboard />
                </MainLayout>
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner-vehicles"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["car_owner"]}>
                <MainLayout>
                  <OwnerVehicles />
                </MainLayout>
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner-reservations"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["car_owner"]}>
                <MainLayout>
                  <OwnerReservations />
                </MainLayout>
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner-rentals"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["car_owner"]}>
                <MainLayout>
                  <OwnerRentals />
                </MainLayout>
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner-earnings"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["car_owner"]}>
                <MainLayout>
                  <OwnerEarnings />
                </MainLayout>
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner-profile"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["car_owner"]}>
                <MainLayout>
                  <OwnerProfile />
                </MainLayout>
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* ================================================== */}
        {/* SUPER ADMIN */}
        {/* ================================================== */}

        <Route
          path="/super-admin"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["super_admin"]}>
                <MainLayout>
                  <SuperAdminDashboard />
                </MainLayout>
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* ================================================== */}
        {/* ADMIN / SUPER ADMIN DASHBOARD */}
        {/* ================================================== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["admin", "super_admin"]}>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* ================================================== */}
        {/* ADMIN / SUPER ADMIN VEHICLES */}
        {/* ================================================== */}

        <Route
          path="/vehicles"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["admin", "super_admin"]}>
                <MainLayout>
                  <Vehicles />
                </MainLayout>
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* ================================================== */}
        {/* ADMIN / SUPER ADMIN CUSTOMERS */}
        {/* ================================================== */}

        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["admin", "super_admin"]}>
                <MainLayout>
                  <Customers />
                </MainLayout>
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* ================================================== */}
        {/* ADMIN / SUPER ADMIN RESERVATIONS */}
        {/* ================================================== */}

        <Route
          path="/reservations"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["admin", "super_admin"]}>
                <MainLayout>
                  <Reservations />
                </MainLayout>
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* ================================================== */}
        {/* ADMIN / SUPER ADMIN RENTALS */}
        {/* ================================================== */}

        <Route
          path="/rentals"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["admin", "super_admin"]}>
                <MainLayout>
                  <Rentals />
                </MainLayout>
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* ================================================== */}
        {/* ADMIN / SUPER ADMIN PAYMENTS */}
        {/* ================================================== */}

        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["admin", "super_admin"]}>
                <MainLayout>
                  <Payments />
                </MainLayout>
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* ================================================== */}
        {/* ADMIN / SUPER ADMIN REPORTS */}
        {/* ================================================== */}

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["admin", "super_admin"]}>
                <MainLayout>
                  <Reports />
                </MainLayout>
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* ================================================== */}
        {/* ADMIN / SUPER ADMIN SETTINGS */}
        {/* ================================================== */}

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["admin", "super_admin"]}>
                <MainLayout>
                  <Settings />
                </MainLayout>
              </RoleRoute>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}