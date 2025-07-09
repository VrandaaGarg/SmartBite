import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaArrowRight,
  FaLinkedin,
  FaGithub,
  FaMailchimp,
} from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import { useEffect } from "react";

function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (email) {
      setSubscribed(true);
      setEmail("");

      // In a real application, you'd send the email to your backend here

      // Auto-hide the popup after 5.5 seconds
      setTimeout(() => {
        setSubscribed(false);
      }, 2000);
    }
  };

  return (
    <footer className="bg-gradient-to-r from-red-800 to-red-700 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="max-w-4xl mx-auto mb-12 px-4 py-8 bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl relative ">
          <div className="text-center mb-6">
            <h3 className="text-3xl font-bold text-white">
              Join Our Foodie Community
            </h3>
            <p className="text-red-100 mt-2 text-lg">
              Get exclusive offers, discounts, and new dish updates straight to
              your inbox!
            </p>
          </div>

          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          >
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-3 rounded-full bg-white/20 placeholder-red-100 text-white focus:outline-none focus:ring-2 focus:ring-yellow-300 border border-white/30"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-3 rounded-full font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all hover:shadow-lg"
            >
              Subscribe <FaArrowRight className="inline ml-1" />
            </button>
          </form>

          {/* Happening Popup */}
          {subscribed && (
            <div className="absolute top-4 right-4 bg-white/90 text-black p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce z-20">
              <FaCheckCircle className="text-green-500 text-2xl" />
              <div>
                <p className="font-bold text-lg">Subscribed!</p>
                <p className="text-sm">You'll hear from us soon 🍔🍕🍟</p>
              </div>
            </div>
          )}
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/" className="flex items-center">
              <h3 className="font-bold text-2xl">SmartBite</h3>
              <span className="ml-2 text-2xl">🍔</span>
            </Link>
            <p className="mt-3 text-red-100">
              Your favorite meals, delivered hot and fresh, right to your
              doorstep.
            </p>
            {/* Social Icons */}
            <div className="flex mt-6 space-x-4 text-xl">
              <a
                href="https://www.instagram.com/vranda_garg"
                className="bg-white/10 p-2.5 rounded-full hover:bg-white hover:text-red-600 transition-colors"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.linkedin.com/in/vrandagarg"
                className="bg-white/10 p-2.5 rounded-full hover:bg-white hover:text-red-600 transition-colors"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://github.com/VrandaaGarg"
                className="bg-white/10 p-2.5 rounded-full hover:bg-white hover:text-red-600 transition-colors"
              >
                <FaGithub />
              </a>
              <a
                href="mailto:smartbite@vrandagarg.in"
                className="bg-white/10 p-2.5 rounded-full hover:bg-white hover:text-red-600 transition-colors"
              >
                <CiMail />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 pb-2 border-b border-red-500/30">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-red-100 hover:text-yellow-300 transition-colors flex items-center"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/menu"
                  className="text-red-100 hover:text-yellow-300 transition-colors"
                >
                  Menu
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="text-red-100 hover:text-yellow-300 transition-colors"
                >
                  Cart
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-red-100 hover:text-yellow-300 transition-colors"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-red-100 hover:text-yellow-300 transition-colors"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 pb-2 border-b border-red-500/30">
              Help & Support
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/support"
                  className="text-red-100 hover:text-yellow-300 transition-colors"
                >
                  Customer Service
                </Link>
              </li>
              <li>
                <Link
                  to="/support"
                  className="text-red-100 hover:text-yellow-300 transition-colors"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-red-100 hover:text-yellow-300 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-red-100 hover:text-yellow-300 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 pb-2 border-b border-red-500/30">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <FaGithub className="text-xl text-white" />
                <a
                  href="https://github.com/VrandaaGarg/SmartBite"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-100 hover:text-yellow-300 transition-colors"
                >
                  SmartBite
                </a>
              </li>

              <li className="flex items-start">
                <span className="mr-3">📧</span>
                <a
                  href="mailto:smartbite@vrandagarg.in"
                  className="text-red-100 hover:text-yellow-300 transition-colors"
                >
                  smartbite@vrandagarg.in
                </a>
              </li>
              <li className="flex items-start">
                <span className="mr-3">🏠</span>
                <span className="text-red-100">
                  52, Food Street, Flavor Avenue
                  <br />
                  Delicious City, FC 10001
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 mt-8 border-t border-red-600 grid sm:grid-cols-2 gap-4 items-center">
          <div className="text-sm text-red-200">
            &copy; {new Date().getFullYear()} SmartBite. All rights reserved.
          </div>
          <div className="flex flex-wrap gap-4 justify-center sm:justify-end text-sm text-red-200">
            <Link to="/support" className="hover:text-yellow-300">
              Terms of Service
            </Link>
            <span>•</span>
            <Link to="/support" className="hover:text-yellow-300">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/support" className="hover:text-yellow-300">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
