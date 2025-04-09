import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { success, message } = login(form.email, form.password);
    if (success) navigate("/");
    else setError(message);
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded shadow animate-fadeIn">
      <h2 className="text-2xl font-bold mb-4 text-red-600">Welcome Back 👋</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        {/* Password Field with Toggle */}
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded pr-10"
          />
          <div
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>

        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-2 rounded w-full hover:bg-red-700 transition"
        >
          Login
        </button>
      </form>

      {/* Sign up link */}
      <div className="mt-6 text-center text-sm text-gray-600">
        Don’t have an account?{" "}
        <Link
          to="/signup"
          className="text-red-600 font-semibold hover:underline transition"
        >
          Sign up here
        </Link>
      </div>
    </div>
  );
};

export default Login;
