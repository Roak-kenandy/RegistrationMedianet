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

    useEffect(() => {
      // Log current path for debugging
      // If no formData is provided, redirect immediately
      if (!location.state?.formData) {
        navigate('/registration-category', { replace: true });
        return;
      }
  
      // Set formData if it exists
      setFormData(location.state.formData);
    }, [location.state, navigate]);

  // Consolidated useEffect to handle all state updates
  useEffect(() => {
    if (!location.state) {
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
    navigate('/registration-category');
  };

  return (
    <div className="reg-success-wrapper">
      <div className="reg-success-greeting">Welcome To</div>
      <div className="reg-success-brand-image-container">
        <img src={logoImage} alt="Medianet Brand" className="reg-success-brand-image" />
      </div>
      <h1 className="reg-success-heading">
        {success ? 'Registration Successful' : 'Registration Failed'}
      </h1>
      <p className="reg-success-message">
        {success
          ? 'Find below your login details. The login details have also been sent to your mobile number.'
          : 'There was an issue with your registration. Please try again.'}
      </p>
      
      {success && (
        <div className="reg-success-details-container">
          <h2 className="reg-success-details-title">Login Details</h2>
          <p className="reg-success-details-text">Service Number: {loginDetails.serviceNumber}</p>
          <p className="reg-success-details-text">Password: {loginDetails.password}</p>
          {/* <button className="reg-success-action-button" onClick={handleBackToLogin}>
            Go back to login page
          </button> */}
        </div>
      )}
      
      {!success && (
        <button className="reg-success-action-button" onClick={handleBackToLogin}>
          Try Again
        </button>
      )}
      
      <p className="reg-success-footer-note">
        {success ? 'Enjoy your world of Entertainment' : 'Medianet Entertainment'}
      </p>
    </div>
  );
};

export default RegistrationSuccess;