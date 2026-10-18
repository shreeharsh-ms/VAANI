import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoute from './ProtectedRoute';
import { ROUTES } from '../constants';

// Pages
import HomePage from '../pages/public/HomePage';
import ServicesPage from '../pages/public/ServicesPage';
import AboutPage from '../pages/public/AboutPage';
import BookingPage from '../pages/public/BookingPage';
import ContactPage from '../pages/public/ContactPage';
import BlogsPage from '../pages/public/BlogsPage';
import ArticleDetailPage from '../pages/public/ArticleDetailPage';
import LoginPage from '../pages/auth/LoginPage';
import AdminHomePage from '../pages/dashboard/AdminHomePage';
import DashboardOverviewPage from '../pages/dashboard/DashboardOverviewPage';
import PatientsPage from '../pages/dashboard/PatientsPage';
import PatientDetailPage from '../pages/dashboard/PatientDetailPage';
import AppointmentsPage from '../pages/dashboard/AppointmentsPage';
import ReportsPage from '../pages/dashboard/ReportsPage';
import ReportCreatePage from '../pages/dashboard/ReportCreatePage';
import ReportViewPage from '../pages/dashboard/ReportViewPage';
import BillingPage from '../pages/dashboard/BillingPage';
import InventoryPage from '../pages/dashboard/InventoryPage';
import RecallsPage from '../pages/dashboard/RecallsPage';
import BlogsManagementPage from '../pages/dashboard/BlogsManagementPage';
import BlogEditorPage from '../pages/dashboard/BlogEditorPage';
import SettingsPage from '../pages/dashboard/SettingsPage';
import NotFoundPage from '../pages/NotFoundPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Facing Routes */}
      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.SERVICES} element={<ServicesPage />} />
        <Route path={ROUTES.ABOUT} element={<AboutPage />} />
        <Route path={ROUTES.BLOGS} element={<BlogsPage />} />
        <Route path="/blogs/:slug" element={<ArticleDetailPage />} />
        <Route path={ROUTES.BOOKING} element={<BookingPage />} />
        <Route path={ROUTES.CONTACT} element={<ContactPage />} />
      </Route>

      {/* Staff Authentication Routes */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      </Route>

      {/* Standalone Full-Tab Clinical Report Preview & Print (Opens in New Tab) */}
      <Route
        path="/dashboard/reports/preview"
        element={
          <ProtectedRoute>
            <ReportViewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/reports/view/:id"
        element={
          <ProtectedRoute>
            <ReportViewPage />
          </ProtectedRoute>
        }
      />

      {/* Authenticated Clinic ERP Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminHomePage />} />
        <Route path="overview" element={<DashboardOverviewPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="patients" element={<PatientsPage />} />
        <Route path="patients/:id" element={<PatientDetailPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="records" element={<ReportsPage />} />
        <Route path="reports/create" element={<ReportCreatePage />} />
        <Route path="reports/edit/:id" element={<ReportCreatePage />} />
        <Route path="records/create" element={<ReportCreatePage />} />
        <Route path="records/edit/:id" element={<ReportCreatePage />} />
        <Route path="billing" element={<BillingPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="recalls" element={<RecallsPage />} />
        <Route path="blogs" element={<BlogsManagementPage />} />
        <Route path="blogs/create" element={<BlogEditorPage />} />
        <Route path="blogs/edit/:id" element={<BlogEditorPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* 404 Route */}
      <Route element={<MainLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
