import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { useState, useEffect } from "react";
import {
  FaSignInAlt, FaUserPlus, FaShoppingCart, FaHome,
  FaInfoCircle, FaHeadset, FaUtensils, FaUserCircle,
  FaHistory, FaSignOutAlt, FaListAlt, FaHamburger
} from "react-icons/fa";
import { useCart } from "../Context/CartContext";

const navigation = [
  { name: "Home", href: "/", icon: FaHome },
  { name: "Menu", href: "/menu", icon: FaUtensils },
  { name: "Customer Service", href: "/support", icon: FaHeadset },
  { name: "About Us", href: "/about", icon: FaInfoCircle },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Calculate total cart items
  const { cart } = useCart();
  const cartItemCount = Array.isArray(cart)
    ? cart.reduce((total, item) => total + (item.Quantity || item.quantity || 0), 0)
    : 0;



  // Handle navbar color change on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <Disclosure
      as="nav"
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-gradient-to-r from-red-700 to-red-600 shadow-lg"
        : "bg-gradient-to-r from-red-600 to-red-500"
        }`}
    >
      {({ open, close }) => {
        // Keep local state in sync with headlessui's open state
        if (open !== menuOpen) {
          setMenuOpen(open);
        }

        return (
          <>
            {/* Navbar Wrapper */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                {/* Left: Enhanced Brand Logo */}
                <div className="flex items-center">
                  <Link
                    to="/"
                    className="flex items-center hover:scale-105 transition-transform"
                    aria-label="SmartBite Home"
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-yellow-400 shadow-md">
                        <FaHamburger className="text-red-600 text-xl" />
                      </div>
                      <div className="ml-2">
                        <div className="text-white font-extrabold text-xl tracking-tight">
                          <span className="text-yellow-300">Smart</span>Bite
                        </div>
                        <div className="text-xs text-yellow-200 -mt-1 tracking-widest font-light">
                          DELICIOUS DELIVERED
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Middle: Desktop Navigation */}
                <div className="hidden md:flex space-x-1 lg:space-x-6">
                  {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          isActive
                            ? "text-yellow-300 font-semibold relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-[3px] after:bg-yellow-300 after:rounded-full"
                            : "text-white hover:text-yellow-200",
                          "text-lg transition-all duration-200 px-3 py-1 rounded-md hover:bg-red-700/30 flex items-center gap-2"
                        )}
                      >
                        <item.icon className={`${isActive ? 'text-yellow-300' : 'text-white'} transition-colors`} />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>

                {/* Right: Cart + Avatar + Hamburger + Auth Buttons */}
                <div className="flex items-center space-x-4">
                  {/* Cart Icon (Both Mobile & Desktop) */}
                  <Link
                    to="/cart"
                    className="relative text-white hover:text-yellow-300 transition-colors"
                    aria-label="Shopping Cart"
                  >

                    <FaShoppingCart className="text-xl" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-700 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}

                  </Link>

                  {/* 👤 Mobile Avatar Dropdown */}
                  {user && (
                    <Menu as="div" className="relative md:hidden">
                      <MenuButton className="flex items-center justify-center h-9 w-9 bg-gradient-to-br from-yellow-300 to-yellow-500 text-black font-bold rounded-full shadow-md hover:shadow-lg transition-all">
                        {user.Name?.charAt(0).toUpperCase()}
                      </MenuButton>
                      <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-xl ring-1 ring-black/10 focus:outline-none text-black z-50 py-1">
                        {user?.isAdmin && (
                          <Link
                            as={Link}
                            to="/admin"
                            className="block px-4 py-2 text-sm hover:bg-red-50 transition flex items-center gap-2"

                          >
                            <FaUserCircle className="text-red-600" /> Admin Dashboard
                          </Link>
                        )}
                        <MenuItem>
                          <Link
                            to="/profile"
                            className="block px-4 py-2 text-sm hover:bg-red-50 transition flex items-center gap-2"
                          >
                            <FaUserCircle className="text-red-600" /> My Profile
                          </Link>
                        </MenuItem>
                        <MenuItem>
                          <Link
                            to="/orders"
                            className="block px-4 py-2 text-sm hover:bg-red-50 transition flex items-center gap-2"
                          >
                            <FaHistory className="text-red-600" /> My Orders
                          </Link>
                        </MenuItem>
                        <MenuItem>
                          <button
                            onClick={logout}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                          >
                            <FaSignOutAlt /> Logout
                          </button>
                        </MenuItem>
                      </MenuItems>
                    </Menu>
                  )}

                  {/* 📱 Hamburger (Mobile Only) */}
                  <div className="md:hidden">
                    <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-red-700/50 focus:outline-none transition">
                      <span className="sr-only">Open menu</span>
                      {open ? (
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                      )}
                    </DisclosureButton>
                  </div>

                  {/* 🖥️ Desktop Avatar (Right Aligned) */}
                  {user && (
                    <Menu as="div" className="relative hidden md:block">

                      <MenuButton className="flex items-center justify-center h-10 w-10 bg-gradient-to-br from-yellow-300 to-yellow-500 text-black font-bold rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105">
                        {user.Name?.charAt(0).toUpperCase()}
                      </MenuButton>
                      <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-xl ring-1 ring-black/10 focus:outline-none text-black z-50 py-1">
                        {user?.isAdmin && (
                          <MenuItem>
                            <Link
                              to="/admin"
                              className="block px-4 py-2 text-sm hover:bg-red-50 transition flex items-center gap-2"
                            >
                              <FaUserCircle className="text-red-600" /> Admin Dashboard
                            </Link>
                          </MenuItem>
                        )}
                        <MenuItem>
                          <Link
                            to="/profile"
                            className="block px-4 py-2 text-sm hover:bg-red-50 transition flex items-center gap-2"
                          >
                            <FaUserCircle className="text-red-600" /> My Profile
                          </Link>
                        </MenuItem>
                        <MenuItem>
                          <Link
                            to="/orders"
                            className="block px-4 py-2 text-sm hover:bg-red-50 transition flex items-center gap-2"
                          >
                            <FaHistory className="text-red-600" /> My Orders
                          </Link>
                        </MenuItem>
                        <MenuItem>
                          <button
                            onClick={logout}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                          >
                            <FaSignOutAlt /> Logout
                          </button>
                        </MenuItem>
                      </MenuItems>
                    </Menu>
                  )}

                  {/* ✨ Auth Buttons (Visible only if not logged in) */}
                  {!user && (
                    <div className="hidden md:flex items-center space-x-3">
                      <Link
                        to="/login"
                        className="inline-flex items-center text-white border border-white/30 hover:bg-white/10 px-4 py-2 rounded-full font-medium transition-all hover:-translate-y-0.5"
                      >
                        <FaSignInAlt className="mr-2" /> Login
                      </Link>
                      <Link
                        to="/signup"
                        className="inline-flex items-center text-black bg-gradient-to-r from-yellow-300 to-yellow-400 px-5 py-2 rounded-full font-semibold hover:from-yellow-400 hover:to-yellow-300 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                      >
                        <FaUserPlus className="mr-2" /> Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 📱 Mobile Nav Panel */}
            <DisclosurePanel className="md:hidden absolute w-full backdrop-blur-xl text-center px-4 pt-2 pb-3 space-y-1 bg-red-700/95 text-white shadow-xl">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-md text-base font-medium transition-all ${location.pathname === item.href
                    ? "bg-yellow-400 text-black shadow-md"
                    : "hover:bg-red-600 hover:text-white"
                    }`}
                >
                  <item.icon /> {item.name}
                </DisclosureButton>
              ))}

              {/* Orders button for mobile */}
              {user && (
                <DisclosureButton
                  as={Link}
                  to="/orders"
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-md text-base font-medium transition-all ${location.pathname === "/orders"
                    ? "bg-yellow-400 text-black shadow-md"
                    : "hover:bg-red-600 hover:text-white"
                    }`}
                >
                  <FaListAlt /> My Orders
                </DisclosureButton>
              )}

              {/* Mobile auth buttons */}
              {!user && (
                <div className="flex flex-col space-y-2 pt-2">
                  <DisclosureButton
                    as={Link}
                    to="/login"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-md text-base font-medium border border-white/30 hover:bg-red-600 text-white"
                  >
                    <FaSignInAlt /> Login
                  </DisclosureButton>
                  <DisclosureButton
                    as={Link}
                    to="/signup"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-md text-base font-medium bg-gradient-to-r from-yellow-400 to-yellow-300 text-black shadow-md"
                  >
                    <FaUserPlus /> Sign Up
                  </DisclosureButton>
                </div>
              )}

              {/* Logout button for mobile */}
              {/* {user && (
                <DisclosureButton
                  onClick={logout}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-md text-base font-medium text-white hover:bg-red-900/50 w-full mt-2"
                >
                  <FaSignOutAlt /> Logout
                </DisclosureButton>
              )} */}



            </DisclosurePanel>
          </>
        );
      }}
    </Disclosure>
  );
}