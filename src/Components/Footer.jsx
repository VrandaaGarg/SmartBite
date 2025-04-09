import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-100 text-center py-4 mt-8 text-sm text-gray-500">
      &copy; {new Date().getFullYear()} SmartBite. All rights reserved.
    </footer>
  );
}

export default Footer;
