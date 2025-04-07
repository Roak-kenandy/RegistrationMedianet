const express = require('express');
const registerProfileController = require('../controllers/registerProfileController');
const router = express.Router();

router.post('/devices', registerProfileController.postDeviceToCRM);

router.post('/accounts', registerProfileController.postAccount);

router.get('/getSubscriptionContacts/:contact_id', registerProfileController.getSubscriptionContacts);

router.post('/mtvusers', registerProfileController.postRegisterProfile);

module.exports = router;
