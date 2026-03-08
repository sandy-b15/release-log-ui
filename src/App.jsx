
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Integration from './pages/Integration';
import Dashboard from './pages/Dashboard';
import GenerateEdit from './pages/GenerateEdit';
import Settings from './pages/Settings';
import LandingPage from './pages/LandingPage';
import './App.css';

function App() {
  const location = useLocation();
  const hideHeaderRoutes = ['/login', '/signup'];
  const showHeader = !hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/integration" element={<ProtectedRoute><Integration /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/generate" element={<ProtectedRoute><GenerateEdit /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
