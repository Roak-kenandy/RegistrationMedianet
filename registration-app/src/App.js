import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RegistrationMedianet from './components/RegistrationMedianet';
import RegistrationOtp from './components/RegistrationOtp';
import RegistrationSucess from './components/RegistrationSuccess';
import RegistrationConfirmation from './components/RegistrationConfirmation';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/registration-medianet" replace />} />
          
          <Route path='registration-medianet' element={<RegistrationMedianet />} />
          <Route path='registration-otp' element={<RegistrationOtp />} />
          <Route path='registration-success' element={<RegistrationSucess />} />
          <Route path='registration-confirmation' element={<RegistrationConfirmation />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
