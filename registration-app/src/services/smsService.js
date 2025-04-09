import { SMS_CONFIG } from '../config/constants';
import { MTV_CONFIG } from '../config/constants';

const smsHeaders = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${SMS_CONFIG.BEARER_TOKEN}`,
  'User-Agent': 'insomnia/8.3.0',
};

// export const smsService = {
//   async sendOtp(phoneNumber, otp) {
//     if (!SMS_CONFIG.BASE_URL) {
//         console.error('SMS_CONFIG.BASE_URL is undefined!');
//         throw new Error('SMS_CONFIG.BASE_URL is not defined');
//       }

//     console.log('Sending OTP Request:');
//     console.log('URL:', SMS_CONFIG.BASE_URL);
//     console.log('Headers:', smsHeaders);
//     console.log('Body:', {
//       username: SMS_CONFIG.USERNAME,
//       access_key: SMS_CONFIG.ACCESS_KEY,
//       message: `Your OTP is: ${otp}`,
//       batch: phoneNumber,
//     });
//     try {
//       const response = await fetch(SMS_CONFIG.BASE_URL, {
//         method: 'POST',
//         headers: smsHeaders,
//         body: JSON.stringify({
//           username: SMS_CONFIG.USERNAME,
//           access_key: SMS_CONFIG.ACCESS_KEY,
//           message: `Your OTP is: ${otp}`,
//           batch: phoneNumber,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to send OTP');
//       }

//       return await response.json();
//     } catch (error) {
//       throw new Error(`SMS Service Error: ${error.message}`);
//     }
//   },
// };


export const smsService = {
    async sendOtp(phoneNumber, message) {
        //${MTV_CONFIG.BASE_URL}
      try {
        const response = await fetch(`${MTV_CONFIG.BASE_URL}/sendOtp`, {
          method: 'POST',
          headers: MTV_CONFIG.HEADERS,
          body: JSON.stringify({
            username: SMS_CONFIG.USERNAME,
            message: message,
            batch: phoneNumber,
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to send OTP');
        }
  
        return await response.json();
      } catch (error) {
        throw new Error(`SMS Service Error: ${error.message}`);
      }
    },
  };