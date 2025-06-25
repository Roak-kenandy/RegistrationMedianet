import { API_CONFIG } from '../config/constants';

const apiHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'api_key': API_CONFIG.API_KEY,
};

const mtvHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

const MTV_BASE_URL = 'https://mtvdev.medianet.mv/api/v1';
// const MTV_BASE_URL = 'http://localhost:3004/api/v1';

export const registrationKycService = {
  async registerContact(formData) {
    console.log('Registering contact with formData:', formData);
    try {
      const payload = {
        type: 'PERSON',
        person_name: {
          first_name: formData.firstName,
          last_name: formData.lastName,
        },
        phone: {
          country_code: 'MDV',
          number: formData.phoneNumber,
          type: 'MOBILE',
        },
        address: {
          type: formData.addressType.toUpperCase(),
          name: "",
          is_primary: true,
          name: formData.fullAddress,
          address_line_1: formData.road,
          address_line_2: formData.ward,
          town_city: formData.city,
          postal_code: "",
          country_code: "MDV",
      },
      };

      const response = await fetch(`${MTV_BASE_URL}/tvContacts`, {
        method: 'POST',
        headers: mtvHeaders,
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(`API error: ${result?.error || 'Unknown error'}`);
      }
      return result.id;
    } catch (error) {
      console.error('Error creating virtual device:', error);
      throw error;
    }
  },

  async createVirtualDevice(contactId) {
    try {
      const response = await fetch(`${MTV_BASE_URL}/tvDevices`, {
        method: 'POST',
        headers: mtvHeaders,
        body: JSON.stringify({ contact_id: contactId }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(`API error: ${result?.error || 'Unknown error'}`);
      }
      return true;
    } catch (error) {
      console.error('Error creating virtual device:', error);
      throw error;
    }
  },

  async createAccount(contactId) {
    try {
      const response = await fetch(`${MTV_BASE_URL}/tvAccounts`, {
        method: 'POST',
        headers: mtvHeaders,
        body: JSON.stringify({ contact_id: contactId }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(`API error: ${result?.error || 'Unknown error'}`);
      }
      return true;
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  },

  async getSubscriptionContacts(contactId) {
    try {
      const response = await fetch(`${MTV_BASE_URL}/getSubscriptionContacts/${contactId}`, {
        method: 'GET',
        headers: mtvHeaders,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(`API error: ${result?.error || 'Unknown error'}`);
      }
      return result;
    } catch (error) {
      console.error('Error fetching subscription contacts:', error);
      throw error;
    }
  },

  async getSubDeviceCode(subScriptionId) {
    try {
      const response = await fetch(`${MTV_BASE_URL}/getSubDeviceCode/${subScriptionId}`, {
        method: 'GET',
        headers: mtvHeaders,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(`API error: ${result?.error || 'Unknown error'}`);
      }
      return result;
    } catch (error) {
      console.error('Error fetching subscription contacts:', error);
      throw error;
    }
  },

  async postMtvUser(formData) {
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        countryCode: 'MDV',
        referralCode: formData.referralCode,
        referralType: formData.referralType,
        registerType: 'TV'
      };
      const response = await fetch(`${MTV_BASE_URL}/mtvusers`, {
        method: 'POST',
        headers: mtvHeaders,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await response.json();
      return true;
    } catch (error) {
      console.error('Error posting MTV user:', error);
      throw error;
    }
  },

  async verifyPhoneNumber(phoneNumber) {
    try {
      const response = await fetch(`${MTV_BASE_URL}/contact-details/${phoneNumber}`, {
        method: 'GET',
        headers: mtvHeaders,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(`API error: ${result?.error || 'Unknown error'}`);
      }
      return result;
    } catch (error) {
      console.error('Error fetching subscription contacts:', error);
      throw error;
    }
  },
};