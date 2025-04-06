import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import logoImage from '../assests/medianet-app-image.jpg';

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

const RegistrationMedianet = () => {
    const navigate = useNavigate();
    const countryData = [
        { name: 'Australia', code: 'AUS', phoneCode: '+61', flag: '🇦🇺', phoneLength: 9 },
        { name: 'Brazil', code: 'BRA', phoneCode: '+55', flag: '🇧🇷', phoneLength: 11 },
        { name: 'Canada', code: 'CAN', phoneCode: '+1', flag: '🇨🇦', phoneLength: 10 },
        { name: 'China', code: 'CHN', phoneCode: '+86', flag: '🇨🇳', phoneLength: 11 },
        { name: 'France', code: 'FRA', phoneCode: '+33', flag: '🇫🇷', phoneLength: 9 },
        { name: 'Germany', code: 'DEU', phoneCode: '+49', flag: '🇩🇪', phoneLength: 11 },
        { name: 'India', code: 'IND', phoneCode: '+91', flag: '🇮🇳', phoneLength: 10 },
        { name: 'Japan', code: 'JPN', phoneCode: '+81', flag: '🇯🇵', phoneLength: 10 },
        { name: 'Macau', code: 'MAC', phoneCode: '+853', flag: '🇲🇴', phoneLength: 8 },
        { name: 'Macedonia (FYROM)', code: 'MKD', phoneCode: '+389', flag: '🇲🇰', phoneLength: 8 },
        { name: 'Madagascar', code: 'MDG', phoneCode: '+261', flag: '🇲🇬', phoneLength: 9 },
        { name: 'Malawi', code: 'MWI', phoneCode: '+265', flag: '🇲🇼', phoneLength: 9 },
        { name: 'Malaysia', code: 'MYS', phoneCode: '+60', flag: '🇲🇾', phoneLength: 9 },
        { name: 'Maldives', code: 'MDV', phoneCode: '+960', flag: '🇲🇻', phoneLength: 7 },
        { name: 'Mexico', code: 'MEX', phoneCode: '+52', flag: '🇲🇽', phoneLength: 10 },
        { name: 'Nigeria', code: 'NGA', phoneCode: '+234', flag: '🇳🇬', phoneLength: 10 },
        { name: 'Russia', code: 'RUS', phoneCode: '+7', flag: '🇷🇺', phoneLength: 10 },
        { name: 'South Africa', code: 'ZAF', phoneCode: '+27', flag: '🇿🇦', phoneLength: 9 },
        { name: 'South Korea', code: 'KOR', phoneCode: '+82', flag: '🇰🇷', phoneLength: 10 },
        { name: 'Spain', code: 'ESP', phoneCode: '+34', flag: '🇪🇸', phoneLength: 9 },
        { name: 'United Kingdom', code: 'GBR', phoneCode: '+44', flag: '🇬🇧', phoneLength: 10 },
        { name: 'United States', code: 'USA', phoneCode: '+1', flag: '🇺🇸', phoneLength: 10 },
    ];

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
        phoneNumber: false
    });
    const [isFormValid, setIsFormValid] = useState(false);
    const [phoneLength, setPhoneLength] = useState(7);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [tags, setTags] = useState([]);

    useEffect(() => {
        const selectedCountry = countryData.find(country => country.code === formData.countryCode);
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
            const url = `/backoffice/v2/contacts/verify?phone=${formData.phoneNumber}`;
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

            console.log(data, 'Contact data fetched successfully');

            if (data.contact_exists) {
                setPopupMessage('This phone number already exists in our system. Please try another one.');
                setShowPopup(true);
            }
            else {
                const { isValid } = validateForm();
                if (isValid) {
                    const selectedCountry = countryData.find(country => country.code === formData.countryCode);

                    localStorage.setItem('medianetCompleted', 'true');

                    navigate('/registration-otp', {
                        state: {
                            phoneNumber: `${selectedCountry.phoneCode}${formData.phoneNumber}`,
                            formData: formData
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching product data:', error);
            setPopupMessage('An error occurred while verifying your phone number. Please try again.');
            setShowPopup(true);
            return false;
        }
    };

    //   const handleContinue = (e) => {
    //     e.preventDefault();
    //     const { isValid } = validateForm();
    //     if (isValid) {
    //       const selectedCountry = countryData.find(country => country.code === formData.countryCode);
    //       // Navigate to RegistrationOtp with phone number
    //       navigate('/registration-otp', { 
    //         state: { 
    //           phoneNumber: `${selectedCountry.phoneCode}${formData.phoneNumber}`,
    //           formData: formData
    //         }
    //       });
    //     }
    //   };

    useEffect(() => {
        const { newErrors, isValid } = validateForm();
        setErrors(newErrors);
        setIsFormValid(isValid);
    }, [formData, phoneLength]);

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let processedValue = value;

        if (name === 'phoneNumber') {
            processedValue = value.replace(/\D/g, '').slice(0, phoneLength);
        } else if (name === 'firstName' || name === 'lastName') {
            processedValue = value.charAt(0).toUpperCase() + value.slice(1);
        }

        setFormData(prev => ({
            ...prev,
            [name]: processedValue
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { isValid } = validateForm();
        if (isValid) {
            console.log('Form submitted:', formData);
        }
    };

    const callGetTags = async () => {
        try {
            const url = `/backoffice/v2/tags?size=10&page=1&entity=CONTACTS&state=ACTIVE&search_value=''`;
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
            const filteredContent = data.content.find(item => item.name === 'OTT');
            console.log(filteredContent, 'filtered contents')
            const tags = filteredContent ? ['0c0d20c2-08e1-4483-bcbe-638608fedaba'] : [];
            console.log(tags, 'tags getting')
            setTags(tags);

            return {
                code: 'OK',
                data: {
                    content: data // Adjust this based on your actual API response structure
                }
            };
        }
        catch (error) {
            console.error('Error fetching on getting tags', error);
            setPopupMessage('An error occurred on fetvhing a tags. Please try again.');
            setShowPopup(true);
            return {
                code: 'ERROR',
                error: error.message
            };
        }
    }

    const selectedCountry = countryData.find(country => country.code === formData.countryCode);

    return (
        <div className="container">
            {/* <div className="logo">
        <span className="highlight">M</span> tv
      </div> */}
            <div className="logo">
                <img src={logoImage} alt="Medianet Logo" className="logo-image" />
            </div>

            <h1 className="title">Register Now!</h1>

            <form onSubmit={handleSubmit} className="form">
                <div className="input-container">
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
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
                        placeholder="Last Name"
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
                            {countryData.map(country => (
                                <option key={country.code} value={country.code} style={{ backgroundColor: '#3A4445', color: '#fff' }}>
                                    {`${country.flag} ${country.name} (${country.phoneCode})`}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="input-container phone-input">
                        <input
                            type="tel"
                            name="phoneNumber"
                            placeholder="Phone Number"
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

                {/* <button type="submit" disabled={!isFormValid} className="submit-button" onClick={fetchContactsData}>
          Register
        </button> */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button type="submit" disabled={!isFormValid} className="submit-button" onClick={fetchContactsData}>
                        Continue
                    </button>
                </div>
            </form>
            {showPopup && (
                <Popup
                    message={popupMessage}
                    onClose={() => setShowPopup(false)}
                />
            )}
        </div>
    );
};

const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .container {
    background-color: #12203b;
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'Roboto', sans-serif;
    color: #fff;
    padding: 20px;
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
    font-size: clamp(24px, 6vw, 36px);
    margin-bottom: 2rem;
    text-align: center;
    margin-top: 100px;
  }

  .form {
    width: 100%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 0 1rem;
  }

  .input-container {
    position: relative;
    width: 100%;
  }

  .input {
    width: 100%;
    padding: clamp(10px, 2vw, 15px);
    background-color: #3A4445;
    border: 2px solid transparent;
    border-radius: 8px;
    color: #fff;
    font-size: clamp(14px, 2.5vw, 16px);
    outline: none;
    transition: all 0.3s ease;
  }

  .input:focus {
    background-color: #4A5556;
    transform: scale(1.02);
    border-color: #FFD700;
  }

  .error-border {
    border-color: #ff4444;
  }

  .phone-container {
    display: flex;
    gap: 10px;
    width: 100%;
    flex-wrap: wrap;
  }

  .custom-select-wrapper {
    position: relative;
    flex: 1;
    min-width: 150px;
  }

  .custom-select-display {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: clamp(10px, 2vw, 15px);
    background-color: #3A4445;
    border-radius: 8px;
    color: #fff;
    font-size: clamp(14px, 2.5vw, 16px);
    display: flex;
    align-items: center;
    pointer-events: none;
  }

  .select {
    padding: clamp(10px, 2vw, 15px);
    background-color: transparent;
    border: none;
    border-radius: 8px;
    color: transparent;
    font-size: clamp(14px, 2.5vw, 16px);
    outline: none;
    transition: all 0.3s ease;
    width: 100%;
    opacity: 0;
    position: relative;
    z-index: 1;
  }

  .phone-input {
    flex: 2;
    min-width: 150px;
  }

  .error {
    color: #ff4444;
    font-size: clamp(10px, 2vw, 12px);
    position: absolute;
    bottom: -18px;
    left: 0;
  }

  .submit-button {
    padding: clamp(12px, 2.5vw, 15px);
    background-color: #FFD700;
    border: none;
    border-radius: 25px;
    color: #1A2526;
    font-size: clamp(14px, 3vw, 18px);
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 1rem;
  }

  .submit-button:disabled {
    background-color: #666;
    color: #999;
    cursor: not-allowed;
    box-shadow: none;
  }

  .submit-button:not(:disabled):hover {
    background-color: #E6C200;
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(255, 215, 0, 0.5);
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .container, .title, .form {
    animation: fadeIn 1s ease-in-out;
  }

  @media (max-width: 480px) {
    .container {
      padding: 15px;
    }
    .form {
      max-width: 100%;
    }
    .phone-container {
      flex-direction: column;
    }
    .phone-input {
      min-width: 100%;
    }
    .custom-select-wrapper {
      min-width: 100%;
    }
  }

  @media (min-width: 481px) and (max-width: 768px) {
    .form {
      max-width: 400px;
    }
  }

  @media (min-width: 769px) and (max-width: 1200px) {
    .form {
      max-width: 450px;
    }
  }

  @media (min-width: 1201px) {
    .form {
      max-width: 500px;
    }
    .title {
      font-size: 36px;
    }
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default RegistrationMedianet;