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

  return (
    <Disclosure as="nav" className="bg-red-600 text-white shadow-md">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between items-center">
              {/* Brand */}
              <div className="flex items-center">
                <Link to="/" className="text-2xl font-bold tracking-wide">
                  SmartBite 🍔
                </Link>
              </div>

              {/* Middle Navigation */}
              <div className="hidden md:flex space-x-6">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={classNames(
                        isActive
                          ? "underline underline-offset-4 font-semibold text-yellow-300"
                          : "hover:text-yellow-300",
                        "text-lg transition"
                      )}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>

              {/* Right Side: Auth Area */}
              <div className="flex items-center space-x-4">
                {!user ? (
                  <Link
                    to="/signup"
                    className="hidden md:inline-block text-white bg-yellow-400 px-4 py-2 rounded-full font-semibold hover:bg-yellow-300 transition"
                  >
                    Sign Up
                  </Link>
                ) : (
                  <Menu as="div" className="relative hidden md:block">
                    <MenuButton className="flex items-center justify-center h-9 w-9 bg-yellow-400 text-black font-bold rounded-full">
                      {user.name?.charAt(0).toUpperCase()}
                    </MenuButton>
                    <MenuItems className="absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none text-gray-800">
                      <MenuItem>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 hover:bg-red-100"
                        >
                          Profile
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <button
                          onClick={logout}
                          className="w-full text-left px-4 py-2 hover:bg-red-100"
                        >
                          Logout
                        </button>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                )}

                {/* Mobile Menu Icon */}
                <div className="md:hidden">
                  <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-red-700 focus:outline-none">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    )}
                  </DisclosureButton>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <DisclosurePanel className="md:hidden px-4 pt-2 pb-3 space-y-1 bg-red-700 text-white">
            {navigation.map((item) => (
              <DisclosureButton
                key={item.name}
                as={Link}
                to={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.href
                    ? "bg-yellow-500 text-black"
                    : "hover:bg-yellow-500 hover:text-black"
                }`}
              >
                {item.name}
              </DisclosureButton>
            ))}
            {!user ? (
              <DisclosureButton
                as={Link}
                to="/signup"
                className="block px-3 py-2 rounded-md text-base font-medium bg-yellow-500 text-black"
              >
                Sign Up
              </DisclosureButton>
            ) : (
              <>
                <DisclosureButton
                  as={Link}
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-yellow-500 hover:text-black"
                >
                  Profile
                </DisclosureButton>
                <DisclosureButton
                  as="button"
                  onClick={logout}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-yellow-500 hover:text-black"
                >
                  Logout
                </DisclosureButton>
              </>
            )}
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}