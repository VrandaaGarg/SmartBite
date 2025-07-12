import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaCity,
  FaMapPin,
  FaEnvelope,
  FaLock,
  FaHome,
  FaSignInAlt,
} from "react-icons/fa";

//url for fetching block,State,Pincode
//https://api.postalpincode.in/pincode/${pincode}

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    houseNo: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: "",
    color: "bg-gray-200",
  });
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState("");

  // Animation on component mount
  useEffect(() => {
    setAnimate(true);
  }, []);

  // Password strength checker
  useEffect(() => {
    if (!form.password) {
      setPasswordStrength({ score: 0, message: "", color: "bg-gray-200" });
      return;
    }

    // Simple password strength check (in a real app, use a better algorithm)
    let score = 0;
    if (form.password.length >= 8) score += 1;
    if (/[A-Z]/.test(form.password)) score += 1;
    if (/[0-9]/.test(form.password)) score += 1;
    if (/[^A-Za-z0-9]/.test(form.password)) score += 1;

    const messages = ["Weak", "Fair", "Good", "Strong"];
    const colors = [
      "bg-red-500",
      "bg-yellow-500",
      "bg-blue-500",
      "bg-green-500",
    ];

    setPasswordStrength({
      score,
      message: messages[score - 1] || "",
      color: colors[score - 1] || "bg-gray-200",
    });
  }, [form.password]);

  // Function to fetch pincode data
  const fetchPincodeData = async (pincode) => {
    if (pincode.length !== 6) return;

    setPincodeLoading(true);
    setPincodeError("");

    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await response.json();

      if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
        const postOffice = data[0].PostOffice[0];
        setForm((prev) => ({
          ...prev,
          city: postOffice.Block || postOffice.District || "",
          state: postOffice.State || "",
          pincode: postOffice.Pincode || pincode,
        }));
        setPincodeError("");
      } else {
        setPincodeError("Invalid pincode or no data found");
      }
    } catch (error) {
      setPincodeError("Failed to fetch pincode data");
      console.error("Pincode API error:", error);
    } finally {
      setPincodeLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Auto-fill city and state when pincode is entered
    if (name === "pincode" && value.length === 6 && /^\d{6}$/.test(value)) {
      fetchPincodeData(value);
    }

    // Clear pincode error when user starts typing again
    if (name === "pincode" && pincodeError) {
      setPincodeError("");
    }
  };

  const validateStep1 = () => {
    if (!form.name || !form.phone || !form.email) {
      setError("Please fill in all required fields");
      return false;
    }

    if (!form.email.includes("@")) {
      setError("Please enter a valid email address");
      return false;
    }

    if (form.phone.length < 10) {
      setError("Please enter a valid phone number");
      return false;
    }

    setError("");
    return true;
  };

  const validateStep2 = () => {
    if (!form.password) {
      setError("Please choose a password");
      return false;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    if (passwordStrength.score < 2) {
      setError("Please choose a stronger password");
      return false;
    }

    setError("");
    return true;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsLoading(true);
    try {
      const {
        name,
        email,
        password,
        phone,
        houseNo,
        street,
        landmark,
        city,
        state,
        pincode,
      } = form;

      const { success, message } = await signup({
        name,
        email,
        password,
        phone: parseInt(phone),
        houseNo,
        street,
        landmark,
        city,
        state,
        pincode: parseInt(pincode),
      });

      if (success) {
        navigate("/");
      } else {
        setError(message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-5 md:py-10 px-4 sm:px-6">
      <div
        className={`bg-white rounded-2xl shadow-lg p-8 transition-all duration-700 transform ${
          animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <div className="text-center mb-8">
          <h1 className="text-xl md:text-3xl font-bold text-red-600 mb-2">
            Create Your Account
          </h1>
          <p className="text-gray-600 text-sm md:text-lg">
            Join the SmartBite family and enjoy delicious food
          </p>

          {/* Steps Indicator */}
          <div className="mt-8 flex justify-center">
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step >= 1
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                1
              </div>
              <div
                className={`w-12 h-1 ${
                  step >= 2 ? "bg-red-600" : "bg-gray-200"
                }`}
              ></div>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step >= 2
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                2
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-12 text-xs text-gray-500 mt-1">
            <span>Personal Info</span>
            <span>Security</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 animate-shake">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="text-gray-400" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      placeholder="9876543210"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* House No & Street */}
                <div>
                  <label
                    htmlFor="houseNo"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    House/Flat No.*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaHome className="text-gray-400" />
                    </div>
                    <input
                      id="houseNo"
                      name="houseNo"
                      placeholder="C-42"
                      value={form.houseNo}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="street"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Street/Area*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="text-gray-400" />
                    </div>
                    <input
                      id="street"
                      name="street"
                      placeholder="Main Street"
                      value={form.street}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Landmark */}
                <div>
                  <label
                    htmlFor="landmark"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Landmark (Optional)
                  </label>
                  <input
                    id="landmark"
                    name="landmark"
                    placeholder="Near Shopping Mall"
                    value={form.landmark}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                {/* Pincode */}
                <div>
                  <label
                    htmlFor="pincode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Pincode*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapPin className="text-gray-400" />
                    </div>
                    <input
                      id="pincode"
                      name="pincode"
                      placeholder="400001"
                      value={form.pincode}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                      maxLength="6"
                    />
                    {pincodeLoading && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <svg
                          className="animate-spin h-4 w-4 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </div>
                    )}
                  </div>
                  {pincodeError && (
                    <p className="text-xs text-red-500 mt-1">{pincodeError}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Enter 6-digit pincode to auto-fill city and state
                  </p>
                </div>

                {/* City */}
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    City*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCity className="text-gray-400" />
                    </div>
                    <input
                      id="city"
                      name="city"
                      placeholder="Mumbai"
                      value={form.city}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* State */}
                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    State*
                  </label>
                  <input
                    id="state"
                    name="state"
                    placeholder="Maharashtra"
                    value={form.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg font-medium transition flex items-center gap-2"
                >
                  Continue <span>→</span>
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              {/* Password with strength meter */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Create Password*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Choose a strong password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                {/* Password strength meter */}
                {form.password && (
                  <div className="mt-2">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${passwordStrength.color} transition-all duration-300`}
                        style={{ width: `${passwordStrength.score * 25}%` }}
                      ></div>
                    </div>
                    <p className="text-xs mt-1 text-gray-600">
                      {passwordStrength.message &&
                        `Password strength: ${passwordStrength.message}`}
                    </p>
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-2">
                  Use at least 8 characters with uppercase letters, numbers, and
                  symbols for a strong password.
                </p>
              </div>

              <div className="pt-4">
                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="terms"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    I agree to the{" "}
                    <a href="#" className="text-red-600 hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-red-600 hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="border border-gray-300 text-gray-700 px-3 md:px-6 py-3 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
                >
                  <span>←</span> Back
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 md:px-6 py-3 rounded-lg transition flex items-center gap-2 ${
                    isLoading ? "opacity-80 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    <>Sign Up</>
                  )}
                </button>
              </div>
            </>
          )}
        </form>

        {/* Already have an account */}
        <div className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-red-600 hover:text-red-700 hover:underline transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
