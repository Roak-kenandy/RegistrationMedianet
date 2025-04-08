import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logoImage from '../assests/medianet-app-image.jpg';
const { v4: uuidv4 } = require('uuid');

const Popup = ({ message, onClose }) => {
    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <div className="popup-header">
                    <span className="popup-title">Notice</span>
                </div>
                <div className="popup-body">
                    <p>{message}</p>
                </div>
                <button className="popup-close-btn" onClick={onClose}>
                    OK
                </button>
            </div>
        </div>
    );
};

const Confirmation = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { selectedPlan, formData } = location.state || {};

    const planDetails = {
        'Free Trial': {
            name: 'Free Trial',
            duration: '10 Days',
            price: 'Free',
            description: 'Try our service for 10 days at no cost',
            nextStep: 'Start your free trial now!',
        },
    };

    const selectedPlanDetails = planDetails[selectedPlan] || {
        name: 'Unknown Plan',
        duration: '',
        price: '',
        description: 'Please select a plan.',
        nextStep: 'Go back to select a plan.',
    };

    const callRegisterContacts = async () => {
        try {
            const payload = {
                type: 'PERSON',
                person_name: {
                    first_name: formData.firstName,
                    last_name: formData.lastName
                },
                phone: {
                    country_code: 'MDV',
                    number: formData.phoneNumber,
                    type: 'MOBILE'
                }
            };
            const url = `${process.env.REACT_APP_API_BASE_URL}/backoffice/v2/contacts`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'api_key': 'c54504d4-0fbe-41cc-a11e-822710db9b8d'
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.id;
        } catch (error) {
            console.error('Error creating contacts:', error);
            setPopupMessage('An error occurred while creating contacts. Please try again.');
            setShowPopup(true);
            return null;
        }
    };

    const callRegisteringTag = async (contact_id) => {
        try {
            const tags = ['0c0d20c2-08e1-4483-bcbe-638608fedaba'];
            const url = `${process.env.REACT_APP_API_BASE_URL}/backoffice/v2/contacts/${contact_id}/tags`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'api_key': 'c54504d4-0fbe-41cc-a11e-822710db9b8d'
                },
                body: JSON.stringify({ tags: tags }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return true;
        } catch (error) {
            console.error('Error registering tag:', error);
            setPopupMessage('An error occurred while registering a tag. Please try again.');
            setShowPopup(true);
            return false;
        }
    };

    // const callVirtualDevice = async (contact_id) => {
    //     try {
    //         const payload = {
    //             serial_number: uuidv4(),
    //             electronic_id: null,
    //             contact_id: contact_id,
    //             product_id: 'b95d8593-6d36-4a59-8407-b3c284471382',
    //         };
    //         const url = `${process.env.REACT_APP_API_BASE_URL}/backoffice/v2/devices`;
    //         const response = await fetch(url, {
    //             method: 'POST',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //                 'api_key': process.env.REACT_APP_API_KEY
    //             },
    //             body: JSON.stringify(payload),
    //         });

    //         if (!response.ok) {
    //             throw new Error(`HTTP error! status: ${response.status}`);
    //         }
    //         return true;
    //     } catch (error) {
    //         console.error('Error posting device:', error);
    //         setPopupMessage('An error occurred while posting a device. Please try again.');
    //         setShowPopup(true);
    //         return false;
    //     }
    // };

    const callVirtualDevice = async (contact_id) => {
        try {
            const response = await fetch('https://mtvdev.medianet.mv/api/v1/devices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ contact_id }),
            });
    
            const result = await response.json();
    
            if (!response.ok) {
                console.error('API Error:', result);
                setPopupMessage('API error: ' + (result?.error || 'Unknown error'));
                setShowPopup(true);
                return false;
            }
    
            console.log('Device Created:', result);
            return true;
        } catch (error) {
            console.error('Request failed:', error);
            setPopupMessage('Something went wrong. Please try again.');
            setShowPopup(true);
            return false;
        }
    };
    
    // const callCreatingAccount = async (contact_id) => {
    //     try {
    //         const payload = {
    //             classification_id: '2c3ad63b-caf8-4be1-b76c-5b0c0438a28c',
    //             credit_limit: '',
    //             currency_code: 'MVR',
    //             is_primary: false,
    //             payment_terms_id: '01ec0a1b-0a9d-4bf6-ad88-51c2bdb9edff'
    //         };
    //         const url = `${process.env.REACT_APP_API_BASE_URL}/backoffice/v2/contacts/${contact_id}/accounts`;
    //         const response = await fetch(url, {
    //             method: 'POST',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //                 'api_key': 'c54504d4-0fbe-41cc-a11e-822710db9b8d'
    //             },
    //             body: JSON.stringify(payload),
    //         });

    //         if (!response.ok) {
    //             throw new Error(`HTTP error! status: ${response.status}`);
    //         }

    //         const data = await response.json();
    //         return data.id;
    //     } catch (error) {
    //         console.error('Error posting account:', error);
    //         setPopupMessage('An error occurred while posting an account. Please try again.');
    //         setShowPopup(true);
    //         return null;
    //     }
    // };

    const callCreatingAccount = async (contact_id) => {
        try {
            const response = await fetch('https://mtvdev.medianet.mv/api/v1/accounts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ contact_id }),
            });
    
            const result = await response.json();
    
            if (!response.ok) {
                console.error('API Error:', result);
                setPopupMessage('API error: ' + (result?.error || 'Unknown error'));
                setShowPopup(true);
                return false;
            }
    
            console.log('Account Created:', result);
            return true;
        } catch (error) {
            console.error('Request failed:', error);
            setPopupMessage('Something went wrong. Please try again.');
            setShowPopup(true);
            return false;
        }
    };
    // const callSubscription = async (account_id, contact_id) => {
    //     try {
    //         const payload = {
    //             account_id: account_id,
    //             scheduled_date: null,
    //             services: [
    //                 {
    //                     price_terms_id: "1187c08d-2795-4c8e-84b7-75a31e8e7c9d",
    //                     product_id: "f6b15e20-8309-454a-8fb0-10b73ec785c4",
    //                     quantity: 1
    //                 }
    //             ]
    //         };
    //         const url = `${process.env.REACT_APP_API_BASE_URL}/backoffice/v2/contacts/${contact_id}/services`;
    //         const response = await fetch(url, {
    //             method: 'POST',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //                 'api_key': 'c54504d4-0fbe-41cc-a11e-822710db9b8d'
    //             },
    //             body: JSON.stringify(payload),
    //         });

    //         if (!response.ok) {
    //             throw new Error(`HTTP error! status: ${response.status}`);
    //         }

    //         const data = await response.json();
    //         return true;
    //     } catch (error) {
    //         console.error('Error posting subscription:', error);
    //         setPopupMessage('An error occurred while posting a subscription. Please try again.');
    //         setShowPopup(true);
    //         return false;
    //     }
    // };

    // const callSubscriptionContacts = async (contact_id) => {
    //     try {
    //         const url = `${process.env.REACT_APP_API_BASE_URL}/backoffice/v2/contacts/${contact_id}/subscriptions`;
    //         const response = await fetch(url, {
    //             method: 'GET',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //                 'api_key': 'c54504d4-0fbe-41cc-a11e-822710db9b8d'
    //             },
    //         });

    //         if (!response.ok) {
    //             throw new Error(`HTTP error! status: ${response.status}`);
    //         }

    //         const data = await response.json();
    //         if (data.content.length) {
    //             return data.content[0].id;
    //         }
    //         return null;
    //     } catch (error) {
    //         console.error('Error getting contacts:', error);
    //         setPopupMessage('An error occurred while getting contacts. Please try again.');
    //         setShowPopup(true);
    //         return null;
    //     }
    // };

    const callSubscriptionContacts = async (contact_id) => {
        try {
            const response = await fetch(`https://mtvdev.medianet.mv/api/v1/getSubscriptionContacts/${contact_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            const result = await response.json();
    
            if (!response.ok) {
                console.error('API Error:', result);
                setPopupMessage('API error: ' + (result?.error || 'Unknown error'));
                setShowPopup(true);
                return false;
            }
    
            console.log('Account Created:', result);
            return true;
        } catch (error) {
            console.error('Request failed:', error);
            setPopupMessage('Something went wrong. Please try again.');
            setShowPopup(true);
            return false;
        }
    };

    // const callAllowedDevices = async (subscription_id) => {
    //     try {
    //         const url = `${process.env.REACT_APP_API_BASE_URL}/backoffice/v2/subscriptions/${subscription_id}/allowed_devices?size=50&page=1&&search_value=`;
    //         const response = await fetch(url, {
    //             method: 'GET',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //                 'api_key': 'c54504d4-0fbe-41cc-a11e-822710db9b8d'
    //             },
    //         });

    //         if (!response.ok) {
    //             throw new Error(`HTTP error! status: ${response.status}`);
    //         }

    //         const data = await response.json();
    //         if (data.content.length) {
    //             return data.content.map(item => ({ device_id: item.device.id }));
    //         }
    //         return null;
    //     } catch (error) {
    //         console.error('Error getting allowed devices:', error);
    //         setPopupMessage('An error occurred while getting allowed devices. Please try again.');
    //         setShowPopup(true);
    //         return null;
    //     }
    // };

    const callAddSubscriptionDevice = async (subscription_id, device_ids) => {
        try {
            const url = `${process.env.REACT_APP_API_BASE_URL}/backoffice/v2/subscriptions/${subscription_id}/devices`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'api_key': 'c54504d4-0fbe-41cc-a11e-822710db9b8d'
                },
                body: JSON.stringify(device_ids[0]), // Assuming we only need to add the first device
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // Only show success message here, after all API calls succeed
            setPopupMessage('You have been registered successfully!');
            setShowPopup(true);
            navigate('/registration-medianet');
            return true;
        } catch (error) {
            console.error('Error posting subscription device:', error);
            setPopupMessage('An error occurred while posting a subscription device. Please try again.');
            setShowPopup(true);
            return false;
        }
    };

    const callAssignDevices = async (contact_id) => {
        try {
            const url = `${process.env.REACT_APP_API_BASE_URL}/backoffice/v2/contacts/${contact_id}/services`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'api_key': 'c54504d4-0fbe-41cc-a11e-822710db9b8d'
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.content[0]?.id || null;
        } catch (error) {
            console.error('Error posting subscription:', error);
            setPopupMessage('An error occurred while posting a subscription. Please try again.');
            setShowPopup(true);
            return false;
        }
    };

    const callAssignSubscriptions = async (service_id, device_ids) => {

        const updatedDevices = device_ids.map(device => ({
            ...device,
            action: 'ENABLE'
          }));
        try {
            const url = `${process.env.REACT_APP_API_BASE_URL}/backoffice/v2/services/${service_id}/devices`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'api_key': 'c54504d4-0fbe-41cc-a11e-822710db9b8d'
                },
                body: JSON.stringify(updatedDevices),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            else {
                callPostMtvUser()
            }

            const data = await response.json();
            return data.content[0]?.id || null;
        } catch (error) {
            console.error('Error posting subscription:', error);
            setPopupMessage('An error occurred while posting a subscription. Please try again.');
            setShowPopup(true);
            return false;
        }
    }

    const callPostMtvUser = async () => {
        try {
            const url = 'https://mtvdev.medianet.mv/api/v1/mtvusers';
            const payload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phoneNumber: formData.phoneNumber,
                countryCode: 'MDV',
                referralCode: formData.referralCode,
            };
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
        }
        catch (error) {
            console.error('Error posting MTV user:', error);
            setPopupMessage('An error occurred while posting MTV user. Please try again.');
            setShowPopup(true);
        }
    };


    const handleNextStep = async () => {
        setIsLoading(true);
        // const isPhoneValid = await fetchContactsData(formData);
        // if (!isPhoneValid) {
        //     setIsLoading(false);
        //     return;
        // }

        const contactId = await callRegisterContacts();
        if (!contactId) {
            setIsLoading(false);
            return;
        }

        const tagSuccess = await callRegisteringTag(contactId);
        if (!tagSuccess) {
            setIsLoading(false);
            return;
        }

        const deviceSuccess = await callVirtualDevice(contactId);
        if (!deviceSuccess) {
            setIsLoading(false);
            return;
        }

        const accountId = await callCreatingAccount(contactId);
        if (!accountId) {
            setIsLoading(false);
            return;
        }

        // const subscriptionSuccess = await callSubscription(accountId, contactId);
        // if (!subscriptionSuccess) {
        //     setIsLoading(false);
        //     return;
        // }

        const subscriptionId = await callSubscriptionContacts(contactId);
        if (!subscriptionId) {
            setIsLoading(false);
            return;
        }

        // const deviceIds = await callAllowedDevices(subscriptionId);
        // if (!deviceIds) {
        //     setIsLoading(false);
        //     return;
        // }

        // const subscriptionDeviceSuccess = await callAddSubscriptionDevice(subscriptionId, deviceIds);
        // if (!subscriptionDeviceSuccess) {
        //     setIsLoading(false);
        //     return;
        // }

        // const callAssignDevice = await callAssignDevices(contactId);
        // if (!callAssignDevice) {
        //     setIsLoading(false);
        //     return;
        // }

        // const callAssignSubscription = await callAssignSubscriptions(callAssignDevice, deviceIds);
        // if (!callAssignSubscription) {
        //     setIsLoading(false);
        //     return;
        // }

        setIsLoading(false);
    };

    const handlePaymentStep = () => {
        console.log(selectedPlan, 'Proceeding to payment...');
    };

    const handleGoBack = () => {
        navigate('/registration-plan', { state: { formData } });
    };

    return (
        <div className="container-confirmation">
            {/* <div className="logo">
                <span className="highlight">M</span> tv
            </div> */}
            <div className="logo">
                <img src={logoImage} alt="Medianet Logo" className="logo-image" />
            </div>

            <h1 className="title">Plan Confirmation</h1>
            <p className="subtitle">Review your selected plan</p>

            <div className="confirmation-card">
                <h2 className="plan-name">{selectedPlanDetails.name}</h2>
                <p className="plan-duration">{selectedPlanDetails.duration}</p>
                <p className="plan-price">{selectedPlanDetails.price}</p>
                <p className="plan-description">{selectedPlanDetails.description}</p>
                <p className="next-step">{selectedPlanDetails.nextStep}</p>
            </div>

            <div className="button-container">
                <button className="confirm-button" onClick={selectedPlan === 'Free Trial' ? handleNextStep : handlePaymentStep} disabled={isLoading}>
                    {isLoading ? (
                        <span className="loading-spinner"></span>
                    ) : (
                        'Confirm & Proceed'
                    )}
                </button>
                {showPopup && (
                    <Popup
                        message={popupMessage}
                        onClose={() => setShowPopup(false)}
                    />
                )}
                <button className="back-button" onClick={handleGoBack}>
                    Go Back
                </button>
            </div>
        </div>
    );
};

// CSS remains the same as in your original code
const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .container-confirmation {
    background-color: #12203b;
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'Roboto', sans-serif;
    color: #fff;
    padding: clamp(15px, 3vw, 40px);
    
  }

.logo {
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 200px; /* Adjust this value based on your logo size */
    padding: 0 10px;
    z-index: 1;
  }

  .logo-image {
    width: 100%;
    height: auto;
    display: block;
    object-fit: contain;
    max-height: 80px; /* Adjust this value based on your needs */
  }

  /* ... (rest of the existing styles remain the same) */

  /* Updated media queries for logo responsiveness */
  @media (max-width: 480px) {
    .logo {
      max-width: 150px;
      top: 15px;
    }
    .logo-image {
      max-height: 60px;
    }
    .container {
      padding: 15px;
    }
  }

  @media (min-width: 481px) and (max-width: 768px) {
    .logo {
      max-width: 180px;
    }
    .logo-image {
      max-height: 70px;
    }
  }

  @media (min-width: 769px) and (max-width: 1200px) {
    .logo {
      max-width: 200px;
    }
  }

  @media (min-width: 1201px) {
    .logo {
      max-width: 250px;
    }
    .logo-image {
      max-height: 100px;
    }
  }

  .highlight {
    color: #FFD700;
  }

  .title {
    font-size: clamp(24px, 6vw, 40px);
    margin-bottom: clamp(10px, 2vw, 20px);
    text-align: center;
    
  }

  .subtitle {
    font-size: clamp(14px, 3vw, 18px);
    color: #ccc;
    margin-bottom: clamp(20px, 4vw, 40px);
    text-align: center;
    animation: fadeIn 1.2s ease-in-out;
  }

  .confirmation-card {
    background-color: #3A4445;
    border-radius: 12px;
    padding: clamp(15px, 3vw, 25px);
    width: 100%;
    max-width: clamp(300px, 50vw, 450px);
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: all 0.3s ease;
    animation: fadeIn 1.4s ease-in-out;
  }

  .confirmation-card:hover {
    background-color: #4A5556;
    box-shadow: 0 6px 20px rgba(255, 215, 0, 0.2);
  }

  .plan-name {
    font-size: clamp(18px, 4vw, 24px);
    color: #FFD700;
    margin-bottom: clamp(5px, 1vw, 10px);
  }

  .plan-duration {
    font-size: clamp(12px, 2.5vw, 16px);
    color: #ccc;
    margin-bottom: clamp(5px, 1vw, 10px);
  }

  .plan-price {
    font-size: clamp(20px, 5vw, 28px);
    font-weight: bold;
    margin-bottom: clamp(10px, 2vw, 15px);
  }

  .plan-description {
    font-size: clamp(12px, 2.5vw, 14px);
    color: #ddd;
    text-align: center;
    margin-bottom: clamp(10px, 2vw, 15px);
    padding: 0 clamp(5px, 1vw, 10px);
  }

  .next-step {
    font-size: clamp(14px, 3vw, 16px);
    color: #FFD700;
    text-align: center;
    margin-bottom: clamp(15px, 3vw, 20px);
  }

  .button-container {
    display: flex;
    flex-wrap: wrap;
    gap: clamp(10px, 2vw, 20px);
    justify-content: center;
    margin-top: clamp(20px, 4vw, 30px);
  }

.confirm-button {
    padding: clamp(8px, 2vw, 12px);
    background-color: #FFD700;
    border: none;
    border-radius: 20px;
    color: #1A2526;
    font-size: clamp(14px, 3vw, 16px);
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    width: clamp(120px, 30vw, 150px);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .confirm-button:disabled {
    background-color: #E6C200;
    cursor: not-allowed;
    opacity: 0.7;
  }

  .confirm-button:hover:not(:disabled) {
    background-color: #E6C200;
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
  }

  .loading-spinner {
    width: 20px;
    height: 20px;
    border: 3px solid #1A2526;
    border-top: 3px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    display: inline-block;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .back-button {
    padding: clamp(8px, 2vw, 12px);
    background-color: #666;
    border: none;
    border-radius: 20px;
    color: #fff;
    font-size: clamp(14px, 3vw, 16px);
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    width: clamp(120px, 30vw, 150px);
  }

  .back-button:hover {
    background-color: #888;
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Mobile Devices (up to 480px) */
  @media (max-width: 480px) {
    .confirmation-card {
      max-width: 100%;
      padding: 15px;
    }
    .confirm-button, .back-button {
      width: 120px;
    }
    .title {
      font-size: 24px;
    }
    .subtitle {
      font-size: 14px;
    }
    .button-container {
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }
  }

  /* Tablets (481px - 768px) */
  @media (min-width: 481px) and (max-width: 768px) {
    .confirmation-card {
      max-width: 80%;
      padding: 20px;
    }
    .confirm-button, .back-button {
      width: 130px;
    }
    .title {
      font-size: 28px;
    }
    .subtitle {
      font-size: 16px;
    }
  }

  /* Small Laptops/iPads (769px - 1024px) */
  @media (min-width: 769px) and (max-width: 1024px) {
    .confirmation-card {
      max-width: 60%;
      padding: 20px;
    }
    .confirm-button, .back-button {
      width: 140px;
    }
    .title {
      font-size: 32px;
    }
    .subtitle {
      font-size: 16px;
    }
  }

  /* Laptops/Desktops (1025px and above) */
  @media (min-width: 1025px) {
    .confirmation-card {
      max-width: 450px;
      padding: 25px;
    }
    .confirm-button, .back-button {
      width: 150px;
    }
    .title {
      font-size: 40px;
    }
    .subtitle {
      font-size: 18px;
    }
  }

    .popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease-in-out;
  }

  .popup-content {
    background-color: #1A2526;
    border-radius: 12px;
    padding: 20px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .popup-header {
    border-bottom: 1px solid #3A4445;
    padding-bottom: 10px;
  }

  .popup-title {
    color: #FFD700;
    font-size: clamp(16px, 3vw, 20px);
    font-weight: bold;
  }

  .popup-body {
    padding: 10px 0;
  }

  .popup-body p {
    color: #fff;
    font-size: clamp(14px, 2.5vw, 16px);
    text-align: center;
  }

  .popup-close-btn {
    padding: clamp(8px, 2vw, 12px);
    background-color: #FFD700;
    border: none;
    border-radius: 20px;
    color: #1A2526;
    font-size: clamp(14px, 2.5vw, 16px);
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100px;
    margin: 0 auto;
  }

  .popup-close-btn:hover {
    background-color: #E6C200;
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
  }

  @media (max-width: 480px) {
    .popup-content {
      width: 85%;
      padding: 15px;
    }
    
    .popup-close-btn {
      width: 80px;
    }
  }

  @media (min-width: 481px) and (max-width: 768px) {
    .popup-content {
      width: 80%;
    }
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Confirmation;