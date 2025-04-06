import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logoImage from '../assests/medianet-app-image.jpg';

const Success = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState(location.state?.formData || {});

    useEffect(() => {
        if (location.state?.formData) {
            setFormData(location.state.formData);
        }
    }, [location.state]);


    const plans = [
        {
            name: 'Free Trial',
            duration: '10 Days',
            price: 'Free',
            description: 'Try our service for 10 days at no cost',
            features: ['Full access to content', 'No commitment', 'Cancel anytime'],
            selectButton: 'Select Plan'
        },
        {
            name: 'Standard Package',
            duration: 'Monthly',
            price: '$9.99',
            description: 'Our standard monthly subscription',
            features: ['Unlimited streaming', 'HD quality', 'Multi-device support'],
            selectButton: 'Subscription'
        },
    ];

    const handlePlanSelect = (planName) => {
        navigate('/registration-confirmation', { state: { selectedPlan: planName, formData: formData } });
    };

    return (
        <div className="container-plan">
            {/* <div className="logo">
                <span className="highlight">M</span> tv
            </div> */}
            <div className="logo">
                <img src={logoImage} alt="Medianet Logo" className="logo-image" />
            </div>

            <h1 className="title">Select Your Plan</h1>
            <p className="subtitle">Choose a plan that suits you best</p>

            <div className="plans-container">
                {plans.map((plan, index) => (
                    <div key={index} className="plan-card">
                        <h2 className="plan-name">{plan.name}</h2>
                        <p className="plan-duration">{plan.duration}</p>
                        <p className="plan-price">{plan.price}</p>
                        <p className="plan-description">{plan.description}</p>
                        <ul className="plan-features">
                            {plan.features.map((feature, idx) => (
                                <li key={idx}>{feature}</li>
                            ))}
                        </ul>
                        <button
                            className="select-button"
                            onClick={() => {
                                if (plan.selectButton === "Subscription") {
                                    window.open("https://my.medianet.mv/", "_blank"); // Opens in a new tab
                                } else {
                                    handlePlanSelect(plan.name); // Existing function for other cases
                                }
                            }}
                        >
                            {plan.selectButton}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .container-plan {
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

  .plans-container {
    display: flex;
    flex-wrap: wrap;
    gap: clamp(15px, 2vw, 30px);
    justify-content: center;
    width: 100%;
    max-width: 1200px;
    animation: fadeIn 1.4s ease-in-out;
  }

  .plan-card {
    background-color: #3A4445;
    border-radius: 12px;
    padding: clamp(15px, 3vw, 25px);
    width: 100%;
    max-width: clamp(250px, 40vw, 350px);
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: all 0.3s ease;
  }

  .plan-card:hover {
    transform: scale(1.03);
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

  .plan-features {
    list-style: none;
    margin-bottom: clamp(15px, 3vw, 20px);
    text-align: center;
    padding: 0 clamp(5px, 1vw, 10px);
  }

  .plan-features li {
    font-size: clamp(11px, 2vw, 14px);
    color: #fff;
    margin: clamp(3px, 0.5vw, 5px) 0;
  }

  .select-button {
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
  }

  .select-button:hover {
    background-color: #E6C200;
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Mobile Devices (up to 480px) */
  @media (max-width: 480px) {
    .plans-container {
      flex-direction: column;
      align-items: center;
      gap: 15px;
    }
    .plan-card {
      max-width: 100%;
      padding: 15px;
    }
    .select-button {
      width: 120px;
    }
    .title {
      font-size: 24px;
    }
    .subtitle {
      font-size: 14px;
    }
  }

  /* Tablets (481px - 768px) */
  @media (min-width: 481px) and (max-width: 768px) {
    .plans-container {
      gap: 20px;
    }
    .plan-card {
      max-width: 45%;
      padding: 20px;
    }
    .select-button {
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
    .plans-container {
      gap: 25px;
    }
    .plan-card {
      max-width: 45%;
      padding: 20px;
    }
    .select-button {
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
    .plans-container {
      gap: 30px;
    }
    .plan-card {
      max-width: 350px;
      padding: 25px;
    }
    .select-button {
      width: 150px;
    }
    .title {
      font-size: 40px;
    }
    .subtitle {
      font-size: 18px;
    }
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Success;