const registerProfileService = require('../services/registerProfileService');
const { v4: uuidv4 } = require('uuid');
const fetch = require('node-fetch');
const fs = require('fs');
const API_KEY = process.env.CRM_API_KEY;

const crmHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'api_key': API_KEY,
}

const smsHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.REACT_APP_SMS_BEARER_TOKEN}`,
    'User-Agent': 'insomnia/8.3.0',
};

const CRM_BASE_URL = process.env.CRM_BASE_URL;
const DEFAULT_TAG_ID = process.env.DEFAULT_TAG_ID;
const MEDIANET_TAG_ID = process.env.MEDIANET_TAG_ID;
const DEVICE_PRODUCT_ID = process.env.DEVICE_PRODUCT_ID;
const TV_APP_DEVICE_ID = process.env.TV_APP_DEVICE_ID;
const CLASSIFICATION_ID = process.env.CLASSIFICATION_ID;
const CURRENCY_CODE = process.env.CURRENCY_CODE;
const PAYMENT_TERMS_ID = process.env.PAYMENT_TERMS_ID;
const PRICE_TERMS_ID = process.env.PRICE_TERMS_ID;
const SERVICE_PRODUCT_ID = process.env.SERVICE_PRODUCT_ID;
const TV_PRICE_TERMS_ID = process.env.TV_PRICE_TERMS_ID;;
const TV_SERVICE_PRODUCT_ID = process.env.TV_SERVICE_PRODUCT_ID;

/**
 * Registers a new user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const postRegisterProfile = async (req, res) => {
    try {
        const { firstName, lastName, phoneNumber, countryCode, referralCode, referralType, registerType } = req.body;

        if (!firstName || !lastName || !phoneNumber || !countryCode) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        const result = await registerProfileService.registerProfile(
            firstName,
            lastName,
            phoneNumber,
            countryCode,
            referralCode,
            referralType,
            registerType
        );

        return res.status(201).json({
            message: 'Profile registered successfully',
            data: result
        });
    } catch (error) {
        console.error('Error registering profile:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Registers a device to the CRM system
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */

const handleResponse = async (response, context) => {
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`${context} failed: ${error}`);
    }
    return response.json();
};

const registerContactTag = async (contactId, tags = [DEFAULT_TAG_ID]) => {
    try {
        const response = await fetch(`${CRM_BASE_URL}/contacts/${contactId}/tags`, {
            method: 'PUT',
            headers: crmHeaders,
            body: JSON.stringify({ tags }),
        });

        return handleResponse(response, `Tag registration for contact ${contactId}`);
    } catch (error) {
        console.error(`Tag registration error for contact ${contactId}:`, error);
        throw error;
    }
};

const registerTVContactTag = async (contactId, tags = [MEDIANET_TAG_ID]) => {
    try {
        const response = await fetch(`${CRM_BASE_URL}/contacts/${contactId}/tags`, {
            method: 'PUT',
            headers: crmHeaders,
            body: JSON.stringify({ tags }),
        });

        return handleResponse(response, `Tag registration for contact ${contactId}`);
    } catch (error) {
        console.error(`Tag registration error for contact ${contactId}:`, error);
        throw error;
    }
};

const postRegisterContact = async (req, res) => {
    try {
        const payload = req.body;

        // Create contact
        const contactResponse = await fetch(`${CRM_BASE_URL}/contacts`, {
            method: 'POST',
            headers: crmHeaders,
            body: JSON.stringify(payload),
        });

        const contactData = await handleResponse(contactResponse, 'Contact creation');

        // Add default tag
        if (contactData?.id) {
            await registerContactTag(contactData.id);
        }

        return res.status(201).json({
            id: contactData.id
        });

    } catch (error) {
        console.error('Contact registration error:', error);
        const statusCode = error.message.includes('failed') ? 400 : 500;
        return res.status(statusCode).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

const postRegisterTvContact = async (req, res) => {
    try {
        const payload = req.body;

        // Create contact
        const contactResponse = await fetch(`${CRM_BASE_URL}/contacts`, {
            method: 'POST',
            headers: crmHeaders,
            body: JSON.stringify(payload),
        });

        const contactData = await handleResponse(contactResponse, 'Contact creation');

        // Add default tag
        if (contactData?.id) {
            await registerTVContactTag(contactData.id);
        }

        return res.status(201).json({
            id: contactData.id
        });

    } catch (error) {
        console.error('Contact registration error:', error);
        const statusCode = error.message.includes('failed') ? 400 : 500;
        return res.status(statusCode).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

/**
 * Registers a device to the CRM system
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const postDeviceToCRM = async (req, res) => {
    const { contact_id } = req.body;

    const payload = {
        serial_number: uuidv4(),
        electronic_id: null,
        contact_id,
        product_id: DEVICE_PRODUCT_ID,
    };

    try {
        const response = await fetch(`${CRM_BASE_URL}/devices`, {
            method: 'POST',
            headers: crmHeaders,
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: data });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error('Error posting device to CRM:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Registers a device to the CRM system
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const postTvDeviceToCRM = async (req, res) => {
    const { contact_id } = req.body;

    const payload = {
        serial_number: uuidv4(),
        electronic_id: null,
        contact_id,
        product_id: TV_APP_DEVICE_ID,
    };

    try {
        const response = await fetch(`${CRM_BASE_URL}/devices`, {
            method: 'POST',
            headers: crmHeaders,
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: data });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error('Error posting device to CRM:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Creates a new account for a contact
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const postAccount = async (req, res) => {
    const { contact_id } = req.body;

    const payload = {
        classification_id: CLASSIFICATION_ID,
        credit_limit: '',
        currency_code: CURRENCY_CODE,
        is_primary: false,
        payment_terms_id: PAYMENT_TERMS_ID,
    };

    try {
        const response = await fetch(`${CRM_BASE_URL}/contacts/${contact_id}/accounts`, {
            method: 'POST',
            headers: crmHeaders,
            body: JSON.stringify(payload),
        });

        const data = await response.json()

        if (data.id) {
            await postSubscription(contact_id, data.id);
        }

        if (!response.ok) {
            return res.status(response.status).json({ error: data });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error('Error creating account in CRM:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Creates a new account for a contact
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const postTvAccount = async (req, res) => {
    const { contact_id } = req.body;

    const payload = {
        classification_id: CLASSIFICATION_ID,
        credit_limit: '',
        currency_code: CURRENCY_CODE,
        is_primary: false,
        payment_terms_id: PAYMENT_TERMS_ID,
    };

    try {
        const response = await fetch(`${CRM_BASE_URL}/contacts/${contact_id}/accounts`, {
            method: 'POST',
            headers: crmHeaders,
            body: JSON.stringify(payload),
        });

        const data = await response.json()

        if (data.id) {
            await postTvSubscription(contact_id, data.id);
        }

        if (!response.ok) {
            return res.status(response.status).json({ error: data });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error('Error creating account in CRM:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Creates a subscription for a contact
 * @param {string} contactId - Contact identifier
 * @param {string} accountId - Account identifier
 * @returns {Promise<void>}
 */
const postSubscription = async (contactId, accountId) => {

    const payload = {
        account_id: accountId,
        scheduled_date: null,
        services: [{
            price_terms_id: PRICE_TERMS_ID,
            product_id: SERVICE_PRODUCT_ID,
            quantity: 1,
        }],
    };

    try {
        const response = await fetch(`${CRM_BASE_URL}/contacts/${contactId}/services`, {
            method: 'POST',
            headers: crmHeaders,
            body: JSON.stringify(payload),
        });

        await response.json();
    } catch (error) {
        console.log(error, 'error getting response')
        console.error('Error creating subscription in CRM:', error);
    }
};

/**
 * Creates a subscription for a contact
 * @param {string} contactId - Contact identifier
 * @param {string} accountId - Account identifier
 * @returns {Promise<void>}
 */
const postTvSubscription = async (contactId, accountId) => {

    const payload = {
        account_id: accountId,
        scheduled_date: null,
        services: [{
            price_terms_id: TV_PRICE_TERMS_ID,
            product_id: TV_SERVICE_PRODUCT_ID,
            quantity: 1,
        }],
    };

    try {
        const response = await fetch(`${CRM_BASE_URL}/contacts/${contactId}/services`, {
            method: 'POST',
            headers: crmHeaders,
            body: JSON.stringify(payload),
        });

        await response.json();
    } catch (error) {
        console.log(error, 'error getting response')
        console.error('Error creating subscription in CRM:', error);
    }
};

const getSubscriptionContacts = async (req, res) => {
    const { contact_id } = req.params;

    try {
        const response = await fetch(`${CRM_BASE_URL}/contacts/${contact_id}/subscriptions`, {
            method: 'GET',
            headers: crmHeaders,
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: data });
        }

        if (data.content?.length) {
            const allowedDevicesData = await getAllowedDevices(data.content[0].id, contact_id);
            return res.status(200).json({
                subscription_id: data.content[0].id,
                device_ids: allowedDevicesData.deviceIds || [],
                custom_fields: allowedDevicesData.customFields || null,
            });
        }

        return res.status(200).json({ subscription_id: null, device_ids: [], custom_fields: null });
    } catch (error) {
        console.error('Error fetching subscription from CRM:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Retrieves allowed devices for a subscription
 * @param {string} subscriptionId - Subscription identifier
 * @param {string} contactId - Contact identifier
 * @returns {Promise<Object|null>}
 */
const getAllowedDevices = async (subscriptionId, contactId) => {

    try {
        const response = await fetch(
            `${CRM_BASE_URL}/subscriptions/${subscriptionId}/allowed_devices?size=50&page=1&search_value=`,
            {
                method: 'GET',
                headers: crmHeaders,
            }
        );

        const data = await response.json();

        if (data.content?.length) {
            const deviceIds = data.content.map(item => ({ device_id: item.device.id }));
            const assignedDevicesData = await postAddSubscriptionDevice(subscriptionId, deviceIds, contactId);
            return {
                deviceIds: assignedDevicesData.deviceIds || [],
                customFields: assignedDevicesData.customFields || null,
            };
        }

        return { deviceIds: [], customFields: null };
    } catch (error) {
        console.error('Error fetching allowed devices from CRM:', error);
        return null;
    }
};

/**
 * Adds devices to a subscription
 * @param {string} subscriptionId - Subscription identifier
 * @param {Array} deviceIds - Array of device identifiers
 * @param {string} contactId - Contact identifier
 * @returns {Promise<Object>}
 */
const postAddSubscriptionDevice = async (subscriptionId, deviceIds, contactId) => {

    try {
        const response = await fetch(`${CRM_BASE_URL}/subscriptions/${subscriptionId}/devices`, {
            method: 'POST',
            headers: crmHeaders,
            body: JSON.stringify(deviceIds[0]),
        });

        const data = await response.json();

        if (data.id) {
            const assignedDevicesData = await getAssignDevices(contactId, deviceIds, subscriptionId);
            return {
                deviceIds: assignedDevicesData.deviceIds || [],
                customFields: assignedDevicesData.customFields || null, // Pass custom fields
            };
        }

        return { deviceIds: [], customFields: null };
    } catch (error) {
        console.error('Error adding devices to subscription:', error);
        return { deviceIds: [], customFields: null };
    }
};

/**
 * Retrieves services to assign devices
 * @param {string} contactId - Contact identifier
 * @param {Array} deviceIds - Array of device identifiers
 * @param {string} subscriptionId - Subscription identifier
 * @returns {Promise<Object|null>}
 */
const getAssignDevices = async (contactId, deviceIds, subscriptionId) => {

    try {
        const response = await fetch(`${CRM_BASE_URL}/contacts/${contactId}/services`, {
            method: 'GET',
            headers: crmHeaders
        });

        const data = await response.json();
        if (data.content?.length) {
            const assignedDevicesData = await postAssignDevices(data.content[0]?.id, deviceIds, subscriptionId);
            return {
                deviceIds: assignedDevicesData.deviceIds || [],
                customFields: assignedDevicesData.customFields || null, // Pass custom fields
            };
        }

        return { deviceIds: null, customFields: null };
    } catch (error) {
        console.error('Error fetching services for device assignment:', error);
        return { deviceIds: null, customFields: null };
    }
};

/**
 * Assigns devices to a service
 * @param {string} serviceId - Service identifier
 * @param {Array} deviceIds - Array of device identifiers
 * @param {string} subscriptionId - Subscription identifier
 * @returns {Promise<Object>}
 */
const postAssignDevices = async (serviceId, deviceIds, subscriptionId) => {

    try {
        const updatedDevices = deviceIds.map(device => ({
            ...device,
            action: 'ENABLE',
        }));

        const response = await fetch(`${CRM_BASE_URL}/services/${serviceId}/devices`, {
            method: 'POST',
            headers: crmHeaders,
            body: JSON.stringify(updatedDevices),
        });

        const data = await response.json();
        const customFields = await getCustomFields(subscriptionId);

        return {
            deviceIds: data,
            customFields: customFields || null,
        };
    } catch (error) {
        console.error('Error assigning devices to service:', error);
        return { deviceIds: null, customFields: null };
    }
};

/**
 * Retrieves custom fields for a subscription
 * @param {string} subscriptionId - Subscription identifier
 * @returns {Promise<Object|null>}
 */
const getCustomFields = async (subscriptionId) => {

    try {
        const response = await fetch(
            `${CRM_BASE_URL}/subscriptions/${subscriptionId}/devices?include_total=true&include_custom_fields=true&size=5&page=1`,
            {
                method: 'GET',
                headers: crmHeaders
            }
        );

        const data = await response.json();
        return data; // Return the data
    } catch (error) {
        console.error('Error fetching services for device assignment:', error);
        return null;
    }
};

const getSubDeviceCode = async (req, res) => {
    const { subscription_id } = req.params;

    try {
        const response = await fetch(`${CRM_BASE_URL}/subscriptions/${subscription_id}/devices?include_total=true&include_custom_fields=true&size=5&page=1`, {
            method: 'GET',
            headers: crmHeaders
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: data });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching subscription from CRM:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


const logsForMtvUsers = async (req, res) => {
    try {

        const { timestamp, message } = req.body;
        const logEntry = `${timestamp} - ${message}\n`;

        fs.appendFile('/var/log/react-frontend.log', logEntry, (err) => {
            if (err) console.error('Failed to write log:', err);
        });

        res.sendStatus(200);

    }
    catch (error) {
        console.error('Error fetching subscription from CRM:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


const smsService = async (req, res) => {
    const { batch, message } = req.body;

    try {
        const response = await fetch(process.env.REACT_APP_SMS_URL, {
            method: 'POST',
            headers: smsHeaders,
            body: JSON.stringify({
                username: 'sms@medianet.mv',
                access_key: process.env.REACT_APP_SMS_ACCESS_KEY,
                message: message,
                batch: batch,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to send OTP');
        }

        return res.status(200).json({ message: 'OTP sent successfully', data: await response.json() });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Helper function to fetch tags for a given contact ID
const fetchContactTags = async (contactId) => {
    const tagsUrl = `${CRM_BASE_URL}/contacts/${contactId}/tags`;
    const response = await fetch(tagsUrl, {
        method: 'GET',
        headers: crmHeaders
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(`Failed to fetch tags for contact ${contactId}: ${response.status}`);
    }
    return data;
};

// Helper function to fetch subscriptions for a given contact ID
const fetchContactSubscriptions = async (contactId) => {
    const subscriptionsUrl = `${CRM_BASE_URL}/contacts/${contactId}/subscriptions?size=100&page=1&include_terms=true&include_billing_info=true&include_future_info=true`;
    const response = await fetch(subscriptionsUrl, {
        method: 'GET',
        headers: crmHeaders
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(`Failed to fetch subscriptions for contact ${contactId}: ${response.status}`);
    }
    return data;
};

// Helper function to fetch devices for a given subscription ID
const fetchSubscriptionDevices = async (subscriptionId) => {
    const devicesUrl = `${CRM_BASE_URL}/subscriptions/${subscriptionId}/devices?include_total=true&include_custom_fields=true&size=5&page=1`;
    const response = await fetch(devicesUrl, {
        method: 'GET',
        headers: crmHeaders
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(`Failed to fetch devices for subscription ${subscriptionId}: ${response.status}`);
    }
    return data;
};

// Helper function to format timestamp to human-readable date (e.g., "1 Jan 2025")
const formatDate = (timestamp) => {
    if (!timestamp) return null;
    const date = new Date(timestamp * 1000); // Assuming timestamp is in seconds
    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

// Main function to get contact details, filter by "OTT" tag, and return simplified data
const getContactDetails = async (req, res) => {
    // Extract parameters from req.params
    const { phone_number } = req.params;

    try {
        // Construct the query string with the parameters for the first API call
        const queryParams = new URLSearchParams({
            phone_number: phone_number || '',
        }).toString();

        // First API call to get contact details
        const contactsUrl = `${CRM_BASE_URL}/contacts?${queryParams}`;
        const contactsResponse = await fetch(contactsUrl, {
            method: 'GET',
            headers: crmHeaders
        });

        const contactsData = await contactsResponse.json();

        if (!contactsResponse.ok) {
            return res.status(contactsResponse.status).json({ error: contactsData });
        }

        // Check if there is content in the response
        if (contactsData.content && contactsData.content.length > 0) {
            // Array to store simplified subscription and device data
            const subscriptionsWithDetails = [];

            // Loop through each contact and fetch their tags
            for (const contact of contactsData.content) {
                const contactId = contact.id;

                try {
                    const tagsData = await fetchContactTags(contactId);
                    // Check if the tags include "OTT"
                    const hasOTTTag = tagsData.content && tagsData.content.some(tag => tag.name === "OTT");

                    if (hasOTTTag) {
                        // Fetch subscriptions for contacts with "OTT" tag
                        try {
                            const subscriptionsData = await fetchContactSubscriptions(contactId);

                            if (subscriptionsData.content && subscriptionsData.content.length > 0) {
                                for (const subscription of subscriptionsData.content) {
                                    const subscriptionId = subscription.id;

                                    try {
                                        const devicesData = await fetchSubscriptionDevices(subscriptionId);
                                        const deviceValues = devicesData.content.map(device => {
                                            // Extract only the "code" value from custom_fields
                                            const codeField = device.custom_fields.find(field => field.key === "code");
                                            return codeField ? codeField.value : null;
                                        }).filter(value => value !== null); // Remove null values

                                        subscriptionsWithDetails.push({
                                            state: subscription.state,
                                            start_date: formatDate(subscription.first_activation_date),
                                            end_date: formatDate(subscription.billing_info.bill_up_date),
                                            value: deviceValues.length > 0 ? deviceValues[0] : null, // Take first value if exists
                                        });
                                    } catch (error) {
                                        console.error(`Error fetching devices for subscription ${subscriptionId}:`, error);
                                        subscriptionsWithDetails.push({
                                            state: subscription.state,
                                            start_date: formatDate(subscription.first_activation_date),
                                            end_date: formatDate(subscription.billing_info.bill_up_date),
                                            value: null,
                                        });
                                    }
                                }
                            }
                        } catch (error) {
                            console.error(`Error fetching subscriptions for contact ${contactId}:`, error);
                            subscriptionsWithDetails.push({
                                state: null,
                                start_date: null,
                                end_date: null,
                                value: null,
                            });
                        }
                    }
                } catch (error) {
                    console.error(`Error fetching tags for contact ${contactId}:`, error);
                    subscriptionsWithDetails.push({
                        state: null,
                        start_date: null,
                        end_date: null,
                        value: null,
                    });
                }
            }

            // Return simplified data
            if (subscriptionsWithDetails.length > 0) {
                return res.status(200).json(subscriptionsWithDetails); // Return array directly
            } else {
                return res.status(200).json({ message: 'No subscriptions with "OTT" tag found for the given phone number' });
            }
        } else {
            return res.status(200).json({ message: 'No contacts found for the given phone number' });
        }
    } catch (error) {
        console.error('Error fetching data from CRM:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const getTvContactDetails = async (req, res) => {
    // Extract parameters from req.params
    const { phone_number } = req.params;

    try {
        // Construct the query string with the parameters for the first API call
        const queryParams = new URLSearchParams({
            phone_number: phone_number || '',
        }).toString();

        // First API call to get contact details
        const contactsUrl = `${CRM_BASE_URL}/contacts?${queryParams}`;
        const contactsResponse = await fetch(contactsUrl, {
            method: 'GET',
            headers: crmHeaders
        });

        const contactsData = await contactsResponse.json();

        if (!contactsResponse.ok) {
            return res.status(contactsResponse.status).json({ error: contactsData });
        }

        // Check if there is content in the response
        if (contactsData.content && contactsData.content.length > 0) {
            // Array to store simplified subscription and device data
            const subscriptionsWithDetails = [];

            // Loop through each contact and fetch their tags
            for (const contact of contactsData.content) {
                const contactId = contact.id;

                try {
                    const tagsData = await fetchContactTags(contactId);
                    // Check if the tags include "medianetTvTag"
                    const medianetTvTag = tagsData.content && tagsData.content.some(tag => tag.name === "Medianet TV");

                    if (medianetTvTag) {
                        // Fetch subscriptions for contacts with "Medianet TV" tag
                        try {
                            const subscriptionsData = await fetchContactSubscriptions(contactId);

                            if (subscriptionsData.content && subscriptionsData.content.length > 0) {
                                for (const subscription of subscriptionsData.content) {
                                    const subscriptionId = subscription.id;

                                    try {
                                        const devicesData = await fetchSubscriptionDevices(subscriptionId);
                                        const deviceValues = devicesData.content.map(device => {
                                            // Extract only the "code" value from custom_fields
                                            const codeField = device.custom_fields.find(field => field.key === "code");
                                            return codeField ? codeField.value : null;
                                        }).filter(value => value !== null); // Remove null values

                                        subscriptionsWithDetails.push({
                                            state: subscription.state,
                                            start_date: formatDate(subscription.first_activation_date),
                                            end_date: formatDate(subscription.billing_info.bill_up_date),
                                            value: deviceValues.length > 0 ? deviceValues[0] : null, // Take first value if exists
                                        });
                                    } catch (error) {
                                        console.error(`Error fetching devices for subscription ${subscriptionId}:`, error);
                                        subscriptionsWithDetails.push({
                                            state: subscription.state,
                                            start_date: formatDate(subscription.first_activation_date),
                                            end_date: formatDate(subscription.billing_info.bill_up_date),
                                            value: null,
                                        });
                                    }
                                }
                            }
                        } catch (error) {
                            console.error(`Error fetching subscriptions for contact ${contactId}:`, error);
                            subscriptionsWithDetails.push({
                                state: null,
                                start_date: null,
                                end_date: null,
                                value: null,
                            });
                        }
                    }
                } catch (error) {
                    console.error(`Error fetching tags for contact ${contactId}:`, error);
                    subscriptionsWithDetails.push({
                        state: null,
                        start_date: null,
                        end_date: null,
                        value: null,
                    });
                }
            }

            // Return simplified data
            if (subscriptionsWithDetails.length > 0) {
                return res.status(200).json(subscriptionsWithDetails); // Return array directly
            } else {
                return res.status(200).json({ message: 'No subscriptions with "OTT" tag found for the given phone number' });
            }
        } else {
            return res.status(200).json({ message: 'No contacts found for the given phone number' });
        }
    } catch (error) {
        console.error('Error fetching data from CRM:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    postRegisterProfile,
    postDeviceToCRM,
    postAccount,
    getSubscriptionContacts,
    postRegisterContact,
    getSubDeviceCode,
    logsForMtvUsers,
    smsService,
    getContactDetails,
    postRegisterTvContact,
    postTvDeviceToCRM,
    postTvAccount,
    getTvContactDetails
};