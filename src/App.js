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
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 p-4">
        <style>
          {`
            @keyframes load-bar {
              0% { transform: translateX(-100%); }
              50% { transform: translateX(0); }
              100% { transform: translateX(100%); }
            }
          `}
        </style>
        <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm font-medium animate-pulse">Loading app...</p>
        <div className="w-48 sm:w-64 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative">
          <div 
            className="absolute top-0 left-0 h-full w-full rounded-full" 
            style={{ 
              backgroundColor: 'var(--theme-primary, #f77c18)',
              animation: 'load-bar 1.5s infinite ease-in-out'
            }}
          ></div>
        </div>
      </div>
    );
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
