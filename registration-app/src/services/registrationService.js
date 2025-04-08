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

export const registrationService = {
  async registerContact(formData) {
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
      };

      const response = await fetch(`https://mtvdev.medianet.mv/api/v1/contacts`, {
        method: 'POST',
        headers: mtvHeaders,
        body: JSON.stringify(payload),
      });

      console.log('Payload:', payload);

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

//   async registerTag(contactId) {
//     try {
//       const tags = ['0c0d20c2-08e1-4483-bcbe-638608fedaba'];
//       const response = await fetch(`${API_CONFIG.LOCAL_URL}/backoffice/v2/contacts/${contactId}/tags`, {
//         method: 'PUT',
//         headers: apiHeaders,
//         body: JSON.stringify({ tags }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       return true;
//     } catch (error) {
//       console.error('Error registering tag:', error);
//       throw error;
//     }
//   },

  async createVirtualDevice(contactId) {
    try {
      const response = await fetch('https://mtvdev.medianet.mv/api/v1/devices', {
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
      const response = await fetch('https://mtvdev.medianet.mv/api/v1/accounts', {
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
      const response = await fetch(`https://mtvdev.medianet.mv/api/v1/getSubscriptionContacts/${contactId}`, {
        method: 'GET',
        headers: mtvHeaders,
      });

      const result = await response.json();
      console.log('Subscription Contacts:', result);
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
      const response = await fetch(`https://mtvdev.medianet.mv/api/v1/getSubDeviceCode/${subScriptionId}`, {
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
      };
      const response = await fetch('https://mtvdev.medianet.mv/api/v1/mtvusers', {
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
};