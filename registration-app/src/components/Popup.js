import React from 'react';
import '../styles/RegistrationMedianet.css';

const Popup = ({ message, onClose }) => (
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

export default Popup;