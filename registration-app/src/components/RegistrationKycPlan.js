'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { registrationKycService } from '../services/registrationKycService';
import logoImage from '../assests/medianet-app-image.png';
import '../styles/RegistrationPlan.css';
import { smsService } from '../services/smsService';
import { debounce } from 'lodash';

const RegistrationKycPlan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!location.state?.formData) {
      navigate('/registration-device', { replace: true });
      return;
    }
    setFormData(location.state.formData);

    // Cleanup on component unmount
    return () => {
      if (debounceRef.current) {
        debounceRef.current.cancel();
      }
    };
  }, [location.state, navigate]);

  const plans = [
    {
      name: 'Free Trial',
      duration: '1 Day',
      features: ['95+ Live Channels'],
      selectButton: 'Continue',
    },
  ];

  const handleConfirm = useCallback(
    debounce(async () => {
      if (isProcessing) {
        console.log('Registration already in progress, ignoring duplicate call');
        return;
      }

      setIsProcessing(true);
      setIsLoading(true);
      setError(null);
      let success = false;
      let deviceCode = 'N/A';

      try {
        if (!formData || Object.keys(formData).length === 0) {
          throw new Error('Missing registration data');
        }


        const contactId = await registrationKycService.registerContact(formData);
        if (!contactId) throw new Error('Failed to register contact');

        const deviceSuccess = await registrationKycService.createVirtualDevice(contactId);
        if (!deviceSuccess) throw new Error('Failed to create virtual device');

        const accountSuccess = await registrationKycService.createAccount(contactId);
        if (!accountSuccess) throw new Error('Failed to create account');

        const subscriptionSuccess = await registrationKycService.getSubscriptionContacts(contactId);
        if (!subscriptionSuccess) throw new Error('Failed to get subscription contacts');

        const subscriptionDeviceCode = await registrationKycService.getSubDeviceCode(subscriptionSuccess.subscription_id);
        if (!subscriptionDeviceCode) throw new Error('Failed to get subscription device code');
        deviceCode = subscriptionDeviceCode.content[0]?.custom_fields?.find(field => field.key === 'code')?.value || 'N/A';

        await registrationKycService.postMtvUser(formData);

        //Send SMS after all successful API calls
        const userFirstName = formData.firstName || 'User';
        const userLastName = formData.lastName || '';
        const phoneNumber = formData.phoneNumber || '';

const message = `Hi ${userFirstName} ${userLastName},\n\nYour 1-day free trial for Medianet TV has been successfully activated! Enjoy unlimited access to your favorite channels today.\n\nTo continue watching without interruption, subscribe to a monthly TV package here:\n\nhttps://my.medianet.mv`;


        await smsService.sendOtp(phoneNumber, message);
        success = true;

        localStorage.setItem('medianetCompleted', 'true');
        window.dispatchEvent(new Event('medianetCompletedChange'));
      } catch (error) {
        console.error('Registration error:', error);
        setError(error.message || 'An error occurred during registration');
        success = false;
      } finally {
        setIsLoading(false);
        setIsProcessing(false);
        navigate('/registration-success', {
          state: { formData, success, deviceCode, error: error?.message },
          replace: true,
        });
      }
    }, 1000, { leading: true, trailing: false }),
    [formData, isProcessing, navigate]
  );

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
                if (!isProcessing) {
                  handleConfirm();
                }
              }}
              disabled={isLoading || isProcessing}
              aria-disabled={isLoading || isProcessing}
              style={{ cursor: isLoading || isProcessing ? 'not-allowed' : 'pointer' }}
            >
              {isLoading ? (
                <div className="spinner-parent">
                  <div className="spinner"></div>
                </div>
              ) : (
                'Continue'
              )}
            </button>
            {isLoading && (
              <p className="loading-message">
                Processing your registration... Please don’t refresh the page. This should take less than a minute.
              </p>
            )}
            {error && (
              <p className="error-message" style={{ color: 'red', marginTop: '10px' }}>
                {error}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegistrationKycPlan;