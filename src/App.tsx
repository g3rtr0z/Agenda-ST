import { ContactProvider } from './context/ContactContext';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import BookLoader from './components/BookLoader';

import Directory from './pages/Directory';
import ReceptionistDirectory from './pages/ReceptionistDirectory';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function AppContent() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ReceptionistDirectory />} />
        <Route path="/galeria" element={<Directory />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <BookLoader onFinished={() => setLoading(false)} />;
  }

  return (
    <AuthProvider>
      <ContactProvider>
        <AppContent />
      </ContactProvider>
    </AuthProvider>
  );
}
