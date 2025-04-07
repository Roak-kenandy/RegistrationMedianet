const express = require('express');
const registerProfileController = require('../controllers/registerProfileController');
const router = express.Router();

router.post('/contacts', registerProfileController.postRegisterContact);

router.post('/devices', registerProfileController.postDeviceToCRM);

router.post('/accounts', registerProfileController.postAccount);

router.get('/getSubscriptionContacts/:contact_id', registerProfileController.getSubscriptionContacts);

router.get('/getSubDeviceCode/:subscription_id', registerProfileController.getSubDeviceCode);

router.post('/mtvusers', registerProfileController.postRegisterProfile);

router.post('/log', registerProfileController.logsForMtvUsers);

router.post('/sendOtp', registerProfileController.smsService);

router.get('/contact-details/:phone_number', registerProfileController.getContactDetails);

module.exports = router;
