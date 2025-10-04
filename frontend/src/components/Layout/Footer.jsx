import React from "react";
import {
  Mail,
  Phone,
  Globe,
  Home,
  BarChart3,
  Users,
  Briefcase,
} from "lucide-react";

function Footer() {
  return (
    <footer className="relative mt-16 mx-4 md:mx-10">
      {/* Main Footer Card */}
      <div className="backdrop-blur-md bg-white/70 shadow-lg border border-white/40 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Left Section — Logo + Brand */}
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight font-[Poppins]">
              LeadSync CRM
            </h2>
            <p className="text-sm text-gray-500 font-[Inter]">
              Smart Lead Management System
            </p>
          </div>
        </div>

        {/* Middle — Quick Links */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 font-medium font-[Inter]">
          <a
            href="/"
            className="flex items-center gap-1 hover:text-blue-600 transition"
          >
            <Home size={16} /> Home
          </a>
          <a
            href="/dashboard"
            className="flex items-center gap-1 hover:text-blue-600 transition"
          >
            <BarChart3 size={16} /> Dashboard
          </a>
          <a
            href="/leads"
            className="flex items-center gap-1 hover:text-blue-600 transition"
          >
            <Briefcase size={16} /> Leads
          </a>
          <a
            href="/users"
            className="flex items-center gap-1 hover:text-blue-600 transition"
          >
            <Users size={16} /> Users
          </a>
        </div>

        {/* Right Section — Contact */}
        <div className="text-sm text-gray-700 text-center md:text-right leading-relaxed font-[Inter]">
          <a
            className="flex items-center justify-center md:justify-end gap-2 hover:text-blue-600 transition"
            href="mailto:priyanshus20k4@gmail.com"
          >
            <Mail size={18} className="text-blue-500" />{" "}
            priyanshus20k4@gmail.com
          </a>
          <a
            className="flex items-center justify-center md:justify-end gap-2 hover:text-blue-600 transition mt-1"
            href="tel:+918000643228"
          >
            <Phone size={18} className="text-green-500" /> +91 8000643228
          </a>
          <a
            className="flex items-center justify-center md:justify-end gap-2 hover:text-blue-600 transition mt-1"
            href="https://priyanshu-soni.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Globe size={18} className="text-purple-500" />{" "}
            priyanshu-soni.vercel.app
          </a>
        </div>
      </div>

      {/* Bottom Gradient Bar */}
      <div className="mt-8 text-center text-xs text-gray-500 relative font-[Inter]">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/60 to-transparent"></div>
        <p className="mt-4 tracking-wide">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-blue-600">LeadSync CRM</span>. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
