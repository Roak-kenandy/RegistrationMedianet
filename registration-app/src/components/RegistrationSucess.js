// RegistrationSuccess.js
'use client';

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logoImage from '../assests/medianet-app-image.jpg';
import '../styles/RegistrationSuccess.css';

const RegistrationSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(location.state?.formData || {});
  const [deviceCode, setDeviceCode] = useState(location.state?.deviceCode || 'N/A');
  const [success, setSuccess] = useState(location.state?.success || false);

  // Consolidated useEffect to handle all state updates
  useEffect(() => {
    if (!location.state) {
      // Do nothing or show an error message instead of redirecting
      setSuccess(false);
    } else {
      setFormData(location.state.formData || {});
      setDeviceCode(location.state.deviceCode || 'N/A');
      setSuccess(location.state.success || false);
    }
  }, [location.state]);

  const loginDetails = {
    serviceNumber: deviceCode,
    password: formData.phoneNumber,
  };

  const handleBackToLogin = () => {
    navigate('/registration-medianet');
  };

  return (
    <div className="container-success">
      <div className="welcome-text">Welcome To</div>
      <div className="logo">
        <img src={logoImage} alt="Medianet Logo" className="logo-image" />
      </div>
      <h1 className="title">
        {success ? 'Registration Successful' : 'Registration Failed'}
      </h1>
      <p className="subtitle">
        {success
          ? 'Find below your login details. The login details have also been sent to your mobile number.'
          : 'There was an issue with your registration. Please try again.'}
      </p>
      
      {success && (
        <div className="login-details-box">
          <h2 className="box-title">Login Details</h2>
          <p className="box-text">Service Number: {loginDetails.serviceNumber}</p>
          <p className="box-text">Password: {loginDetails.password}</p>
          <button className="back-to-login-btn" onClick={handleBackToLogin}>
            Go back to login page
          </button>
        </div>
      )}
      
      {!success && (
        <button className="back-to-login-btn" onClick={handleBackToLogin}>
          Try Again
        </button>
      )}
      
      <p className="footer-text">
        {success ? 'Enjoy your world of Entertainment' : 'Medianet Entertainment'}
      </p>
    </div>
  );
};

export default RegistrationSuccess;