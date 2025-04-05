const MtvUsersModel = require('../models/MTVUsers');
const registerProfile = async (firstName, lastName,phoneNumber,countryCode,referralCode) => {
    try {

        const newUser = new MtvUsersModel({
            firstName, lastName,phoneNumber,countryCode,referralCode
        });

        await newUser.save();
        return { message: 'User registered successfully', user: newUser };
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    registerProfile
};