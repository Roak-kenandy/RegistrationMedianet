const registerProfileService = require('../services/registerProfileService');
const { v4: uuidv4 } = require('uuid');
const fetch = require('node-fetch');

/**
 * Registers a new user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const postRegisterProfile = async (req, res) => {
    try {
        const { firstName, lastName, phoneNumber, countryCode, referralCode } = req.body;

        if (!firstName || !lastName || !phoneNumber || !countryCode) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        const result = await registerProfileService.registerProfile(
            firstName,
            lastName,
            phoneNumber,
            countryCode,
            referralCode
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
const postDeviceToCRM = async (req, res) => {
    const { contact_id } = req.body;
    const apiKey = process.env.CRM_API_KEY || 'c54504d4-0fbe-41cc-a11e-822710db9b8d';

    const payload = {
        serial_number: uuidv4(),
        electronic_id: null,
        contact_id,
        product_id: 'b95d8593-6d36-4a59-8407-b3c284471382',
    };

    try {
        const response = await fetch('https://app.crm.com/backoffice/v2/devices', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'api_key': apiKey,
            },
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
    const apiKey = process.env.CRM_API_KEY || 'c54504d4-0fbe-41cc-a11e-822710db9b8d';

    const payload = {
        classification_id: '2c3ad63b-caf8-4be1-b76c-5b0c0438a28c',
        credit_limit: '',
        currency_code: 'MVR',
        is_primary: false,
        payment_terms_id: '01ec0a1b-0a9d-4bf6-ad88-51c2bdb9edff',
    };

    try {
        const response = await fetch(`https://app.crm.com/backoffice/v2/contacts/${contact_id}/accounts`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'api_key': apiKey,
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

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
 * Creates a subscription for a contact
 * @param {string} contactId - Contact identifier
 * @param {string} accountId - Account identifier
 * @returns {Promise<void>}
 */
const postSubscription = async (contactId, accountId) => {
    const apiKey = process.env.CRM_API_KEY || 'c54504d4-0fbe-41cc-a11e-822710db9b8d';

    const payload = {
        account_id: accountId,
        scheduled_date: null,
        services: [{
            price_terms_id: '1187c08d-2795-4c8e-84b7-75a31e8e7c9d',
            product_id: 'f6b15e20-8309-454a-8fb0-10b73ec785c4',
            quantity: 1,
        }],
    };

    try {
        const response = await fetch(`https://app.crm.com/backoffice/v2/contacts/${contactId}/services`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'api_key': apiKey,
            },
            body: JSON.stringify(payload),
        });

        await response.json();
    } catch (error) {
        console.error('Error creating subscription in CRM:', error);
    }
};

/**
 * Retrieves subscription details for a contact
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const getSubscriptionContacts = async (req, res) => {
    const { contact_id } = req.params;
    const apiKey = process.env.CRM_API_KEY || 'c54504d4-0fbe-41cc-a11e-822710db9b8d';

    try {
        const response = await fetch(`https://app.crm.com/backoffice/v2/contacts/${contact_id}/subscriptions`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'api_key': apiKey,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: data });
        }

        if (data.content?.length) {
            const allowedDevices = await getAllowedDevices(data.content[0].id, contact_id);
            return res.status(200).json({
                subscription_id: data.content[0].id,
                device_ids: allowedDevices || [],
            });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching subscription from CRM:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Retrieves allowed devices for a subscription
 * @param {string} subscriptionId - Subscription identifier
 * @param {string} contactId - Contact identifier
 * @returns {Promise<Array|null>}
 */
const getAllowedDevices = async (subscriptionId, contactId) => {
    const apiKey = process.env.CRM_API_KEY || 'c54504d4-0fbe-41cc-a11e-822710db9b8d';

    try {
        const response = await fetch(
            `https://app.crm.com/backoffice/v2/subscriptions/${subscriptionId}/allowed_devices?size=50&page=1&search_value=`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'api_key': apiKey,
                },
            }
        );

        const data = await response.json();

        if (data.content?.length) {
            const deviceIds = data.content.map(item => ({ device_id: item.device.id }));
            await postAddSubscriptionDevice(subscriptionId, deviceIds, contactId);
        }
        
        return [];
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
 * @returns {Promise<void>}
 */
const postAddSubscriptionDevice = async (subscriptionId, deviceIds, contactId) => {
    const apiKey = process.env.CRM_API_KEY || 'c54504d4-0fbe-41cc-a11e-822710db9b8d';

    try {
        const response = await fetch(`https://app.crm.com/backoffice/v2/subscriptions/${subscriptionId}/devices`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'api_key': apiKey,
            },
            body: JSON.stringify(deviceIds[0]),
        });

        const data = await response.json();

        if (data.id) {
            await getAssignDevices(contactId, deviceIds);
        }
    } catch (error) {
        console.error('Error adding devices to subscription:', error);
    }
};

/**
 * Retrieves services to assign devices
 * @param {string} contactId - Contact identifier
 * @param {Array} deviceIds - Array of device identifiers
 * @returns {Promise<void|null>}
 */
const getAssignDevices = async (contactId, deviceIds) => {
    const apiKey = process.env.CRM_API_KEY || 'c54504d4-0fbe-41cc-a11e-822710db9b8d';

    try {
        const response = await fetch(`https://app.crm.com/backoffice/v2/contacts/${contactId}/services`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'api_key': apiKey,
            },
        });

        const data = await response.json();

        if (data.content?.length) {
            await postAssignDevices(data.content[0]?.id, deviceIds);
        }
    } catch (error) {
        console.error('Error fetching services for device assignment:', error);
        return null;
    }
};

/**
 * Assigns devices to a service
 * @param {string} serviceId - Service identifier
 * @param {Array} deviceIds - Array of device identifiers
 * @returns {Promise<void>}
 */
const postAssignDevices = async (serviceId, deviceIds) => {
    const apiKey = process.env.CRM_API_KEY || 'c54504d4-0fbe-41cc-a11e-822710db9b8d';

    try {
        const updatedDevices = deviceIds.map(device => ({
            ...device,
            action: 'ENABLE',
        }));

        const response = await fetch(`https://app.crm.com/backoffice/v2/services/${serviceId}/devices`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'api_key': apiKey,
            },
            body: JSON.stringify(updatedDevices),
        });

        await response.json();
    } catch (error) {
        console.error('Error assigning devices to service:', error);
    }
};

module.exports = { 
    postRegisterProfile, 
    postDeviceToCRM, 
    postAccount, 
    getSubscriptionContacts 
};