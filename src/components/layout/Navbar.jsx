import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Briefcase, User, LogOut, PlusCircle, Building, ShieldCheck, Menu, X } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 bg-clip-text text-transparent">
              JobPortal
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/jobs"
              className={`text-sm font-medium transition ${
                isActive("/jobs") ? "text-indigo-600 font-semibold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Explore Jobs
            </Link>

            {user?.role === "JOB_SEEKER" && (
              <>
                <Link
                  to="/dashboard"
                  className={`text-sm font-medium transition ${
                    isActive("/dashboard") ? "text-indigo-600 font-semibold" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/my-applications"
                  className={`text-sm font-medium transition ${
                    isActive("/my-applications")
                      ? "text-indigo-600 font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  My Applications
                </Link>
              </>
            )}

            {user?.role === "RECRUITER" && (
              <>
                <Link
                  to="/recruiter"
                  className={`text-sm font-medium transition ${
                    isActive("/recruiter") ? "text-indigo-600 font-semibold" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Recruiter Console
                </Link>
                <Link
                  to="/recruiter/company"
                  className={`text-sm font-medium transition ${
                    isActive("/recruiter/company") ? "text-indigo-600 font-semibold" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Company Profile
                </Link>
                <Link
                  to="/recruiter/post-job"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 shadow-sm transition"
                >
                  <PlusCircle className="w-4 h-4" /> Post a Job
                </Link>
              </>
            )}

            {user?.role === "ADMIN" && (
              <Link
                to="/admin"
                className={`inline-flex items-center gap-1 text-sm font-semibold transition ${
                  isActive("/admin") ? "text-indigo-600" : "text-amber-600 hover:text-amber-700"
                }`}
              >
                <ShieldCheck className="w-4 h-4" /> Admin Portal
              </Link>
            )}
          </nav>

          {/* Right Action / Profile */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-100 transition text-slate-700"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs">
                    {user.fullName ? user.fullName[0].toUpperCase() : "U"}
                  </div>
                  <span className="text-sm font-medium text-slate-800">{user.fullName}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-700 hover:text-indigo-600 px-3 py-2 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-xl shadow-sm transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 hover:text-indigo-600"
          >
            Explore Jobs
          </Link>
          {user?.role === "JOB_SEEKER" && (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-700 hover:text-indigo-600"
              >
                Dashboard
              </Link>
              <Link
                to="/my-applications"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-700 hover:text-indigo-600"
              >
                My Applications
              </Link>
            </>
          )}
          {user?.role === "RECRUITER" && (
            <>
              <Link
                to="/recruiter"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-700 hover:text-indigo-600"
              >
                Recruiter Console
              </Link>
              <Link
                to="/recruiter/post-job"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-indigo-600 font-semibold"
              >
                + Post a Job
              </Link>
            </>
          )}
          {user?.role === "ADMIN" && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-amber-600"
            >
              Admin Portal
            </Link>
          )}
          {user ? (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">{user.email}</span>
              <button
                onClick={handleLogout}
                className="text-xs font-semibold text-rose-600 hover:underline"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center text-xs font-semibold py-2 border border-slate-200 rounded-lg text-slate-700"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center text-xs font-semibold py-2 bg-slate-900 text-white rounded-lg"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
