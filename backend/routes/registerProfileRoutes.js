const express = require('express');
const registerProfileController = require('../controllers/registerProfileController');
const router = express.Router();

router.post('/contacts', registerProfileController.postRegisterContact);

router.post('/tvContacts', registerProfileController.postRegisterTvContact);

router.post('/devices', registerProfileController.postDeviceToCRM);

router.post('/tvDevices', registerProfileController.postTvDeviceToCRM);

router.post('/accounts', registerProfileController.postAccount);

router.post('/tvAccounts', registerProfileController.postTvAccount);

router.get('/getSubscriptionContacts/:contact_id', registerProfileController.getSubscriptionContacts);

router.get('/getSubDeviceCode/:subscription_id', registerProfileController.getSubDeviceCode);

router.post('/mtvusers', registerProfileController.postRegisterProfile);

router.post('/log', registerProfileController.logsForMtvUsers);

router.post('/sendOtp', registerProfileController.smsService);

router.get('/contact-details/:phone_number', registerProfileController.getContactDetails);

router.get('/tvContactDetails/:phone_number', registerProfileController.getTvContactDetails);

module.exports = router;
