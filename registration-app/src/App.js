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

import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import RegistrationMedianet from './components/RegistrationMedianet';
import RegistrationOtp from './components/RegistrationOtp';
import RegistrationPlan from './components/RegistrationPlan';
import RegistrationSuccess from './components/RegistrationSucess';
import RegistrationExisting from './components/RegistrationExisting';
import { useEffect, useState } from 'react';
import './App.css';

// Global navigation listener
function NavigationController() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMedianetCompleted = localStorage.getItem('medianetCompleted') === 'true';
  
  useEffect(() => {
    // Check if we're trying to access a protected page
    const protectedRoutes = [
      '/registration-existing', 
      '/registration-otp', 
      '/registration-plan', 
      '/registration-success'
    ];
    
    // Redirect to medianet if trying to access protected routes without completion
    if (protectedRoutes.includes(location.pathname) && !isMedianetCompleted) {
      window.location.href = '/registration-medianet';
    }
    
    // Prevent back navigation for specified routes
    const noBackRoutes = [
      '/registration-plan', 
      '/registration-success', 
      '/registration-existing'
    ];
    
    if (noBackRoutes.includes(location.pathname)) {
      // Push current state to history to detect back navigation
      window.history.pushState(null, null, location.pathname);
      
      const handlePopState = (event) => {
        // Force redirect to medianet on back button
        window.location.href = '/registration-medianet';
        // Prevent default back behavior
        event.preventDefault();
      };
      
      window.addEventListener('popstate', handlePopState);
      
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [location.pathname, isMedianetCompleted, navigate]);
  
  return null;
}

function App() {
  useEffect(() => {
    if (localStorage.getItem('medianetCompleted') === null) {
      localStorage.setItem('medianetCompleted', 'false');
    }
  }, []);
  
  return (
    <Router>
      <div className="App">
        <NavigationController />
        <Routes>
          <Route path="/" element={<Navigate to="/registration-medianet" replace />} />
          <Route path="/registration-medianet" element={<RegistrationMedianet />} />
          <Route path="/registration-existing" element={<RegistrationExisting />} />
          <Route path="/registration-otp" element={<RegistrationOtp />} />
          <Route path="/registration-plan" element={<RegistrationPlan />} />
          <Route path="/registration-success" element={<RegistrationSuccess />} />
          <Route path="*" element={<Navigate to="/registration-medianet" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;