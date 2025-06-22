'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registrationService } from '../services/registrationService';
import { COUNTRY_DATA } from '../config/constants';
import Popup from './Popup';
import logoImage from '../assests/medianet-app-image.png';
import '../styles/RegistrationKycScreen.css';
import { useMedianet } from '../context/MedianetContext'; // ✅ Import the context

const RegistrationKycScreen = () => {
  const navigate = useNavigate();
    const { completeMedianet } = useMedianet(); // ✅ Use context method

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    countryCode: 'MDV',
    phoneNumber: '',
    fullAddress: '',
    addressType: 'Home',
    road: '',
    ward: '',
    city: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    phoneNumber: false,
    fullAddress: false,
    city: false,
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
    if (!formData.firstName.match(/^[A-Za-z\s-]{2,}$/)) {
      newErrors.firstName = 'First name must be at least 2 letters';
    }
    if (!formData.lastName.match(/^[A-Za-z\s-]{1,}$/)) {
      newErrors.lastName = 'Last name must be at least 1 letter';
    }
    if (!formData.phoneNumber.match(new RegExp(`^\\d{${phoneLength}}$`))) {
      newErrors.phoneNumber = `Phone number must be exactly ${phoneLength} digits`;
    }
    if (!formData.fullAddress.trim()) {
      newErrors.fullAddress = 'Full address is required';
    }
    if (!formData.addressType) {
      newErrors.addressType = 'Address type is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    return { newErrors, isValid: Object.keys(newErrors).length === 0 };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid } = validateForm();
    if (isValid && !isLoading) {
      try {
        setIsLoading(true);
        const selectedCountry = COUNTRY_DATA.find(country => country.code === formData.countryCode);
        if (!selectedCountry) {
          throw new Error('Invalid country code selected');
        }
        const fullPhoneNumber = `${formData.phoneNumber}`;

        // Simulate API call to verify phone number
        const data = await registrationService.verifyTvPhoneNumber(fullPhoneNumber);
        completeMedianet();

        if (data.length > 0) {
          navigate('/registration-existing', {
            state: {
              data,
              phoneNumber: fullPhoneNumber,
              firstName: formData.firstName,
              lastName: formData.lastName,
              addressDetails: {
                fullAddress: formData.fullAddress,
                addressType: formData.addressType,
                road: formData.road,
                ward: formData.ward,
                city: formData.city,
              },
            },
            replace: true,
          });
        } else {
          navigate('/registration-tv-otp', {
            state: {
              phoneNumber: fullPhoneNumber,
              formData,
            },
            replace: true,
          });
        }
      } catch (error) {
        console.error('Error verifying contact:', error);
        setPopupMessage('An error occurred while verifying your information. Please try again.');
        setShowPopup(true);
      } finally {
        setIsLoading(false);
      }
    } else {
      setPopupMessage('Please fill in all required fields correctly.');
      setShowPopup(true);
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

  const selectedCountry = COUNTRY_DATA.find(country => country.code === formData.countryCode);

  return (
    <div className="container-registration">
      <div className="content-wrapper">
        <div className="logo">
          <img src={logoImage} alt="Medianet Logo" className="logo-image" />
        </div>

        <div className="form-container">
          <h1 className="title-registration">Register Now!</h1>
          <form onSubmit={handleSubmit} className="form">
            <div className="input-container">
              <label
                className={`floating-label ${formData.firstName ? 'active' : ''}`}
                htmlFor="firstName"
              >
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
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
              <label
                className={`floating-label ${formData.lastName ? 'active' : ''}`}
                htmlFor="lastName"
              >
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
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
                <label
                  className={`floating-label ${formData.phoneNumber ? 'active' : ''}`}
                  htmlFor="phoneNumber"
                >
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  id="phoneNumber"
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

            <div className="address-container">
              <h2 className="address-title">Installation Address</h2>
              <div className="input-container">
                <label
                  className={`floating-label ${formData.fullAddress ? 'active' : ''}`}
                  htmlFor="fullAddress"
                >
                  Full Address *
                </label>
                <input
                  type="text"
                  name="fullAddress"
                  id="fullAddress"
                  value={formData.fullAddress}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input ${touched.fullAddress && errors.fullAddress ? 'error-border' : ''}`}
                />
                {touched.fullAddress && errors.fullAddress && (
                  <span className="error">{errors.fullAddress}</span>
                )}
              </div>

              <div className="input-container">
                <label
                  className={`floating-label ${formData.addressType ? 'active' : ''}`}
                  htmlFor="addressType"
                >
                  Address Type
                </label>
                <select
                  name="addressType"
                  id="addressType"
                  value={formData.addressType}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="Home">Home</option>
                  <option value="Business">Business</option>
                  <option value="Alternative">Alternative</option>
                </select>
              </div>

              <div className="input-container">
                <label
                  className={`floating-label ${formData.road ? 'active' : ''}`}
                  htmlFor="road"
                >
                  Road
                </label>
                <input
                  type="text"
                  name="road"
                  id="road"
                  value={formData.road}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div className="address-row">
                <div className="input-container">
                  <label
                    className={`floating-label ${formData.ward ? 'active' : ''}`}
                    htmlFor="ward"
                  >
                    Ward
                  </label>
                  <input
                    type="text"
                    name="ward"
                    id="ward"
                    value={formData.ward}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
                <div className="input-container">
                  <label
                    className={`floating-label ${formData.city ? 'active' : ''}`}
                    htmlFor="city"
                  >
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    value={formData.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`input ${touched.city && errors.city ? 'error-border' : ''}`}
                  />
                  {touched.city && errors.city && (
                    <span className="error">{errors.city}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="terms-container">
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`submit-button ${isLoading ? 'loading' : ''}`}
              >
                {isLoading ? (
                  <div className="spinner-medianet"></div>
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
    </div>
  );
};

export default RegistrationKycScreen;