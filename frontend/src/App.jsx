import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Receipts from './pages/Receipts';
import Deliveries from './pages/Deliveries';
import Transfers from './pages/Transfers';
import StockLedger from './pages/StockLedger';
import OAuthRedirect from './pages/OAuthRedirect';
import './index.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (!localStorage.getItem('token')) return <Navigate to="/login" />;
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        <Route path="/oauth2-redirect" element={<OAuthRedirect setUser={setUser} />} />
        
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard user={user} setUser={setUser} /></ProtectedRoute>} />
        <Route path="/dashboard/products" element={<ProtectedRoute><Products user={user} setUser={setUser} /></ProtectedRoute>} />
        <Route path="/dashboard/receipts" element={<ProtectedRoute><Receipts user={user} setUser={setUser} /></ProtectedRoute>} />
        <Route path="/dashboard/deliveries" element={<ProtectedRoute><Deliveries user={user} setUser={setUser} /></ProtectedRoute>} />
        <Route path="/dashboard/transfers" element={<ProtectedRoute><Transfers user={user} setUser={setUser} /></ProtectedRoute>} />
        <Route path="/dashboard/ledger" element={<ProtectedRoute><StockLedger user={user} setUser={setUser} /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
