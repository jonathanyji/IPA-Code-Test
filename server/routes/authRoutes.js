const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', [
    body('name').isString().isLength({ min: 1 }).trim().escape(),
    body('email').isEmail().normalizeEmail()
], authController.signup);

router.post('/signin', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 })
], authController.signin);

module.exports = router;
