import React from "react";
import { Link } from "react-router-dom";
import { Search, Briefcase, Building, Users, ShieldCheck, ArrowRight, CheckCircle } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 text-white pt-20 pb-24 rounded-b-[2.5rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            The #1 Platform for Top Tech Talent & Industry Recruiter Connections
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Find Your Dream Career Or Hire <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Top Candidates</span> Fast
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-medium">
            Explore thousands of open positions with verified companies, apply directly with structured resumes, and track application status in real-time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/jobs"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white text-sm shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" /> Explore All Jobs
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 font-bold text-white text-sm transition flex items-center justify-center gap-2"
            >
              Post a Job as Recruiter <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Why Choose JobPortal?</h2>
          <p className="text-sm text-slate-500">Built for simplicity, speed, and security.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Smart Search & Filtering</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Filter by keyword, location, salary range, job type, and experience requirements to pinpoint your ideal role.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Verified Companies</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Recruiter company profiles are verified by administrators to ensure authentic, high-quality career opportunities.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Real-Time Status Tracker</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Track your applications live from <span className="font-semibold text-slate-700">Applied</span> to <span className="font-semibold text-slate-700">Shortlisted</span> and <span className="font-semibold text-slate-700">Offered</span>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
