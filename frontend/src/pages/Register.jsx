import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/auth";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await registerUser({
        name,
        email,
        password,
        role,
      });

      console.log("Registration successful:", response);

      setSuccess("Account created successfully! Redirecting to login...");

      // Go to login after successful registration
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.error("Registration error:", error);

      setError(
        error.response?.data?.detail ||
        error.message ||
        "Unable to create account."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white border-2 border-[#0F172B] rounded-2xl shadow-xl p-8">

        {/* Logo */}
        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-[#0F172B]">
            ARGO
          </h1>

          <p className="text-[#5273A3] mt-2">
            Rent-a-Car Management System
          </p>

        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-[#0F172B] mb-6">
          Create Account
        </h2>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-600">
            {success}
          </div>
        )}

        {/* Registration Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Full Name */}
          <div>

            <label
              htmlFor="name"
              className="block text-sm font-medium text-[#0F172B] mb-2"
            >
              Full Name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
              autoComplete="name"
              className="w-full px-4 py-3 border border-[#0F172B] rounded-lg outline-none focus:border-[#0F172B] focus:ring-2 focus:ring-[#DCE3EC]"
            />

          </div>

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
              placeholder="Create a password"
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full px-4 py-3 border border-[#0F172B] rounded-lg outline-none focus:border-[#0F172B] focus:ring-2 focus:ring-[#DCE3EC]"
            />

          </div>

          {/* Account Type */}
          <div>

            <label className="block text-sm font-medium text-[#0F172B] mb-2">
              Account Type
            </label>

            <div className="grid grid-cols-2 gap-3">

              {/* User */}
              <button
                type="button"
                onClick={() => setRole("user")}
                className={`py-3 px-4 rounded-lg border-2 text-sm font-semibold transition ${
                  role === "user"
                    ? "bg-[#0F172B] text-white border-[#0F172B]"
                    : "bg-white text-[#0F172B] border-gray-300 hover:border-[#0F172B]"
                }`}
              >
                👤 User
              </button>

              {/* Car Owner */}
              <button
                type="button"
                onClick={() => setRole("car_owner")}
                className={`py-3 px-4 rounded-lg border-2 text-sm font-semibold transition ${
                  role === "car_owner"
                    ? "bg-[#0F172B] text-white border-[#0F172B]"
                    : "bg-white text-[#0F172B] border-gray-300 hover:border-[#0F172B]"
                }`}
              >
                🚗 Car Owner
              </button>

            </div>

            {/* Selected Account Type */}
            <p className="text-xs text-[#5273A3] mt-2">
              Selected account:{" "}
              <span className="font-semibold text-[#0F172B]">
                {role === "user" ? "User" : "Car Owner"}
              </span>
            </p>

          </div>

          {/* Create Account */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0F172B] text-white py-3 rounded-lg font-semibold hover:bg-[#18233D] transition disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-[#5273A3] mt-6">

          Already have an account?{" "}

          <Link
            to="/login"
            className="text-[#0F172B] font-semibold hover:underline"
          >
            Sign In
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Register;