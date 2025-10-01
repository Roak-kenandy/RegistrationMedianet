'use client';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../assests/medianet-app-image.png';
import mobileImage from '../assests/medianet-mobile.webp';
import tvImage from '../assests/medianet-tv.webp';
import '../styles/RegistrationCategory.css';

const RegistrationCategory = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [tvOn, setTvOn] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    // Turn on TV after mobile animation
    const tvTimer = setTimeout(() => {
      setTvOn(true);
    }, 1200);

    return () => {
      clearTimeout(timer);
      clearTimeout(tvTimer);
    };
  }, []);

  return (
    <div className="category-container">
      <div className="logo-header">
        <img src={logoImage} alt="Medianet Logo" className="logo-image" />
      </div>
      <h1 className="entertainment-header">Select . Stream. Enjoy.</h1>
      
      <div className="devices-container">
        {/* Mobile Device Card */}
        <div className="device-card">
          <img src={mobileImage} alt="Mobile Streaming" className={`device-image mobile-image ${isLoaded ? 'mobile-slide-in' : ''}`} />
          <div className="device-info">
            <h2 className="device-title">Stream on your phone</h2>
            <p className="device-subtitle">anytime, anywhere!</p>
            <button className="btn-3d mobile-btn" onClick={() => navigate('/registration-medianet')}>
              Continue on Mobile
            </button>
          </div>
        </div>

        {/* TV Device Card */}
        <div className="device-card">
          <div className="tv-image-wrapper">
            <img src={tvImage} alt="TV Streaming" className={`device-image tv-image ${tvOn ? 'tv-flash-animation' : ''}`} />
            <div className={`tv-flash-overlay ${tvOn ? 'flash-active' : ''}`}></div>
          </div>
          <div className="device-info">
            <h2 className="device-title">Enjoy on your big screen</h2>
            <p className="device-subtitle">at home comfort!</p>
            <button className="btn-3d tv-btn" onClick={() => navigate('/registration-device')}>
              Continue on TV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationCategory;