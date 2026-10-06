import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Public Pages
import HomePage from "../pages/public/HomePage";
import JobListPage from "../pages/public/JobListPage";
import JobDetailPage from "../pages/public/JobDetailPage";
import LoginPage from "../pages/public/LoginPage";
import RegisterPage from "../pages/public/RegisterPage";

// Seeker Pages
import SeekerDashboard from "../pages/seeker/SeekerDashboard";
import MyApplications from "../pages/seeker/MyApplications";
import ProfilePage from "../pages/seeker/ProfilePage";

// Recruiter Pages
import RecruiterDashboard from "../pages/recruiter/RecruiterDashboard";
import CompanyProfilePage from "../pages/recruiter/CompanyProfilePage";
import PostJobPage from "../pages/recruiter/PostJobPage";
import ApplicantsPage from "../pages/recruiter/ApplicantsPage";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/jobs" element={<JobListPage />} />
      <Route path="/jobs/:id" element={<JobDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Seeker Routes */}
      <Route element={<ProtectedRoute role="JOB_SEEKER" />}>
        <Route path="/dashboard" element={<SeekerDashboard />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Recruiter Routes */}
      <Route element={<ProtectedRoute role="RECRUITER" />}>
        <Route path="/recruiter" element={<RecruiterDashboard />} />
        <Route path="/recruiter/company" element={<CompanyProfilePage />} />
        <Route path="/recruiter/post-job" element={<PostJobPage />} />
        <Route path="/recruiter/edit-job/:id" element={<PostJobPage />} />
        <Route path="/recruiter/jobs/:id/applicants" element={<ApplicantsPage />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute role="ADMIN" />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
}
