import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RegistrationMedianet from './components/RegistrationMedianet';
import RegistrationOtp from './components/RegistrationOtp';
import RegistrationSuccess from './components/RegistrationSuccess';
import RegistrationConfirmation from './components/RegistrationConfirmation';

// ProtectedRoute component to check if RegistrationMedianet is completed
function ProtectedRoute({ element: Component, ...rest }) {
  const isMedianetCompleted = localStorage.getItem('medianetCompleted') === 'true';

  return isMedianetCompleted ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/registration-medianet" replace />
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default route redirects to RegistrationMedianet */}
          <Route path="/" element={<Navigate to="/registration-medianet" replace />} />
          
          {/* Public route */}
          <Route path="/registration-medianet" element={<RegistrationMedianet />} />
          
          {/* Protected routes */}
          <Route
            path="/registration-otp"
            element={<ProtectedRoute element={RegistrationOtp} />}
          />
          <Route
            path="/registration-plan"
            element={<ProtectedRoute element={RegistrationSuccess} />}
          />
          <Route
            path="/registration-confirmation"
            element={<ProtectedRoute element={RegistrationConfirmation} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;