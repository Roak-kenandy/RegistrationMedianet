'use client';

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/RegistrationExisting.css';
import logoImage from '../assests/medianet-app-image.jpg';
import { smsService } from '../services/smsService';
import Popup from './Popup';

const RegistrationExisting = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Retrieve initial state from location.state or localStorage
    const initialState = location.state || JSON.parse(localStorage.getItem('registrationState')) || {
        data: [],
        phoneNumber: null,
        firstName: null,
        lastName: null,
    };
    const { data, phoneNumber, firstName, lastName } = initialState;

    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [loadingStates, setLoadingStates] = useState({});
    const [subscriptions, setSubscriptions] = useState(data);
    const [redirectAfterPopup, setRedirectAfterPopup] = useState(false);

    useEffect(() => {
        // Persist the state to localStorage whenever it changes
        localStorage.setItem('registrationState', JSON.stringify({ data: subscriptions, phoneNumber, firstName, lastName }));

        // Check if required state is missing
        if ((!data.length && !phoneNumber)) {
            navigate('/registration-medianet');
            return;
        }

        const returningTo = localStorage.getItem('returningTo');
        if (returningTo) {
            const updatedSubscriptions = subscriptions.map(sub => ({
                ...sub,
                state: 'churned',
            }));
            setSubscriptions(updatedSubscriptions);
            navigate(returningTo, { state: { data: updatedSubscriptions, phoneNumber, firstName, lastName } });
            localStorage.removeItem('returningTo');
        }
    }, [subscriptions, navigate, phoneNumber, firstName, lastName, data]);

    const maskString = (str) => {
        if (!str || str.length < 2) return 'N/A';
        return `${str.slice(0, 2)}***`;
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        if (redirectAfterPopup) {
            navigate('/registration-medianet', { state: { data: subscriptions, phoneNumber, firstName, lastName } });
            setRedirectAfterPopup(false);
        }
    };

    const handleButtonClick = async (subscription, index) => {
        setLoadingStates((prev) => ({ ...prev, [index]: true }));

        try {
            if (subscription.state?.toLowerCase() === 'active') {
                if (!phoneNumber) {
                    throw new Error('Phone number not available for this subscription');
                }

                const userFirstName = firstName || 'Customer';
                const userLastName = lastName || '';

                const message = `Hi ${userFirstName} ${userLastName},\n\nThank you for choosing Medianet as your entertainment partner. Please find your login details below:\n\nUsername: ${subscription.value}\nPassword: ${phoneNumber}\n\nWe hope you enjoy your Medianet experience!`;
                const response = await smsService.sendOtp(phoneNumber, `${message}`);

                setPopupMessage('Login details have been sent to your registered phone number!');
                setShowPopup(true);
                setRedirectAfterPopup(true);
            } else if (subscription.state?.toLowerCase() === 'inactive' || subscription.state?.toLowerCase() === 'churned') {
                localStorage.setItem('returningTo', '/registration-medianet');
                window.location.href = 'https://my.medianet.mv';
            }
        } catch (error) {
            console.error('Error in handleButtonClick:', error);
            setPopupMessage(`Error: ${error.message || 'Failed to process request. Please try again.'}`);
            setShowPopup(true);
        } finally {
            setLoadingStates((prev) => ({ ...prev, [index]: false }));
        }
    };

    return (
        <div className="existing-container">
            <div className="logo">
                <img src={logoImage} alt="Medianet Logo" className="logo-image" />
            </div>
            <div className="content-wrapper">
                <h1 className="title">
                    You are already <span className="highlight">Registered!</span>
                </h1>
                <div className="subscriptions-list">
                    {subscriptions.length > 0 ? (
                        subscriptions.map((subscription, index) => (
                            <div key={index} className="subscription-card">
                                {subscription.state?.toLowerCase() === 'churned' ? (
                                    <>
                                        <p className="churned-message">
                                            You have already registered. You have to subscribe using the button below.
                                        </p>
                                        <button
                                            className="action-button inactive"
                                            onClick={() => handleButtonClick(subscription, index)}
                                            disabled={loadingStates[index]}
                                        >
                                            {loadingStates[index] ? (
                                                <span className="spinner-existing"></span>
                                            ) : (
                                                'Subscribe'
                                            )}
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="field-group">
                                            <span className="field-label">Service Code</span>
                                            <span className="field-value">{maskString(subscription.value)}</span>
                                        </div>
                                        <div className="field-group">
                                            <span className="field-label">Status</span>
                                            <span className="field-value status">
                                                <span className={`status-indicator ${subscription.state?.toLowerCase() || 'unknown'}`}></span>
                                                {subscription.state || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="field-group">
                                            <span className="field-label">Start Date</span>
                                            <span className="field-value">{subscription.start_date || 'N/A'}</span>
                                        </div>
                                        <div className="field-group">
                                            <span className="field-label">End Date</span>
                                            <span className="field-value">{subscription.end_date || 'N/A'}</span>
                                        </div>
                                        <button
                                            className={`action-button ${subscription.state?.toLowerCase() || 'unknown'}`}
                                            onClick={() => handleButtonClick(subscription, index)}
                                            disabled={loadingStates[index]}
                                        >
                                            {loadingStates[index] ? (
                                                <span className="spinner-existing"></span>
                                            ) : (
                                                subscription.state?.toLowerCase() === 'active'
                                                    ? 'Resend Login Details'
                                                    : subscription.state?.toLowerCase() === 'inactive'
                                                    ? 'Subscribe'
                                                    : 'N/A'
                                            )}
                                        </button>
                                    </>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="no-data">No existing subscriptions found.</p>
                    )}
                </div>
            </div>
            {showPopup && (
                <Popup message={popupMessage} onClose={handleClosePopup} />
            )}
        </div>
    );
};

export default RegistrationExisting;