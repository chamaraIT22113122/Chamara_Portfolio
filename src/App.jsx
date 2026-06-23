import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PortfolioPage from './pages/PortfolioPage';
import ErrorBoundary from './components/ErrorBoundary';
import app from './firebase/config';
import { getAuth } from 'firebase/auth';

// Lazy load admin components to significantly reduce public site bundle size
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

// Initialize auth from the default app
const auth = getAuth(app);

const PrivateRoute = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [initialLoading, setInitialLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setInitialLoading(false);
    });
    return unsubscribe;
  }, []);

  if (initialLoading) {
    return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Global fallback for lazy loaded routes
const SuspenseFallback = () => (
  <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <ErrorBoundary>
        <Suspense fallback={<SuspenseFallback />}>
        <Routes>
          <Route path="/" element={<PortfolioPage />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route 
            path="/admin/*" 
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
