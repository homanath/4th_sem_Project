import React from "react";
import PropTypes from "prop-types";
import { Routes, Route, Navigate } from "react-router-dom";
import { userPropType } from "../../utils/propTypes";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Dashboard from "../../pages/Dashboard";
import Lawyers from "../../pages/Lawyers";
import Cases from "../../components/CaseList";
import Analytics from "../../pages/Analytics";
import Settings from "../../pages/Settings";
import Clients from "../../components/CaseList";
import Notifications from "../../components/CaseForm";

function Layout({ user }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar role={user.role} />
      <div className="ml-64">
        <Header user={user} />
        <main className="p-6 mt-16">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            {user.role === "super_admin" && (
              <>
                <Route path="/lawyers" element={<Lawyers />} />
                <Route path="/analytics" element={<Analytics />} />
              </>
            )}
            {user.role === "lawyer" && (
              <>
                <Route path="/clients" element={<Clients />} />
                <Route path="/notifications" element={<Notifications />} />
              </>
            )}
            {user.role === "client" && (
              <>
                <Route path="/notifications" element={<Notifications />} />
              </>
            )}
            <Route path="/cases" element={<Cases userRole={user.role} />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

Layout.propTypes = {
  user: userPropType.isRequired,
};

export default Layout;
