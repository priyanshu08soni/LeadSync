import React from "react";
import img from "../assets/hero.png";
import { ArrowRight, BarChart3, Zap, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="relative min-h-screen pb-20">
      {/* Hero Section */}
      <section
        className="relative text-center text-white overflow-hidden flex flex-col items-center justify-center min-h-[90vh]"
      >
        <div
          className="absolute inset-0 z-0 opacity-20 bg-slate-950"
          style={{
            backgroundImage: `url(${img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-slate-950 z-0"></div>

        <div className="relative z-10 px-6 max-w-5xl animate-in fade-in zoom-in duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-8">
            <Zap size={14} className="animate-pulse" /> LeadSync Enterprise v2.0
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9] uppercase">
            Precision <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400">Pipeline</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl mb-12 text-slate-400 font-bold uppercase tracking-wide leading-relaxed">
            The high-performance dashboard for sales teams <br />
            who demand absolute visibility and speed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              to="/dashboard"
              className="glass-button py-4 px-12 text-sm font-black uppercase tracking-widest flex items-center gap-3 group shadow-[0_0_30px_rgba(37,99,235,0.3)]"
            >
              Command Center
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/leads"
              className="glass-button-secondary py-4 px-12 text-sm font-black uppercase tracking-widest border border-white/5"
            >
              Explore Assets
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid gap-8 -mt-24 relative z-20 md:grid-cols-3 max-w-6xl mx-auto px-6">
        <div className="glass-card rounded-3xl p-8 bg-slate-900/80 hover:bg-slate-800/80 transition-all border border-white/10 shadow-2xl group">
          <div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/10">
            <BarChart3 size={28} />
          </div>
          <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Architecture</h2>
          <h3 className="text-xl font-extrabold text-white mb-3">Intelligent Tracking</h3>
          <p className="text-slate-400 text-sm leading-relaxed font-medium">
            Stay on top of your sales funnel with real-time lead tracking, scorings, and value estimations.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-8 bg-slate-900/80 hover:bg-slate-800/80 transition-all border border-white/10 shadow-2xl group">
          <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/10">
            <Zap size={28} />
          </div>
          <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Performance</h2>
          <h3 className="text-xl font-extrabold text-white mb-3">Ultra-Fast Filters</h3>
          <p className="text-slate-400 text-sm leading-relaxed font-medium">
            Find the right leads instantly with advanced multi-criteria filtering and instant search.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-8 bg-slate-900/80 hover:bg-slate-800/80 transition-all border border-white/10 shadow-2xl group">
          <div className="w-14 h-14 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/10">
            <ShieldCheck size={28} />
          </div>
          <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Security</h2>
          <h3 className="text-xl font-extrabold text-white mb-3">Enterprise Grade</h3>
          <p className="text-slate-400 text-sm leading-relaxed font-medium">
            Your data is protected with military-grade encryption using JWT and secure cookie-based auth.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Home;
