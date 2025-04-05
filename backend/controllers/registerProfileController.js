const registerProfileService = require('../services/registerProfileService');

const postRegisterProfile = async (req, res) => {
    try {

        const {firstName, lastName,phoneNumber,countryCode,referralCode } = req.body;
        console.log('Received data:', req.body);

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
}

module.exports = { postRegisterProfile };