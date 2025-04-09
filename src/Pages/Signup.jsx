import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    houseNo: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const fullAddress = `${form.houseNo}, ${form.street}, ${form.landmark}, ${form.city}, ${form.state} - ${form.pincode}`;

    const user = {
      name: form.name,
      email: form.email,
      password: form.password,
      phone: form.phone,
      address: fullAddress,
    };

    const { success, message } = signup(user);
    if (success) {
      navigate("/");
    } else {
      setError(message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white rounded shadow animate-fadeIn">
      <h2 className="text-3xl font-bold text-red-600 mb-6">
        Create Your SmartBite Account
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          name="houseNo"
          placeholder="House No."
          value={form.houseNo}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          name="street"
          placeholder="Street"
          value={form.street}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          name="landmark"
          placeholder="Landmark"
          value={form.landmark}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          name="state"
          placeholder="State"
          value={form.state}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          name="pincode"
          placeholder="Pincode"
          value={form.pincode}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border p-2 rounded col-span-full"
          required
        />

        {/* Password with toggle */}
        <div className="relative col-span-full">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border p-2 rounded pr-10"
            required
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
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 col-span-full transition"
        >
          Sign Up
        </button>
      </form>

      {/* Already have an account? */}
      <div className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-red-600 font-semibold hover:underline transition"
        >
          Login here
        </Link>
      </div>
    </div>
  );
};

export default Signup;
