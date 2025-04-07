const express = require('express');
const registerProfileController = require('../controllers/registerProfileController');
const router = express.Router();

router.post('/devices', registerProfileController.postDeviceToCRM);

router.post('/mtvusers', registerProfileController.postRegisterProfile);

module.exports = router;
