'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { smsService } from '../services/smsService';
import logoImage from '../assests/medianet-app-image.jpg';
import '../styles/RegistrationOtp.css';

const RegistrationOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { phoneNumber, formData } = location.state || {};
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60); // Resend timer
  const [otpExpirationTimer, setOtpExpirationTimer] = useState(60); // OTP validity timer
  const [canResend, setCanResend] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isOtpExpired, setIsOtpExpired] = useState(false);
  const hasSentInitialOtp = useRef(false);
  const inputRefs = useRef([]);

    // Check if required data is available
    useEffect(() => {
      if (!phoneNumber || !formData) {
        // If no phone number or form data, redirect to registration-medianet
        navigate('/registration-medianet', { replace: true });
      }
    }, [phoneNumber, formData, navigate]);

  // Resend countdown timer
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

  // OTP expiration timer
  useEffect(() => {
    if (otpExpirationTimer > 0 && generatedOtp) {
      const expirationCountdown = setInterval(() => {
        setOtpExpirationTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(expirationCountdown);
    } else if (otpExpirationTimer === 0) {
      setIsOtpExpired(true);
      setError('OTP has expired. Please request a new one.');
    }
  }, [otpExpirationTimer, generatedOtp]);

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    
    if (pastedData.length === 6) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      inputRefs.current[5].focus();
      
      if (!isOtpExpired && pastedData === generatedOtp) {
        navigate('/registration-plan', { state: { formData } });
      }
    }
  };

  const handleKeyDown = (e, index) => {
    switch (e.key) {
      case 'Backspace':
        e.preventDefault();
        const newOtp = [...otp];
        if (otp[index]) {
          newOtp[index] = '';
          setOtp(newOtp);
        } else if (index > 0) {
          newOtp[index - 1] = '';
          setOtp(newOtp);
          inputRefs.current[index - 1].focus();
        }
        break;

      case 'ArrowLeft':
        e.preventDefault();
        if (index > 0) {
          inputRefs.current[index - 1].focus();
        }
        break;

      case 'ArrowRight':
        e.preventDefault();
        if (index < 5) {
          inputRefs.current[index + 1].focus();
        }
        break;

      default:
        break;
    }
  };

  const handleVerify = () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter a 6-digit OTP');
      return;
    }

    if (isOtpExpired) {
      setError('OTP has expired. Please request a new one.');
      return;
    }

    if (otpValue === generatedOtp) {
      navigate('/registration-plan', { state: { formData } });
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  const sendOtp = async (phoneNumber) => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    logToServer('Generated OTP: ' + newOtp);
    setGeneratedOtp(newOtp);
    setIsOtpExpired(false);
    setOtpExpirationTimer(60); // Reset expiration timer to 60 seconds

    try {
      logToServer('Sending OTP to: ' + phoneNumber);
      const message = `Your OTP is: ${newOtp}`;
      await smsService.sendOtp(phoneNumber, message);
      setError('');
    } catch (err) {
      logToServer('error sending OTP: ' + err);
      console.error('Error sending OTP:', err);
      setError('Failed to send OTP. Please try again.');
      setGeneratedOtp('');
      setIsOtpExpired(true);
    }
  };

  const logToServer = async (message) => {
    try {
      await fetch('https://mtvdev.medianet.mv/api/v1/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          message: message,
        }),
      });
    } catch (err) {
      console.error('Failed to send log to server:', err);
    }
  };

  const handleResend = () => {
    if (canResend) {
      sendOtp(phoneNumber);
      setTimer(60); // Reset resend timer
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
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleOtpChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={index === 0 ? handlePaste : undefined}
            className="otp-input"
            disabled={isOtpExpired} // Disable inputs when OTP is expired
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
        disabled={isOtpExpired} // Disable verify button when OTP is expired
      >
        Verify OTP
      </button>
    </div>
  );
};

export default RegistrationOtp;