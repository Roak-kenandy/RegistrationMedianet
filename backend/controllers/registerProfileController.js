const registerProfileService = require('../services/registerProfileService');
const { v4: uuidv4 } = require('uuid');
const fetch = require('node-fetch');

const postRegisterProfile = async (req, res) => {
    try {

        const {firstName, lastName,phoneNumber,countryCode,referralCode } = req.body;

        if (!firstName || !lastName || !phoneNumber || !countryCode) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const result = await registerProfileService.registerProfile(firstName, lastName, phoneNumber, countryCode, referralCode);
        return res.status(201).json({ message: 'Profile registered successfully', data: result });

    }
    catch (error) {
        console.error('Error in postRegisterProfile:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


const postDeviceToCRM = async (req, res) => {
    const { contact_id } = req.body;

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
                'api_key': process.env.CRM_API_KEY || 'c54504d4-0fbe-41cc-a11e-822710db9b8d', // default for dev
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: data });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error('Error posting to CRM API:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { postRegisterProfile, postDeviceToCRM };