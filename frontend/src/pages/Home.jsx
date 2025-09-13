import React from "react";
import img from "../assets/hero.png";
function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section
        className="absolute top-0 left-0 right-0 text-center text-white shadow-lg flex flex-col items-center justify-center h-[80vh] bg-black/70 bg-blend-overlay"
        style={{
          backgroundImage: `url(${img})`, // put your image inside public/hero-bg.jpg
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="px-6">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
            Welcome to Lead Management System
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl mb-6 drop-shadow-md">
            Manage your leads efficiently with powerful tools for tracking,
            filtering, and analyzing. Boost your sales pipeline 🚀
          </p>
          <button className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-xl shadow-lg hover:bg-gray-100 transition transform hover:scale-105">
            Get Started
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid gap-8 pt-[65vh] md:grid-cols-3 max-w-6xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
          <div className="text-blue-600 text-4xl mb-4">📊</div>
          <h2 className="text-xl font-semibold mb-2">Track Leads</h2>
          <p className="text-gray-600">
            Stay on top of your sales funnel with real-time lead tracking and
            updates.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
          <div className="text-blue-600 text-4xl mb-4">⚡</div>
          <h2 className="text-xl font-semibold mb-2">Quick Filters</h2>
          <p className="text-gray-600">
            Find the right leads instantly with advanced filtering and sorting
            options.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
          <div className="text-blue-600 text-4xl mb-4">🔒</div>
          <h2 className="text-xl font-semibold mb-2">Secure Access</h2>
          <p className="text-gray-600">
            Your data is safe with secure authentication using JWT and cookies.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Home;
