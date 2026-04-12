import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from './context/ConfigContext';
import { LoadingPage } from './components/LoadingPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Lazy loaded components
const LandingPage = lazy(() => import('./pages/LandingPage').then(module => ({ default: module.LandingPage })));
const ThankYouPage = lazy(() => import('./pages/ThankYouPage').then(module => ({ default: module.ThankYouPage })));
const AdminAuthGuard = lazy(() => import('./components/admin/AdminAuthGuard').then(module => ({ default: module.AdminAuthGuard })));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout').then(module => ({ default: module.AdminLayout })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const AdminSubmissions = lazy(() => import('./pages/admin/AdminSubmissions').then(module => ({ default: module.AdminSubmissions })));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings').then(module => ({ default: module.AdminSettings })));

function App() {
  return (
    <ConfigProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingPage />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
            <Route path="/admin" element={<AdminAuthGuard />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="submissions" element={<AdminSubmissions />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
