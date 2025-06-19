'use client';

import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import RegistrationCategory from './components/RegistrationCategory';
import RegistrationMedianet from './components/RegistrationMedianet';
import RegistrationOtp from './components/RegistrationOtp';
import RegistrationTvOtp from './components/RegistrationKycOtp';
import RegistrationPlan from './components/RegistrationPlan';
import RegistrationTvPlan from './components/RegistrationKycPlan';
import RegistrationSuccess from './components/RegistrationSucess';
import RegistrationExisting from './components/RegistrationExisting';
import RegistrationKycScreen from './components/RegistrationKycScreen';
import { useEffect, useState, useRef, createContext, useContext } from 'react';
import './App.css';

// Create a session context to manage flow state in memory
const SessionContext = createContext({
  medianetCompleted: false,
  setMedianetCompleted: () => {},
  sessionData: {},
  setSessionData: () => {},
});

// Session provider component
function SessionProvider({ children }) {
  const [medianetCompleted, setMedianetCompleted] = useState(false);
  const [sessionData, setSessionData] = useState({});

  // Try to sync with localStorage if available, but don't depend on it
  useEffect(() => {
    try {
      const stored = localStorage.getItem('medianetCompleted');
      if (stored === 'true') {
        setMedianetCompleted(true);
      }
    } catch (e) {
      console.log('localStorage not available, using memory storage');
    }
  }, []);

  const setMedianetCompletedWithStorage = (value) => {
    setMedianetCompleted(value);
    try {
      localStorage.setItem('medianetCompleted', value.toString());
      // Dispatch custom event for other components
      window.dispatchEvent(new CustomEvent('medianetCompletedChange'));
    } catch (e) {
      console.log('localStorage not available, storing in memory only');
    }
  };

  return (
    <SessionContext.Provider value={{
      medianetCompleted,
      setMedianetCompleted: setMedianetCompletedWithStorage,
      sessionData,
      setSessionData,
    }}>
      {children}
    </SessionContext.Provider>
  );
}

// Hook to use session context
export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

// Simplified navigation controller
function NavigationController() {
  const navigate = useNavigate();
  const location = useLocation();
  const { medianetCompleted } = useSession();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // Only protect specific routes that truly need medianet completion
    const protectedRoutes = [
      '/registration-otp',
      '/registration-tv-otp',
      '/registration-plan',
      '/registration-tv-plan',
      '/registration-success',
    ];

    // Skip if currently navigating
    if (isNavigating) return;

    // Only redirect if on a protected route without medianet completion
    if (protectedRoutes.includes(location.pathname) && !medianetCompleted) {
      console.log('Redirecting to category - medianet not completed');
      setIsNavigating(true);
      navigate('/registration-category', { replace: true });
      setTimeout(() => setIsNavigating(false), 100);
    }
  }, [location.pathname, medianetCompleted, navigate, isNavigating]);

  return null;
}

function App() {
  return (
    <SessionProvider>
      <Router>
        <div className="App">
          <NavigationController />
          <Routes>
            <Route path="/" element={<Navigate to="/registration-category" replace />} />
            <Route path="/registration-category" element={<RegistrationCategory />} />
            <Route path="/registration-medianet" element={<RegistrationMedianet />} />
            <Route path="/registration-existing" element={<RegistrationExisting />} />
            <Route path="/registration-otp" element={<RegistrationOtp />} />
            <Route path="/registration-tv-otp" element={<RegistrationTvOtp />} />
            <Route path="/registration-plan" element={<RegistrationPlan />} />
            <Route path="/registration-tv-plan" element={<RegistrationTvPlan />} />
            <Route path="/registration-success" element={<RegistrationSuccess />} />
            <Route path="/registration-device" element={<RegistrationKycScreen />} />
            <Route path="*" element={<Navigate to="/registration-category" replace />} />
          </Routes>
        </div>
      </Router>
    </SessionProvider>
  );
}

export default App;