const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.get('/getuserbyemail/:email', userController.getUserByEmail);

module.exports = router;