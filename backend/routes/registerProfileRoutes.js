const express = require('express');
const registerProfileController = require('../controllers/registerProfileController');

const router = express.Router();

router.post('/post', registerProfileController.postRegisterProfile);

module.exports = router;
