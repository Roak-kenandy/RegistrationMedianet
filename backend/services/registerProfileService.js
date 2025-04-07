const MtvUsersModel = require('../models/MTVUsers');
const { v4: uuidv4 } = require('uuid');
const { crmRequest, mtvRequest } = require('./apiService');
const { DEFAULT_TAG_ID } = require('../config/apiConfig');
const registerProfile = async (firstName, lastName,phoneNumber,countryCode,referralCode, referralType) => {
    try {

        const newUser = new MtvUsersModel({
            firstName, lastName,phoneNumber,countryCode,referralCode,referralType
        });

        await newUser.save();
        return { message: 'User registered successfully', user: newUser };
    } catch (error) {
        throw new Error(error.message);
    }
};

const registerContact = async (payload) => {
    const contactData = await crmRequest('contacts', 'POST', payload);
    if (contactData?.id) {
      await crmRequest(`contacts/${contactData.id}/tags`, 'PUT', { tags: [DEFAULT_TAG_ID] });
    }
    return contactData.id;
  };
  
  const registerDevice = async (contactId) => {
    const payload = {
      serial_number: uuidv4(),
      electronic_id: null,
      contact_id: contactId,
      product_id: 'b95d8593-6d36-4a59-8407-b3c284471382',
    };
    return crmRequest('devices', 'POST', payload);
  };
  
  const createAccount = async (contactId) => {
    const payload = {
      classification_id: '2c3ad63b-caf8-4be1-b76c-5b0c0438a28c',
      credit_limit: '',
      currency_code: 'MVR',
      is_primary: false,
      payment_terms_id: '01ec0a1b-0a9d-4bf6-ad88-51c2bdb9edff',
    };
    const accountData = await crmRequest(`contacts/${contactId}/accounts`, 'POST', payload);
    if (accountData.id) {
      await createSubscription(contactId, accountData.id);
    }
    return accountData;
  };
  
  const createSubscription = async (contactId, accountId) => {
    const payload = {
      account_id: accountId,
      scheduled_date: null,
      services: [{
        price_terms_id: '1187c08d-2795-4c8e-84b7-75a31e8e7c9d',
        product_id: 'babe5663-c577-4e85-b30b-06c961232853',
        quantity: 1,
      }],
    };
    return crmRequest(`contacts/${contactId}/services`, 'POST', payload);
  };
  
  const getSubscriptionContacts = async (contactId) => {
    const data = await crmRequest(`contacts/${contactId}/subscriptions`);
    if (data.content?.length) {
      const subscriptionId = data.content[0].id;
      const allowedDevices = await getAllowedDevices(subscriptionId, contactId);
      return { subscription_id: subscriptionId, device_ids: allowedDevices || [] };
    }
    return data;
  };
  
  const getAllowedDevices = async (subscriptionId, contactId) => {
    const data = await crmRequest(`subscriptions/${subscriptionId}/allowed_devices?size=50&page=1&search_value=`);
    if (data.content?.length) {
      const deviceIds = data.content.map(item => ({ device_id: item.device.id }));
      await addSubscriptionDevice(subscriptionId, deviceIds, contactId);
      return deviceIds.map(d => d.device_id);
    }
    return [];
  };
  
  const addSubscriptionDevice = async (subscriptionId, deviceIds, contactId) => {
    const data = await crmRequest(`subscriptions/${subscriptionId}/devices`, 'POST', deviceIds[0]);
    if (data.id) {
      await assignDevices(contactId, deviceIds);
    }
    return data;
  };
  
  const assignDevices = async (contactId, deviceIds) => {
    const servicesData = await crmRequest(`contacts/${contactId}/services`);
    if (servicesData.content?.length) {
      const serviceId = servicesData.content[0].id;
      const updatedDevices = deviceIds.map(device => ({ ...device, action: 'ENABLE' }));
      return crmRequest(`services/${serviceId}/devices`, 'POST', updatedDevices);
    }
  };


module.exports = {
    registerProfile,
    registerProfile,
    registerContact,
    registerDevice,
    createAccount,
    getSubscriptionContacts,
};