import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/auth";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await loginUser({
        email,
        password,
      });

      console.log("Login successful:", response);

      // =====================================================
      // CHECK ACCESS TOKEN
      // =====================================================

      if (!response?.access_token) {
        throw new Error("No access token received from server.");
      }

      // =====================================================
      // CHECK USER INFORMATION
      // =====================================================

      if (!response?.user) {
        throw new Error("No user information received from server.");
      }

      // =====================================================
      // CHECK ACCOUNT ROLE
      // =====================================================

      if (response.user.role !== role) {
        throw new Error(
          `This account is registered as ${response.user.role.replace(
            "_",
            " "
          )}. Please select the correct account type.`
        );
      }

      // =====================================================
      // SAVE LOGIN INFORMATION
      // =====================================================

      localStorage.setItem(
        "access_token",
        response.access_token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.user)
      );

      // =====================================================
      // REDIRECT BASED ON ROLE
      // =====================================================

      switch (response.user.role) {
        case "super_admin":
          navigate("/super-admin");
          break;

        case "admin":
          navigate("/dashboard");
          break;

        case "car_owner":
          navigate("/owner-dashboard");
          break;

        case "user":
          navigate("/user-dashboard");
          break;

        default:
          throw new Error(
            "Your account role is not recognized."
          );
      }

    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.response?.data?.detail ||
        error.message ||
        "Invalid email or password."
      );

      // Remove invalid login information
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white border-2 border-[#0F172B] rounded-2xl shadow-xl p-8">

        {/* ==================================================
            LOGO
        ================================================== */}

        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-[#0F172B]">
            ARGO
          </h1>

          <p className="text-[#5273A3] mt-2">
            Rent-a-Car Management System
          </p>

        </div>


        {/* ==================================================
            TITLE
        ================================================== */}

        <h2 className="text-2xl font-semibold text-[#0F172B] mb-6">
          Sign In
        </h2>


        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}


        {/* ==================================================
            LOGIN FORM
        ================================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Email */}

          <div>

            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#0F172B] mb-2"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              autoComplete="email"
              className="w-full px-4 py-3 border border-[#0F172B] rounded-lg outline-none focus:border-[#0F172B] focus:ring-2 focus:ring-[#DCE3EC]"
            />

          </div>


          {/* Password */}

          <div>

            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#0F172B] mb-2"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 border border-[#0F172B] rounded-lg outline-none focus:border-[#0F172B] focus:ring-2 focus:ring-[#DCE3EC]"
            />

          </div>


          {/* ==================================================
              ACCOUNT TYPE
          ================================================== */}

          <div>

            <label className="block text-sm font-medium text-[#0F172B] mb-2">
              Account Type
            </label>

            <div className="grid grid-cols-2 gap-2">

              {/* USER */}

              <button
                type="button"
                onClick={() => setRole("user")}
                className={`py-3 px-2 rounded-lg border-2 text-sm font-semibold transition ${
                  role === "user"
                    ? "bg-[#0F172B] text-white border-[#0F172B]"
                    : "bg-white text-[#0F172B] border-gray-300 hover:border-[#0F172B]"
                }`}
              >
                👤 User
              </button>


              {/* CAR OWNER */}

              <button
                type="button"
                onClick={() => setRole("car_owner")}
                className={`py-3 px-2 rounded-lg border-2 text-sm font-semibold transition ${
                  role === "car_owner"
                    ? "bg-[#0F172B] text-white border-[#0F172B]"
                    : "bg-white text-[#0F172B] border-gray-300 hover:border-[#0F172B]"
                }`}
              >
                🚗 Car Owner
              </button>


              {/* ADMIN */}

              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`py-3 px-2 rounded-lg border-2 text-sm font-semibold transition ${
                  role === "admin"
                    ? "bg-[#0F172B] text-white border-[#0F172B]"
                    : "bg-white text-[#0F172B] border-gray-300 hover:border-[#0F172B]"
                }`}
              >
                🛡️ Admin
              </button>


              {/* SUPER ADMIN */}

              <button
                type="button"
                onClick={() => setRole("super_admin")}
                className={`py-3 px-2 rounded-lg border-2 text-sm font-semibold transition ${
                  role === "super_admin"
                    ? "bg-[#0F172B] text-white border-[#0F172B]"
                    : "bg-white text-[#0F172B] border-gray-300 hover:border-[#0F172B]"
                }`}
              >
                👑 Super Admin
              </button>

            </div>

          </div>


          {/* ==================================================
              SIGN IN BUTTON
          ================================================== */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0F172B] text-white py-3 rounded-lg font-semibold hover:bg-[#18233D] transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>


        {/* ==================================================
            REGISTER
        ================================================== */}

        <p className="text-center text-sm text-[#5273A3] mt-6">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="text-[#0F172B] font-semibold hover:underline"
          >
            Create an account
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;