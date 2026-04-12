import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from './context/ConfigContext';
import { LandingPage } from './pages/LandingPage';
import { ThankYouPage } from './pages/ThankYouPage';
import { AdminAuthGuard } from './components/admin/AdminAuthGuard';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminSubmissions } from './pages/admin/AdminSubmissions';
import { AdminSettings } from './pages/admin/AdminSettings';
import { LoadingPage } from './components/LoadingPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    let timeoutId;
    document.fonts.ready.then(() => {
      clearTimeout(timeoutId);
      setFontsLoaded(true);
    });
    // Fallback: If fonts take longer than 2.5s, fail silently and show app anyway
    timeoutId = setTimeout(() => {
      setFontsLoaded(true);
    }, 2500);

    return () => clearTimeout(timeoutId);
  }, []);

  if (!fontsLoaded) {
    return <LoadingPage />;
  }

  return (
    <ConfigProvider>
      <BrowserRouter>
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
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
