'use client';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';

import { useEffect, useState } from 'react';
import {
  MedianetProvider,
  useMedianet,
} from './context/MedianetContext';

import RegistrationCategory from './components/RegistrationCategory';
import RegistrationMedianet from './components/RegistrationMedianet';
import RegistrationOtp from './components/RegistrationOtp';
import RegistrationTvOtp from './components/RegistrationKycOtp';
import RegistrationPlan from './components/RegistrationPlan';
import RegistrationTvPlan from './components/RegistrationKycPlan';
import RegistrationSuccess from './components/RegistrationSucess';
import RegistrationExisting from './components/RegistrationExisting';
import RegistrationKycScreen from './components/RegistrationKycScreen';
import './App.css';

function NavigationController() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isMedianetCompleted } = useMedianet();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const protectedRoutes = [
      '/registration-existing',
      '/registration-otp',
      '/registration-tv-otp',
      '/registration-plan',
      '/registration-tv-plan',
      '/registration-success',
    ];

    if (isNavigating || location.pathname === '/registration-category') return;

    if (protectedRoutes.includes(location.pathname) && !isMedianetCompleted) {
      setIsNavigating(true);
      navigate('/registration-category', { replace: true });
      setTimeout(() => setIsNavigating(false), 1000);
      return;
    }

    const noBackRoutes = ['/registration-category'];
    const redirectOnBackRoutes = [
      '/registration-otp',
      '/registration-tv-otp',
      '/registration-existing',
      '/registration-plan',
      '/registration-tv-plan',
      '/registration-success',
    ];

    const handlePopState = (event) => {
      if (isNavigating) return;
      event.preventDefault();

      if (redirectOnBackRoutes.includes(location.pathname)) {
        setIsNavigating(true);
        navigate('/registration-category', { replace: true });
        setTimeout(() => setIsNavigating(false), 1000);
      } else if (noBackRoutes.includes(location.pathname)) {
        window.history.pushState({ page: location.pathname }, null, location.pathname);
      }
    };

    window.history.pushState({ page: location.pathname }, null, location.pathname);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location.pathname, isMedianetCompleted, navigate, isNavigating]);

  return null;
}

function AppRoutes() {
  return (
    <>
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
    </>
  );
}

export default function App() {
  return (
    <MedianetProvider>
      <Router>
        <AppRoutes />
      </Router>
    </MedianetProvider>
  );
}
