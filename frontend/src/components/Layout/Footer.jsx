import React from "react";
import logo from "../../assets/logo.png"; // adjust path if needed

function Footer() {
  return (
    <footer className="bg-blue-600/20 text-gray-800 py-6 px-6 mt-12 w-100">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left side: logo + brand */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-10" />
        </div>

        {/* Right side: contact info */}
        <div className="text-sm text-center flex flex-col md:text-right ">
          <a className="hover:text-blue-500" href="mailto:priyanshus20k4@gmail.com">📧 Email: priyanshus204@gmail.com</a>
          <a className="hover:text-blue-500" href="tel:+918000643228">📞 Phone: +91 8000643228</a>
          <a className="hover:text-blue-500" href="https://priyanshu-soni.vercel.app/">🌐 Website: https://priyanshu-soni.vercel.app</a>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center text-xs text-gray-500 mt-4">
        © {new Date().getFullYear()} Lead Management System. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;
