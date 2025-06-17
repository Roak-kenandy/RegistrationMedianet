'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../assests/medianet-app-image.jpg';
import '../styles/RegistrationCategory.css';

const RegistrationCategory = () => {
  const navigate = useNavigate();

  const handleMobileClick = () => {
    navigate('/registration-medianet');
  };

  const handleTvClick = () => {
    navigate('/registration-device');
  };

  return (
    <div className="category-container">
      <div className="logo">
        <img src={logoImage} alt="Medianet Logo" className="logo-image" />
      </div>
      <div className="content-wrapper">
        <h1 className="title">
          How do you want to <span className="highlight">Entertain</span>?
        </h1>
        <div className="category-list">
          <div className="category-item mobile-device" onClick={handleMobileClick}>
            <div className="device-notch"></div>
            <div className="category-content">
              <div className="device-screen">
                <h2 className="category-title">Mobile</h2>
                <p className="category-description">Stream on your phone anytime, anywhere</p>
                <div className="category-icon">📱</div>
              </div>
              <div className="device-home-bar"></div>
            </div>
          </div>
          
          <div className="category-item tv-device" onClick={handleTvClick}>
            <div className="category-content">
              <div className="device-screen">
                <h2 className="category-title">TV</h2>
                <p className="category-description">Enjoy on your big screen at home</p>
                <div className="category-icon">📺</div>
              </div>
              <div className="device-stand"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationCategory;