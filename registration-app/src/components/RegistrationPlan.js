'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { registrationService } from '../services/registrationService';
import logoImage from '../assests/medianet-app-image.jpg';
import '../styles/RegistrationPlan.css';

const RegistrationPlan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!location.state?.formData) {
      navigate('/registration-medianet', { replace: true });
      return;
    }
    setFormData(location.state.formData);
  }, [location.state, navigate]);

  const plans = [
    {
      name: 'Free Trial',
      duration: '30 Days',
      features: ['95+ Live Channels', '01 Mobile Device'],
      selectButton: 'Continue',
    },
  ];

  const handleConfirm = async () => {
    setIsLoading(true);
    let success = false;
    let deviceCode = 'N/A';

    try {
      if (!formData || Object.keys(formData).length === 0) {
        throw new Error('Missing registration data');
      }

      const contactId = await registrationService.registerContact(formData);
      if (!contactId) throw new Error('Failed to register contact');

      const deviceSuccess = await registrationService.createVirtualDevice(contactId);
      if (!deviceSuccess) throw new Error('Failed to create virtual device');

      const accountSuccess = await registrationService.createAccount(contactId);
      if (!accountSuccess) throw new Error('Failed to create account');

      const subscriptionSuccess = await registrationService.getSubscriptionContacts(contactId);
      if (!subscriptionSuccess) throw new Error('Failed to get subscription contacts');

      const subscriptionDeviceCode = await registrationService.getSubDeviceCode(subscriptionSuccess.subscription_id);
      if (!subscriptionDeviceCode) throw new Error('Failed to get subscription device code');
      deviceCode = subscriptionDeviceCode.content[0]?.custom_fields?.find(field => field.key === 'code')?.value || 'N/A';

      await registrationService.postMtvUser(formData);
      success = true;
    } catch (error) {
      console.error('Registration error:', error);
      success = false;
    } finally {
      setIsLoading(false);
      localStorage.setItem('medianetCompleted', 'true');
      navigate('/registration-success', {
        state: { formData, success, deviceCode },
        replace: true,
      });
    }
  };

  if (!formData || Object.keys(formData || {}).length === 0) {
    console.log('Not rendering, waiting for redirect');
    return null;
  }

  return (
    <div className="container-plan">
      <div className="logo">
        <img src={logoImage} alt="Medianet Logo" className="logo-image" />
      </div>
      <div className="plans-container">
        {plans.map((plan, index) => (
          <div key={index} className="plan-card">
            <h2 className="plan-name">{plan.name}</h2>
            <p className="plan-duration">{plan.duration}</p>
            <ul className="plan-features">
              {plan.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
            <button
              className="select-button"
              onClick={() => {
                if (plan.selectButton === 'Subscription') {
                  window.open('https://my.medianet.mv/', '_blank');
                } else {
                  handleConfirm();
                }
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="spinner-parent">
                  <div className="spinner"></div>
                </div>
              ) : (
                'Continue'
              )}
            </button>
            {/* Inline loading message */}
            {isLoading && (
              <p className="loading-message">
                Processing your registration... Please don’t refresh the page. This should take less than a minute.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegistrationPlan;