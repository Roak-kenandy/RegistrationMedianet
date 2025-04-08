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
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const hasSentInitialOtp = useRef(false);

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
      }
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
        state: { formData }
      });
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  const sendOtp = async (phoneNumber) => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated OTP:', newOtp);
    logToServer('Generated OTP: ' + newOtp);
    setGeneratedOtp(newOtp);

    try {
    logToServer('Sending OTP to: ' + phoneNumber);
      await smsService.sendOtp(phoneNumber, newOtp);
      console.log('OTP sent successfully');
      setError('');
    } catch (err) {
      logToServer('error sending OTP: ' + err);
      console.log('Error sending OTP:', err);
      console.error('Error sending OTP:', err);
      setError('Failed to send OTP. Please try again.');
      setGeneratedOtp('');
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
      <button className="submit-button" onClick={handleVerify}>
        Verify OTP
      </button>
    </div>
  );
};

export default RegistrationOtp;