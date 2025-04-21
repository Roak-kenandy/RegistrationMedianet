'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registrationService } from '../services/registrationService';
import { COUNTRY_DATA } from '../config/constants';
import Popup from './Popup';
import logoImage from '../assests/medianet-app-image.jpg';
import '../styles/RegistrationMedianet.css';

const RegistrationMedianet = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        countryCode: 'MDV',
        phoneNumber: '',
        referralType: '',
        referralCode: '',
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({
        firstName: false,
        lastName: false,
        phoneNumber: false,
        referralCode: false,
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
        return { newErrors, isValid: Object.keys(newErrors).length === 0 };
    };

    const fetchContactsData = async () => {
        try {
            setIsLoading(true);
            const data = await registrationService.verifyPhoneNumber(formData.phoneNumber);

            if (data.length > 0) {
                navigate('/registration-existing', {
                    state: {
                        data,
                        phoneNumber: formData.phoneNumber,
                        firstName: formData.firstName,
                        lastName: formData.lastName
                    }
                });
            } else {
                const { isValid } = validateForm();

                if (isValid) {
                    const selectedCountry = COUNTRY_DATA.find(country => country.code === formData.countryCode);
                    if (!selectedCountry) {
                        throw new Error('Invalid country code selected');
                    }

                    const fullPhoneNumber = `${selectedCountry.phoneCode}${formData.phoneNumber}`;
                    localStorage.setItem('medianetCompleted', 'true');

                    navigate('/registration-otp', {
                        state: {
                            phoneNumber: fullPhoneNumber,
                            formData: formData,
                        },
                    });
                } else {
                    setPopupMessage('Please fill in all required fields correctly.');
                    setShowPopup(true);
                }
            }
        } catch (error) {
            console.error('Error verifying contact:', error);
            setPopupMessage('An error occurred while verifying your phone number. Please try again.');
            setShowPopup(true);
        } finally {
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

                {/* Mobile Form Container (shown below 992px) */}
                <div className="mobile-form-container">
                    <h1 className="title">Register Now!</h1>
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

                        <div className="referral-container">
                            <div className="referral-select-container">
                                <label className="select-label">Referral Type (Optional)</label>
                                <select
                                    name="referralType"
                                    id="referralType"
                                    value={formData.referralType}
                                    onChange={handleChange}
                                    className="referral-select"
                                >
                                    <option value="">Select...</option>
                                    <option value="Employee">Medianet</option>
                                    <option value="Dealer">Dealer</option>
                                </select>
                            </div>
                            <div className="input-container referral-input">
                                <label
                                    className={`floating-label ${formData.referralCode ? 'active' : ''}`}
                                    htmlFor="referralCode"
                                >
                                    Referral phone number
                                </label>
                                <input
                                    type="text"
                                    name="referralCode"
                                    id="referralCode"
                                    value={formData.referralCode}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="input referral-input-field"
                                />
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

                {/* Desktop Contact Container (shown 992px and up) */}
                <div className="desktop-contact-container">
                    <h1 className="title">Medianet Registration</h1>
                    <div className="contact-info">
                        <p>Medianet Registration Portal will be LIVE soon! </p>
                        <p>Meanwhile, for registration and queries contact us at:</p>
                        <div className="contact-details">
                            <p><strong>Phone:</strong> 332-0800</p>
                            <p><strong>Email:</strong> support@medianet.mv</p>
                        </div>
                    </div>
                </div>

                {showPopup && (
                    <Popup message={popupMessage} onClose={() => setShowPopup(false)} />
                )}
            </div>
        </div>
    );
};

export default RegistrationMedianet;