import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';

import LandingPage   from './pages/LandingPage';
import ApplyPage     from './pages/ApplyPage';
import AdminLogin    from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import CheckStatusPage from './pages/CheckStatusPage';

const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="w-8 h-8 border-4 border-rose border-t-transparent rounded-full animate-spin" />
    </div>
  );
  return admin ? children : <Navigate to="/admin/login" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"            element={<LandingPage />} />
          <Route path="/apply"       element={<ApplyPage />} />
          <Route path="/status"      element={<CheckStatusPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin"       element={
            <ProtectedRoute><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        theme="colored"
        toastStyle={{ fontFamily: 'DM Sans, sans-serif' }}
      />
    </AuthProvider>
  );
}
