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
          {/* Navbar Wrapper */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Left: Brand */}
              <div className="flex items-center">
                <Link to="/" className="text-2xl font-bold tracking-wide">
                  SmartBite 🍔
                </Link>
              </div>

              {/* Middle: Desktop Navigation */}
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

              {/* Right: Avatar + Hamburger + Sign Up */}
              <div className="flex items-center space-x-3">
                {/* 👤 Mobile Avatar Dropdown */}
                {user && (
                  <Menu as="div" className="relative md:hidden">
                    <MenuButton className="flex items-center justify-center h-9 w-9 bg-yellow-400 text-black font-bold rounded-full">
                      {user.name?.charAt(0).toUpperCase()}
                    </MenuButton>
                    <MenuItems className="absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none text-black z-50">
                      <MenuItem>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm hover:bg-red-100"
                        >
                          Profile
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-sm hover:bg-red-100"
                        >
                          My Orders
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <button
                          onClick={logout}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-red-100"
                        >
                          Logout
                        </button>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                )}

                {/* 📱 Hamburger (Mobile Only) */}
                <div className="md:hidden">
                  <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-red-700 focus:outline-none">
                    <span className="sr-only">Open menu</span>
                    {open ? (
                      <XMarkIcon className="h-6 w-6" />
                    ) : (
                      <Bars3Icon className="h-6 w-6" />
                    )}
                  </DisclosureButton>
                </div>

                {/* 🖥️ Desktop Avatar (Right Aligned) */}
                {user && (
                  <Menu as="div" className="relative hidden md:block">
                    <MenuButton className="flex items-center justify-center h-9 w-9 bg-yellow-400 text-black font-bold rounded-full">
                      {user.name?.charAt(0).toUpperCase()}
                    </MenuButton>
                    <MenuItems className="absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none text-black z-50">
                      <MenuItem>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm hover:bg-red-100"
                        >
                          Profile
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-sm hover:bg-red-100"
                        >
                          My Orders
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <button
                          onClick={logout}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-red-100"
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
                    className="hidden md:inline-block text-white bg-yellow-400 px-4 py-2 rounded-full font-semibold hover:bg-yellow-300 transition"
                  >
                    Sign Up
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* 📱 Mobile Nav Panel */}
          <DisclosurePanel className="md:hidden absolute w-full backdrop-blur-2xl text-center px-4 pt-2 pb-3 space-y-1 bg-red-700 text-white">
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
            {!user && (
              <DisclosureButton
                as={Link}
                to="/signup"
                className="block px-3 py-2 rounded-md text-base font-medium bg-yellow-500 text-black"
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