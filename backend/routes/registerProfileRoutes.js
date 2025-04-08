const express = require('express');
const registerProfileController = require('../controllers/registerProfileController');
const router = express.Router();

router.post('/contacts', registerProfileController.postRegisterContact);

router.post('/devices', registerProfileController.postDeviceToCRM);

router.post('/accounts', registerProfileController.postAccount);

router.get('/getSubscriptionContacts/:contact_id', registerProfileController.getSubscriptionContacts);

router.get('/getSubDeviceCode/:subscription_id', registerProfileController.getSubDeviceCode);

router.post('/mtvusers', registerProfileController.postRegisterProfile);

router.post('/api/v1/log', registerProfileController.logsForMtvUsers);

module.exports = router;
