'use client';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';

import { useEffect, useState, useRef } from 'react';
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
import RegistrationKycExisting from './components/RegistrationKycExisting';
import './App.css';

function NavigationController() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isMedianetCompleted } = useMedianet();
  const [isNavigating, setIsNavigating] = useState(false);
  const navigationTimeoutRef = useRef(null);

  useEffect(() => {
    const protectedRoutes = [
      '/registration-existing',
      '/registration-otp',
      '/registration-tv-otp',
      '/registration-plan',
      '/registration-tv-plan',
      '/registration-success',
    ];

    // Clear any existing timeout
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }

    // Initial protection check
    if (location.pathname === '/registration-category') return;

    if (protectedRoutes.includes(location.pathname) && !isMedianetCompleted) {
      if (!isNavigating) {
        setIsNavigating(true);
        navigate('/registration-category', { replace: true });
        navigationTimeoutRef.current = setTimeout(() => {
          setIsNavigating(false);
        }, 200);
      }
      return;
    }

    const redirectOnBackRoutes = [
      '/registration-otp',
      '/registration-tv-otp',
      '/registration-existing',
      '/registration-plan',
      '/registration-tv-plan',
      '/registration-success',
    ];

    const noBackRoutes = ['/registration-category'];

    const handlePopState = (event) => {
      // Prevent multiple rapid navigations
      if (isNavigating) {
        event.preventDefault();
        window.history.pushState(
          { preventBack: true, timestamp: Date.now() }, 
          null, 
          location.pathname
        );
        return;
      }

      // Handle back button for routes that should redirect to category
      if (redirectOnBackRoutes.includes(location.pathname)) {
        event.preventDefault();
        setIsNavigating(true);
        
        // Immediately push state to prevent further back navigation
        window.history.pushState(
          { preventBack: true, timestamp: Date.now() }, 
          null, 
          location.pathname
        );
        
        navigate('/registration-category', { replace: true });
        
        navigationTimeoutRef.current = setTimeout(() => {
          setIsNavigating(false);
        }, 200);
      } 
      // Handle back button for routes that should not allow back navigation
      else if (noBackRoutes.includes(location.pathname)) {
        event.preventDefault();
        window.history.pushState(
          { preventBack: true, timestamp: Date.now() }, 
          null, 
          location.pathname
        );
      }
    };

    // Add back button control for specific routes
    const needsBackControl = [
      '/registration-category',
      ...redirectOnBackRoutes
    ];

    if (needsBackControl.includes(location.pathname)) {
      // Push initial state with timestamp to track it
      window.history.pushState(
        { preventBack: true, timestamp: Date.now() }, 
        null, 
        location.pathname
      );
      
      window.addEventListener('popstate', handlePopState);
    }

    // Cleanup function
    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, [location.pathname, isMedianetCompleted, navigate, isNavigating]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

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
        <Route path="/registration-tv-existing" element={<RegistrationKycExisting />} />
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