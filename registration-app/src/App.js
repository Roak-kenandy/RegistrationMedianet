// import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
// import RegistrationMedianet from './components/RegistrationMedianet';
// import RegistrationOtp from './components/RegistrationOtp';
// import RegistrationPlan from './components/RegistrationPlan';
// import RegistrationSuccess from './components/RegistrationSucess';
// import RegistrationExisting from './components/RegistrationExisting';
// import { useEffect } from 'react';
// import './App.css';

// // Simplified ProtectedRoute without manual history manipulation
// const ProtectedRoute = ({ children }) => {
//   const navigate = useNavigate();
//   const isMedianetCompleted = localStorage.getItem('medianetCompleted') === 'true';

//   useEffect(() => {
//     if (!isMedianetCompleted) {
//       navigate('/registration-medianet', { replace: true });
//     }
//   }, [isMedianetCompleted, navigate]);

//   if (!isMedianetCompleted) {
//     return null;
//   }

//   return children;
// };

// // Enhanced NoBackRoute that prevents going back
// const NoBackRoute = ({ children }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const isMedianetCompleted = localStorage.getItem('medianetCompleted') === 'true';

//   useEffect(() => {
//     if (!isMedianetCompleted) {
//       navigate('/registration-medianet', { replace: true });
//       return;
//     }

//     // Handle browser back button by listening to popstate event
//     const preventNavigation = (e) => {
//       // Push the current route back onto the history stack
//       // This effectively cancels the back button action
//       window.history.pushState(null, '', location.pathname);
      
//       // If user attempts to go back, redirect them to registration-medianet
//       navigate('/registration-medianet', { replace: true });
//     };

//     // Add popstate event listener when component mounts
//     window.addEventListener('popstate', preventNavigation);

//     // Push current state to prevent immediate back button usage
//     window.history.pushState(null, '', location.pathname);

//     // Clean up event listener
//     return () => {
//       window.removeEventListener('popstate', preventNavigation);
//     };
//   }, [isMedianetCompleted, navigate, location.pathname]);

//   if (!isMedianetCompleted) {
//     return null;
//   }

//   return children;
// };

// function App() {
//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           <Route path="/" element={<Navigate to="/registration-medianet" replace />} />
//           <Route path="/registration-medianet" element={<RegistrationMedianet />} />
//           <Route
//             path="/registration-existing"
//             element={
//               <ProtectedRoute>
//                 <RegistrationExisting />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/registration-otp"
//             element={
//               <ProtectedRoute>
//                 <RegistrationOtp />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/registration-plan"
//             element={
//               <NoBackRoute>
//                 <RegistrationPlan />
//               </NoBackRoute>
//             }
//           />
//           <Route
//             path="/registration-success"
//             element={
//               <NoBackRoute>
//                 <RegistrationSuccess />
//               </NoBackRoute>
//             }
//           />
//           <Route path="*" element={<Navigate to="/registration-medianet" replace />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

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
import { useEffect, useState } from 'react';
import './App.css';

// Global navigation listener
function NavigationController() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMedianetCompleted, setIsMedianetCompleted] = useState(
    localStorage.getItem('medianetCompleted') === 'true'
  );
  const [isNavigating, setIsNavigating] = useState(false);
  const [hasReachedCategory, setHasReachedCategory] = useState(false);

  // Sync isMedianetCompleted with localStorage changes via custom event
  useEffect(() => {
    const handleStorageChange = () => {
      setIsMedianetCompleted(localStorage.getItem('medianetCompleted') === 'true');
    };

    window.addEventListener('medianetCompletedChange', handleStorageChange);
    handleStorageChange(); // Initial check

    return () => {
      window.removeEventListener('medianetCompletedChange', handleStorageChange);
    };
  }, []);

  // Track when user reaches registration-category
  useEffect(() => {
    if (location.pathname === '/registration-category') {
      setHasReachedCategory(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    const protectedRoutes = [
      '/registration-existing',
      '/registration-otp',
      '/registration-tv-otp',
      '/registration-plan',
      '/registration-tv-plan',
      '/registration-success',
    ];

    // Skip checks if navigating
    if (isNavigating) {
      return;
    }

    // Protect routes - redirect to category if medianet not completed
    if (protectedRoutes.includes(location.pathname) && !isMedianetCompleted) {
      setIsNavigating(true);
      navigate('/registration-category', { replace: true });
      setTimeout(() => setIsNavigating(false), 1000);
      return;
    }

    // Once user has reached registration-category, prevent all back navigation
    if (hasReachedCategory) {
      // Clear any existing history and push current state
      window.history.pushState({ page: location.pathname, preventBack: true }, null, location.pathname);

      const handlePopState = (event) => {
        if (isNavigating) return; // Ignore during programmatic navigation
        
        event.preventDefault();
        event.stopPropagation();
        
        // Always stay on current page or redirect to category
        if (location.pathname === '/registration-category') {
          // Stay on category page
          window.history.pushState({ page: location.pathname, preventBack: true }, null, location.pathname);
        } else {
          // Redirect to category from any other page
          setIsNavigating(true);
          navigate('/registration-category', { replace: true });
          setTimeout(() => setIsNavigating(false), 1000);
        }
      };

      // Also handle browser back button attempts
      const handleBeforeUnload = (event) => {
        // This won't prevent back navigation but can show a warning
        event.preventDefault();
        return event.returnValue = '';
      };

      window.addEventListener('popstate', handlePopState);
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        window.removeEventListener('popstate', handlePopState);
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [location.pathname, isMedianetCompleted, navigate, isNavigating, hasReachedCategory]);

  // Additional protection: Clear browser history when reaching category
  useEffect(() => {
    if (location.pathname === '/registration-category' && hasReachedCategory) {
      // Replace current history entry to prevent back navigation
      window.history.replaceState({ page: '/registration-category', preventBack: true }, null, '/registration-category');
      
      // Push multiple entries to make back navigation more difficult
      for (let i = 0; i < 5; i++) {
        window.history.pushState({ page: '/registration-category', preventBack: true }, null, '/registration-category');
      }
    }
  }, [location.pathname, hasReachedCategory]);

  return null;
}

function App() {
  useEffect(() => {
    if (localStorage.getItem('medianetCompleted') === null) {
      localStorage.setItem('medianetCompleted', 'false');
    }

    // Disable browser back button globally
    window.addEventListener('popstate', function(event) {
      window.history.pushState(null, null, window.location.pathname);
    });
    
    // Push initial state
    window.history.pushState(null, null, window.location.pathname);
  }, []);

  return (
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
  );
}

export default App;