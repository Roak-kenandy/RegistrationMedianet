export const COUNTRY_DATA = [
    { name: 'Maldives', code: 'MDV', phoneCode: '+960', flag: '🇲🇻', phoneLength: 7 },
  ];
  
  export const API_CONFIG = {
    BASE_URL: process.env.REACT_APP_API_URL,
    API_KEY: process.env.REACT_APP_API_KEY,
    LOCAL_URL: 'http://localhost:3004',
  };
  
  export const SMS_CONFIG = {
    BASE_URL: process.env.REACT_APP_SMS_URL,
    BEARER_TOKEN: process.env.REACT_APP_SMS_BEARER_TOKEN,
    ACCESS_KEY: process.env.REACT_APP_SMS_ACCESS_KEY,
    USERNAME: 'sms@medianet.mv',
  };