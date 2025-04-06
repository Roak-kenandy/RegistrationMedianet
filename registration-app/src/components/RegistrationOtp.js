import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logoImage from '../assests/medianet-app-image.jpg';

const RegistrationOtp = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { phoneNumber, formData } = location.state || {};
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [generatedOtp, setGeneratedOtp] = useState('');
    const hasSentInitialOtp = useRef(false);

    // API configuration
    const API_ENDPOINT = 'https://o-papim-lb01.ooredoo.mv/bulk_sms/v2';
    const BEARER_TOKEN = 'eyJ4NXQiOiJNV0l5TkRJNVlqRTJaV1kxT0RNd01XSTNOR1ptTVRZeU5UTTJOVFZoWlRnMU5UTTNaVE5oTldKbVpERTFPVEE0TldFMVlUaGxNak5sTldFellqSXlZUSIsImtpZCI6Ik1XSXlOREk1WWpFMlpXWTFPRE13TVdJM05HWm1NVFl5TlRNMk5UVmhaVGcxTlRNM1pUTmhOV0ptWkRFMU9UQTROV0UxWVRobE1qTmxOV0V6WWpJeVlRX1JTMjU2IiwidHlwIjoiYXQrand0IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJjMjU3NmVhMC1jZTQ5LTRjNTktYTg2Ni00MmYzZDNhZGEyNGMiLCJhdXQiOiJBUFBMSUNBVElPTiIsImF1ZCI6IkFnVnhuenNlcFNuNl9hVzFXekVRdTZfT2Y1WWEiLCJuYmYiOjE3MTA0MTU1NDEsImF6cCI6IkFnVnhuenNlcFNuNl9hVzFXekVRdTZfT2Y1WWEiLCJpc3MiOiJodHRwczpcL1wvbG9jYWxob3N0Ojk0NDNcL29hdXRoMlwvdG9rZW4iLCJleHAiOjI3MTA0MTU1NDAsImlhdCI6MTcxMDQxNTU0MSwianRpIjoiMDFjZDg3YTMtMDQ3Ni00NGMyLWEwMzAtYjVlNDc1MDExNDNkIiwiY2xpZW50X2lkIjoiQWdWeG56c2VwU242X2FXMVd6RVF1Nl9PZjVZYSJ9.Yji06itjB8vCLsh5QgIRG06PgBq6QNDrodaFQaCggASvea6uLc1QGwk_Uf-IOOmguhRuBxtcLMM8u_C9vJOrILnmOUktVCEVVw6oWMiadP6QbPbaBiEqW_R11pf1sGCS-DQzRPCH7MMpGu8KHNDBFEKQE5VMinU70kg76szcSj2AlEfuoB296xZ2l-pXSt-_oa7HzvYM2UkAEBD3zSr7vOlz4yJSSJz_az5sGCWhgwB_scF4Qpl3pZI2rwFJIM8yart22VYCX7RqpNJ3QjhK56i7MoChNXJw8godun-9Xf6QT0iqBiqbmN9U2ajPs2BSEElr1XVqNhyTukHtAYkdPw';
    const ACCESS_KEY = 'eGRWT2w1cmtTT1loWUZzL09mQlY2SXpES1VTZjhnWGJrdkhFWEs0eTZaeGRxZlBvdFVXWmFWdVV2UnJNMkpOUA==';

    useEffect(() => {
        if (timer > 0) {
            const countdown = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(countdown);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    const handleOtpChange = (e, index) => {
        const value = e.target.value.replace(/\D/g, '');
        
        if (e.key === 'Backspace' && !value && index > 0) {
            // Handle backspace when input is empty
            const newOtp = [...otp];
            newOtp[index] = '';
            setOtp(newOtp);
            document.getElementById(`otp-${index - 1}`).focus();
            return;
        }

        if (value.length <= 1) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (value && index < 5) {
                document.getElementById(`otp-${index + 1}`).focus();
            };
            
        }
    };

    const handleVerify = () => {
        const otpValue = otp.join('');

        if (otpValue.length !== 6) {
            setError('Please enter a 6-digit OTP');
            return;
        }

        if (otpValue === generatedOtp) {
            navigate('/registration-plan', {
                state: {
                    formData: formData
                }
            });
        } else {
            setError('Invalid OTP. Please try again.');
        }
    };

    const sendOtp = async (phoneNumber) => {
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(newOtp);

        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${BEARER_TOKEN}`,
                    'User-Agent': 'insomnia/8.3.0',
                },
                body: JSON.stringify({
                    username: 'sms@medianet.mv',
                    access_key: ACCESS_KEY,
                    message: `Your OTP is: ${newOtp}`,
                    batch: phoneNumber
                })
            });

            if (!response.ok) {
                throw new Error('Failed to send OTP');
            }

            const data = await response.json();
            setError('');
        } catch (err) {
            console.error('Error sending OTP:', err);
            setError('Failed to send OTP. Please try again.');
            setGeneratedOtp('');
        }
    };

    const handleResend = () => {
        if (canResend) {
            sendOtp(phoneNumber);
            setTimer(60);
            setCanResend(false);
            setOtp(['', '', '', '', '', '']);
            setError('');
        }
    };

    useEffect(() => {
        if (phoneNumber && !hasSentInitialOtp.current) {
            hasSentInitialOtp.current = true;
            sendOtp(phoneNumber);
        }
    }, [phoneNumber]);

    return (
        <div className="container-otp">
            <div className="logo">
                <img src={logoImage} alt="Medianet Logo" className="logo-image" />
            </div>

            <h1 className="title">Enter OTP</h1>
            <p className="subtitle">
                We've sent a 6-digit code to {phoneNumber || 'your phone number'}
            </p>

            {error && <span className="error-otp">{error}</span>}

            <div className="otp-container">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(e, index)}
                        onKeyDown={(e) => handleOtpChange(e, index)}
                        className="otp-input"
                    />
                ))}
            </div>

            <p className="resend">
                Didn't receive the code?{' '}
                <span
                    className={`resend-link ${!canResend ? 'disabled' : ''}`}
                    onClick={handleResend}
                >
                    {canResend ? 'Resend OTP' : `Resend OTP (${timer}s)`}
                </span>
            </p>

            <button
                className="submit-button"
                onClick={handleVerify}
            >
                Verify OTP
            </button>
        </div>
    );
};

const styles = `
  .container-otp {
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
    max-width: 200px;
    padding: 0 10px;
    z-index: 1;
  }

  .logo-image {
    width: 100%;
    height: auto;
    display: block;
    object-fit: contain;
    max-height: 80px;
  }

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
    margin-bottom: 1rem;
    text-align: center;
  }

  .subtitle {
    font-size: clamp(14px, 2.5vw, 16px);
    color: #ccc;
    text-align: center;
    margin-bottom: 1rem;
  }

  .otp-container {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    justify-content: center;
  }

  .otp-input {
    width: 50px;
    height: 50px;
    padding: 10px;
    background-color: #3A4445;
    border: 2px solid transparent;
    border-radius: 8px;
    color: #fff;
    font-size: 20px;
    text-align: center;
    outline: none;
    transition: all 0.3s ease;
  }

  .otp-input:focus {
    border-color: #FFD700;
    background-color: #4A5556;
  }

  .error-otp {
    color: #ff4444;
    font-size: clamp(12px, 2vw, 14px);
    margin-bottom: 1rem;
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
    width: 200px;
  }

  .submit-button:hover {
    background-color: #E6C200;
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(255, 215, 0, 0.5);
  }

  .resend {
    margin-bottom: 20px;
    font-size: clamp(12px, 2vw, 14px);
    color: #ccc;
  }

  .resend-link {
    color: #FFD700;
    cursor: pointer;
    text-decoration: underline;
  }

  .resend-link:not(.disabled):hover {
    color: #E6C200;
  }

  .resend-link.disabled {
    color: #666;
    cursor: not-allowed;
    text-decoration: none;
  }

  @media (max-width: 480px) {
    .otp-input {
      width: 40px;
      height: 40px;
    }
    .submit-button {
      width: 150px;
    }
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default RegistrationOtp;