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

const navigation = [
  { name: "Home", href: "/" },
  { name: "Menu", href: "/menu" },
  { name: "Cart", href: "/cart" },
  { name: "Customer Service", href: "/support" },
  { name: "About Us", href: "/about" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  // Handle navbar color change on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Disclosure 
      as="nav" 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-gradient-to-r from-red-700 to-red-600 shadow-lg" 
          : "bg-gradient-to-r from-red-600 to-red-500"
      }`}
    >
      {({ open }) => (
        <>
          {/* Navbar Wrapper */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Left: Brand */}
              <div className="flex items-center">
                <Link 
                  to="/" 
                  className="text-2xl font-bold tracking-wide text-white flex items-center hover:scale-105 transition-transform"
                >
                  <span className="mr-2">SmartBite</span>
                  <span className="animate-bounce inline-block">🍔</span>
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
                        "text-lg transition-all duration-200 px-3 py-1 rounded-md hover:bg-red-700/30"
                      )}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>

              {/* Right: Avatar + Hamburger + Sign Up */}
              <div className="flex items-center space-x-3">
                {/* 👤 Mobile Avatar Dropdown */}
                {user && (
                  <Menu as="div" className="relative md:hidden">
                    <MenuButton className="flex items-center justify-center h-9 w-9 bg-gradient-to-br from-yellow-300 to-yellow-500 text-black font-bold rounded-full shadow-md hover:shadow-lg transition-all">
                      {user.name?.charAt(0).toUpperCase()}
                    </MenuButton>
                    <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-xl ring-1 ring-black/10 focus:outline-none text-black z-50 py-1">
                      <MenuItem>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm hover:bg-red-50 transition"
                        >
                          My Profile
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-sm hover:bg-red-50 transition"
                        >
                          My Orders
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <button
                          onClick={logout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                        >
                          Logout
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
                      {user.name?.charAt(0).toUpperCase()}
                    </MenuButton>
                    <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-xl ring-1 ring-black/10 focus:outline-none text-black z-50 py-1">
                      <MenuItem>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm hover:bg-red-50 transition"
                        >
                          My Profile
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-sm hover:bg-red-50 transition"
                        >
                          My Orders
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <button
                          onClick={logout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                        >
                          Logout
                        </button>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                )}

                {/* ✨ Sign Up (Visible only if not logged in) */}
                {!user && (
                  <Link
                    to="/signup"
                    className="hidden md:inline-flex items-center text-black bg-gradient-to-r from-yellow-300 to-yellow-400 px-6 py-2 rounded-full font-semibold hover:from-yellow-400 hover:to-yellow-300 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                  >
                    Sign Up
                  </Link>
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
                className={`block px-4 py-3 rounded-md text-base font-medium transition-all ${
                  location.pathname === item.href
                    ? "bg-yellow-400 text-black shadow-md"
                    : "hover:bg-red-600 hover:text-white"
                }`}
              >
                {item.name}
              </DisclosureButton>
            ))}
            {!user && (
              <DisclosureButton
                as={Link}
                to="/signup"
                className="block w-full mt-2 px-4 py-3 rounded-md text-base font-medium bg-gradient-to-r from-yellow-400 to-yellow-300 text-black shadow-md"
              >
                Sign Up
              </DisclosureButton>
            )}
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}