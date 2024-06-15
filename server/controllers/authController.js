const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const userId = await User.createUser(name, email, password);

        res.status(201).json({ message: 'User created successfully', userId });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.signin = async (req, res) => {
    const { email, password } = req.body;
    console.log("PASSWRD: ", password);
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("THE HASH: ", hashedPassword)

    try {
        const user = await User.findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        console.log("PASSWRD FROM DB: ", user.password);

        const isMatch = await User.comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = generateJwtToken(user.id);
        res.json({ token });
    } catch (err) {
        console.error('Error signing in:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

function generateJwtToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
}
