import React from "react";
import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white">JobPortal</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering job seekers and employers with seamless connections, smart filters, and fast recruitment.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">For Job Seekers</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/jobs" className="hover:text-white transition">Browse Jobs</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition">Candidate Dashboard</Link></li>
              <li><Link to="/my-applications" className="hover:text-white transition">Application Tracker</Link></li>
              <li><Link to="/profile" className="hover:text-white transition">Resume Builder</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">For Employers</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/recruiter/post-job" className="hover:text-white transition">Post a Job</Link></li>
              <li><Link to="/recruiter" className="hover:text-white transition">Employer Console</Link></li>
              <li><Link to="/recruiter/company" className="hover:text-white transition">Company Profile</Link></li>
              <li><Link to="/register" className="hover:text-white transition">Recruiter Sign Up</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="http://localhost:8080/swagger-ui.html" target="_blank" rel="noreferrer" className="hover:text-white transition">REST API Docs</a></li>
              <li><span className="text-slate-500">PostgreSQL / MySQL Storage</span></li>
              <li><span className="text-slate-500">JWT Authentication</span></li>
              <li><span className="text-slate-500">Spring Boot 3 + React 19</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Job Portal Application. All rights reserved. Built with React.js & Java Spring Boot.
        </div>
      </div>
    </footer>
  );
}
