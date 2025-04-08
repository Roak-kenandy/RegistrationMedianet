'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { COUNTRY_DATA } from '../config/constants';
import Popup from './Popup';
import logoImage from '../assests/medianet-app-image.jpg'; // Ensure this path is correct
import '../styles/RegistrationMedianet.css';

const RegistrationMedianet = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    countryCode: 'MDV',
    phoneNumber: '',
    referralCode: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    phoneNumber: false,
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [phoneLength, setPhoneLength] = useState(7);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const selectedCountry = COUNTRY_DATA.find(country => country.code === formData.countryCode);
    setPhoneLength(selectedCountry ? selectedCountry.phoneLength : 7);
    setFormData(prev => ({ ...prev, phoneNumber: '' }));
  }, [formData.countryCode]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.match(/^[A-Za-z]{2,}$/)) {
      newErrors.firstName = 'First name must be at least 2 letters';
    }
    if (!formData.lastName.match(/^[A-Za-z]{2,}$/)) {
      newErrors.lastName = 'Last name must be at least 2 letters';
    }
    if (!formData.phoneNumber.match(new RegExp(`^\\d{${phoneLength}}$`))) {
      newErrors.phoneNumber = `Phone number must be exactly ${phoneLength} digits`;
    }
    return { newErrors, isValid: Object.keys(newErrors).length === 0 };
  };

  const fetchContactsData = async () => {
    try {
        setIsLoading(true);
      const data = await apiService.get('/contacts/verify', { phone: formData.phoneNumber });

      if (data.contact_exists) {
        setPopupMessage('This phone number already exists in our system. Please try another one.');
        setShowPopup(true);
        return;
      }

      const { isValid } = validateForm();
      if (isValid) {
        const selectedCountry = COUNTRY_DATA.find(country => country.code === formData.countryCode);
        localStorage.setItem('medianetCompleted', 'true');
        navigate('/registration-otp', {
          state: {
            phoneNumber: `${selectedCountry.phoneCode}${formData.phoneNumber}`,
            formData: formData,
          },
        });
      }
    } catch (error) {
      console.error('Error verifying contact:', error);
      setPopupMessage('An error occurred while verifying your phone number. Please try again.');
      setShowPopup(true);
    }
    finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    const { newErrors, isValid } = validateForm();
    setErrors(newErrors);
    setIsFormValid(isValid);
  }, [formData, phoneLength]);

  const handleBlur = (e) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === 'phoneNumber') {
      processedValue = value.replace(/\D/g, '').slice(0, phoneLength);
    } else if (name === 'firstName' || name === 'lastName') {
      processedValue = value.charAt(0).toUpperCase() + value.slice(1);
    }

    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { isValid } = validateForm();
    if (isValid && !isLoading) {
      fetchContactsData();
    }
  };

  const selectedCountry = COUNTRY_DATA.find(country => country.code === formData.countryCode);

  return (
    <div className="container-registration">
      <div className="content-wrapper">
        <div className="logo">
          <img src={logoImage} alt="Medianet Logo" className="logo-image" />
        </div>
        <h1 className="title">Register Now!</h1>
        <form onSubmit={handleSubmit} className="form">
          <div className="input-container">
            <input
              type="text"
              name="firstName"
              placeholder="First Name *"
              value={formData.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`input ${touched.firstName && errors.firstName ? 'error-border' : ''}`}
            />
            {touched.firstName && errors.firstName && (
              <span className="error">{errors.firstName}</span>
            )}
          </div>

          <div className="input-container">
            <input
              type="text"
              name="lastName"
              placeholder="Last Name *"
              value={formData.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`input ${touched.lastName && errors.lastName ? 'error-border' : ''}`}
            />
            {touched.lastName && errors.lastName && (
              <span className="error">{errors.lastName}</span>
            )}
          </div>

          <div className="phone-container">
            <div className="custom-select-wrapper">
              <div className="custom-select-display">
                {selectedCountry ? `${selectedCountry.flag} ${selectedCountry.phoneCode}` : 'Select Country'}
              </div>
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                className="select"
              >
                {COUNTRY_DATA.map(country => (
                  <option key={country.code} value={country.code}>
                    {`${country.flag} ${country.name} (${country.phoneCode})`}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-container phone-input">
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number *"
                value={formData.phoneNumber}
                onChange={handleChange}
                maxLength={phoneLength}
                onBlur={handleBlur}
                className={`input ${touched.phoneNumber && errors.phoneNumber ? 'error-border' : ''}`}
              />
              {touched.phoneNumber && errors.phoneNumber && (
                <span className="error">{errors.phoneNumber}</span>
              )}
            </div>
          </div>

          <div className="input-container">
            <input
              type="text"
              name="referralCode"
              placeholder="Referral Code (Optional)"
              value={formData.referralCode}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div className="terms-container">
            <button 
              type="submit" 
              disabled={!isFormValid || isLoading} 
              className={`submit-button ${isLoading ? 'loading' : ''}`}
            >
              {isLoading ? (
                <div className="spinner"></div>
              ) : (
                'Continue'
              )}
            </button>
          </div>
        </form>
      </div>
      {showPopup && (
        <Popup message={popupMessage} onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
};

export default RegistrationMedianet;