import React from "react";
import { FaInstagram, FaFacebookF, FaTwitter, FaYoutube } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-red-700 text-white pt-8 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          <div>
            <h3 className="font-semibold text-lg mb-2">SmartBite</h3>
            <p>Your favorite meals, delivered hot and fresh!</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-1">
              <li><a href="/" className="hover:text-yellow-300">Home</a></li>
              <li><a href="/menu" className="hover:text-yellow-300">Menu</a></li>
              <li><a href="/cart" className="hover:text-yellow-300">Cart</a></li>
              <li><a href="/login" className="hover:text-yellow-300">Login</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Contact</h4>
            <p>📞 123-456-7890</p>
            <p>📧 support@smartbite.com</p>
            <p>🏠 Smart Street, Food City</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Follow Us</h4>
            <div className="flex space-x-4 text-xl">
              <FaInstagram className="hover:text-yellow-300 cursor-pointer" />
              <FaFacebookF className="hover:text-yellow-300 cursor-pointer" />
              <FaTwitter className="hover:text-yellow-300 cursor-pointer" />
              <FaYoutube className="hover:text-yellow-300 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-red-500 mt-6 pt-4 text-center text-xs">
          &copy; {new Date().getFullYear()} SmartBite. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;